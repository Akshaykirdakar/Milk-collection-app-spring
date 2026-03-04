package in.bgksoftcomp.milk.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "rate_slab")
public class RateSlab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // FAT or SNF
    private double fromValue;
    private double toValue;
    private double ratePerStep;

    private LocalDate fromDate;
    private LocalDate toDate;

    public RateSlab() {}

    public RateSlab(String type, double fromValue, double toValue, double ratePerStep, LocalDate fromDate, LocalDate toDate) {
        this.type = type;
        this.fromValue = fromValue;
        this.toValue = toValue;
        this.ratePerStep = ratePerStep;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    public Long getId() {
        return id;
    }

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
}
