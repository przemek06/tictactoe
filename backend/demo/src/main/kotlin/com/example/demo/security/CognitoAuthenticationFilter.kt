package com.example.demo.security

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import lombok.extern.java.Log
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient
import software.amazon.awssdk.services.cognitoidentityprovider.model.GetUserRequest
import java.io.IOException

@Component
@Log
class CognitoAuthorizationFilter : OncePerRequestFilter() {
    private val cognitoClient: CognitoIdentityProviderClient = CognitoIdentityProviderClient.builder()
        .region(Region.US_EAST_1)
        .credentialsProvider(DefaultCredentialsProvider.create())
        .build()

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authorizationHeader = request.getHeader("Authorization")

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            val token = authorizationHeader.substring(7)

            try {
                val getUserRequest = GetUserRequest.builder()
                    .accessToken(token)
                    .build()

                logger.info(getUserRequest.accessToken())

                val getUserResponse = cognitoClient.getUser(getUserRequest)

                logger.info(getUserResponse.username())

                val authentication = UsernamePasswordAuthenticationToken(
                    getUserResponse.username(), null, null
                )
                SecurityContextHolder.getContext().authentication = authentication
            } catch (e: Exception) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token")
                return
            }
        }

        filterChain.doFilter(request, response)
    }
}