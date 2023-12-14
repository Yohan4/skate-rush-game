// function to show placeholder type as text
const showplaceholderText = () => {
    const dob = document.getElementById('dob')
    if (dob.value === ''){
        dob.type = 'text';
        dob.placeholder = 'Date of birth';
    }
};

// function to show placeholder type as date
const changePlaceholder = () => {
    const dob = document.getElementById('dob');
    dob.type ='date';
};


let username = document.getElementById("username");
let button = document.getElementById("submit");
let email = document.getElementById("email");
let password = document.getElementById("password");
let date = document.getElementById("dob");
let gender = document.getElementById("gender");


//Real-time validation event listener for the username input field
username.addEventListener("input", () => {
    let messageBox = document.getElementById("usernameMessage")
    const usernameValue = username.value;
    const errorUsername = usernameValidation(usernameValue);
  
    if (!errorUsername) {
        messageBox.textContent = "Valid";
        messageBox.style.color = "#39FF14"      
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
    }  else {
        // check if username already exists in the users array in local storage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.username === usernameValue)) {
            return "Username is already taken. Choose another one!";
        }
    }

    return null;
};


//Real-time validation event listener for the email input field
email.addEventListener("input", () => {
    let messageBox = document.getElementById("emailMessage")
    const emailValue = email.value;
    const errorEmail = emailValidation(emailValue);
    if (!errorEmail) {
        messageBox.textContent = "Valid";
        messageBox.style.color = "#39FF14"      
    } else{
        messageBox.textContent = errorEmail;
        messageBox.style.color = "#FFA07A";
    }
});

//function for email validation
const emailValidation = (emailValue) => {
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

    if(emailValue.length === 0){
        return "Email cannot be empty"
    }else if(!regex.test(emailValue)){
        return "Your email address should in the format of name@domain.com."
    }
    return null;
};

//Real-time validation event listener for the password input field
password.addEventListener("input", () => {
    let messageBox = document.getElementById("passwordMessage")
    const passwordValue = password.value;
    const errorPassword= passwordValidation(passwordValue);
    if (!errorPassword) {
        messageBox.textContent = "Valid";
        messageBox.style.color = "#39FF14"      
    } else{
        messageBox.textContent = errorPassword;
        messageBox.style.color = "#FFA07A";
    }
});

//function for password validation
const passwordValidation = (passwordValue) => {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[?$_&!@#^&*-])(?=.*[0-9])[A-Za-z0-9?$_&!@#%^*-]{8,}$/;

    if(passwordValue.length === 0){
        return "Password cannot be empty"
    }else if(!regex.test(passwordValue)){
        return "Password should have a minimum of 8 characters and have at least 1 symbol, digit, lowercase and uppercase letter!"
    }
    return null;
};


//Real-time validation event listener for the date input field
date.addEventListener("input", () => {
    let messageBox = document.getElementById("dateMessage")
    const dateValue = date.value;
    const errorDate = dateValidation(dateValue);
    if (!errorDate) {
        messageBox.textContent = "Valid";
        messageBox.style.color = "#39FF14"      
    } else{
        messageBox.textContent = errorDate;
        messageBox.style.color = "#FFA07A";
    }
});

//function for date validation
const dateValidation = (dateValue) => {
    const dateinput = new Date(dateValue);
    const today_date = new Date();

    if(dateValue.length === 0){
        return "Date of birth cannot be empty"
    }else if (dateinput > today_date){
        return "Date of birth must be in the past"
    }
    return null;
};

//Real-time validation event listener for the gender select input field
gender.addEventListener("change", () => {
    let messageBox = document.getElementById("genderMessage")
    const genderValue = gender.value;
    const errorGender = genderValidation(genderValue);
    if (!errorGender) {
        messageBox.textContent = "Valid";
        messageBox.style.color = "#39FF14"      
    } else{
        messageBox.textContent = errorGender;
        messageBox.style.color = "#FFA07A";
    }
});

//function for gender validation
const genderValidation = (genderValue) => {
    if(genderValue.length === 0){
        return "Gender field cannot be empty"
    }

    return null;
};

//function to validate register form and store data in local storage
const validateRegisterForm = (event) => {
    event.preventDefault();
    // The value of each field
    const usernameValue = username.value;
    const emailValue = email.value;
    const passwordValue = password.value;
    const dateValue = date.value;
    const genderValue = gender.value;



    if (usernameValidation(usernameValue) === null &&
        emailValidation(emailValue) === null &&
        passwordValidation(passwordValue) === null &&
        dateValidation(dateValue) === null &&
        genderValidation(genderValue) === null) {
    
        // parse existing users data otherwise use an empty array
        let users = JSON.parse(localStorage.getItem('users')) || [];      

        // Object storing the data about new user
        const newUserData = {
            username: usernameValue,
            email: emailValue,
            password: passwordValue,
            date: dateValue,
            gender: genderValue      
        };

        users.push(newUserData);
        localStorage.setItem('users',JSON.stringify(users));
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('loggedInUser', usernameValue);

        alert("Registration sucessful!");
        window.location.href= '../index.html';

    } else {
        if (!usernameValue){
            document.getElementById("usernameMessage").textContent = "Username cannot be empty";
        }
        if (!emailValue){
            document.getElementById("emailMessage").textContent = "Email cannot be empty";
        }
        if (!dateValue){
            document.getElementById("dateMessage").textContent = "Date cannot be empty";
        }
        if (!genderValue){
            document.getElementById("genderMessage").textContent = "Gender cannot be empty";
        }
        if (!passwordValue){
            document.getElementById("passwordMessage").textContent = "Password cannot be empty";
        }
    }
}         