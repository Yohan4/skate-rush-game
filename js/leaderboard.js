// function to display leaderboard table and sort top score
function ranking(){
    let users = JSON.parse(localStorage.getItem('users'));
    const table_body = document.querySelector(".body-table");
    table_body.innerHTML = '';

    users.sort((first, second) => {
        let firstMaxScore = 0;
        let secondMaxScore = 0;

        if (first.scores && first.scores.length) {
            firstMaxScore = Math.max(...first.scores);
        }

        if (second.scores && second.scores.length){
            secondMaxScore = Math.max(...second.scores);
        }

        return secondMaxScore - firstMaxScore;
    });

    users.forEach((user, index) => {
        let row = table_body.insertRow();
        let topScore;
        if (user.scores && user.scores.length){
            topScore = Math.max(...user.scores);
        } else{
            topScore = 0;
        }

        let rankColumn = row.insertCell(0);
        let usernameColumn = row.insertCell(1);
        let scoreColumn = row.insertCell(2);


        rankColumn.textContent = index +1;
        usernameColumn.textContent = user.username;
        scoreColumn.textContent = topScore;
    });
}

document.addEventListener('DOMContentLoaded', ranking);


