package in.bgksoftcomp.milk.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
	    name = "rate_details",
	    uniqueConstraints = @UniqueConstraint(columnNames = {"fat", "snf", "animal_type"})
	)
public class RateDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Double fat;
	private Double snf;
	private Double rate;

	@ManyToOne
	@JoinColumn(name = "rate_master_id")
	@JsonBackReference
	private RateMaster rateMaster;
	
	@Column(name = "animal_type", insertable = false, updatable = false)
    private Integer animalType; // This will be set from RateMaster's animalType

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Double getFat() {
		return fat;
	}

	public void setFat(Double fat) {
		this.fat = fat;
	}

	public Double getSnf() {
		return snf;
	}

	public void setSnf(Double snf) {
		this.snf = snf;
	}

	public Double getRate() {
		return rate;
	}

	public void setRate(Double rate) {
		this.rate = rate;
	}

	public RateMaster getRateMaster() {
		return rateMaster;
	}

	public void setRateMaster(RateMaster rateMaster) {
		this.rateMaster = rateMaster;
	}

	public Integer getAnimalType() {
		return animalType;
	}

	public void setAnimalType(Integer animalType) {
		this.animalType = animalType;
	}
	
	

}
