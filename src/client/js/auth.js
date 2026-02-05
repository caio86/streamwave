import { showToast } from "./utils.js";
import { updateUsuario, getUsuarioByUsername } from "./api.js";

const TOKEN_KEY = "streamwave_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  showToast("Sessão encerrada.", "info");
  window.location.href = "./login.html";
}

export function requireAuth() {
  const path = window.location.pathname;
  const isAuthPage =
    path.endsWith("/login.html") || path.endsWith("/register.html");

  if (!isLoggedIn() && !isAuthPage) {
    showToast("Faça login para continuar.", "info");
    window.location.href = "./login.html";
  }
}

export function initAuthUI() {
  const authButtons = document.querySelector(".auth-buttons");
  const mobileAuth = document.querySelector(".mobile-auth");
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    link.addEventListener("click", (event) => {
      if (!isLoggedIn() && !href.endsWith("login.html") && !href.endsWith("register.html")) {
        event.preventDefault();
        showToast("Você precisa estar logado.", "info");
        window.location.href = "./login.html";
      }
    });
  });

  if (!authButtons || !mobileAuth) return;

  if (isLoggedIn()) {
    const token = getToken();
    const payload = decodeToken(token);
    const username = payload?.username ?? "Perfil";
    const userId = payload?.sub;

    authButtons.innerHTML = `
      <div class="profile-menu">
        <button class="btn btn-login profile-trigger" id="profileTrigger" type="button">
          ${username}
        </button>
        <div class="profile-panel" id="profilePanel">
          <div class="profile-header">Perfil</div>
          <div class="profile-info">
            <div class="profile-info__name" id="profileName">—</div>
            <div class="profile-info__username" id="profileUsername">@${username}</div>
            <div class="profile-info__email" id="profileEmail">—</div>
          </div>
          <div class="profile-actions">
            <button class="btn action-btn" id="openSettingsBtn" type="button">
              Configurações
            </button>
            <button class="btn btn-login" id="logoutBtn" type="button">Sair</button>
          </div>
        </div>
      </div>
    `;
    mobileAuth.innerHTML = `
      <button class="btn btn-login" id="profileToggleMobile" type="button">
        ${username}
      </button>
      <div class="profile-panel profile-panel--mobile" id="profilePanelMobile">
        <div class="profile-header">Perfil</div>
        <div class="profile-info">
          <div class="profile-info__name" id="profileNameMobile">—</div>
          <div class="profile-info__username" id="profileUsernameMobile">@${username}</div>
          <div class="profile-info__email" id="profileEmailMobile">—</div>
        </div>
        <div class="profile-actions">
          <button class="btn action-btn" id="openSettingsBtnMobile" type="button">
            Configurações
          </button>
          <button class="btn btn-login" id="logoutBtnMobile" type="button">Sair</button>
        </div>
      </div>
    `;

    const profileTrigger = document.querySelector("#profileTrigger");
    const profilePanel = document.querySelector("#profilePanel");
    const profileToggleMobile = document.querySelector("#profileToggleMobile");
    const profilePanelMobile = document.querySelector("#profilePanelMobile");
    const profileName = document.querySelector("#profileName");
    const profileUsername = document.querySelector("#profileUsername");
    const profileEmail = document.querySelector("#profileEmail");
    const profileNameMobile = document.querySelector("#profileNameMobile");
    const profileUsernameMobile = document.querySelector("#profileUsernameMobile");
    const profileEmailMobile = document.querySelector("#profileEmailMobile");
    const openSettingsBtn = document.querySelector("#openSettingsBtn");
    const openSettingsBtnMobile = document.querySelector(
      "#openSettingsBtnMobile",
    );

    profileTrigger?.addEventListener("click", () => {
      profilePanel?.classList.toggle("is-open");
    });

    profileToggleMobile?.addEventListener("click", () => {
      profilePanelMobile?.classList.toggle("is-open");
    });

    let userCache = null;

    const loadProfile = async () => {
      if (!username || username === "Perfil") return;
      try {
        userCache = await getUsuarioByUsername(username);
        profileName.textContent = userCache.nome_completo ?? "—";
        profileUsername.textContent = `@${userCache.username ?? username}`;
        profileEmail.textContent = userCache.email ?? "—";
        profileNameMobile.textContent = userCache.nome_completo ?? "—";
        profileUsernameMobile.textContent = `@${userCache.username ?? username}`;
        profileEmailMobile.textContent = userCache.email ?? "—";
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };

    loadProfile();

    const openSettingsModal = () => {
      if (!userId) {
        showToast("Não foi possível identificar o usuário.", "error");
        return;
      }

      const modal = document.createElement("div");
      modal.className = "modal is-open";
      modal.innerHTML = `
        <div class="modal__content" role="dialog" aria-modal="true">
          <div class="modal__header">
            <h2>Configurações</h2>
            <button class="modal__close" type="button" id="settingsClose">✕</button>
          </div>
          <form id="settingsForm" class="form">
            <label class="form__field">
              Nome completo
              <input name="nome_completo" type="text" value="${userCache?.nome_completo ?? ""}" />
            </label>
            <label class="form__field">
              Nome de usuário
              <input name="username" type="text" value="${userCache?.username ?? ""}" />
            </label>
            <label class="form__field">
              E-mail
              <input name="email" type="email" value="${userCache?.email ?? ""}" />
            </label>
            <label class="form__field">
              Nova senha
              <input name="senha" type="password" />
            </label>
            <label class="form__field">
              Confirmar nova senha
              <input name="senha_confirm" type="password" />
            </label>
            <div class="form__actions">
              <button class="btn action-btn" type="submit">Salvar</button>
              <button class="btn btn-login" type="button" id="settingsCancel">Cancelar</button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector("#settingsClose")?.addEventListener("click", closeModal);
      modal.querySelector("#settingsCancel")?.addEventListener("click", closeModal);
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
      });

      modal.querySelector("#settingsForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const payloadUpdate = {};
        ["nome_completo", "username", "email"].forEach((field) => {
          const value = formData.get(field);
          if (value) payloadUpdate[field] = value;
        });

        const senha = formData.get("senha");
        const senhaConfirm = formData.get("senha_confirm");
        if (senha || senhaConfirm) {
          if (senha !== senhaConfirm) {
            showToast("As senhas não conferem.", "error");
            return;
          }
          payloadUpdate.senha = senha;
        }

        try {
          const updated = await updateUsuario(userId, payloadUpdate);
          userCache = updated;
          showToast("Perfil atualizado.", "success");
          if (payloadUpdate.username) {
            profileTrigger.textContent = payloadUpdate.username;
            profileToggleMobile.textContent = payloadUpdate.username;
          }
          await loadProfile();
          closeModal();
        } catch (error) {
          console.error("Erro ao atualizar perfil:", error);
          showToast("Não foi possível atualizar o perfil.", "error");
        }
      });
    };

    openSettingsBtn?.addEventListener("click", openSettingsModal);
    openSettingsBtnMobile?.addEventListener("click", openSettingsModal);

    document.querySelector("#logoutBtn")?.addEventListener("click", logout);
    document.querySelector("#logoutBtnMobile")?.addEventListener("click", logout);
  }
}

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded));
    return decoded;
  } catch {
    return null;
  }
}

requireAuth();
initAuthUI();
