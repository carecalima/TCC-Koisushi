document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Login falhou: " + (data.message || "Erro"));
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userId", data.userId);

      alert("Login bem-sucedido!");

      if (data.role === "ADMIN") {
        window.location.href = "../html/admin/adminhome.html";
      } else {
        window.location.href = "../html/home.html";
      }
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Ocorreu um erro ao tentar logar.");
    }
  });
