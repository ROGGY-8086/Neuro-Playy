package com.cognitiveplatform.service;

import com.cognitiveplatform.entity.LifeEvent;
import com.cognitiveplatform.entity.PersonalQuestion;
import com.cognitiveplatform.entity.Relative;
import com.cognitiveplatform.entity.UserProfile;
import com.cognitiveplatform.repository.LifeEventRepository;
import com.cognitiveplatform.repository.PersonalQuestionRepository;
import com.cognitiveplatform.repository.RelativeRepository;
import com.cognitiveplatform.repository.UserProfileRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DailyQuestionGeneratorService {

    public static class InternalQuestion {
        private int index;
        private String questionText;
        private String category;
        private String imageUrl;
        private String correctAnswer;
        private List<String> options = new ArrayList<>();

        public InternalQuestion() {}

        public InternalQuestion(int index, String questionText, String category, String correctAnswer, List<String> options) {
            this(index, questionText, category, null, correctAnswer, options);
        }

        public InternalQuestion(int index, String questionText, String category, String imageUrl, String correctAnswer, List<String> options) {
            this.index = index;
            this.questionText = questionText;
            this.category = category;
            this.imageUrl = imageUrl;
            this.correctAnswer = correctAnswer;
            this.options = options != null ? options : new ArrayList<>();
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public int getIndex() {
            return index;
        }

        public void setIndex(int index) {
            this.index = index;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(String correctAnswer) {
            this.correctAnswer = correctAnswer;
        }

        public List<String> getOptions() {
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }
    }

    private final UserProfileRepository userProfileRepository;
    private final RelativeRepository relativeRepository;
    private final LifeEventRepository lifeEventRepository;
    private final PersonalQuestionRepository personalQuestionRepository;
    private final ObjectMapper objectMapper;

    // Distractor reference pools
    private static final List<String> CITY_DISTRACTORS = List.of(
            "Pune", "Mumbai", "Nashik", "Nagpur", "Delhi", "Bangalore",
            "Jaipur", "Hyderabad", "Goa", "Kolkata", "Chennai", "Manali"
    );

    private static final List<String> RELATIONSHIP_DISTRACTORS = List.of(
            "Mother", "Father", "Daughter", "Son", "Sister", "Brother",
            "Spouse", "Grandmother", "Grandfather", "Aunt", "Uncle", "Friend", "Cousin"
    );

    private static final List<String> NAME_DISTRACTORS = List.of(
            "Rahul Sharma", "Amit Sharma", "Rohan Patel", "Karan Shah",
            "Priya Joshi", "Sunita Rao", "Neha Kulkarni", "Kavita Deshmukh",
            "Vikram Singh", "Suresh Nair", "Anita Patil", "Deepak Mehta"
    );

    private static final List<String> DATE_DISTRACTORS = List.of(
            "12 March", "25 June", "8 September", "19 December",
            "14 January", "30 October", "4 July", "22 April", "18 August"
    );

    public DailyQuestionGeneratorService(UserProfileRepository userProfileRepository,
                                         RelativeRepository relativeRepository,
                                         LifeEventRepository lifeEventRepository,
                                         PersonalQuestionRepository personalQuestionRepository,
                                         ObjectMapper objectMapper) {
        this.userProfileRepository = userProfileRepository;
        this.relativeRepository = relativeRepository;
        this.lifeEventRepository = lifeEventRepository;
        this.personalQuestionRepository = personalQuestionRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Generates up to 5 personalized, distinct, balanced questions from guardian profile facts.
     */
    public List<InternalQuestion> generateDailyQuestions(Long userId) {
        List<InternalQuestion> candidates = new ArrayList<>();

        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        List<Relative> relatives = relativeRepository.findByUserId(userId);
        List<LifeEvent> events = lifeEventRepository.findByUserId(userId);
        List<PersonalQuestion> customQuestions = personalQuestionRepository.findByUserIdAndActiveTrue(userId);

        // 1. Basic Personal Information Questions
        if (profileOpt.isPresent()) {
            UserProfile profile = profileOpt.get();

            if (profile.getFullName() != null && !profile.getFullName().isBlank()) {
                candidates.add(createQuestion(
                        "What is your full name?",
                        "Personal",
                        profile.getFullName().trim(),
                        extractDistractors(profile.getFullName().trim(), NAME_DISTRACTORS)
                ));
            }

            if (profile.getPlaceOfBirth() != null && !profile.getPlaceOfBirth().isBlank()) {
                candidates.add(createQuestion(
                        "In which city were you born?",
                        "Birthplace",
                        profile.getPlaceOfBirth().trim(),
                        extractDistractors(profile.getPlaceOfBirth().trim(), CITY_DISTRACTORS)
                ));
            }

            if (profile.getHometown() != null && !profile.getHometown().isBlank()) {
                candidates.add(createQuestion(
                        "Which city is your current hometown?",
                        "Hometown",
                        profile.getHometown().trim(),
                        extractDistractors(profile.getHometown().trim(), CITY_DISTRACTORS)
                ));
            }

            if (profile.getDateOfBirth() != null) {
                String formattedDob = formatMonthDay(profile.getDateOfBirth());
                candidates.add(createQuestion(
                        "When is your birthday?",
                        "Birthday",
                        formattedDob,
                        extractDistractors(formattedDob, DATE_DISTRACTORS)
                ));
            }

            if (profile.getNickname() != null && !profile.getNickname().isBlank()) {
                candidates.add(createQuestion(
                        "What nickname or preferred name do your family members use for you?",
                        "Personal",
                        profile.getNickname().trim(),
                        extractDistractors(profile.getNickname().trim(), List.of("Dada", "Aaji", "Baba", "Tai", "Sonu", "Chhotu", "Raju"))
                ));
            }
        }

        // 2. Family Members & Relatives Questions
        for (Relative rel : relatives) {
            if (rel.getFullName() != null && !rel.getFullName().isBlank() &&
                    rel.getRelationship() != null && !rel.getRelationship().isBlank()) {

                // "What is your [relationship]'s name?"
                List<String> otherRelativeNames = relatives.stream()
                        .map(Relative::getFullName)
                        .filter(n -> !n.equalsIgnoreCase(rel.getFullName()))
                        .collect(java.util.stream.Collectors.toList());
                List<String> namePool = new ArrayList<>(otherRelativeNames);
                namePool.addAll(NAME_DISTRACTORS);

                candidates.add(createQuestion(
                        "What is your " + rel.getRelationship().toLowerCase() + "'s name?",
                        "Family",
                        rel.getFullName().trim(),
                        extractDistractors(rel.getFullName().trim(), namePool)
                ));

                // "How is [rel.fullName] related to you?"
                candidates.add(createQuestion(
                        "How is " + rel.getFullName().trim() + " related to you?",
                        "Family",
                        rel.getRelationship().trim(),
                        extractDistractors(rel.getRelationship().trim(), RELATIONSHIP_DISTRACTORS)
                ));

                if (rel.getDateOfBirth() != null) {
                    String relBday = formatMonthDay(rel.getDateOfBirth());
                    candidates.add(createQuestion(
                            "When is " + rel.getFullName().trim() + "'s birthday?",
                            "Birthdays",
                            relBday,
                            extractDistractors(relBday, DATE_DISTRACTORS)
                    ));
                }
            }
        }

        // 3. Life Events Questions
        for (LifeEvent ev : events) {
            if (ev.getEventPlace() != null && !ev.getEventPlace().isBlank()) {
                candidates.add(createQuestion(
                        "Where did the memorable experience \"" + ev.getEventTitle().trim() + "\" take place?",
                        "Life Events",
                        ev.getEventPlace().trim(),
                        extractDistractors(ev.getEventPlace().trim(), CITY_DISTRACTORS)
                ));
            }

            if (ev.getApproximateYear() != null && ev.getApproximateYear() > 1900) {
                int yr = ev.getApproximateYear();
                List<String> yearDistractors = List.of(
                        String.valueOf(yr - 3),
                        String.valueOf(yr - 1),
                        String.valueOf(yr + 2),
                        String.valueOf(yr + 5)
                );
                candidates.add(createQuestion(
                        "In approximately what year did \"" + ev.getEventTitle().trim() + "\" take place?",
                        "Life Events",
                        String.valueOf(yr),
                        yearDistractors
                ));
            } else if (ev.getEventDate() != null) {
                String formattedDate = formatMonthDay(ev.getEventDate());
                candidates.add(createQuestion(
                        "When did \"" + ev.getEventTitle().trim() + "\" take place?",
                        "Life Events",
                        formattedDate,
                        extractDistractors(formattedDate, DATE_DISTRACTORS)
                ));
            }
        }

        // 4. Custom Questions
        for (PersonalQuestion pq : customQuestions) {
            List<String> customDistractors = new ArrayList<>();
            if (pq.getAlternativeAnswers() != null && !pq.getAlternativeAnswers().isBlank()) {
                // Parse comma-separated or json
                String[] parts = pq.getAlternativeAnswers().split("[,;|]");
                for (String p : parts) {
                    if (!p.trim().isEmpty() && !p.trim().equalsIgnoreCase(pq.getCorrectAnswer().trim())) {
                        customDistractors.add(p.trim());
                    }
                }
            }
            if (customDistractors.size() < 3) {
                customDistractors.addAll(extractDistractors(pq.getCorrectAnswer().trim(), NAME_DISTRACTORS));
            }
            candidates.add(createQuestion(
                    pq.getQuestionText().trim(),
                    pq.getCategory() != null ? pq.getCategory().trim() : "Custom",
                    pq.getCorrectAnswer().trim(),
                    customDistractors
            ));
        }

        if (candidates.isEmpty()) {
            return Collections.emptyList();
        }

        // Group by category to ensure diversity
        Map<String, List<InternalQuestion>> byCategory = new LinkedHashMap<>();
        for (InternalQuestion q : candidates) {
            byCategory.computeIfAbsent(q.getCategory(), k -> new ArrayList<>()).add(q);
        }

        // Shuffle within each category
        for (List<InternalQuestion> list : byCategory.values()) {
            Collections.shuffle(list);
        }

        // Round-robin selection up to 5 questions
        List<InternalQuestion> selected = new ArrayList<>();
        int maxQuestions = Math.min(5, candidates.size());

        boolean addedAny = true;
        while (selected.size() < maxQuestions && addedAny) {
            addedAny = false;
            for (Map.Entry<String, List<InternalQuestion>> entry : byCategory.entrySet()) {
                List<InternalQuestion> list = entry.getValue();
                if (!list.isEmpty() && selected.size() < maxQuestions) {
                    selected.add(list.remove(0));
                    addedAny = true;
                }
            }
        }

        // Assign clean 0-based indices
        for (int i = 0; i < selected.size(); i++) {
            selected.get(i).setIndex(i);
        }

        return selected;
    }

    private InternalQuestion createQuestion(String text, String category, String correctAnswer, List<String> distractors) {
        Set<String> optionsSet = new LinkedHashSet<>();
        optionsSet.add(correctAnswer);

        for (String d : distractors) {
            if (d != null && !d.isBlank() && !d.trim().equalsIgnoreCase(correctAnswer)) {
                optionsSet.add(d.trim());
                if (optionsSet.size() == 4) break;
            }
        }

        // If still fewer than 4, pull safe fallback options
        if (optionsSet.size() < 4) {
            for (String fallback : List.of("Option A", "Option B", "Option C", "Option D")) {
                if (!fallback.equalsIgnoreCase(correctAnswer)) {
                    optionsSet.add(fallback);
                    if (optionsSet.size() == 4) break;
                }
            }
        }

        List<String> optionsList = new ArrayList<>(optionsSet);
        Collections.shuffle(optionsList);

        return new InternalQuestion(0, text, category, correctAnswer, optionsList);
    }

    private List<String> extractDistractors(String correctAnswer, List<String> pool) {
        List<String> list = new ArrayList<>();
        for (String item : pool) {
            if (item != null && !item.isBlank() && !item.equalsIgnoreCase(correctAnswer)) {
                list.add(item);
            }
        }
        Collections.shuffle(list);
        return list;
    }

    private String formatMonthDay(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern("d MMMM", Locale.ENGLISH));
    }

    // JSON Serialization Helpers for session persistence
    public String serializeQuestions(List<InternalQuestion> questions) {
        try {
            return objectMapper.writeValueAsString(questions);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize question set", e);
        }
    }

    public List<InternalQuestion> deserializeQuestions(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<InternalQuestion>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize question set", e);
        }
    }
}
