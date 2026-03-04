package in.bgksoftcomp.milk.services;

import java.time.LocalDate;
import java.util.List;

import in.bgksoftcomp.milk.entity.RateMaster;

public interface RateService {
	
	RateMaster saveRateMaster(RateMaster rateMaster);
    List<RateMaster> getAllRateMasters();
    RateMaster getRateMasterById(Long id);
    void deleteRateMaster(Long id);
 // Method to get RateMasters by date range
    List<RateMaster> getRateMastersByDateRange(LocalDate startDate, LocalDate endDate);
}
