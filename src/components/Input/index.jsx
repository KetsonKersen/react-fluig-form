import { memo, useCallback, useMemo } from "react"
import { useController, useFormContext, useFormState } from "react-hook-form"
import { IMaskInput } from "react-imask"
import { useFluigRuntime, useSection } from "@fluig-kit/ecm"

const MASKS = {
  cpf: "000.000.000-00",
  cnpj: "00.000.000/0000-00",
  telefone: "(00) 00000-0000",
  cep: "00000-000",
}

function InputCustom({
  name,
  label = "",
  placeholder = "",
  type = "text",
  mask,
  className = "",
  forceReadOnly = false,
  forceHidden = false,
}) {
  const { isReadOnly, isHidden } = useSection()
  // Casting para boolean caso o contexto retorne algo diferente
  const readOnly = forceReadOnly || !!isReadOnly(name)
  const hidden = forceHidden || !!isHidden(name)

  const { control } = useFormContext()
  const { isView } = useFluigRuntime()

  const { field } = useController({ name, control })
  const { errors } = useFormState({ name })
  const error = errors?.[name]

  const maskPattern = useMemo(
    () => (mask ? (MASKS[mask] ?? mask) : null),
    [mask],
  )

  const formatMonetary = useCallback((val) => {
    if (!val) return ""
    const numeric = val.replace(/\D/g, "")
    const number = Number(numeric) / 100
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }, [])

  const applyValue = useCallback(
    (val) => {
      if (type === "monetary") {
        return formatMonetary(val)
      }
      return val
    },
    [type, formatMonetary],
  )

  if (isView) {
    return (
      <div className="form-group">
        <label>{label}</label>
        <span className="form-control">{field.value || "-"}</span>
      </div>
    )
  }

  return (
    <div className={`form-group ${hidden ? "hidden" : ""}`}>
      <label>{label}</label>

      {maskPattern ? (
        <IMaskInput
          name={name}
          mask={maskPattern}
          value={String(field.value ?? "")}
          unmask={false}
          onAccept={(val) => field.onChange(applyValue(val))}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`form-control ${error ? "border-red" : ""} ${className}`}
          inputRef={field.ref}
          onBlur={field.onBlur}
        />
      ) : (
        <input
          {...field}
          type="text"
          value={field.value ?? ""}
          onChange={(e) => field.onChange(applyValue(e.target.value))}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`form-control ${error ? "border-red" : ""} ${className}`}
        />
      )}

      {error && <p className="text-danger">{String(error.message)}</p>}
    </div>
  )
}

export default memo(InputCustom)
