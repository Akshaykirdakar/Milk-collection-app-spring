package in.bgksoftcomp.milk.services;

import org.springframework.stereotype.Service;

import in.bgksoftcomp.milk.entity.MilkReportSettings;

@Service
public class MilkReportSettingsService {

    private MilkReportSettings settings = new MilkReportSettings();

    public MilkReportSettings getSettings() {
        return settings;
    }

    public void updateSettings(MilkReportSettings newSettings) {
        this.settings = newSettings;
    }
}
