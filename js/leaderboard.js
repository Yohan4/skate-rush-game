function displayRankings() {
    // Retrieve the users array from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    console.log('Retrieved users:', users); // Log the users data

    const tbody = document.querySelector('.body-table');

    if (!tbody) {
        console.error('The .body-table element was not found.');
        return;
    }

    tbody.innerHTML = ''; // Clear current leaderboard

    let htmlString = ''; // Initialize an empty string to build up the HTML

    // Go through each user and find their top score
    users.forEach((user, index) => {
        // Determine the user's top score
        let topScore = user.scores && user.scores.length ? Math.max(...user.scores) : 0;
        
        // Create a row for the user
        const row = `<tr>
                        <td>${index + 1}</td>
                        <td>${user.username}</td>
                        <td>${topScore}</td>
                     </tr>`;
        htmlString += row; // Add the row to the HTML string
    });

    tbody.innerHTML = htmlString; // Set the innerHTML of the tbody element
    console.log('Final HTML for tbody:', htmlString); // Log the final HTML string
}

// Call this function to update the rankings when the rankings page is loaded
document.addEventListener('DOMContentLoaded', displayRankings);
