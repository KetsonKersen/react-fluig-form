import React, { useEffect, useState } from "react";
import { BookAIcon, DollarSignIcon, ExternalLinkIcon, RocketIcon, TerminalIcon } from "lucide-react";
import { parentProxy } from "../../fluig-configs/parentProxy"

export default function Welcome(){
  const [user,setUser] = useState()
  const [atividade,setAtividade] = useState()

  useEffect(()=>{
    async function getUser(){
      const result_user = await parentProxy.window.WCMAPI.getUser() || "Usuário não encontrado"
      const result_atividade = await parentProxy.parent.window.ECM_WKFView.selectActivity() || "Sem atividade"

      setUser(result_user)
      setAtividade(result_atividade)

      top.console.log("user react", result_user)
      top.console.log("atividadet", result_atividade)
    }
    getUser()
  },[])

  return(
    <div className="container">
      <div className="icons">
        <div className="icon-react"></div>
        <span>+</span>
        <div className="icon-fluig"></div>
      </div>
      <h1>{user}</h1>
      <h1>{atividade}</h1>
      <p>Bem-vindo ao seu template de desenvolvimento React + Fluig. Uma base moderna e robusta para criar aplicações para a plataforma fluig utilizando React.js.</p>
  
      <div className="cards">
        <div className="card">
          <div className="title-card">
            <BookAIcon color="#00d8ff"/>
            Documentação React
          </div>
          <p className="text-card">Aprenda React com a documentação oficial</p>
          <a style={{color: "#00d8ff"}}>Acessar Docs <ExternalLinkIcon size={14}/></a>
        </div>
        <div className="card">
          <div className="title-card">
            <BookAIcon color="#fcc707"/>
            TOTVS Fluig Developer
          </div>
          <p className="text-card">Aprenda React com a documentação oficial</p>
          <a style={{color: "#fcc707"}}>Ver Recursos <ExternalLinkIcon size={14}/></a>
        </div>
        <div className="card">
          <div className="title-card">
            <RocketIcon color="#a4c93e"/>
            Começar Agora
          </div>
          <p className="text-card">Aprenda React com a documentação oficial</p>
          <a style={{color: "#a4c93e"}}>Acessar Reade-me <ExternalLinkIcon size={14}/></a>
        </div>
      </div>

      <div className="commands">
        <h3><TerminalIcon color="#49da7e"/>Comandos Úteis</h3>
        <div>
          <div className="command">
            <div className="title-command">
              <DollarSignIcon size={18} color="#49da7e"/>
              <p>npm run dev</p>
            </div>
            <p className="text-command">Iniciar servidor de desenolvimento.</p>
          </div>
          <div className="command">
            <div className="title-command">
              <DollarSignIcon size={18} color="#49da7e"/>
              <p>npm run build</p>
            </div>
            <p className="text-command">Iniciar build para exportar para o fluig.</p>
          </div>
          <div className="command">
            <div className="title-command">
              <DollarSignIcon size={18} color="#49da7e"/>
              <p>node index.js</p>
            </div>
            <p className="text-command">Iniciar conexão com a extensão via Node.js.</p>
          </div>
        </div>
      </div>
    </div>
  )
}