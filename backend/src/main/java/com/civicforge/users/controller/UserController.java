package com.civicforge.users.controller;

import com.civicforge.audit.service.AuditService;
import com.civicforge.common.dto.ApiResponse;
import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import com.civicforge.identity.security.CivicForgeUserDetails;
import com.civicforge.users.dto.UpdateProfileRequest;
import com.civicforge.users.dto.UserDto;
import com.civicforge.users.entity.User;
import com.civicforge.users.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AuditService auditService;

    @PatchMapping("/me/profile")
    @Transactional
    public ApiResponse<UserDto> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        CivicForgeUserDetails principal = (CivicForgeUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = principal.getUserId();

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.NOT_FOUND, "User not found", HttpStatus.NOT_FOUND));

        user.setDisplayName(request.displayName());
        userRepository.save(user);

        auditService.audit("USER_UPDATE_PROFILE", "USER", userId.toString(), "SUCCESS", null);

        return ApiResponse.success(UserDto.from(user));
    }
}
