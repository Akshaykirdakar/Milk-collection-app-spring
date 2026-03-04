package in.bgksoftcomp.milk.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import in.bgksoftcomp.milk.entity.MilkRate;
import in.bgksoftcomp.milk.repository.MilkRateRepository;

public class MilkRateServiceImpl implements MilkRateService {

	 @Autowired
	    private MilkRateRepository repository;

	    public MilkRate save(MilkRate milkRate) {
	        return repository.save(milkRate);
	    }

	    public List<MilkRate> getAllRates() {
	        return repository.findAll();
	    }

}
