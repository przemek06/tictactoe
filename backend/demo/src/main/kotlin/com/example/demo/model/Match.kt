package com.example.demo.model

import java.util.UUID

data class Match(
    val uuid: UUID,
    val player1: Player,
    val player2: Player,
    val fields: MutableList<Field>
)
