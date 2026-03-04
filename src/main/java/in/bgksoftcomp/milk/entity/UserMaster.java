package in.bgksoftcomp.milk.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import in.bgksoftcomp.milk.services.UserMasterService;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class UserMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String username;
    private String password;
    private String role;

    private String firstName;
    private String middleName;
    private String lastName;
    
    private LocalDate dob;

    private String userMobile;
    private String userEmail;

    private String userAge;
    private String userGender;

    private String userActiveInactive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUserMobile() {
        return userMobile;
    }

    public void setUserMobile(String userMobile) {
        this.userMobile = userMobile;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserAge() {
        return userAge;
    }

    public void setUserAge(String userAge) {
        this.userAge = userAge;
    }

    public String getUserGender() {
        return userGender;
    }

    public void setUserGender(String userGender) {
        this.userGender = userGender;
    }

    public String getUserActiveInactive() {
        return userActiveInactive;
    }

    public void setUserActiveInactive(String userActiveInactive) {
        this.userActiveInactive = userActiveInactive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    

    public LocalDate getDob() {
		return dob;
	}

	public void setDob(LocalDate dob) {
		this.dob = dob;
	}

	public String generateUsername(UserMasterService userMasterService) {
        StringBuilder usernameBuilder = new StringBuilder();

        // Option 1: First letter of first name + last name (Akirdakar)
        String option1 = (firstName != null && !firstName.isEmpty() ? String.valueOf(firstName.charAt(0)) : "") + (lastName != null ? lastName : "");

        // Option 2: First name + last name initial (AkshayK)
        String option2 = (firstName != null && !firstName.isEmpty() ? firstName : "") + (lastName != null && !lastName.isEmpty() ? String.valueOf(lastName.charAt(0)) : "");

        // Option 3: First name initials + last name (ABKirdakar)
        String option3 = (firstName != null && !firstName.isEmpty() ? String.valueOf(firstName.charAt(0)) : "") 
                         + (middleName != null && !middleName.isEmpty() ? String.valueOf(middleName.charAt(0)) : "") 
                         + (lastName != null ? lastName : "");

        // Option 4: Last name + first letter of first name (KirdakarA)
        String option4 = (lastName != null ? lastName : "") + (firstName != null && !firstName.isEmpty() ? String.valueOf(firstName.charAt(0)) : "");

        // Option 5: Last name + first name initials (KirdakarAB)
        String option5 = (lastName != null ? lastName : "") 
                         + (firstName != null && !firstName.isEmpty() ? String.valueOf(firstName.charAt(0)) : "") 
                         + (middleName != null && !middleName.isEmpty() ? String.valueOf(middleName.charAt(0)) : "");

        // Combine the options into a list
        List<String> usernameOptions = Arrays.asList(option1, option2, option3, option4, option5);

        // Check each option and generate a unique username
        for (String usernameOption : usernameOptions) {
            String uniqueUsername = usernameOption.toLowerCase(); // Convert to lowercase

            // If the username is available, return it
            if (!userMasterService.existsByUsername(uniqueUsername)) {
                return uniqueUsername;
            }
        }

        // If none of the options are available, add a number to the last option (or any other strategy)
        String uniqueUsernameWithNumber = option5.toLowerCase(); // Start with the last option
        int counter = 1;

        // Try appending a number to the last option until a unique username is found
        while (userMasterService.existsByUsername(uniqueUsernameWithNumber)) {
            uniqueUsernameWithNumber = option5.toLowerCase() + counter;
            counter++;
        }

        return uniqueUsernameWithNumber;
    }



}
