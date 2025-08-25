import { z } from "zod";

export const loginSchema = z.object({
    username: z.string()
        .nonempty({ message: "Este campo es obligatorio" })
        .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
        .max(200, { message: "El nombre no puede tener más de 200 caracteres" }),
    password: z.string()
        .nonempty({ message: "Este campo es obligatorio" })
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .max(100, { message: "La contraseña no puede tener más de 100 caracteres" })
});