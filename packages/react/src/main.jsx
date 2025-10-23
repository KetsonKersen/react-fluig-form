import { createRoot } from "react-dom/client";
import "./index.css";
"../parentProxy";
import App from "./App.jsx";

(function initReactApp() {
  try {
    const rootEl = document.getElementById("root");
    if (!rootEl) {
      setTimeout(initReactApp, 300);
      return;
    }

    const isInIframe = window.self !== window.top;
    const isLocalhost = window.location.hostname === "localhost";
    const params = new URLSearchParams(window.location.search);

    const editParam = params.get("edit");        
    const isCreationMode = !editParam;           
    const isEditMode = editParam === "true";     
    const isViewMode = editParam === "false";    

    const shouldRenderReact = isLocalhost || (isInIframe && (isCreationMode || isEditMode));

    console.log("🔎 Fluig detectado — edit param:", editParam);
    console.log("⚛️ React será renderizado?", shouldRenderReact);

    if (shouldRenderReact) {
      const prefilledValues = {};
      document.querySelectorAll("input, textarea, select").forEach((el) => {
        if (el.name) prefilledValues[el.name] = el.value;
      });

      createRoot(rootEl).render(
        <>
          <App prefilledValues={prefilledValues} />
        </>
      );
    } else {
      console.log("🚫 Visualização apenas — React não montado.");
    }

  } catch (err) {
    console.error("Erro ao inicializar React:", err);
  }
})();
