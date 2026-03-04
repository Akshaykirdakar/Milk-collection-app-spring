package in.bgksoftcomp.milk.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.bgksoftcomp.milk.entity.MilkCollection;
import in.bgksoftcomp.milk.entity.MilkRate;
import in.bgksoftcomp.milk.repository.MilkCollectionRepository;
import in.bgksoftcomp.milk.repository.MilkRateRepository;
import in.bgksoftcomp.milk.repository.RateDetailsRepository;
import in.bgksoftcomp.milk.repository.RateMasterRepository;

@Service
public class MilkCollectionServiceImpl implements MilkCollectionService {

	@Autowired
	private MilkCollectionRepository repository;

	@Autowired
	private RateMasterRepository rateMasterRepo;

	@Autowired
	private RateDetailsRepository rateDetailsRepo;
	
	 @Autowired
	    private MilkRateRepository milkRateRepository;

	public List<MilkCollection> getAll() {
		return repository.findAll();
	}

	public MilkCollection save(MilkCollection milkCollection) throws Exception {
		
		List<MilkRate> allRates = milkRateRepository.findAll();

	    LocalDate date = milkCollection.getDate();
	    double fat = (milkCollection.getFat());
	    double snf = (milkCollection.getSnf());

	    Optional<MilkRate> rateMatch = allRates.stream()
	        .filter(rate ->
	            !date.isBefore(rate.getFromDate()) &&
	            !date.isAfter(rate.getToDate()) &&
	            (rate.getFat()) == fat &&
	            (rate.getSnf()) == snf
	        )
	        .findFirst();

	    if (rateMatch.isEmpty()) {
	        throw new RuntimeException("No rate found for FAT=" + fat + ", SNF=" + snf + ", Date=" + date);
	    }

	    milkCollection.setRate(rateMatch.get().getRate());
	    return repository.save(milkCollection);
	}

	@Override
	public List<MilkCollection> getAllCollectionBySupplierName(String supplierName) {
		// TODO Auto-generated method stub
		return repository.findBySupplierName(supplierName);
	}

	@Override
	public List<MilkCollection> getAllCollectionByUserID(Long userID) {
		// TODO Auto-generated method stub
		return repository.findByUserID(userID);
	} 

}
