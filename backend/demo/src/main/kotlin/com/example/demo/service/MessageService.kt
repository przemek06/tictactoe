package com.example.demo.service

import com.example.demo.model.Match
import com.example.demo.model.Player
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

@Service
class MessageService(val messageTemplate: SimpMessagingTemplate) {

    fun sendMatchMessage(msg: Any, match: Match) {
        messageTemplate.convertAndSend("/topic/match/${match.uuid}", msg)
    }

    fun sendPlayerMessage(msg: Any, player: Player) {
        messageTemplate.convertAndSend("/topic/player/${player.name}", msg)
    }
}