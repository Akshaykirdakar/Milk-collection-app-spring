package in.bgksoftcomp.milk.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.bgksoftcomp.milk.entity.UserMaster;
import in.bgksoftcomp.milk.repository.UserMasterRepository;

@Service
public class UserMasterServiceImpl implements UserMasterService {

	@Autowired
	private UserMasterRepository userMasterRepository;

	@Override
	public List<UserMaster> getUserList() throws Exception {
		return userMasterRepository.findAll();
	}

	@Override
	public UserMaster save(UserMaster userMaster) throws Exception {
	    // Validate username
	    if (userMaster.getUsername() == null || userMaster.getUsername().trim().isEmpty()) {
	        throw new Exception("Username cannot be empty.");
	    }
	    
	    if (userMasterRepository.existsByUsername(userMaster.getUsername())) {
	        throw new Exception("Username already exists.");
	    }

	    // Validate password
	    if (userMaster.getPassword() == null || userMaster.getPassword().trim().isEmpty()) {
	        throw new Exception("Password cannot be empty.");
	    }
	    if (userMaster.getPassword().length() < 6) {
	        throw new Exception("Password must be at least 6 characters long.");
	    }
	    if (!userMaster.getPassword().matches(".*[A-Z].*") ||
	        !userMaster.getPassword().matches(".*[a-z].*") ||
	        !userMaster.getPassword().matches(".*\\d.*")) {
	        throw new Exception("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
	    }

	    // Optional: Email format check
	    if (userMaster.getUserEmail() != null && !userMaster.getUserEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
	        throw new Exception("Invalid email format.");
	    }

	    // Save user
	    UserMaster savedUser = userMasterRepository.save(userMaster);

	    // Check if save was successful
	    if (savedUser == null) {
	        throw new Exception("Failed to save user to the database.");
	    }

	    return savedUser;
	}


	@Override
	public Optional<UserMaster> getUserById(long userID) throws Exception {
		return userMasterRepository.findById(userID);
	}

	@Override
	public void deleteUserById(Long userID) {
		if (!userMasterRepository.existsById(userID)) {
			throw new IllegalArgumentException("User with ID " + userID + " does not exist.");
		}
		userMasterRepository.deleteById(userID);
	}

	@Override
	public Optional<UserMaster> getUserByUsername(String username) {
		return userMasterRepository.findByUsername(username);
	}

	@Override
	public List<UserMaster> searchUsersByName(String namePart) {
		return userMasterRepository.findByFirstNameContainingIgnoreCase(namePart);
	}

	@Override
	public List<UserMaster> getUsersByRole(String role) {
		return userMasterRepository.findByRole(role);
	}

	@Override
	public List<UserMaster> getActiveUsers() {
		return userMasterRepository.findByUserActiveInactive("ACTIVE");
	}

	@Override
	public List<UserMaster> getInactiveUsers() {
		return userMasterRepository.findByUserActiveInactive("INACTIVE");
	}

	@Override
	public boolean existsByUsername(String username) {
		return userMasterRepository.existsByUsername(username);
	}

	@Override
	public boolean validateUserCredentials(String username, String password) {
		if (username == null || password == null || username.trim().isEmpty() || password.trim().isEmpty()) {
			return false;
		}
		return userMasterRepository.findByUsernameAndPassword(username, password).isPresent();
	}

	@Override
	public void updateUserDetails(long userId, UserMaster updatedUser) throws Exception {
		Optional<UserMaster> existingUserOpt = userMasterRepository.findById(userId);

		if (existingUserOpt.isPresent()) {
			UserMaster existingUser = existingUserOpt.get();

			// Prevent username change to existing one
			if (!existingUser.getUsername().equals(updatedUser.getUsername())
					&& userMasterRepository.existsByUsername(updatedUser.getUsername())) {
				throw new Exception("Username already taken by another user.");
			}

			// Validate required fields
			if (updatedUser.getUsername() == null || updatedUser.getUsername().trim().isEmpty()) {
				throw new Exception("Username cannot be empty.");
			}
			if (updatedUser.getPassword() == null || updatedUser.getPassword().trim().isEmpty()) {
				throw new Exception("Password cannot be empty.");
			}

			// Copy values
			existingUser.setUsername(updatedUser.getUsername());
			existingUser.setPassword(updatedUser.getPassword());
			existingUser.setRole(updatedUser.getRole());
			existingUser.setUserMobile(updatedUser.getUserMobile());
			existingUser.setUserEmail(updatedUser.getUserEmail());
			existingUser.setUserAge(updatedUser.getUserAge());
			existingUser.setUserGender(updatedUser.getUserGender());
			existingUser.setUserActiveInactive(updatedUser.getUserActiveInactive());
			existingUser.setUpdatedAt(updatedUser.getUpdatedAt());

			userMasterRepository.save(existingUser);
		} else {
			throw new Exception("User not found with ID: " + userId);
		}
	}
}
