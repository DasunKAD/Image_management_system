package com.healthcare.sso.service;

import com.healthcare.common.dto.*;
import com.healthcare.common.entity.Role;
import com.healthcare.common.entity.User;
import com.healthcare.common.entity.UserGroup;
import com.healthcare.sso.repository.RoleRepository;
import com.healthcare.sso.repository.UserGroupRepository;
import com.healthcare.sso.repository.UserRepository;
import com.healthcare.sso.security.CustomUserDetails;
import com.healthcare.sso.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails, userDetails.getEmail());

        Set<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        return LoginResponse.builder()
                .token(token)
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional(readOnly = true)
    public TokenValidationResponse validateToken(TokenValidationRequest request) {
        try {
            if (!jwtUtil.validateToken(request.getToken())) {
                return TokenValidationResponse.builder()
                        .valid(false)
                        .build();
            }

            String username = jwtUtil.extractUsername(request.getToken());
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Set<String> roles = user.getUserGroups().stream()
                    .flatMap(group -> group.getRoles().stream())
                    .map(role -> role.getName().name())
                    .collect(Collectors.toSet());

            return TokenValidationResponse.builder()
                    .valid(true)
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .roles(roles)
                    .build();
        } catch (Exception e) {
            return TokenValidationResponse.builder()
                    .valid(false)
                    .build();
        }
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .userGroups(new HashSet<>())
                .build();

        if (request.getGroupNames() != null && !request.getGroupNames().isEmpty()) {
            for (String groupName : request.getGroupNames()) {
                UserGroup group = userGroupRepository.findByName(groupName)
                        .orElseThrow(() -> new RuntimeException("Group not found: " + groupName));
                user.getUserGroups().add(group);
            }
        }

        user = userRepository.save(user);

        Set<String> groups = user.getUserGroups().stream()
                .map(UserGroup::getName)
                .collect(Collectors.toSet());

        Set<String> roles = user.getUserGroups().stream()
                .flatMap(group -> group.getRoles().stream())
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .groups(groups)
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
