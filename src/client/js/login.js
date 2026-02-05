import { loginUsuario } from "./api.js";
import { showToast } from "./utils.js";

const loginForm = document.querySelector("#loginForm");
const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#password");

togglePassword?.addEventListener("change", () => {
  passwordInput.type = togglePassword.checked ? "text" : "password";
});

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const email = formData.get("email");
  const senha = formData.get("password");

  try {
    const { token } = await loginUsuario(email, senha);
    localStorage.setItem("streamwave_token", token);
    showToast("Login realizado com sucesso.", "success");
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    showToast("E-mail ou senha inválidos.", "error");
  }
});
