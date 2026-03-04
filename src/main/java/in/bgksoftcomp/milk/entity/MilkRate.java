package in.bgksoftcomp.milk.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
    name = "milk_rate",
    uniqueConstraints = @UniqueConstraint(columnNames = {"fat", "snf", "fromDate", "toDate"})
)
public class MilkRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double fat;
    private double snf;
    private double rate;

    private LocalDate fromDate;
    private LocalDate toDate;

    public MilkRate() {}

    public MilkRate(double fat, double snf, double rate, LocalDate fromDate, LocalDate toDate) {
        this.fat = fat;
        this.snf = snf;
        this.rate = rate;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    public Long getId() {
        return id;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
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
