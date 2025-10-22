const FLUIG_BASE_URL = import.meta.env.VITE_FLUIG_BASE_URL

const fluigStyles = [
  `${FLUIG_BASE_URL}/style-guide/css/fluig-style-guide.min.css`,
  `${FLUIG_BASE_URL}/portal/resources/merged/wcm_global.css`,
]

const fluigScripts = [
  `${FLUIG_BASE_URL}/portal/resources/js/jquery/jquery-3.6.3.min.js`,
  `${FLUIG_BASE_URL}/style-guide/js/fluig-style-guide.min.js`,
  `${FLUIG_BASE_URL}/portal/resources/js/api_pt_BR.js`,
]

// Injetando os links de estilo no head do HTML
fluigStyles.forEach((url) => {
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = url
  document.head.appendChild(link)
})

// Injetando os scripts no final do body
fluigScripts.forEach((url) => {
  const script = document.createElement("script")
  script.src = url
  document.body.appendChild(script)
})
