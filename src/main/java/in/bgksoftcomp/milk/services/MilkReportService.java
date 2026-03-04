package in.bgksoftcomp.milk.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import in.bgksoftcomp.milk.entity.MilkCollection;
import in.bgksoftcomp.milk.entity.MilkCollectionReportItem;
import in.bgksoftcomp.milk.entity.UserMilkCollectionReport;
import in.bgksoftcomp.milk.repository.MilkCollectionRepository;

@Service 
public class MilkReportService {

    private final MilkCollectionRepository milkCollectionRepository;

    public MilkReportService(MilkCollectionRepository milkCollectionRepository) {
        this.milkCollectionRepository = milkCollectionRepository;
    }

    public List<UserMilkCollectionReport> getDateWiseReport(LocalDate fromDate, LocalDate toDate) {
        List<MilkCollection> entries = milkCollectionRepository.findAllBetweenDates(fromDate, toDate);

        // Use a LinkedHashMap to preserve insertion order (by userID)
        Map<Long, UserMilkCollectionReport> reportMap = new LinkedHashMap<>();

        for (MilkCollection entry : entries) {
            Long uid = entry.getUserID();
            String supplierName = entry.getSupplierName();

            UserMilkCollectionReport userReport = reportMap.get(uid);
            if (userReport == null) {
                userReport = new UserMilkCollectionReport(uid, supplierName);
                reportMap.put(uid, userReport);
            }

            // Compute totalAmount = rate * liters
            double totalAmount = entry.getRate() * entry.getLiters();

            MilkCollectionReportItem item = new MilkCollectionReportItem(
                entry.getId(),
                entry.getDate(),
                entry.getTime(),
                entry.getAnimalType(),
                entry.getLiters(),
                entry.getFat(),
                entry.getClr(),
                entry.getSnf(),
                entry.getRate(),
                totalAmount,
                entry.getUserID(),
                entry.getSupplierName()
            );

            userReport.addEntry(item);
        }

        return new ArrayList<>(reportMap.values());
    }
}