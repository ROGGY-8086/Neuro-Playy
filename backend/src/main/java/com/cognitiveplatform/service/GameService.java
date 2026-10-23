package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.GameResponse;
import com.cognitiveplatform.mapper.GameMapper;
import com.cognitiveplatform.repository.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GameService {

    private final GameRepository gameRepository;
    private final GameMapper gameMapper;

    public GameService(GameRepository gameRepository, GameMapper gameMapper) {
        this.gameRepository = gameRepository;
        this.gameMapper = gameMapper;
    }

    public List<GameResponse> getEnabledGames() {
        return gameRepository.findByEnabledTrue().stream()
                .map(gameMapper::toResponse)
                .collect(Collectors.toList());
    }
}
