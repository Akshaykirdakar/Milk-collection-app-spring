package in.bgksoftcomp.milk.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import in.bgksoftcomp.milk.entity.UserMaster;

public interface UserMasterRepository extends JpaRepository<UserMaster, Long> {

	// Find by username
	Optional<UserMaster> findByUsername(String username);

	// Search by partial name (case-insensitive)
	List<UserMaster> findByFirstNameContainingIgnoreCase(String namePart);

	// Find all users with a specific role
	List<UserMaster> findByRole(String role);

	// Find users based on active/inactive status
	List<UserMaster> findByUserActiveInactive(String status); // e.g., "ACTIVE" or "INACTIVE"

	// Check if a user exists by username
	boolean existsByUsername(String username);

	// Validate credentials
	Optional<UserMaster> findByUsernameAndPassword(String username, String password);
}
