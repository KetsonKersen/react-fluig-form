import React, { useEffect, useState } from "react"
import {
  BookAIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  RocketIcon,
  TerminalIcon,
} from "lucide-react"
import { parentProxy } from "@fluig-kit/core"

export default function Welcome() {
  const [user, setUser] = useState()
  const [atividade, setAtividade] = useState()

  useEffect(() => {
    async function getUser() {
      const result_user =
        (await parentProxy.window.WCMAPI.getUser()) || "Usuário não encontrado"
      const result_atividade =
        (await parentProxy.parent.window.ECM_WKFView.selectActivity()) ||
        "Sem atividade"

      setUser(result_user)
      setAtividade(result_atividade)

      top.console.log("user react", result_user)
      top.console.log("atividadet", result_atividade)
    }
    getUser()
  }, [])

  return (
    <div className="container">
      <div className="icons">
        <div className="icon-react"></div>
        <span>+</span>
        <div className="icon-fluig"></div>
      </div>

      <p>
        Bem-vindo ao seu template de desenvolvimento React + Fluig. Uma base
        moderna e robusta para criar aplicações para a plataforma fluig
        utilizando React.js.
      </p>

      <div className="cards">
        <div className="card">
          <div className="title-card">
            <BookAIcon color="#00d8ff" size={20} />
            Documentação React
          </div>
          <p className="text-card">Aprenda React com a documentação oficial</p>
          <a style={{ color: "#00d8ff" }}>
            Acessar Docs <ExternalLinkIcon size={14} />
          </a>
        </div>
        <div className="card">
          <div className="title-card">
            <BookAIcon color="#fcc707" size={20} />
            TOTVS Fluig Developer
          </div>
          <p className="text-card">Aprenda Fluig com a documentação oficial</p>
          <a style={{ color: "#fcc707" }}>
            Ver Recursos <ExternalLinkIcon size={14} />
          </a>
        </div>
        <div className="card">
          <div className="title-card">
            <RocketIcon color="#a4c93e" size={20} />
            Começar Agora
          </div>
          <p className="text-card">Siga o passo a passo de instalação</p>
          <a style={{ color: "#a4c93e" }}>
            Acessar Reade-me <ExternalLinkIcon size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
