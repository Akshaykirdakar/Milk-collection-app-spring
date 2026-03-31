	package in.bgksoftcomp.milk.controller;
	
	import java.time.LocalDate;
	import java.util.List;
	
	import org.springframework.format.annotation.DateTimeFormat;
	import org.springframework.http.ResponseEntity;
	import org.springframework.web.bind.annotation.CrossOrigin;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RequestParam;
	import org.springframework.web.bind.annotation.RestController;
	
	import in.bgksoftcomp.milk.entity.UserMilkCollectionReport;
	import in.bgksoftcomp.milk.services.MilkReportService;
	
	@RestController
	@RequestMapping("/api/reports/milk-collections")
	public class MilkReportController {
	
	    private final MilkReportService milkReportService;
	
	    public MilkReportController(MilkReportService milkReportService) {
	        this.milkReportService = milkReportService;
	    }
	
	    @GetMapping("/date-wise")
	    public ResponseEntity<List<UserMilkCollectionReport>> getDateWiseReport(
	        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
	        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
	
	        if (fromDate == null || toDate == null) {
	            return ResponseEntity.badRequest().build();
	        }
	
	        List<UserMilkCollectionReport> report = milkReportService.getDateWiseReport(fromDate, toDate);
	        return ResponseEntity.ok(report);
	    }
	}