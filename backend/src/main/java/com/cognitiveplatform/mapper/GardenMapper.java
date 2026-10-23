package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.GardenStateResponse;
import com.cognitiveplatform.entity.GardenState;
import org.springframework.stereotype.Component;

@Component
public class GardenMapper {

    public GardenStateResponse toResponse(GardenState entity) {
        if (entity == null) return null;
        GardenStateResponse resp = new GardenStateResponse();
        resp.setId(entity.getId());
        resp.setPlayerId(entity.getPlayerId());
        resp.setPlantsJson(entity.getPlantsJson());
        resp.setItemsJson(entity.getItemsJson());
        resp.setUpdatedAt(entity.getUpdatedAt());
        return resp;
    }
}
