import React, { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import Welcome from "./components/Welcome";
import FormExemple from "./components/FormExemple";
import ExtensionStatus from "./components/ExtensionStatus";

export default function App({prefilledValues}) {
  const [currentSection, setCurrentSection] = useState("welcome"); // "welcome" ou "form"

  function toggleSection() {
    setCurrentSection((prev) => (prev === "welcome" ? "form" : "welcome"));
  }

  return (
    <div className="main fluig-style-guide">
      <ExtensionStatus/>

      <div className="center">
        <div style={{ display: currentSection === "welcome" ? "block" : "none" }}>
          <Welcome />
        </div>
        
        <div style={{ display: currentSection === "form" ? "block" : "none" }}>
          <FormExemple prefilledValues={prefilledValues} />
        </div>

        <div className="controls">
          <div className="control-btn" onClick={toggleSection}>
            <p>
              {currentSection === "welcome" ? "Ir para Formulário" : "Voltar para Boas-vindas"}
            </p>
            <button>
              <ArrowRightIcon style={{transform:currentSection === "welcome" ? "rotate(0deg)" : "rotate(180deg)",transition: "transform 0.3s"}}/>
            </button>
          </div>
        </div>
      </div>
      
      <div className="footer-inf">
        <p>1.0.0</p>
        <p>Ketson Kersen</p>
      </div>
    </div>
  );
}
