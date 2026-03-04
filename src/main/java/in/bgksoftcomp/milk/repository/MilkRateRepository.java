package in.bgksoftcomp.milk.repository;


import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import in.bgksoftcomp.milk.entity.MilkRate;

@Repository
public interface MilkRateRepository extends JpaRepository<MilkRate, Long> {
	
	
	Optional<MilkRate> findFirstByFatAndSnfAndFromDateLessThanEqualAndToDateGreaterThanEqual(
	        double fat, double snf, LocalDate from, LocalDate to
	    );
	
	
	@Query("SELECT m FROM MilkRate m " +
		       "WHERE :date BETWEEN m.fromDate AND m.toDate " +
		       "AND ABS(m.fat - :fat) < 0.05 AND ABS(m.snf - :snf) < 0.05")
		Optional<MilkRate> findApplicableRate(@Param("fat") double fat,
		                                      @Param("snf") double snf,
		                                      @Param("date") LocalDate date);

	
}
