package in.bgksoftcomp.milk.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class RateMaster {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String year;

    @Column(name = "animal_type") // e.g., Cow = 1, Buffalo = 2
    private Integer animalType;

    private LocalDate startDate;
    private LocalDate endDate;

    @OneToMany(mappedBy = "rateMaster", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<RateDetails> rateDetails;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public Integer getAnimalType() {
		return animalType;
	}

	public void setAnimalType(Integer animalType) {
		this.animalType = animalType;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public List<RateDetails> getRateDetails() {
		return rateDetails;
	}

	public void setRateDetails(List<RateDetails> rateDetails) {
		this.rateDetails = rateDetails;
	}
    
    

}
