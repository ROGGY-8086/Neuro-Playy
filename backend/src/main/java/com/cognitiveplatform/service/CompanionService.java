package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.entity.RadarAgentEntity;
import com.cognitiveplatform.entity.TelemetryEntity;
import com.cognitiveplatform.entity.UserSettingsEntity;
import com.cognitiveplatform.mapper.CompanionMapper;
import com.cognitiveplatform.repository.RadarAgentRepository;
import com.cognitiveplatform.repository.TelemetryRepository;
import com.cognitiveplatform.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CompanionService {

    private final TelemetryRepository telemetryRepository;
    private final RadarAgentRepository radarAgentRepository;
    private final UserSettingsRepository settingsRepository;
    private final CompanionMapper companionMapper;

    public CompanionService(TelemetryRepository telemetryRepository,
                            RadarAgentRepository radarAgentRepository,
                            UserSettingsRepository settingsRepository,
                            CompanionMapper companionMapper) {
        this.telemetryRepository = telemetryRepository;
        this.radarAgentRepository = radarAgentRepository;
        this.settingsRepository = settingsRepository;
        this.companionMapper = companionMapper;
    }

    @Transactional(readOnly = true)
    public TelemetryDto getTelemetry() {
        TelemetryEntity entity = telemetryRepository.findTopByOrderByIdAsc()
                .orElseGet(() -> {
                    TelemetryEntity defaultEntity = new TelemetryEntity();
                    defaultEntity.setRecallBalance(9.16);
                    defaultEntity.setPerSecondGain(214.1);
                    defaultEntity.setVelocity("154.3M/SEC");
                    defaultEntity.setErrorDriftIndex("0.384 [-1.2%]");
                    defaultEntity.setDailyFocusFee(124);
                    defaultEntity.setFocusTax(15);
                    defaultEntity.setDailyModelRamp(85);
                    defaultEntity.setXpPerMin(3450);
                    defaultEntity.setStreak(7.2);
                    defaultEntity.setDriftReduction(78);
                    defaultEntity.setRatValue(21.43);
                    defaultEntity.setNodeId("08/A");
                    defaultEntity.setProtocolStatus("EXTENDED DRILL V2.3");
                    defaultEntity.setEscalating(true);
                    return telemetryRepository.save(defaultEntity);
                });
        return companionMapper.toDto(entity);
    }

    public TelemetryDto updateTelemetry(TelemetryDto updates) {
        TelemetryEntity entity = telemetryRepository.findTopByOrderByIdAsc()
                .orElseGet(TelemetryEntity::new);
        companionMapper.updateEntity(entity, updates);
        TelemetryEntity saved = telemetryRepository.save(entity);
        return companionMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<CognitivePillarDto> getPillars() {
        return Arrays.asList(
                new CognitivePillarDto("pillar-1", "01", "DAILY MEMORY GAME", "target",
                        "Personalized memory questions tailored by your caregiver about loved ones, treasured milestones, and familiar places.",
                        "RECALL GAIN", "+48.2%", "recall", "#10B981", "daily-game"),
                new CognitivePillarDto("pillar-2", "02", "INHIBITORY CONTROL", "lightbulb",
                        "Suppress involuntary gaze tracking and notification triggers. Learn to ignore high-contrast distractions right as they spawn.",
                        "DISTRACTION LOSS", "-62.4%", "distraction", "#F5B800", "inhibitory"),
                new CognitivePillarDto("pillar-3", "03", "FACIAL ASSOCIATOR", "badge",
                        "Rapid-fire accurate retrieval of names, project traits, and stressful avatars under time stress.",
                        "SOCIAL RETENTION", "+54.0%", "retention", "#0EA5E9", "facial-associator"),
                new CognitivePillarDto("pillar-4", "04", "SYNAPTIC VELOCITY", "zap",
                        "Milliseconds matter. Shrink the cognitive latency between sensory recognition and physical decision-making loops.",
                        "REACTION SPEED", "+187 MS", "velocity", "#A855F7", "synaptic-velocity")
        );
    }

    @Transactional(readOnly = true)
    public List<RadarAgentDto> getRadarAgents() {
        List<RadarAgentEntity> agents = radarAgentRepository.findAllByOrderByIdAsc();
        if (agents.isEmpty()) {
            resetRadarAgents();
            agents = radarAgentRepository.findAllByOrderByIdAsc();
        }
        return agents.stream().map(companionMapper::toDto).collect(Collectors.toList());
    }

    public Map<String, Object> neutraliseAgent(Long agentId) {
        RadarAgentEntity agent = radarAgentRepository.findById(agentId).orElse(null);
        if (agent != null) {
            agent.setStatus("countered");
            agent.setSpeech("Countermeasure Active! [STABILIZED]");
            radarAgentRepository.save(agent);
        }
        return Map.of("success", true, "bonusPoints", 350);
    }

    public List<RadarAgentDto> resetRadarAgents() {
        radarAgentRepository.deleteAll();
        List<RadarAgentEntity> seeds = Arrays.asList(
                new RadarAgentEntity(1L, "AGENT 01", 22, 36, "threat", "Unread Notification Ping [ATTENTION]", 12),
                new RadarAgentEntity(2L, "AGENT 02", 35, 28, "active", "Background Multitasking Load", 18),
                new RadarAgentEntity(3L, "AGENT 03", 48, 20, "active", "Pending Calendar Alert", 9),
                new RadarAgentEntity(4L, "AGENT 04", 68, 40, "threat", "High Contrast Visual Flashing", 14),
                new RadarAgentEntity(5L, "AGENT 05", 75, 56, "active", "Unsorted Task Inflow", 22),
                new RadarAgentEntity(6L, "AGENT 06", 32, 72, "threat", "Sudden Device Vibration", 10),
                new RadarAgentEntity(7L, "AGENT 07", 44, 65, "active", "Peripheral Screen Glare", 16)
        );
        radarAgentRepository.saveAll(seeds);
        return seeds.stream().map(companionMapper::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SimulatorStageDto> getSimulatorStages() {
        return Arrays.asList(
                new SimulatorStageDto(1, 4, "PERIPHERAL SENSORY FILTER", "Identify baseline noise signatures and lock focus onto target frequency anchors.", 3, true),
                new SimulatorStageDto(2, 4, "DISTRACT THEM BEFORE THEY CLOG", "Scan, identify, and formulate sound drop-ins when distraction corruptions reach thresholds. Keep out-of-focus elements low.", 5, false),
                new SimulatorStageDto(3, 4, "CROSS-MODAL DUAL SYNCHRONIZATION", "Correlate simultaneous audio tone shifts with spatial coordinate triggers under isometric pressure.", 6, false),
                new SimulatorStageDto(4, 4, "PREFRONTAL DRIFT ARREST", "Maintain maximum uninterrupted cognitive hold for 90 seconds while eliminating high-salience peripheral lures.", 8, false)
        );
    }

    @Transactional(readOnly = true)
    public List<CohortTestimonialDto> getCohortTestimonials() {
        return Arrays.asList(
                new CohortTestimonialDto("test-1", "I used to open browser tabs and instantly forget why. Two weeks into 10-day Neuro Playy and the cognitive reset is completely gone.", "DR. AMIE THORNE", "Design Systems Architect", "AT", "#F5B800", 42, 14200),
                new CohortTestimonialDto("test-2", "The doodle scenarios mixed with hard neuro-drills pushes working memory harder than clinical desktop software.", "ELENA LIN", "Chief Prod. Officer", "EL", "#D5D7DF", 19, 11850),
                new CohortTestimonialDto("test-3", "The fast-paced test teaches you how to ignore phone-pick focus. You literally feel the relief when you dispell distractions.", "BRYON D’SOUZA", "ER Physician", "BD", "#F5B800", 31, 18600)
        );
    }

    @Transactional(readOnly = true)
    public UserSettingsDto getSettings(Long userId) {
        UserSettingsEntity entity = settingsRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    UserSettingsEntity def = new UserSettingsEntity();
                    def.setUserId(userId != null ? userId : 1L);
                    return settingsRepository.save(def);
                });
        return companionMapper.toDto(entity);
    }

    public UserSettingsDto saveSettings(UserSettingsDto dto, Long userId) {
        UserSettingsEntity entity = settingsRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    UserSettingsEntity def = new UserSettingsEntity();
                    def.setUserId(userId != null ? userId : 1L);
                    return def;
                });
        companionMapper.updateEntity(entity, dto);
        UserSettingsEntity saved = settingsRepository.save(entity);
        return companionMapper.toDto(saved);
    }
}
