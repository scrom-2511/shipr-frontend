import { z } from "zod";

export async function validateInput<T>(data: T, schema: z.ZodObject) {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true };
    }

    throw new Error(result.error.issues[0].message);
}