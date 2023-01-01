package com.github.miho73.ion.Repository;

import com.github.miho73.ion.jpa.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
