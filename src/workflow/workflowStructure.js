import { schemaExemple } from "../form/schemas/schema"
import SectionExemple from "../sections/SectionExemple"

export const SECTIONS_REGISTRY = {
  SectionExemple: { Component: SectionExemple, schema: schemaExemple },
}

export const WORKFLOW_STRUCTURE = {
  0: {
    sections: {
      active: ["SectionExemple"],
      readonly: [],
      order: [],
      rules: [],
    },
    fields: {
      active: [],
      readonly: [],
      hidden: [],
      rules: [],
    },
  },
}
