package in.bgksoftcomp.milk.services;

import java.util.List;

import in.bgksoftcomp.milk.entity.MilkRate;

public interface MilkRateService {

	public MilkRate save(MilkRate milkRate);
	
	 public List<MilkRate> getAllRates();
}
