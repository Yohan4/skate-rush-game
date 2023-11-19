const LoginLogoutButton = () => {
    const login = document.querySelector('.login')

    if (sessionStorage.getItem('isLoggedIn') === 'true'){
        login.textContent = 'LOGOUT';
        login.onclick = () => {
            logout();
        };
    } else{
        login.textContent = 'LOGIN';
        login.onclick = redirectToLogin;
    }
}

// function for logout
const logout = () =>{
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = '../index.html'
}

// function to redirect user to login page 
function redirectToLogin() {
    window.location.href = '/pages/login.html';
}

// update function en every page load
document.addEventListener('DOMContentLoaded',LoginLogoutButton)
