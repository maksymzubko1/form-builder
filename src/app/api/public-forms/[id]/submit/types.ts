import z, { ZodTypeAny } from "zod";

const FormFieldDefSchema = z.object({
  id: z.string(),
  type: z.string(),
  required: z.boolean().optional(),
}).catchall(z.any());

export const PayloadSchema = <T extends ZodTypeAny>(schema: T) => z.object({
  fields: z.array(FormFieldDefSchema),
  data: schema
});
export type PayloadType = z.infer<typeof PayloadSchema>;