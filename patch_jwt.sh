sed -i '' '/public UUID getUserIdFromJWT/i\
    public CivicForgeUserDetails getUserDetailsFromJWT(String token) {\
        Claims claims = Jwts.parser()\
                .setSigningKey(key)\
                .build()\
                .parseSignedClaims(token)\
                .getPayload();\
        UUID id = UUID.fromString(claims.getSubject());\
        String email = claims.get("email", String.class);\
        String roles = claims.get("roles", String.class);\
        return new CivicForgeUserDetails(id, email, "", java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(roles)), true);\
    }\
' /Users/babaganesh/civicforge/backend/src/main/java/com/civicforge/identity/security/JwtTokenProvider.java
