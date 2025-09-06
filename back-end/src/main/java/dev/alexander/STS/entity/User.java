package dev.alexander.STS.entity;


import java.util.Collection;
import java.util.List;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
public class User implements UserDetails {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "id")
private int id;


@Column(name = "first_name")
private String firstName;


@Column(name = "last_name")
private String lastName;


@Column(name = "user_password")
private String password;


@Column(name = "email", unique = true)
private String email;


@Enumerated(EnumType.STRING)
@Column(name = "role", nullable = false)
private Role role;


public enum Role {
Student,
Tutor,
Vice_Dean
}


@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
}


@Override
public String getUsername() {
return email;
}


@Override
public boolean isAccountNonExpired() { return true; }


@Override
public boolean isAccountNonLocked() { return true; }


@Override
public boolean isCredentialsNonExpired() { return true; }


@Override
public boolean isEnabled() { return true; }
}