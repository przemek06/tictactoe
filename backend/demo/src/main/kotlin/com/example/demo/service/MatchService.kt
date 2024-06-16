package com.example.demo.service

import com.example.demo.model.*
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.web.client.HttpClientErrorException.Unauthorized
import software.amazon.awssdk.services.cognitoidentityprovider.model.UnauthorizedException
import java.util.*
import java.util.concurrent.ConcurrentHashMap

@Service
class MatchService(
    val playerService: PlayerService,
    val messageService: MessageService,
    val historyService: HistoryService
) {

    val logger = LoggerFactory.getLogger(this::class.java)

    val matches: MutableMap<UUID, Match> = ConcurrentHashMap()

    fun makeMove(moveMessage: MoveMessage, matchUUID: UUID) {
        val user = SecurityContextHolder.getContext().authentication.name

        if (user != moveMessage.player) {
            throw SecurityException()
        }

        val match = matches.getOrDefault(matchUUID, null) ?: throw NoSuchElementException()

        if (!isMoveLegal(match, moveMessage.field)) {
            throw IllegalArgumentException()
        }

        val matchField = findField(match, moveMessage.field)
        val player = if (moveMessage.player == match.player1.name) match.player1 else match.player2
        matchField.occupant = player

        val matchMessage = MatchMessage("MOVE", match)

        messageService.sendMatchMessage(matchMessage, match)

        if (isGameFinished(match)) {
            val winner = findWinner(match)
            val loser = if (match.player1.name == winner?.name) match.player2.name else match.player1.name
            messageService.sendMatchMessage(GameOverMessage("RESULT", winner), match)
            historyService.saveHistory(winner?.name!!, loser)
        }
    }

    @Scheduled(fixedRate = 10000)
    fun matchPlayers() {
        while (playerService.getQueueSize() > 1) {
            val player1 = playerService.pollRandomPlayer()
            val player2 = playerService.pollRandomPlayer()
            val match = Match(UUID.randomUUID(), player1, player2, generateFields())

            matches[match.uuid] = match

            val msg = MatchMessage("MOVE", match)
            messageService.sendPlayerMessage(msg, player1)
            messageService.sendPlayerMessage(msg, player2)
        }
    }

    private fun generateFields() : MutableList<Field> {
        val fields: MutableList<Field> = mutableListOf()
        for (x in 0..2) {
            for (y in 0..2) {
                val field = Field(null, x, y)
                fields.add(field)
            }
        }

        return fields
    }

    private fun findField(match: Match, field: Field) : Field {
        return  match.fields.filter { it.x == field.x && it.y == field.y }
            .firstOrNull() ?: throw NoSuchElementException()
    }

    private fun isMoveLegal(match: Match, field: Field) : Boolean {
        val matchField = findField(match, field)

        return matchField.occupant == null
    }

    private fun isGameFinished(match: Match) : Boolean {
        val grid = Array(3) { arrayOfNulls<Player>(3) }
        for (field in match.fields) {
            if (field.x in 0..2 && field.y in 0..2) { // assuming 0-based index
                grid[field.x][field.y] = field.occupant
            }
        }

        for (i in 0..2) {
            if ((grid[i][0] != null && grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]) ||
                (grid[0][i] != null && grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i])
            ) {
                return true
            }
        }

        if ((grid[0][0] != null && grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) ||
            (grid[0][2] != null && grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0])
        ) {
            return true
        }

        if (match.fields.all { it.occupant != null }) {
            return true
        }

        return false
    }

    private fun findWinner(match: Match): Player? {
        val grid = Array(3) { arrayOfNulls<Player>(3) }
        for (field in match.fields) {
            if (field.x in 0..2 && field.y in 0..2) { // assuming 0-based index
                grid[field.x][field.y] = field.occupant
            }
        }

        for (i in 0..2) {
            if (grid[i][0] != null && grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]) {
                return grid[i][0]
            }
            if (grid[0][i] != null && grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i]) {
                return grid[0][i]
            }
        }

        if (grid[0][0] != null && grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) {
            return grid[0][0]
        }
        if (grid[0][2] != null && grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]) {
            return grid[0][2]
        }

        return null
    }


}