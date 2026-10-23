package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.GameResponse;
import com.cognitiveplatform.entity.Game;
import org.springframework.stereotype.Component;

@Component
public class GameMapper {

    public GameResponse toResponse(Game game) {
        if (game == null) return null;
        return new GameResponse(game.getId(), game.getGameKey(), game.getTitle(), game.getCategory(), game.isEnabled());
    }
}
