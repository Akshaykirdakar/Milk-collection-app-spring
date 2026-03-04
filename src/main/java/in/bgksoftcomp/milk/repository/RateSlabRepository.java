package in.bgksoftcomp.milk.repository;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.bgksoftcomp.milk.entity.RateSlab;

@Repository
public interface RateSlabRepository extends JpaRepository<RateSlab, Long> {
	
	List<RateSlab> findByTypeAndFromDateAndToDate(String type, LocalDate fromDate, LocalDate toDate);
}
