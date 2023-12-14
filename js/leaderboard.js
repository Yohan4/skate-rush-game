// function displayRankings() {
//     // Retrieve the users array from localStorage
//     let users = JSON.parse(localStorage.getItem('users')) || [];
    
//     console.log('Retrieved users:', users); // Log the users data

//     const tbody = document.querySelector('.body-table');

//     if (!tbody) {
//         console.error('The .body-table element was not found.');
//         return;
//     }

//     tbody.innerHTML = ''; // Clear current leaderboard

//     let htmlString = ''; // Initialize an empty string to build up the HTML

//     // Go through each user and find their top score
//     users.forEach((user, index) => {
//         // Determine the user's top score
//         let topScore = user.scores && user.scores.length ? Math.max(...user.scores) : 0;
        
//         // Create a row for the user
//         const row = `<tr>
//                         <td>${index + 1}</td>
//                         <td>${user.username}</td>
//                         <td>${topScore}</td>
//                      </tr>`;
//         htmlString += row; // Add the row to the HTML string
//     });

//     tbody.innerHTML = htmlString; // Set the innerHTML of the tbody element
//     console.log('Final HTML for tbody:', htmlString); // Log the final HTML string
// }

// // Call this function to update the rankings when the rankings page is loaded
// document.addEventListener('DOMContentLoaded', displayRankings);

function displayRankings() {
    // Retrieve the users array from localStorage and parse it into an array
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Get the <tbody> element where the leaderboard will be populated
    const tbody = document.querySelector('.body-table');

    if (!tbody) {
        console.error('The .body-table element was not found.');
        return;
    }

    // Clear the current contents of the tbody
    tbody.innerHTML = '';

    // Sort the users based on their top score in descending order
    users.sort((a, b) => {
        let aTopScore = a.scores && a.scores.length ? Math.max(...a.scores) : 0;
        let bTopScore = b.scores && b.scores.length ? Math.max(...b.scores) : 0;
        return bTopScore - aTopScore;
    });

    // Iterate over the sorted users and add a row for each to the tbody
    users.forEach((user, index) => {
        // Create a new row at the end of the table
        let row = tbody.insertRow();

        // Insert cells for the rank, username, and top score
        let rankCell = row.insertCell(0);
        let usernameCell = row.insertCell(1);
        let scoreCell = row.insertCell(2);

        // Set the text content of the cells
        rankCell.textContent = index + 1;
        usernameCell.textContent = user.username;
        scoreCell.textContent = user.scores && user.scores.length ? Math.max(...user.scores) : 0;
    });
}

// Call displayRankings when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', displayRankings);
