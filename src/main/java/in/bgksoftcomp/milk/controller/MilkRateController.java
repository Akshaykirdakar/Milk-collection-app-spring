package in.bgksoftcomp.milk.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import in.bgksoftcomp.milk.entity.MilkRate;
import in.bgksoftcomp.milk.entity.RateSlab;
import in.bgksoftcomp.milk.entity.RateSlabRequest;
import in.bgksoftcomp.milk.repository.MilkRateRepository;
import in.bgksoftcomp.milk.repository.RateSlabRepository;
import in.bgksoftcomp.milk.services.RateSlabService;

@RestController
@RequestMapping("/api/rates")
@CrossOrigin("http://localhost:3000/")
public class MilkRateController {

    @Autowired
    private MilkRateRepository milkRateRepository;

    @Autowired
    private RateSlabRepository rateSlabRepository;
    
    @Autowired
    private RateSlabService rateSlabService;

    @GetMapping("/milk")
    public List<MilkRate> getAllMilkRates() {
        return milkRateRepository.findAll();
    }

    @PostMapping("/milk")
    public MilkRate saveMilkRate(@RequestBody MilkRate milkRate) {
        return milkRateRepository.save(milkRate);
    }

    @GetMapping("/slabs")
    public List<RateSlab> getAllRateSlabs() {
        return rateSlabRepository.findAll();
    }

    @PostMapping("/slabs")
    public RateSlab saveRateSlab(@RequestBody RateSlab rateSlab) {
        return rateSlabRepository.save(rateSlab);
    }
    
    @PostMapping("/slabs/batch")
    public List<RateSlab> saveRateSlabs(@RequestBody RateSlabRequest request) {
        List<RateSlab> savedSlabs = new ArrayList<>();
        for (RateSlabRequest.SlabDetail detail : request.getSlabs()) {
            RateSlab slab = new RateSlab();
            slab.setFromDate(request.getFromDate());
            slab.setToDate(request.getToDate());
            slab.setType(detail.getType());
            slab.setFromValue(detail.getFromValue());
            slab.setToValue(detail.getToValue());
            slab.setRatePerStep(detail.getRatePerStep());

            savedSlabs.add(rateSlabRepository.save(slab));
        }
        return savedSlabs;
    }

    
    @PostMapping("/generate")
    public String generateRates(
        @RequestParam double baseRate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
    	List<MilkRate> milkRates = rateSlabService.calculateAllRates(baseRate, fromDate, toDate);
        return "Milk rates calculated and saved successfully.";
    }
}
