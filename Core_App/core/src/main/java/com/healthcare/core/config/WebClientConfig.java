package com.healthcare.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${sso.service.url}")
    private String ssoServiceUrl;

    @Bean
    public WebClient ssoWebClient() {
        return WebClient.builder()
                .baseUrl(ssoServiceUrl)
                .build();
    }
}
