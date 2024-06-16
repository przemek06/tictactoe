package com.example.demo.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig(
    private val cognitoAuthorizationFilter: CognitoAuthorizationFilter
) {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.invoke {
            authorizeRequests {
                authorize("/player/**", authenticated)
                authorize("/match/**", authenticated)
                authorize("/history", authenticated)
                authorize("/stomp/**", permitAll)
            }

            csrf { disable() }
            cors { }
            exceptionHandling { authenticationEntryPoint = HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED) }
            addFilterBefore<UsernamePasswordAuthenticationFilter>(cognitoAuthorizationFilter)
        }
        return http.build()
    }

    @Bean
    fun corsConfigurer(): WebMvcConfigurer? {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://44.193.15.3:3000")
                    .allowedMethods("GET", "POST", "DELETE", "PUT")
                    .allowCredentials(true)
            }
        }
    }
}