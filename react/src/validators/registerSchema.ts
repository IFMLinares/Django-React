import { z } from "zod";

export const registerSchema = z.object({
    first_name: z.string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
        .max(100, { message: "El nombre no puede tener más de 100 caracteres" })
        .nonempty({ message: "Este campo es obligatorio" }),
    last_name: z.string()
        .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
        .max(100, { message: "El apellido no puede tener más de 100 caracteres" })
        .nonempty({ message: "Este campo es obligatorio" }),
    username: z.string()
        .min(2, { message: "El nombre de usuario debe tener al menos 2 caracteres" })
        .max(100, { message: "El nombre de usuario no puede tener más de 100 caracteres" })
        .nonempty({ message: "Este campo es obligatorio" }),
    email: z.string()
        .email({ message: "Ingresa un correo electrónico válido" })
        .nonempty({ message: "Este campo es obligatorio" }),
    password: z.string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .max(100, { message: "La contraseña no puede tener más de 100 caracteres" })
        .nonempty({ message: "Este campo es obligatorio" }),
    confirm_password: z.string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .max(100, { message: "La contraseña no puede tener más de 100 caracteres" })
        .nonempty({ message: "Este campo es obligatorio" }),
    cedula: z.string()
        .min(8, { message: "La cédula debe tener exactamente 10 caracteres" })
        .max(10, { message: "La cédula debe tener exactamente 10 caracteres" })
        .nonempty({ message: "Este campo es obligatorio" }),
    phone: z.string()
        .min(10, { message: "El teléfono debe tener al menos 10 caracteres" })
        .max(15, { message: "El teléfono no puede tener más de 15 caracteres" })
        .nonempty({ message: "Este campo es obligatorio" }),
}).refine((data) => {
    return data.password === data.confirm_password, {
        message: "Las contraseñas no coinciden",
        path: ["confirm_password"],
    }
});