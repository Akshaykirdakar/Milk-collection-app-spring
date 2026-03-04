package in.bgksoftcomp.milk.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.bgksoftcomp.milk.entity.MilkReportSettings;
import in.bgksoftcomp.milk.services.MilkReportSettingsService;

@RestController
@RequestMapping("/api/reports/settings")
@CrossOrigin("http://localhost:3000/")
public class MilkReportSettingsController {

    private final MilkReportSettingsService settingsService;

    public MilkReportSettingsController(MilkReportSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<MilkReportSettings> getSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PostMapping
    public ResponseEntity<?> updateSettings(@RequestBody MilkReportSettings settings) {
        settingsService.updateSettings(settings);
        return ResponseEntity.ok().build();
    }
}
