const characterBar = document.getElementById("character-bar");
const characterImage = document.getElementById("image");
const VoteCount = document.getElementById("vote-count");
const voteInput = document.getElementById("votes");
const addVotesForm = document.getElementById("votes-form");
const resetButton = document.getElementById("reset-btn");

let characters = [];
let selectedAnimal = null;


fetch("http://localhost:3000/characters")
   .then(response => response.json())
   .then(data => {
       characters = data; 

       data.forEach(animal => {
           let nameButton = document.createElement("div");
           nameButton.textContent = animal.name;

           
           nameButton.style.padding = "10px 15px";
           nameButton.style.fontWeight = "bold";
           nameButton.style.backgroundColor = "#3498db";
           nameButton.style.color = "white";
           nameButton.style.border = "none";
           nameButton.style.borderRadius = "5px";
           nameButton.style.cursor = "pointer";
           nameButton.style.textAlign = "center";
           nameButton.style.fontSize = "16px";
           nameButton.style.transition = "background 0.3s";
           nameButton.style.display = "inline-block";
           nameButton.style.margin = "5px";
           nameButton.style.borderRadius = "30px"
           
           // just a Hover effects
           nameButton.addEventListener("mouseenter", () => {
               nameButton.style.backgroundColor = "#2980b9";
           });
           nameButton.addEventListener("mouseleave", () => {
               nameButton.style.backgroundColor = "#3498db";
           });
        

           
           nameButton.addEventListener("click", () => {
               characterImage.src = animal.image;
               characterImage.alt = animal.name;
               VoteCount.innerText = animal.votes;
               selectedAnimal = animal;
           });

           characterBar.appendChild(nameButton);
       });
   })
   .catch(error => console.error("Error loading JSON:", error));


addVotesForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    if (!selectedAnimal) {
        alert("Please select a character first!");
        return;
    }

    const addedVotes = parseInt(voteInput.value);
    if (isNaN(addedVotes) || addedVotes <= 0) {
        alert("Enter a valid number of votes!");
        return;
    }

    selectedAnimal.votes += addedVotes;
    VoteCount.innerText = selectedAnimal.votes;

    fetch(`http://localhost:3000/characters/${selectedAnimal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: selectedAnimal.votes })
    })
    .catch(error => console.error("Error updating votes:", error));

    voteInput.value = "";
});


resetButton.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to reset all votes to 0?")) return;

    const updatePromises = characters.map(character =>
        fetch(`http://localhost:3000/characters/${character.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: 0 })
        })
        .then(response => response.json())
        .then(() => {
            character.votes = 0; 
        })
        .catch(error => console.error(`Error resetting votes for ${character.name}:`, error))
    );

    await Promise.all(updatePromises);

       if (selectedAnimal) {
        VoteCount.innerText = 0;
    }
});