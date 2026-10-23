package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.UserDto;
import com.cognitiveplatform.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) return null;
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getPlayerProfileId()
        );
    }
}
