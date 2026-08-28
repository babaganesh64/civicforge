package com.civicforge.identity.controller;

import com.civicforge.common.dto.ApiResponse;
import com.civicforge.identity.dto.AuthResponse;
import com.civicforge.identity.dto.LoginRequest;
import com.civicforge.identity.dto.RefreshRequest;
import com.civicforge.identity.dto.RegisterRequest;
import com.civicforge.identity.security.CivicForgeUserDetails;
import com.civicforge.identity.service.AuthService;
import com.civicforge.users.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null) {
            ipAddress = httpRequest.getRemoteAddr();
        }
        return ApiResponse.success(authService.login(request, ipAddress));
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ApiResponse.success(authService.refreshToken(request.refreshToken()));
    }

    @GetMapping("/me")
    public ApiResponse<UserDto> getCurrentUser() {
        CivicForgeUserDetails principal = (CivicForgeUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(authService.getCurrentUser(principal.getUserId()));
    }
}
