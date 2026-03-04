package in.bgksoftcomp.milk.controller;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import in.bgksoftcomp.milk.entity.MilkCollection;
import in.bgksoftcomp.milk.services.MilkCollectionService;

@RestController
@RequestMapping("/milk")
@CrossOrigin("http://localhost:3000/")
public class MilkCollectionController {

	@Autowired
    private  MilkCollectionService service;

    @GetMapping
    public List<MilkCollection> getAll() {
        return service.getAll();
    }

    @PostMapping("/entry")
    public ResponseEntity<?> save(@RequestBody MilkCollection milkCollection) {
        try {
            MilkCollection saved = service.save(milkCollection);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("message", "Milk entry saved successfully.");
            response.put("id", saved.getId());
            response.put("supplierName", saved.getSupplierName());
            response.put("date", saved.getDate());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    @GetMapping("/supplier/{supplierName}")
    public List<MilkCollection> getAllBySupplier(@PathVariable String supplierName) {
    	System.out.println("suplier called ");
    	
    	List<MilkCollection> milkCollections = service.getAllCollectionBySupplierName(supplierName);
    	
        return milkCollections;
    }
    
    @GetMapping("/userID/{userID}")
    public List<MilkCollection> getAllBySupplier(@PathVariable Long userID) {
    	System.out.println("suplier called ");
    	
    	List<MilkCollection> milkCollections = service.getAllCollectionByUserID(userID);
    	
        return milkCollections;
    }



}
