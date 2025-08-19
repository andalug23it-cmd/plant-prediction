// mathutils.js
// Utility to generate and manage profile cards dynamically

// Function to create a profile card
export function createProfileCard(container, name, role) {
  // Create card element
  const card = document.createElement("div");
  card.classList.add("profile-card");

  // Card content
  card.innerHTML = `
    <div class="avatar">${name.charAt(0).toUpperCase()}</div>
    <div class="details">
      <h3>${name}</h3>
      <p>${role}</p>
    </div>
    <button class="remove-btn">❌</button>
  `;

  // Remove button functionality
  card.querySelector(".remove-btn").addEventListener("click", () => {
    card.remove();
  });

  // Append to container
  container.appendChild(card);
}

// Function to prompt user and add profile
export function addProfile(containerId) {
  const name = prompt("Enter name:");
  const role = prompt("Enter role:");
  if (name && role) {
    const container = document.getElementById(containerId);
    createProfileCard(container, name, role);
  }
}
