import { Section } from "@fluig-kit/ecm"
import Input from "../components/Input"

function SectionExempleContent() {
  return (
    <div>
      <div className="row">
        <div className="form-group col-md-12">
          <Input name="name" label="Nome"/>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Input name="email" label="E-mail" />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Input name="Telefone" label="Telefone" mask="telefone" />
        </div>
      </div>
    </div>
  )
}
export default function SectionExemple(props) {
  return (
    <Section id="SectionExemple" className="well" {...props}>
      <SectionExempleContent />
    </Section>
  )
}
