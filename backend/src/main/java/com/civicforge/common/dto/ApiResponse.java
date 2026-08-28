package com.civicforge.common.dto;

public record ApiResponse<T>(T data, String message, boolean success) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(data, "Success", true);
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(data, message, true);
    }
}