package in.bgksoftcomp.milk.services;

import java.util.List;
import java.util.Optional;

import in.bgksoftcomp.milk.entity.UserMaster;

public interface UserMasterService {

	List<UserMaster> getUserList() throws Exception;

	UserMaster save(UserMaster userMaster) throws Exception;

	Optional<UserMaster> getUserById(long userID) throws Exception;

	void deleteUserById(Long userID);

	// 🔍 Search Methods
	Optional<UserMaster> getUserByUsername(String username);

	List<UserMaster> searchUsersByName(String namePart);

	List<UserMaster> getUsersByRole(String role);

	List<UserMaster> getActiveUsers();

	List<UserMaster> getInactiveUsers();

	// 🔐 Authentication-style check (optional)
	boolean existsByUsername(String username);

	boolean validateUserCredentials(String username, String password); // basic login-like check

	// 🔄 Update helpers
	void updateUserDetails(long userId, UserMaster updatedUser) throws Exception;

}
