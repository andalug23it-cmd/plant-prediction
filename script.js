// Handle profile form
document.getElementById("profileForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value.trim();

  if(name && role) {
    const profileList = document.getElementById("profileList");

    const card = document.createElement("div");
    card.className = "profile-card";
    card.innerHTML = `
      <button class="remove-btn">✖</button>
      <div class="avatar">${name.charAt(0).toUpperCase()}</div>
      <div class="details">
        <h3>${name}</h3>
        <p>${role}</p>
      </div>
    `;

    // Remove functionality
    card.querySelector(".remove-btn").addEventListener("click", () => {
      card.remove();
    });

    profileList.appendChild(card);
    this.reset();
  }
});
