package in.bgksoftcomp.milk.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import in.bgksoftcomp.milk.entity.MilkCollection;

@Repository
public interface MilkCollectionRepository extends JpaRepository<MilkCollection, Long> {

	List<MilkCollection> findBySupplierName(String supplierName);

	List<MilkCollection> findByUserID(Long userID);
	
	// Fetch all entries between two dates, ordered by userID
    @Query("SELECT m FROM MilkCollection m " +
           "WHERE m.date BETWEEN :fromDate AND :toDate " +
           "ORDER BY m.userID, m.date")
    List<MilkCollection> findAllBetweenDates(
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate
    );
	
}