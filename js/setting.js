let username = document.getElementById("username");
let currentPassword = document.getElementById("password");
let newPassword = document.getElementById("changePassword");

const usernameRegex = /^(?=.*[a-zA-Z]{3,})[\w]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[?$_&!@#^&*-])(?=.*[0-9]).{8,}$/;


// Event listener for real-time username validation
username.addEventListener("input", () => {
    let messageBox = document.getElementById("usernameMessage");
    const usernameValue = username.value;
    messageBox.textContent = usernameExistsValidation(usernameValue);
    messageBox.style.color = messageBox.textContent ? "#FFA07A" : "transparent";
});

// Function to validate the existence of the username
const usernameExistsValidation = (usernameValue) => {
    if (usernameValue.length === 0) {
        return "Username cannot be empty";
    } else if (usernameValue.length < 6) {
        return "Username must at least be 6 characters long";
    } else if (!usernameRegex.test(usernameValue)) {
        return "Username can only have underscore, digits & minimum of 3 alphabets";
    } else {
        let users = JSON.parse(localStorage.getItem('users'));
        let user = users.find(user => user.username === usernameValue);
        if (!user) {
            return "Username does not exist";
        }
    }
    return "";
};

// Event listener for real-time current password validation
currentPassword.addEventListener("input", () => {
    let messageBox = document.getElementById("passwordMessage");
    const passwordValue = currentPassword.value;
    messageBox.textContent = passwordValidation(username.value, passwordValue);
    messageBox.style.color = messageBox.textContent ? "#FFA07A" : "transparent";
});

// Function to validate the current password
const passwordValidation = (usernameValue, passwordValue) => {
    if (passwordValue.length === 0) {
        return "Password cannot be empty";
    } else {
        let users = JSON.parse(localStorage.getItem('users'));
        let user = users.find(user => user.username === usernameValue);
        if (user && user.password !== passwordValue) {
            return "Current password is incorrect";
        }
    }
    return "";
};

// Event listener for real-time new password validation
newPassword.addEventListener("input", () => {
    let messageBox = document.getElementById("changePasswordMessage");
    const newPasswordValue = newPassword.value;
    messageBox.textContent = validateNewPassword(newPasswordValue);
    messageBox.style.color = messageBox.textContent ? "#FFA07A" : "transparent";
});

// Function to validate the new password
const validateNewPassword = (newPasswordValue) => {
    if (newPasswordValue.length === 0) {
        return "New password cannot be empty";
    } else if (!passwordRegex.test(newPasswordValue)) {
        return "New password should have a minimum of 8 characters and include at least 1 symbol, digit, lowercase and uppercase letter!";
    }
    return "";
};

// Function to validate and process the change password form
const validateChangePasswordForm = (event) => {
    event.preventDefault();
    const usernameValue = username.value;
    const currentPasswordValue = currentPassword.value;
    const newPasswordValue = newPassword.value;

    const usernameError = usernameExistsValidation(usernameValue);
    const currentPasswordError = passwordValidation(usernameValue, currentPasswordValue);
    const newPasswordError = validateNewPassword(newPasswordValue);

    if (usernameError || currentPasswordError || newPasswordError) {
        document.getElementById("usernameMessage").textContent = usernameError;
        document.getElementById("passwordMessage").textContent = currentPasswordError;
        document.getElementById("changePasswordMessage").textContent = newPasswordError;
    } else {
        
        let users = JSON.parse(localStorage.getItem('users'));
        let userIndex = users.findIndex(user => user.username === usernameValue);
        if (userIndex !== -1) {
            users[userIndex].password = newPasswordValue;
            localStorage.setItem('users', JSON.stringify(users));
            alert("Password changed successfully!");
           
        } else {
            alert("Username does not exist.");
        }
    }
};


