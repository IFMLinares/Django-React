import { z } from "zod";

export const productSchema = z.object({
    name: z.string()
        .nonempty({ message: "Este campo es obligatorio" })
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
        .max(100, { message: "El nombre no puede tener más de 100 caracteres" }),
    priceBase: z.coerce.number()
        .min(0.01, { message: "El precio es obligatorio" }),
    descripcion: z.string().optional(),
    tipoProducto: z.enum(["simple", "variantes"]),
    attributes: z.array(z.object({
        name: z.string()
            .nonempty({ message: "Este campo es obligatorio" })
            .min(1, { message: "El nombre es obligatorio" }),
        value: z.string()
            .nonempty({ message: "Este campo es obligatorio" })
            .min(1, { message: "El valor es obligatorio" }),
    })).optional(),
    stock: z.object({
        tipoUnidad: z.string()
            .nonempty({ message: "Este campo es obligatorio" })
            .min(1, { message: "La unidad es obligatoria" }),
        cantidad: z.coerce.number()
            .min(0, { message: "La cantidad es obligatoria" }),
        stockMinimo: z.coerce.number()
            .min(0, { message: "El stock mínimo es obligatorio" }),
    }).optional(),
    variants: z.array(z.object({
        attributes: z.array(z.object({
            name: z.string()
                .nonempty({ message: "Este campo es obligatorio" }),
            value: z.string()
                .nonempty({ message: "Este campo es obligatorio" })
                .min(1, { message: "El valor es obligatorio" }),
        })),
        cantidad: z.coerce.number()
            .min(1, { message: "La cantidad de la variante es obligatoria" }),
        stockMinimo: z.coerce.number()
            .min(1, { message: "El stock mínimo de la variante es obligatorio" }),
    })).optional(),
});
