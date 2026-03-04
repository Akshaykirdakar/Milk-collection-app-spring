package in.bgksoftcomp.milk.controller;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.bgksoftcomp.milk.entity.UserMaster;
import in.bgksoftcomp.milk.services.UserMasterService;

@RestController
@RequestMapping("/milk/user")
@CrossOrigin("http://localhost:3000/")
public class UserMasterController {

	@Autowired
	private UserMasterService userMasterService;

	@GetMapping
	public ResponseEntity<List<UserMaster>> getAllUsers() {
		try {
			List<UserMaster> users = userMasterService.getUserList();
			return ResponseEntity.ok(users);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping
	public ResponseEntity<?> addUser(@RequestBody UserMaster user) {
	    try {
	        String generatedUsername = user.generateUsername(userMasterService);
	        user.setUsername(generatedUsername);

	        UserMaster savedUser = userMasterService.save(user);

	        Map<String, Object> response = new LinkedHashMap<>();
	        response.put("message", "User created successfully.");
	        response.put("id", savedUser.getId());
	        response.put("username", savedUser.getUsername());
	        response.put("password", savedUser.getPassword());
	        

	        return ResponseEntity.status(HttpStatus.CREATED).body(response);
	    } catch (Exception e) {
	    	Map<String, String> errorResponse = new HashMap<>();
	        errorResponse.put("message", "Error: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
	    }
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserMaster> getUserById(@PathVariable Long id) {
		try {
			Optional<UserMaster> user = userMasterService.getUserById(id);
			return user.map(ResponseEntity::ok)
					   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id) {
		try {
			userMasterService.deleteUserById(id);
			return ResponseEntity.ok("User deleted successfully.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
		}
	}

	@GetMapping("/username/{username}")
	public ResponseEntity<UserMaster> getUserByUsername(@PathVariable String username) {
		Optional<UserMaster> user = userMasterService.getUserByUsername(username);
		return user.map(ResponseEntity::ok)
				   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/search/{name}")
	public ResponseEntity<List<UserMaster>> searchUsersByName(@PathVariable String name) {
		return ResponseEntity.ok(userMasterService.searchUsersByName(name));
	}

	@GetMapping("/role/{role}")
	public ResponseEntity<List<UserMaster>> getUsersByRole(@PathVariable String role) {
		return ResponseEntity.ok(userMasterService.getUsersByRole(role));
	}

	@GetMapping("/active")
	public ResponseEntity<List<UserMaster>> getActiveUsers() {
		return ResponseEntity.ok(userMasterService.getActiveUsers());
	}

	@GetMapping("/inactive")
	public ResponseEntity<List<UserMaster>> getInactiveUsers() {
		return ResponseEntity.ok(userMasterService.getInactiveUsers());
	}

	@GetMapping("/exists/{username}")
	public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
		return ResponseEntity.ok(userMasterService.existsByUsername(username));
	}

	@PostMapping("/validate")
	public ResponseEntity<Boolean> validateCredentials(@RequestBody UserMaster user) {
		boolean isValid = userMasterService.validateUserCredentials(user.getUsername(), user.getPassword());
		return ResponseEntity.ok(isValid);
	}

	@PutMapping("/{id}")
	public ResponseEntity<UserMaster> updateUser(@PathVariable long id, @RequestBody UserMaster updatedUser) {
	    Map<String, String> response = new HashMap<>();
	    try {
	        userMasterService.updateUserDetails(id, updatedUser);
	        
	        Optional<UserMaster> user = userMasterService.getUserById(id);
	        
			response.put("message", "User updated successfully.");
	        //return ResponseEntity.ok(response);
	        return user.map(ResponseEntity::ok)
					   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	    } catch (Exception e) {
	        response.put("error", e.getMessage());
	       // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}

}
