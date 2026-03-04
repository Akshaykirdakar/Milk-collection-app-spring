package in.bgksoftcomp.milk.entity;

import java.time.LocalDate;

public class MilkCollectionReportItem {
    private Long entryId;
    private LocalDate date;
    private int time;
    private Integer animalType;
    private double liters;
    private double fat;
    private int clr;
    private double snf;
    private double rate;
    private double totalAmount;
    
    private Long userID;
    private String supplierName;

    // Constructor
    public MilkCollectionReportItem(
        Long entryId,
        LocalDate date,
        int time,
        Integer animalType,
        double liters,
        double fat,
        int clr,
        double snf,
        double rate,
        double totalAmount,
        Long userID,
        String supplierName) {
        this.entryId = entryId;
        this.date = date;
        this.time = time;
        this.animalType = animalType;
        this.liters = liters;
        this.fat = fat;
        this.clr = clr;
        this.snf = snf;
        this.rate = rate;
        this.totalAmount = totalAmount;
        this.userID = userID;
        this.supplierName = supplierName;
    }

	public Long getEntryId() {
		return entryId;
	}

	public void setEntryId(Long entryId) {
		this.entryId = entryId;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public int getTime() {
		return time;
	}

	public void setTime(int time) {
		this.time = time;
	}

	public Integer getAnimalType() {
		return animalType;
	}

	public void setAnimalType(Integer animalType) {
		this.animalType = animalType;
	}

	public double getLiters() {
		return liters;
	}

	public void setLiters(double liters) {
		this.liters = liters;
	}

	public double getFat() {
		return fat;
	}

	public void setFat(double fat) {
		this.fat = fat;
	}

	public int getClr() {
		return clr;
	}

	public void setClr(int clr) {
		this.clr = clr;
	}

	public double getSnf() {
		return snf;
	}

	public void setSnf(double snf) {
		this.snf = snf;
	}

	public double getRate() {
		return rate;
	}

	public void setRate(double rate) {
		this.rate = rate;
	}

	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public Long getUserID() {
		return userID;
	}

	public void setUserID(Long userID) {
		this.userID = userID;
	}

	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}

    // Getters and setters omitted for brevity
    
    
    
}