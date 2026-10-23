package com.cognitiveplatform.dto;

public class CognitivePillarDto {
    private String id;
    private String number;
    private String title;
    private String iconName;
    private String description;
    private String metricLabel;
    private String metricValue;
    private String metricType;
    private String accentColor;
    private String drillType;

    public CognitivePillarDto() {}

    public CognitivePillarDto(String id, String number, String title, String iconName, String description,
                              String metricLabel, String metricValue, String metricType, String accentColor, String drillType) {
        this.id = id;
        this.number = number;
        this.title = title;
        this.iconName = iconName;
        this.description = description;
        this.metricLabel = metricLabel;
        this.metricValue = metricValue;
        this.metricType = metricType;
        this.accentColor = accentColor;
        this.drillType = drillType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMetricLabel() {
        return metricLabel;
    }

    public void setMetricLabel(String metricLabel) {
        this.metricLabel = metricLabel;
    }

    public String getMetricValue() {
        return metricValue;
    }

    public void setMetricValue(String metricValue) {
        this.metricValue = metricValue;
    }

    public String getMetricType() {
        return metricType;
    }

    public void setMetricType(String metricType) {
        this.metricType = metricType;
    }

    public String getAccentColor() {
        return accentColor;
    }

    public void setAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }

    public String getDrillType() {
        return drillType;
    }

    public void setDrillType(String drillType) {
        this.drillType = drillType;
    }
}
