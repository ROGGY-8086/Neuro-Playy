package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.entity.DailyGameSession;
import com.cognitiveplatform.entity.DailyScore;
import com.cognitiveplatform.exception.BadRequestException;
import com.cognitiveplatform.repository.DailyGameSessionRepository;
import com.cognitiveplatform.repository.DailyScoreRepository;
import com.cognitiveplatform.repository.UserProfileRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DailyMemoryGameService {

    private final DailyGameSessionRepository sessionRepository;
    private final DailyScoreRepository scoreRepository;
    private final UserProfileRepository userProfileRepository;
    private final DailyQuestionGeneratorService generatorService;
    private final ObjectMapper objectMapper;

    public DailyMemoryGameService(DailyGameSessionRepository sessionRepository,
                                  DailyScoreRepository scoreRepository,
                                  UserProfileRepository userProfileRepository,
                                  DailyQuestionGeneratorService generatorService,
                                  ObjectMapper objectMapper) {
        this.sessionRepository = sessionRepository;
        this.scoreRepository = scoreRepository;
        this.userProfileRepository = userProfileRepository;
        this.generatorService = generatorService;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public DailyGameStatusDto getStatus(Long userId, LocalDate today) {
        Optional<DailyScore> scoreOpt = scoreRepository.findByUserIdAndGameDate(userId, today);
        boolean hasCompleted = scoreOpt.isPresent();
        Integer score = scoreOpt.map(DailyScore::getScore).orElse(null);

        Optional<DailyGameSession> sessionOpt = sessionRepository.findByUserIdAndGameDate(userId, today);
        boolean hasActive = sessionOpt.isPresent() && "IN_PROGRESS".equalsIgnoreCase(sessionOpt.get().getStatus());
        int questionsCount = 0;
        if (sessionOpt.isPresent()) {
            List<DailyQuestionGeneratorService.InternalQuestion> qList =
                    generatorService.deserializeQuestions(sessionOpt.get().getQuestionSet());
            questionsCount = qList.size();
        }

        boolean hasProfile = userProfileRepository.existsByUserId(userId);

        return new DailyGameStatusDto(
                today,
                hasCompleted,
                score,
                questionsCount > 0 ? questionsCount : 5,
                hasActive,
                questionsCount,
                hasProfile
        );
    }

    @Transactional
    public DailyGameSessionDto startOrResumeSession(Long userId, LocalDate today) {
        // 1. If today's game is already completed and scored, do not allow a second game
        Optional<DailyScore> existingScore = scoreRepository.findByUserIdAndGameDate(userId, today);
        if (existingScore.isPresent()) {
            throw new BadRequestException("Today's game has already been completed with score " + existingScore.get().getScore() + "/5.");
        }

        // 2. Check if a session already exists for today
        Optional<DailyGameSession> existingSessionOpt = sessionRepository.findByUserIdAndGameDate(userId, today);
        DailyGameSession session;

        if (existingSessionOpt.isPresent()) {
            session = existingSessionOpt.get();
        } else {
            // Generate up to 5 personalized questions
            List<DailyQuestionGeneratorService.InternalQuestion> questions = generatorService.generateDailyQuestions(userId);
            if (questions.isEmpty()) {
                throw new BadRequestException("Please ask your guardian to add profile information, relatives, or life events before playing the daily game.");
            }

            String serialized = generatorService.serializeQuestions(questions);
            session = new DailyGameSession(userId, today, serialized);
            session = sessionRepository.save(session);
        }

        return toSessionDto(session);
    }

    @Transactional
    public DailyGameSessionDto submitAnswer(Long userId, LocalDate today, Integer questionIndex, String selectedOption) {
        DailyGameSession session = sessionRepository.findByUserIdAndGameDate(userId, today)
                .orElseThrow(() -> new BadRequestException("No active daily game session found for today."));

        if (!"IN_PROGRESS".equalsIgnoreCase(session.getStatus())) {
            throw new BadRequestException("This daily game session has already been completed.");
        }

        Map<String, String> answers = deserializeAnswers(session.getAnswerState());
        if (selectedOption != null) {
            answers.put(String.valueOf(questionIndex), selectedOption.trim());
        }
        session.setAnswerState(serializeAnswers(answers));
        session = sessionRepository.save(session);

        return toSessionDto(session);
    }

    @Transactional
    public DailyGameResultDto completeGame(Long userId, LocalDate today) {
        // 1. Check if score already exists (concurrency / refresh safeguard)
        Optional<DailyScore> existingScore = scoreRepository.findByUserIdAndGameDate(userId, today);
        if (existingScore.isPresent()) {
            int prevScore = existingScore.get().getScore();
            return new DailyGameResultDto(prevScore, 5, "You scored " + prevScore + " out of 5 today.", today, false);
        }

        DailyGameSession session = sessionRepository.findByUserIdAndGameDate(userId, today)
                .orElseThrow(() -> new BadRequestException("No active daily game session found to complete."));

        List<DailyQuestionGeneratorService.InternalQuestion> questions =
                generatorService.deserializeQuestions(session.getQuestionSet());
        Map<String, String> answers = deserializeAnswers(session.getAnswerState());

        // 2. Server-side score calculation (1 point per correct answer, 0 for incorrect)
        int score = 0;
        for (int i = 0; i < questions.size(); i++) {
            DailyQuestionGeneratorService.InternalQuestion q = questions.get(i);
            String userAnswer = answers.get(String.valueOf(i));
            if (userAnswer != null && userAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer().trim())) {
                score++;
            }
        }

        int totalQuestions = questions.size();

        // 3. Save to minimal permanent daily_scores table (ONLY id, user_id, score, game_date)
        try {
            DailyScore dailyScore = new DailyScore(userId, score, today);
            scoreRepository.saveAndFlush(dailyScore);
        } catch (DataIntegrityViolationException ex) {
            // Uniqueness constraint prevented duplicate credited attempt
            DailyScore saved = scoreRepository.findByUserIdAndGameDate(userId, today)
                    .orElse(new DailyScore(userId, score, today));
            return new DailyGameResultDto(saved.getScore(), totalQuestions, "You scored " + saved.getScore() + " out of " + totalQuestions + " today.", today, false);
        }

        // 4. Mark operational session completed and clean temporary answers
        session.setStatus("COMPLETED");
        session.setAnswerState(null); // Clear temporary answers per privacy requirements
        sessionRepository.save(session);

        String message = score >= (totalQuestions * 0.8)
                ? "Wonderful job! You scored " + score + " out of " + totalQuestions + " today."
                : "Well done! You scored " + score + " out of " + totalQuestions + " today.";

        return new DailyGameResultDto(score, totalQuestions, message, today, true);
    }

    @Transactional(readOnly = true)
    public DailyScoreHistoryDto getScoreHistory(Long userId) {
        List<DailyScore> scores = scoreRepository.findByUserIdOrderByGameDateDesc(userId);

        List<DailyScoreHistoryDto.ScoreEntry> entries = scores.stream()
                .map(s -> new DailyScoreHistoryDto.ScoreEntry(s.getId(), s.getGameDate(), s.getScore(), 5))
                .collect(Collectors.toList());

        int totalGames = scores.size();
        double avgScore = 0.0;
        int bestScore = 0;

        if (totalGames > 0) {
            avgScore = scores.stream().mapToInt(DailyScore::getScore).average().orElse(0.0);
            avgScore = Math.round(avgScore * 10.0) / 10.0;
            bestScore = scores.stream().mapToInt(DailyScore::getScore).max().orElse(0);
        }

        DailyScoreHistoryDto.DerivedStatistics stats =
                new DailyScoreHistoryDto.DerivedStatistics(totalGames, avgScore, bestScore);

        return new DailyScoreHistoryDto(entries, stats);
    }

    private DailyGameSessionDto toSessionDto(DailyGameSession session) {
        List<DailyQuestionGeneratorService.InternalQuestion> questions =
                generatorService.deserializeQuestions(session.getQuestionSet());

        // Mask correct answers! Client only gets question text, category, and options
        List<ClientQuestionDto> clientQuestions = questions.stream()
                .map(q -> new ClientQuestionDto(q.getIndex(), q.getQuestionText(), q.getCategory(), q.getOptions()))
                .collect(Collectors.toList());

        Map<String, String> answers = deserializeAnswers(session.getAnswerState());

        return new DailyGameSessionDto(
                session.getId(),
                session.getGameDate(),
                clientQuestions,
                answers,
                session.getStatus()
        );
    }

    private Map<String, String> deserializeAnswers(String json) {
        if (json == null || json.isBlank()) return new HashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    private String serializeAnswers(Map<String, String> answers) {
        try {
            return objectMapper.writeValueAsString(answers != null ? answers : new HashMap<>());
        } catch (Exception e) {
            return "{}";
        }
    }
}
