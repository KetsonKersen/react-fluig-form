# React Fluig Form Template

Template para desenvolvimento de **formulários Fluig** usando React com hot-reload e acesso completo ao contexto Fluig (ECM, WCMAPI, FLUIGC, etc.).

## ✨ Funcionalidades
- #### 🔥 Hot Reload: Desenvolvimento com reload instantâneo
- #### 🌐 Contexto Fluig Completo: Acesso direto às APIs: **ECM**, **WCMAPI**, **FLUIGC** e etc...
- #### 🧩 Componentes nativos do Fluig: calendários, dropdowns, toasts e etc...
- #### 🛠️ Stack Moderna: React 19 + Vite + React Hook Form + Lucide Icons

## 📋 Requisitos

- Node.js 18+
- Google Chrome (para extensão de desenvolvimento)
- Ambiente Fluig ativo (cloudtotvs.com.br)

> ***Nota:** Este template faz parte do CLI `create-react-fluig` e é utilizado especificamente para criar **formulários**, o template de widgets já está em desenvolvimento.
 <!-- Para widgets, consulte o template [widget](../widget). -->

## 🚀 Instalação

```cmd
npx create-react-fluig
```
```cmd
Escolha o tipo de template:
>   Form
```
```cmd
Nome do projeto: meu-projeto
🌐 Clonando template form do GitHub...
```
```cmd
cd meu-projeto
```
```cmd
npm run dev
```


## 🔌 Configuração da Extensão Chrome

A extensão captura o contexto do Fluig para sua aplicação React:

1. Instale em `packages/extension`
2. Abra o Fluig no navegador
3. Acompanhe o status de conexão pelo console

**Importante:** Para obter informações como `window.ECM_WKFView.selectActivity()`, a página do Fluig deve estar aberta no processo correspondente.


## 💻 Desenvolvimento

### Acessando APIs do Fluig

```jsx
import { useEffect } from 'react';

export default function MeuFormulario() {
  useEffect(() => {
    if (window.FLUIGC) {
      FLUIGC.toast({
        title: 'Sucesso!',
        message: 'Formulário carregado',
        type: 'success'
      });
    }
  }, []);

  return <div>Meu formulário</div>;
}
```

### Usando Componentes Nativos

```jsx
import { useRef, useEffect } from 'react';

export default function FormWithCalendar() {
  const calendarRef = useRef(null);

  useEffect(() => {
    if (window.FLUIGC && calendarRef.current) {
      FLUIGC.calendar(`#${calendarRef.current.id}`);
    }
  }, []);

  return (
    <input
      id="meuCalendario"
      ref={calendarRef}
      type="text"
      className="form-control"
    />
  );
}
```

### Proxy do Contexto

Use `parentProxy` para acessar métodos/funções disponíveis no Fluig:

```jsx
import { parentProxy } from "../../fluig-configs/parentProxy"

const user = await parentProxy.window.WCMAPI.getUser()
```


## 🚀 Build e Deploy

### Gerar Build de Produção

```bash
npm run build
```

### Upload no Fluig

Mova os arquivos de `packages/react/dist` para seu projeto Fluig no Eclipse e faça o export.


## 📚 Componentes de Exemplo

- **FormExemple.jsx** - Formulário completo com React Hook Form, calendário Fluig e validação
- **Welcome.jsx** - Página de boas-vindas
- **ExtensionStatus.jsx** - Indicador de status da extensão com exemplo do usuário atual logado no Fluig.


## 💝 Apoiando o Projeto

Este projeto é open source e totalmente comunitário! Toda ajuda é bem-vinda para expandir a comunidade Fluig:

- ⭐ **Dê uma estrela** no repositório - ajuda a espalhar o projeto
- 🐛 **Abra uma issue** - reporte bugs ou sugira melhorias
- 💬 **Participe das discussões** - compartilhe experiências e ideias
- 💻 **Contribua com código** - abra pull requests com melhorias
- 📝 **Melhore a documentação** - ajude outros desenvolvedores
- ☕ **Tome um café comigo** - se quiser apoiar financeiramente:
  - **Chave PIX** - `38dcb076-2a9a-4fcd-9dc2-20f5cf236315`

Toda contribuição, por menor que seja, faz diferença! 🙏

## 📝 Licença

MIT © [Ketson Kersen](https://github.com/ketsonkersen)
