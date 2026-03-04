package in.bgksoftcomp.milk.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import in.bgksoftcomp.milk.entity.RateMaster;

@Repository
public interface RateMasterRepository extends JpaRepository<RateMaster, Long> {

    // Custom query to find RateMasters by startDate and endDate
    @Query("SELECT rm FROM RateMaster rm WHERE rm.startDate >= :startDate AND rm.endDate <= :endDate")
    List<RateMaster> findRateMastersByDateRange(@Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);
    
    
    @Query("SELECT rm FROM RateMaster rm WHERE rm.animalType = :animalType AND :date BETWEEN rm.startDate AND rm.endDate")
    Optional<RateMaster> findApplicableRateMaster(@Param("animalType") Integer animalType, @Param("date") LocalDate date);

    
    

}
