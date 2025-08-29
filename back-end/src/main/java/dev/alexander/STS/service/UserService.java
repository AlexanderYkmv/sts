package dev.alexander.STS.service;

import java.util.Optional;
import dev.alexander.STS.entity.User;


public interface UserService {
    boolean emailExists(String email);
    Optional<User> getUserByEmail(String email);
    User saveUser(User user);
    Optional<User> getUserById(int id);
}