package in.bgksoftcomp.milk.entity;

import java.util.ArrayList;
import java.util.List;

public class UserMilkCollectionReport {
    private Long userID;
    private String supplierName;
    private List<MilkCollectionReportItem> entries;
    private double totalLiters;
    private double totalAmount;

    public UserMilkCollectionReport(Long userID, String supplierName) {
        this.userID = userID;
        this.supplierName = supplierName;
        this.entries = new ArrayList<>();
        this.totalLiters = 0.0;
        this.totalAmount = 0.0;
    }

    public void addEntry(MilkCollectionReportItem item) {
        this.entries.add(item);
        this.totalLiters += item.getLiters();
        this.totalAmount += item.getTotalAmount();
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

	public List<MilkCollectionReportItem> getEntries() {
		return entries;
	}

	public void setEntries(List<MilkCollectionReportItem> entries) {
		this.entries = entries;
	}

	public double getTotalLiters() {
		return totalLiters;
	}

	public void setTotalLiters(double totalLiters) {
		this.totalLiters = totalLiters;
	}

	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

    // Getters and setters omitted for brevity
    
}