package com.example.demo.controller

import com.example.demo.dto.HistoryDto
import com.example.demo.service.HistoryService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HistoryController(
    val historyService: HistoryService
) {

    @GetMapping("/history")
    fun getHistory() : List<HistoryDto> {
        return historyService.getUserHistory()
    }
}