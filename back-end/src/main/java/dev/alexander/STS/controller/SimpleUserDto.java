package dev.alexander.STS.dto;

import dev.alexander.STS.entity.User;
import lombok.Data;

@Data
public class SimpleUserDto {
    private int id;
    private String firstName;
    private String lastName;
    private User.Role role;

    public SimpleUserDto(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.role = user.getRole();
    }
}