package com.example.demo.controller

import com.example.demo.model.MoveMessage
import com.example.demo.service.MatchService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class MatchController(val matchService: MatchService) {

    @PostMapping("/match/{uuid}")
    fun makeMove(@RequestBody moveMessage: MoveMessage, @PathVariable uuid: UUID) : ResponseEntity<Unit> {
        matchService.makeMove(moveMessage, uuid)
        return ResponseEntity.ok().build()
    }
}