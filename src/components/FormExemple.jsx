import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export default function FormExemple({prefilledValues}) {
  const { register, handleSubmit, reset } = useForm({defaultValues: prefilledValues});
  const calendarRef = useRef(null);

  // Inicializa calendário Fluig
  useEffect(() => {
    if (typeof window !== "undefined" && window.FLUIGC && calendarRef.current && calendarRef.current.id) {
      window.FLUIGC.calendar(`#${calendarRef.current.id}`);
    }
  }, []);

  // Envio simples com toast Fluig
  const onSubmit = (data) => {
    console.log("✅ Dados enviados:", data);
    FLUIGC.toast({
      title: "Sucesso!",
      message: "Informações salvas com sucesso.",
      type: "success",
    });
    reset();
  };

  return (
    <div>
      <div className="panel panel-success">
        <div className="panel-heading">
            <h3 className="panel-title">Formulário Fluig de exemplo</h3>
        </div>
        <div className="panel-body">
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="form-group">
              <label>Nome completo</label>
              <input
                type="text"
                name="nome"
                className="form-control"
                placeholder="Digite seu nome"
                {...register("nome")}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="exemplo@empresa.com"
                {...register("email")}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de nascimento</label>
              <input
                id="dataNascimento"
                type="text"
                name="dataNascimento"
                className="form-control"
                value={prefilledValues?.dataNascimento}
                {...register("dataNascimento")}
                ref={(el) => {
                  calendarRef.current = el;
                }}
                 required
              />
            </div>

            <div className="form-group">
              <label>Observações</label>
              <textarea
                className="form-control"
                name="obs"
                rows="3"
                placeholder="Algum comentário opcional..."
                {...register("obs")}
                 required
              ></textarea>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="submit" className="btn btn-success">
                Salvar
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={() => reset()}
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
