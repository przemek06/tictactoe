package com.example.demo.service

import com.example.demo.model.Player
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.*
import kotlin.NoSuchElementException

@Service
class PlayerService {
    val playerQueue: MutableSet<Player> = Collections.synchronizedSet(mutableSetOf())

    fun getQueueSize() : Int {
        return playerQueue.size
    }

    fun addPlayer(player: Player) {
        val user = SecurityContextHolder.getContext().authentication.name
        if (user != player.name) {
            throw SecurityException()
        }

        if (playerQueue.map { it.name }.contains(player.name)) {
            throw IllegalArgumentException()
        }
        playerQueue.add(player)
    }

    fun pollRandomPlayer() : Player {
        val player = playerQueue.randomOrNull() ?: throw NoSuchElementException()
        playerQueue.remove(player)

        return player
    }
}