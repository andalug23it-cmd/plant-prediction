// mathutils.js
// Utility to generate and manage profile cards dynamically

// Container where cards will be added
const profileContainer = document.getElementById("profileContainer");

// Function to create a profile card
export function createProfileCard(name, role) {
  // Create the card element
  const card = document.createElement("div");
  card.classList.add("profile-card");

  // Add content
  card.innerHTML = `
    <div class="avatar">${name.charAt(0).toUpperCase()}</div>
    <div class="details">
      <h3>${name}</h3>
      <p>${role}</p>
    </div>
    <button class="remove-btn">❌</button>
  `;

  // Add remove button event
  card.querySelector(".remove-btn").addEventListener("click", () => {
    card.remove();
  });

  // Append to container
  profileContainer.appendChild(card);
}

// Function to prompt user and add a new profile
export function addProfile() {
  const name = prompt("Enter name:");
  const role = prompt("Enter role:");
  if (name && role) {
    createProfileCard(name, role);
  }
}
