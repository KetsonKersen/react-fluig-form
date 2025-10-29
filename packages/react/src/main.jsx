import React from "react";
import { createRoot } from "react-dom/client";
import "@fluig-configs/imports";
import "./index.css";
import App from "./App.jsx";
import { isCreationMode, isEditMode } from "./utils/viewMode";

(function initReactApp() {
  try {
    const rootEl = document.getElementById("root");
    if (!rootEl) {
      setTimeout(initReactApp, 300);
      return;
    }

    const isInIframe = window.self !== window.top;
    const isLocalhost = window.location.hostname === "localhost";

    const shouldRenderReact =
      isLocalhost || (isInIframe && (isCreationMode() || isEditMode()));

    console.log("🔎 Fluig detectado — edit param:", window.location.search);
    console.log("⚛️ React será renderizado?", shouldRenderReact);

    if (shouldRenderReact) {
      const prefilledValues = {};
      document.querySelectorAll("input, textarea, select").forEach((el) => {
        if (el.name) prefilledValues[el.name] = el.value;
      });

      createRoot(rootEl).render(<App prefilledValues={prefilledValues} />);
    } else {
      console.log("🚫 Visualização apenas — React não montado.");

      document.querySelectorAll("input, textarea, select, .custom-select").forEach((el) => {
        if (el.classList.contains("custom-select")) {
          el.classList.add("hidden");
        }

        if (!el.name) return;

        const span = document.createElement("span");
        span.className = el.className || "form-control";
        span.style.display = "inline-block";
        span.style.width = "100%";
        span.textContent = el.value || "-";

        el.replaceWith(span);
      });
    }
  } catch (err) {
    console.error("Erro ao inicializar React:", err);
  }
})();
