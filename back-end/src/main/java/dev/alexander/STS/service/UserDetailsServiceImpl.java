package dev.alexander.STS.service;


import dev.alexander.STS.entity.User;
import dev.alexander.STS.repos.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
private final UserRepository userRepository;


@Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
// Return the domain User which already implements UserDetails
return userRepository.findByEmail(email)
.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
}
}