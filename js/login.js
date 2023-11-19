let username = document.getElementById("username");
let password = document.getElementById("password");


//Real-time validation event listener for the username input field
username.addEventListener("input", () => {
    let messageBox = document.getElementById("usernameMessage")
    const usernameValue = username.value;
    const errorUsername = usernameValidation(usernameValue);
  
    if (!errorUsername) {
        messageBox.textContent = "";     
    } else{
        messageBox.textContent = errorUsername;
        messageBox.style.color = "#FFA07A";
    }
});

// function for validation of username
const usernameValidation = (usernameValue) => {
    let regex = /^(?=.*[a-zA-Z]{3,})[\w]+$/;

    if (usernameValue.length === 0){
        return "Username cannot be empty"
    }  else if(usernameValue.length < 6) {
        return "Username must at least be 6 characters long"
    }  else if(!regex.test(usernameValue)){
        return "Username can only have undescore, digits & minimum of 3 alphabets"
    }  

    return null;
};


// Real-time validation event listener for the password input field
password.addEventListener("input", () => {
    let messageBox = document.getElementById("passwordMessage")
    const passwordValue = password.value;
    const errorPassword= passwordValidation(passwordValue);
    if (!errorPassword) {
        messageBox.textContent = "";      
    } else{
        messageBox.textContent = errorPassword;
        messageBox.style.color = "#FFA07A";
    }
});

// function for password validation
const passwordValidation = (passwordValue) => {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[?$_&!@#^&*-])(?=.*[0-9])[A-Za-z0-9?$_&!@#%^*-]{8,}$/;

    if(passwordValue.length === 0){
        return "Password cannot be empty"
    }else if(!regex.test(passwordValue)){
        return "Password should have a minimum of 8 characters and have at least 1 symbol, digit, lowercase and uppercase letter!"
    }
    return null;
};


// function to validate login form
const validateLoginForm = (event) => {
    event.preventDefault();
    // The value of each field
    const usernameValue = username.value;
    const passwordValue = password.value;

    if (usernameValidation(usernameValue) === null &&
        passwordValidation(passwordValue) === null) {

            let users = JSON.parse(localStorage.getItem('users'));
            let userExists = users.find(user => user.username === usernameValue)

            if (!userExists || userExists.password !== passwordValue){
                alert("Validation failed! Incorrect username or password");
                return false;
            }

            sessionStorage.setItem('isLoggedIn', 'true');
            alert("Login sucessful!");
            window.location.href= '../index.html';
        }
    };
