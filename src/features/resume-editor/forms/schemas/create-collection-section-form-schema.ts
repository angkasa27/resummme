import { z } from "zod";

export function createCollectionSectionFormSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema).min(1, "Keep at least one item in this section."),
  });
}