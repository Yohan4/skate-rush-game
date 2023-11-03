// function to show placeholder type as text
const placeholder = () => {
    const dob = document.getElementById('dob')
    if (dob.value === ''){
        dob.type = 'text';
        dob.placeholder = 'Date of birth';
    }
};

// function to show placeholder type as date
const changePlaceholderType = () => {
    const dob = document.getElementById('dob');
    dob.type ='date';
};