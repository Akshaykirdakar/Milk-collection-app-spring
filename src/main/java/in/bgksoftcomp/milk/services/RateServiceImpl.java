package in.bgksoftcomp.milk.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.bgksoftcomp.milk.entity.RateDetails;
import in.bgksoftcomp.milk.entity.RateMaster;
import in.bgksoftcomp.milk.repository.RateDetailsRepository;
import in.bgksoftcomp.milk.repository.RateMasterRepository;
import jakarta.transaction.Transactional;

@Service
public class RateServiceImpl implements RateService {

	@Autowired
	private RateMasterRepository rateMasterRepo;

	@Autowired
	private RateDetailsRepository rateDetailsRepo;

	@Transactional
	@Override
	public RateMaster saveRateMaster(RateMaster rateMaster) {
	    List<RateDetails> inputDetails = rateMaster.getRateDetails();
	    if (inputDetails == null || inputDetails.isEmpty()) {
	        throw new IllegalArgumentException("RateDetails cannot be empty");
	    }

	 // Ensure that animalType is set in RateMaster first
	    Integer animalType = rateMaster.getAnimalType();
	    
	    List<RateDetails> newOrUpdatedDetails = new ArrayList<>();

	    for (RateDetails detail : inputDetails) {
	        // Ensure that animalType is set on each RateDetails through the RateMaster
	        detail.setRateMaster(rateMaster); // Ensure that rateMaster is set
	        detail.setAnimalType(animalType); // Ensure animalType is set in RateDetails
	        System.out.println("animalType======> " +animalType);
	        
	        // Fetch existing rate details based on fat, snf, date range, and animalType
	        Optional<RateDetails> existingOpt = rateDetailsRepo.findExistingRateDetails(
	            detail.getFat(), detail.getSnf(),
	            rateMaster.getStartDate(), rateMaster.getEndDate(),
	            rateMaster.getAnimalType() // Include animalType in the check
	        );

	        if (existingOpt.isPresent()) {
	            RateDetails existing = existingOpt.get();
	            if (!existing.getRate().equals(detail.getRate())) {
	                // Rate is different → update it
	                existing.setRate(detail.getRate());
	                newOrUpdatedDetails.add(existing); // mark for update
	            }
	        } else {
	            // New entry → insert it
	        	detail.setRateMaster(rateMaster); // Attach RateMaster to the detail
	            detail.setAnimalType(animalType); // Ensure animalType is set in RateDetails
	            newOrUpdatedDetails.add(detail);
	        }
	    }

	    if (newOrUpdatedDetails.isEmpty()) {
	        throw new IllegalStateException("No new or updated RateDetails found. RateMaster not saved.");
	    }

	    // Save RateMaster first (detach RateDetails to avoid cascade loop)
	    rateMaster.setRateDetails(null); // Detach rateDetails temporarily to avoid cascading
	    RateMaster savedMaster = rateMasterRepo.save(rateMaster);

	    for (RateDetails detail : newOrUpdatedDetails) {
	        detail.setRateMaster(savedMaster); // Attach the saved RateMaster
	        detail.setAnimalType(animalType); 
	        System.out.println("animalType======> " +animalType);
	        rateDetailsRepo.save(detail); // Save the RateDetails (insert or update)
	    }

	    return savedMaster;
	}




	@Override
	public List<RateMaster> getAllRateMasters() {
		return rateMasterRepo.findAll();
	}

	@Override
	public RateMaster getRateMasterById(Long id) {
		return rateMasterRepo.findById(id).orElse(null);
	}

	@Override
	public void deleteRateMaster(Long id) {
		rateMasterRepo.deleteById(id);
	}

	@Override
	public List<RateMaster> getRateMastersByDateRange(LocalDate startDate, LocalDate endDate) {
		return rateMasterRepo.findRateMastersByDateRange(startDate, endDate);
	}
}
