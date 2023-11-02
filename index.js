function redirectToLogin() {
    window.location.href = '/pages/login.html';
}

const placeholder = () => {
    const dob = document.getElementById('dob')
    if (dob.value === ''){
        dob.type = 'text';
        dob.placeholder = 'Date of birth';
    }
};

const changePlaceholderType = () => {
    const dob = document.getElementById('dob');
    dob.type ='date';
};


