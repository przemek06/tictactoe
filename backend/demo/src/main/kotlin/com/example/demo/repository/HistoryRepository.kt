package com.example.demo.repository

import com.example.demo.entity.History
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface HistoryRepository : JpaRepository<History, UUID> {
    @Query("SELECT h FROM History h WHERE h.winner = :user OR h.loser = :user")
    fun findAllUserGames(user: String) : List<History>
}