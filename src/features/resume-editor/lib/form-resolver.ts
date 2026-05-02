import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";

export function createSchemaResolver<TFieldValues extends FieldValues>(
  schema: unknown
) {
  return zodResolver(schema as never) as Resolver<TFieldValues>;
}
