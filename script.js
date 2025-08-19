// Profile Card Generator
document.getElementById("btnAddProfile").addEventListener("click", function(){
  const name = document.getElementById("profileName").value.trim();
  const role = document.getElementById("profileRole").value.trim();
  const container = document.getElementById("profileContainer");

  if(!name || !role){
    alert("Please enter both name and role.");
    return;
  }

  const card = document.createElement("div");
  card.className = "profile-card";
  card.innerHTML = `
    <h3>${name}</h3>
    <p>${role}</p>
    <button class="remove-btn">Remove</button>
  `;

  card.querySelector(".remove-btn").addEventListener("click", () => card.remove());
  container.appendChild(card);

  document.getElementById("profileName").value = "";
  document.getElementById("profileRole").value = "";
});
