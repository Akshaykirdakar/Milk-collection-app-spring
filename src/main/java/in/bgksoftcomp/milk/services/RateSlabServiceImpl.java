package in.bgksoftcomp.milk.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.bgksoftcomp.milk.entity.MilkRate;
import in.bgksoftcomp.milk.entity.RateSlab;
import in.bgksoftcomp.milk.repository.MilkRateRepository;
import in.bgksoftcomp.milk.repository.RateSlabRepository;

@Service
public class RateSlabServiceImpl implements RateSlabService {

	@Autowired
	private MilkRateRepository milkRateRepository;

	@Autowired
	private RateSlabRepository repository;

	public RateSlab save(RateSlab rateSlab) {
		return repository.save(rateSlab);
	}

	public List<RateSlab> getAllSlabs() {
		return repository.findAll();
	}

	public void deleteById(Long id) {
		repository.deleteById(id);
	}

	public RateSlab getById(Long id) {
		return repository.findById(id).orElse(null);
	}

	public List<MilkRate> calculateAllRates(double baseRate, LocalDate fromDate, LocalDate toDate) {
		List<RateSlab> fatSlabs = repository.findByTypeAndFromDateAndToDate("FAT", fromDate, toDate);
		List<RateSlab> snfSlabs = repository.findByTypeAndFromDateAndToDate("SNF", fromDate, toDate);

		List<MilkRate> milkRates = new ArrayList<>();

		for (double fat = 2.5; fat <= 5.5; fat = round1(fat + 0.1)) {
			for (double snf = 7.5; snf <= 9.0; snf = round1(snf + 0.1)) {
				double rate = calculateRate(baseRate, fat, snf, fatSlabs, snfSlabs);
				milkRates.add(new MilkRate(fat, snf, rate, fromDate, toDate));
			}
		}

		//milkRateRepository.saveAll(milkRates);
		
		return milkRateRepository.saveAll(milkRates);
	}

	private double calculateRate(double baseRate, double fat, double snf, List<RateSlab> fatSlabs,
			List<RateSlab> snfSlabs) {
		double rate = baseRate;

		double currentFat = 2.5;
		for (RateSlab slab : fatSlabs) {
			while (round1(currentFat + 0.1) <= fat && round1(currentFat + 0.1) <= slab.getToValue()) {
				currentFat = round1(currentFat + 0.1);
				if (currentFat >= slab.getFromValue() && currentFat <= slab.getToValue()) {
					rate += slab.getRatePerStep();
				}
			}
		}

		double currentSnf = 9.0;
		for (RateSlab slab : snfSlabs) {
			while (round1(currentSnf - 0.1) >= snf && round1(currentSnf - 0.1) >= slab.getFromValue()) {
				currentSnf = round1(currentSnf - 0.1);
				if (currentSnf >= slab.getFromValue() && currentSnf <= slab.getToValue()) {
					rate -= slab.getRatePerStep();
				}
			}
		}

		return Math.round(rate * 100.0) / 100.0;
	}

	private double round1(double value) {
		return Math.round(value * 10.0) / 10.0;
	}

}
