package com.example.demo.service

import com.example.demo.dto.HistoryDto
import com.example.demo.entity.History
import com.example.demo.repository.HistoryRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class HistoryService(
    private val historyRepository: HistoryRepository
) {

    fun saveHistory(winner: String, loser: String) {
        val history = History.createInstance(winner, loser)
        historyRepository.save(history)
    }

    fun getUserHistory() : List<HistoryDto> {
        val user = SecurityContextHolder.getContext().authentication.name

        return historyRepository.findAllUserGames(user)
            .map { it.toDto() }
    }
}