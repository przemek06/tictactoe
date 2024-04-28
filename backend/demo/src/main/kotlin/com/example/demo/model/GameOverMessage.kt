package com.example.demo.model

data class GameOverMessage(
    val type: String,
    val won: Player?
)