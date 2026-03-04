package in.bgksoftcomp.milk.entity;

import java.time.LocalDate;
import java.util.List;

public class RateSlabRequest {

	private LocalDate fromDate;
	private LocalDate toDate;
	private List<SlabDetail> slabs;

	public static class SlabDetail {
		private String type;
		private double fromValue;
		private double toValue;
		private double ratePerStep;

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public double getFromValue() {
			return fromValue;
		}

		public void setFromValue(double fromValue) {
			this.fromValue = fromValue;
		}

		public double getToValue() {
			return toValue;
		}

		public void setToValue(double toValue) {
			this.toValue = toValue;
		}

		public double getRatePerStep() {
			return ratePerStep;
		}

		public void setRatePerStep(double ratePerStep) {
			this.ratePerStep = ratePerStep;
		}

		// Getters and setters

	}

	public LocalDate getFromDate() {
		return fromDate;
	}

	public void setFromDate(LocalDate fromDate) {
		this.fromDate = fromDate;
	}

	public LocalDate getToDate() {
		return toDate;
	}

	public void setToDate(LocalDate toDate) {
		this.toDate = toDate;
	}

	public List<SlabDetail> getSlabs() {
		return slabs;
	}

	public void setSlabs(List<SlabDetail> slabs) {
		this.slabs = slabs;
	}

	// Getters and setters

}