document.addEventListener("DOMContentLoaded", async () => {
  const usernameSpan = document.querySelector(".username");
  const token = localStorage.getItem("token");

  if (!token) {
    return window.location.href = "login.html";
  }

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      usernameSpan.textContent = "Olá!";
      return;
    }

    const data = await response.json();
    usernameSpan.textContent = `Olá, ${data.nome}!`;
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    usernameSpan.textContent = "Olá!";
  }
});

lucide.createIcons();

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("usuarioNome");
  alert("Você saiu da conta!");
  window.location.href = "login.html";
});

const slides = document.querySelectorAll(".banner img");
let index = 0;
setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 4000);

const userMenu = document.querySelector(".user-menu");
const usernameBtn = document.querySelector(".username");

usernameBtn.addEventListener("click", () => {
  userMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!userMenu.contains(e.target)) {
    userMenu.classList.remove("open");
  }
});

