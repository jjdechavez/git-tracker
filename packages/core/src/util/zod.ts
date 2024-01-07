import { z } from "zod";

export function zod<
  Schema extends z.ZodSchema<any, any, any>,
  Return extends any
>(schema: Schema, func: (value: z.infer<Schema>) => Return) {
  const result = (input: z.infer<Schema>) => {
    const parsed = schema.parse(input);
    return func(parsed);
  };
  result.schema = schema;
  return result;
}

export const idSchema = z
  .union([z.string(), z.number()])
  .pipe(z.coerce.number());

export const statusSchema = z
  .enum(["active", "inactive"])
  .transform((val) => (val === "active" ? 1 : 0));
