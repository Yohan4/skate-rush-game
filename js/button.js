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


document.addEventListener('DOMContentLoaded', () => {
    const gameAccess = (event) => {
        event.preventDefault();
        if (sessionStorage.getItem('isLoggedIn') === 'true'){

            currentPage = window.location.pathname;
            const pageLink = currentPage.endsWith('index.html') || currentPage === '/' ? 'pages/game.html' : 'game.html';
            window.location.href = pageLink;
        } else {
            redirectToLogin();
        }
    };

    const gamePage = document.getElementById('playGame');
    const playButton = document.querySelector('.game-button');

    if (gamePage) {
        gamePage.addEventListener('click', gameAccess);
    }

    if (playButton) {
        playButton.addEventListener('click', gameAccess);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const exploreButton = document.querySelector('.explore-button');

    exploreButton.addEventListener('click', (event) => {
        event.preventDefault;
        window.location = 'pages/support.html';
    })
});

// function  to scoll to subhero section
document.addEventListener('DOMContentLoaded', () => {
    const learnMoreButton = document.querySelector('.learn-more-button');
    const subHeroSection = document.getElementById('sub-hero-section');

    learnMoreButton.addEventListener('click', (event) => {
        event.preventDefault();
        subHeroSection.scrollIntoView({behaviour: 'smooth'});
    });
});




// Function to update every page load
document.addEventListener('DOMContentLoaded',LoginLogoutButton)
