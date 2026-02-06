import { registerUsuario } from "./api.js";
import { showToast } from "./utils.js";

const registerForm = document.querySelector("#registerForm");
const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#password");
const passwordConfirmInput = document.querySelector("#passwordConfirm");

togglePassword?.addEventListener("change", () => {
  const nextType = togglePassword.checked ? "text" : "password";
  passwordInput.type = nextType;
  passwordConfirmInput.type = nextType;
});

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const payload = {
    nome_completo: formData.get("fullname"),
    data_nascimento: formData.get("birthdate"),
    username: formData.get("username"),
    email: formData.get("email"),
    senha: formData.get("password"),
  };
  const confirm = formData.get("passwordConfirm");

  if (payload.senha !== confirm) {
    showToast("As senhas não conferem.", "error");
    return;
  }

  try {
    const { token } = await registerUsuario(payload);
    localStorage.setItem("streamwave_token", token.token);
    showToast("Cadastro realizado com sucesso.", "success");
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    if (
      error?.status === 409 ||
      String(error?.message || "").includes("Duplicate field value entered")
    ) {
      const campo = error?.data?.field;
      if (campo === "email") {
        showToast("Este e-mail já está cadastrado.", "error");
      } else if (campo === "username") {
        showToast("Este nome de usuário já está em uso.", "error");
      } else {
        showToast("E-mail ou usuário já cadastrado.", "error");
      }
      return;
    }
    showToast("Não foi possível cadastrar. Verifique os dados.", "error");
  }
});
