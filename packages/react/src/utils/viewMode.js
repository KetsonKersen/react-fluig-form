// utils/viewMode.js

export function getEditParam() {
  const params = new URLSearchParams(window.location.search)
  return params.get("edit") // "true", "false" ou null
}

export function isCreationMode() {
  return getEditParam() === null
}

export function isEditMode() {
  return getEditParam() === "true"
}

export function isViewMode() {
  if (typeof window === "undefined") return false
  const params = new URLSearchParams(window.location.search)
  const editParam = params.get("edit")
  return editParam === "false"
}

function renderViewModeSpans() {
  document.querySelectorAll("input, select, textarea").forEach((el) => {
    if (!el.name) return

    const span = document.createElement("span")
    span.className = el.className || "form-control"
    span.style.display = "inline-block"
    span.style.width = "100%"
    span.textContent = el.value || "-"

    el.replaceWith(span)
  })
}
