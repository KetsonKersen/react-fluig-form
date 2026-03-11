import { FluigWorkflowForm } from "@fluig-kit/ecm"
import { ArrowRightIcon } from "lucide-react"
import { useState } from "react"
import ExtensionStatus from "./sections/ExtensionStatus"
import Welcome from "./sections/Welcome"
import {
  SECTIONS_REGISTRY,
  WORKFLOW_STRUCTURE,
} from "./workflow/workflowStructure"
import packageJson from '../package.json';

export default function App({ prefilledValues }) {
  const [currentSection, setCurrentSection] = useState("welcome") // "welcome" ou "form"

  function toggleSection() {
    setCurrentSection((prev) => (prev === "welcome" ? "form" : "welcome"))
  }

  return (
    <div id="root" className="fluig-style-guide"> 
      <ExtensionStatus />

      <div className="center">
        <div
          style={{ display: currentSection === "welcome" ? "block" : "none" }}
        >
          <Welcome />
        </div>

        <div style={{ display: currentSection === "form" ? "block" : "none" }}>
          <FluigWorkflowForm
            workflowStructure={WORKFLOW_STRUCTURE}
            sectionsRegistry={SECTIONS_REGISTRY}
          />
        </div>

        <div className="controls">
          <div className="control-btn" onClick={toggleSection}>
            <p>
              {currentSection === "welcome"
                ? "Ir para Formulário"
                : "Voltar para Boas-vindas"}
            </p>
            <button>
              <ArrowRightIcon
                style={{
                  transform:
                    currentSection === "welcome"
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                  transition: "transform 0.3s",
                }}
              />
            </button>
          </div>
        </div>

      </div>

      <div className="footer-inf">
        <p>v{packageJson.version}</p>
        <p>Ketson Kersen</p>
      </div>
    </div>
  )
}
