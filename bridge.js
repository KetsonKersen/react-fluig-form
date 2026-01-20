;(function () {
  var root = window.top || window

  if (!root.ECM_WKFView) return
  if (root.__REACT_FORM_BOUND__) return
  root.__REACT_FORM_BOUND__ = true

  var wkf = root.ECM_WKFView
  var original = wkf.getFormData

  wkf.getFormData = function () {
    var originalData = original ? original.call(this) : []
    var reactData = root.__FLUIG_REACT_FORM_DATA__

    if (!reactData) return originalData

    var result = []

    for (var name in reactData) {
      if (!Object.prototype.hasOwnProperty.call(reactData, name)) continue

      var value = reactData[name]

      // 🚨 REGRA DE OURO DO FLUIG
      if (value && typeof value === "object" && !Array.isArray(value)) {
        continue // IGNORA objetos
      }

      result.push({
        name: name,
        value: Array.isArray(value) ? value.join(",") : (value ?? ""),
      })
    }

    return result
  }
})()
