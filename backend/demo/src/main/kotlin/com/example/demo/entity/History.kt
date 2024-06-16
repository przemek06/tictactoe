package com.example.demo.entity

import com.example.demo.dto.HistoryDto
import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.util.UUID

@Entity
data class History(
    @Id
    var uuid: UUID,
    var winner: String,
    var loser: String,
    var timestamp: Long
) {
    constructor() : this(UUID.randomUUID(), "", "", 0L)

    fun toDto() : HistoryDto {
        return HistoryDto(winner, loser, timestamp)
    }

    companion object {
        fun createInstance(winner: String, loser: String) : History {
            val uuid = UUID.randomUUID()
            val timestamp = System.currentTimeMillis()
            return History(
                uuid, winner, loser, timestamp
            )
        }
    }
}