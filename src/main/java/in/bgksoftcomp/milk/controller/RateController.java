package in.bgksoftcomp.milk.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import in.bgksoftcomp.milk.entity.RateDetails;
import in.bgksoftcomp.milk.entity.RateMaster;
import in.bgksoftcomp.milk.services.RateService;

@RestController
@RequestMapping("/milk/rate")
@CrossOrigin("http://localhost:3000/")
public class RateController {

	@Autowired
	private RateService rateService;

	 @PostMapping
	    public ResponseEntity<RateMaster> createRateMaster(@RequestBody RateMaster rateMaster) {
	     RateDetails rateDetails = new RateDetails();
	     
	     rateDetails.setAnimalType(rateMaster.getAnimalType());
		 RateMaster saved = rateService.saveRateMaster(rateMaster);
	        return ResponseEntity.ok(saved);
	    }

	    @GetMapping
	    public List<RateMaster> getAllRateMasters() {
	        return rateService.getAllRateMasters();
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<RateMaster> getRateMasterById(@PathVariable Long id) {
	        RateMaster rateMaster = rateService.getRateMasterById(id);
	        if (rateMaster != null) {
	            return ResponseEntity.ok(rateMaster);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteRateMaster(@PathVariable Long id) {
	        rateService.deleteRateMaster(id);
	        return ResponseEntity.noContent().build();
	    }
	    
	    @GetMapping("/bydate")
	    public ResponseEntity<List<RateMaster>> getRateMastersByDateRange(
	            @RequestParam("startDate") String startDate,
	            @RequestParam("endDate") String endDate) {
	        // Parse the start and end date strings to LocalDate
	        LocalDate parsedStartDate = LocalDate.parse(startDate);
	        LocalDate parsedEndDate = LocalDate.parse(endDate);
	        
	        List<RateMaster> rateMasters = rateService.getRateMastersByDateRange(parsedStartDate, parsedEndDate);
	        
	        return ResponseEntity.ok(rateMasters);
	    }
}
