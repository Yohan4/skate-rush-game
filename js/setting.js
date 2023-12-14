let username = document.getElementById("username");
let password = document.getElementById("password");
let change_password = document.getElementById("changePasword");

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

password.addEventListener()