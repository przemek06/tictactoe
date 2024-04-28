package com.example.demo.error

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(value = [IllegalArgumentException::class])
    fun handleIllegalArgument(e: IllegalArgumentException) : ResponseEntity<Unit> {
        return ResponseEntity.status(HttpStatus.CONFLICT).build()
    }

    @ExceptionHandler(value = [NoSuchElementException::class])
    fun handleNotFound(e: NoSuchElementException) : ResponseEntity<Unit> {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build()
    }
}