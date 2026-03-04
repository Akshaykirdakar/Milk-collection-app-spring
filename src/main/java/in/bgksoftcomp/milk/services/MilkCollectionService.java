package in.bgksoftcomp.milk.services;

import java.util.List;

import in.bgksoftcomp.milk.entity.MilkCollection;

public interface MilkCollectionService {
	
	public List<MilkCollection> getAll();
	
	public MilkCollection save(MilkCollection milkCollection) throws Exception;
	
	List<MilkCollection> getAllCollectionBySupplierName(String supplierName);
	
	List<MilkCollection> getAllCollectionByUserID(Long userID);
	
	

	
}
