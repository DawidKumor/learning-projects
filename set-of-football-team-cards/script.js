const footballTeam = {
  team: "Real Madryt",
  year: 1993,
  headCoach: "Dante Sparda",
  players: [
    { name: "Dani Carvajal", position: "defender", isCaptain: true },
    { name: "Kylian Mbappé", position: "forward", isCaptain: false },
    { name: "Jude Bellingham", position: "midfielder", isCaptain: false },
    { name: "Vinícius Júnior", position: "forward", isCaptain: false },
  ]
}

const headCoach = document.getElementById("head-coach");
const team = document.getElementById("team");
const year = document.getElementById("year");
const selectMenu = document.getElementById("players");
const playerCards = document.getElementById("player-cards");

headCoach.innerText = footballTeam.headCoach;
team.innerText = footballTeam.team;
year.innerText = footballTeam.year;

selectMenu.addEventListener("change", (e) => {
  const selectedValue = e.target.value;

  const filteredPlayers = selectedValue === "all"
    ? footballTeam.players
    : footballTeam.players.filter(player => player.position === selectedValue);

  playerCards.innerHTML = filteredPlayers.map(player => {
    return `<div class="player-card">
      <h2>${player.isCaptain ? "(Captain) " : ""}${player.name}</h2>
      <p>Position: ${player.position}</p>
    </div>`
  }).join('');
});