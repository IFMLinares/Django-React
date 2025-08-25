
// Type selector for product (simple or with variants)
import React from "react";

// Props for TypeProduct: register (React Hook Form), tipoProducto state, setTipoProducto setter
interface TypeProductProps {
    register: any;
    tipoProducto: "simple" | "variantes";
    setTipoProducto: (tipo: "simple" | "variantes") => void;
}


// TypeProduct: Radio selector for product type
const TypeProduct: React.FC<TypeProductProps> = ({ register, tipoProducto, setTipoProducto }) => (
    <div className="flex items-center mb-6">
        <div className="flex gap-4 border rounded-lg px-6 py-3 shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700">
            {/* Radio for simple product */}
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    value="simple"
                    checked={tipoProducto === "simple"}
                    {...register("tipoProducto")}
                    onChange={() => setTipoProducto("simple")}
                    className="accent-brand-500 dark:accent-brand-400 dark:bg-gray-800 dark:border-gray-600"
                />
                <span className="text-gray-800 dark:text-white">Simple</span>
            </label>
            {/* Radio for product with variants */}
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    value="variantes"
                    checked={tipoProducto === "variantes"}
                    {...register("tipoProducto")}
                    onChange={() => setTipoProducto("variantes")}
                    className="accent-brand-500 dark:accent-brand-400 dark:bg-gray-800 dark:border-gray-600"
                />
                <span className="text-gray-800 dark:text-white">Con Variantes</span>
            </label>
        </div>
    </div>
);

export default TypeProduct;
