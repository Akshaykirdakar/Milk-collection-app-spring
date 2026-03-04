package in.bgksoftcomp.milk.services;

import java.time.LocalDate;
import java.util.List;

import in.bgksoftcomp.milk.entity.MilkRate;
import in.bgksoftcomp.milk.entity.RateSlab;


public interface RateSlabService {

	public RateSlab save(RateSlab rateSlab);
	
	public List<RateSlab> getAllSlabs();
	
	 public void deleteById(Long id);
	 
	 public RateSlab getById(Long id);

	public List<MilkRate> calculateAllRates(double baseRate, LocalDate fromDate, LocalDate toDate);
}
