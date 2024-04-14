package com.example.demo.controller

import com.example.demo.model.Player
import com.example.demo.service.PlayerService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class PlayerController(val playerService: PlayerService) {

    @PostMapping("/player")
    fun addPlayer(@RequestBody player: Player) : ResponseEntity<Unit> {
        playerService.addPlayer(player)
        return ResponseEntity.ok().build()
    }
}