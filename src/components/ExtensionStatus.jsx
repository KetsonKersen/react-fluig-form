import React from "react";
import { DotIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ExtensionStatus() {
  const [connected, setConnected] = useState(false);
  const [userActive, setUserActive] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4002");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "EXTENSION_STATUS") {
          setConnected(Boolean(msg.connected));
          setUserActive(msg.userActive || null);
        }
      } catch (err) {
        console.warn("⚠️ Mensagem WS inválida:", err);
      }
    };

    ws.onopen = () => console.log("🧭 Conectado ao WS Frontend");
    ws.onclose = () => console.log("❌ WS Frontend desconectado");

    return () => ws.close();
  }, []);

  return (
    <div className="container-status">
      <div>
        <span>
         Status de conexão: {connected? <DotIcon color="green" size={32}/>: <DotIcon color="red" size={32}/>}
        </span>
      </div>
      <div>
        <span>
          {userActive ? `Usuário conectado: ${userActive}` : "Nenhum usuário conectado"}
        </span>
      </div>
    </div>
  );
}
