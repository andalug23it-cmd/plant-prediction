// ----- PROFILE CARD + GENERATE CARD HELPERS -----
function addProfileCard({ name, role, avatar, email }) {
  const wrap = document.getElementById("profiles");
  const el = document.createElement("div");
  el.className = "hist-item profile-card";
  el.innerHTML = `
    <div class="profile-row">
      <img class="avatar" src="${avatar || 'https://api.dicebear.com/9.x/initials/svg?seed=' + encodeURIComponent(name)}" alt="${name}">
      <div>
        <div class="title">${name}</div>
        <div class="muted small">${role}</div>
        ${email ? `<div class="muted small">${email}</div>` : ""}
      </div>
    </div>
    <div class="profile-actions">
      <a href="contact.html" class="tag">Contact</a>
    </div>
  `;
  wrap.appendChild(el);
}

function addGeneratedCard({ label, confidence, imgSrc }) {
  const wrap = document.getElementById("generated");
  const el = document.createElement("div");
  el.className = "hist-item gen-card";
  const pct = Math.round((confidence ?? 0) * 100);
  el.innerHTML = `
    <div class="gen-head">
      <div class="title">${label || "Unknown"}</div>
      <span class="tag">${pct}%</span>
    </div>
    ${imgSrc ? `<img class="thumb" src="${imgSrc}" alt="result"/>` : ""}
    <div class="bar" title="Confidence">
      <span style="width:${pct}%"></span>
    </div>
    <div class="muted small">${new Date().toLocaleString()}</div>
  `;
  wrap.prepend(el);
}

// Seed a few profiles on load
document.addEventListener("DOMContentLoaded", () => {
  addProfileCard({ name: "Andal K", role: "Frontend Engineer", email: "andal@example.com" });
  addProfileCard({ name: "Ravi Kumar", role: "ML Engineer" });
  addProfileCard({ name: "Priya S", role: "QA & Docs" });

  // Demo: generate a sample result card
  const btn = document.getElementById("btnGenCard");
  if (btn) {
    btn.addEventListener("click", () => {
      // Use current preview image if available, else no image
      const prev = document.getElementById("preview");
      const imgSrc = prev && prev.src ? prev.src : "";
      addGeneratedCard({ label: "Tomato Leaf Blight", confidence: Math.random()*0.4 + 0.6, imgSrc });
    });
  }
});
