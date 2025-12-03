const form = document.getElementById("registerForm");
const errorMsg = document.getElementById("registerError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Usuário cadastrado com sucesso! Faça login para continuar.");
      window.location.href = "login.html";
    } else {
      errorMsg.textContent = data.mensagem || "Erro ao cadastrar usuário.";
    }
  } catch (error) {
    console.error(error);
    errorMsg.textContent = "Erro de conexão com o servidor.";
  }
});
