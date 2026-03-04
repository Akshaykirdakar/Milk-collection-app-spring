package in.bgksoftcomp.milk.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import in.bgksoftcomp.milk.entity.RateDetails;
import in.bgksoftcomp.milk.entity.RateMaster;

@Repository
public interface RateDetailsRepository extends JpaRepository<RateDetails, Long> {

	@Query("SELECT rd FROM RateDetails rd WHERE rd.fat = :fat AND rd.snf = :snf AND "
			+ "(rd.rateMaster.startDate <= :endDate AND rd.rateMaster.endDate >= :startDate) "
			+ "AND rd.rateMaster.animalType = :animalType")
	Optional<RateDetails> findExistingRateDetails(@Param("fat") Double fat, @Param("snf") Double snf,
			@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate,
			@Param("animalType") Integer animalType);

	Optional<RateDetails> findByRateMasterAndFatAndSnf(RateMaster rateMaster, Double fat, Double snf);

}
