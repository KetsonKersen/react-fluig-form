import z from "zod"

export const schemaBase = z.object({
  CURRENTACTIVITYID: z.coerce.number().optional(),
  LASTACTIVITYID: z.coerce.number().optional(),
})

export const schemaExemple = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  telefone: z.string().optional(),
})
