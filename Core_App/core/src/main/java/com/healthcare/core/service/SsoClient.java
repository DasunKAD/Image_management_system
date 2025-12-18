package com.healthcare.core.service;

import com.healthcare.common.dto.CreateUserRequest;
import com.healthcare.common.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class SsoClient {

    private final WebClient ssoWebClient;

    public UserResponse createUserInSso(String username, String email, String password, Set<String> groupNames) {
        CreateUserRequest request = CreateUserRequest.builder()
                .username(username)
                .email(email)
                .password(password)
                .groupNames(groupNames)
                .build();

        return ssoWebClient.post()
                .uri("/users")
                .body(Mono.just(request), CreateUserRequest.class)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .block();
    }

    public ResponseEntity<String> validateToken(String jwt) {

        return ssoWebClient
                .get()
                .uri("/auth/validate") // or "" if baseUrl already contains full path
                .headers(headers -> headers.setBearerAuth(jwt))
                .retrieve()
                .toEntity(String.class)
                .block();
    }
}
