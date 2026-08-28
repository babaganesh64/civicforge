package com.civicforge.identity.service;

import com.civicforge.identity.security.CivicForgeUserDetails;
import com.civicforge.users.entity.User;
import com.civicforge.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new CivicForgeUserDetails(
            user.getId(),
            user.getEmail(),
            user.getPasswordHash(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getUserType())),
            "ACTIVE".equals(user.getStatus())
        );
    }
}
