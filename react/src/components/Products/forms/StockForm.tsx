

// Card container for the stock section
import ComponentCard from "../../common/ComponentCard";
// Label component for form fields
import Label from "../../form/Label";
// Input field for numbers
import Input from "../../form/input/InputField";
// Select dropdown for unit type
import Select from "../../form/Select";

type UnidadMedida = {
    value: string;
    label: string;
};

// Props for StockForm: register (React Hook Form) and errors (validation)
interface StockFormProps {
    register: any;
    errors: any;
    unidadMedida: UnidadMedida[];
    setUnidadMedida: React.Dispatch<React.SetStateAction<UnidadMedida[]>>;
    setValue: any;
}



import React, { useEffect } from "react";
import { getUnitsProduct } from '../../../endpoints/api';

const StockForm: React.FC<StockFormProps> = ({ register, errors, unidadMedida, setUnidadMedida, setValue }) => {

    // Fetch dinámico de unidades de medida desde la API
    useEffect(() => {
        async function fetchUnidades() {
            try {
                const data = await getUnitsProduct();
                // Si la respuesta es un objeto tipo { unidad: "Unidad", kg: "Kilogramo", ... }
                const unidades = data && typeof data === 'object'
                    ? Object.entries(data).map(([value, label]) => ({ value, label: String(label) }))
                    : [];
                setUnidadMedida(unidades);
            } catch (error) {
                setUnidadMedida([]);
            }
        }
        fetchUnidades();
    }, [setUnidadMedida]);

    // Cuando cambia la unidad seleccionada, actualiza el form
    const handleUnidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue("stock.tipoUnidad", e.target.value);
    };

    return (
        <ComponentCard title="Stock del producto">
            {/* Flex container for stock fields */}
            <div className="flex gap-4 items-end">
                {/* Tipo de Unidad (dropdown) */}
                <div className="flex-1">
                    <Label htmlFor="tipoUnidad">Tipo de Unidad</Label>
                    <Select
                        options={unidadMedida}
                        onChange={handleUnidadChange}
                        placeholder="Selecciona atributo"
                        defaultValue=""
                        className="border rounded px-2 py-1 w-full"
                    />
                    {/* Validation error for tipoUnidad */}
                    {errors.stock?.tipoUnidad && <span className="text-red-500 text-xs">{errors.stock.tipoUnidad.message}</span>}
                </div>
                {/* Cantidad (number input) */}
                <div className="w-32">
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                        type="number"
                        id="cantidad"
                        {...register("stock.cantidad")}
                        required
                        className="w-full"
                    />
                    {/* Validation error for cantidad */}
                    {errors.stock?.cantidad && <span className="text-red-500 text-xs">{errors.stock?.cantidad.message}</span>}
                </div>
                {/* Stock Minimo (number input) */}
                <div className="w-32">
                    <Label htmlFor="stockMinimo">Stock Minimo</Label>
                    <Input
                        type="number"
                        id="stockMinimo"
                        {...register("stock.stockMinimo")}
                        required
                        className="w-full"
                    />
                    {/* Validation error for stockMinimo */}
                    {errors.stock?.stockMinimo && <span className="text-red-500 text-xs">{errors.stock?.stockMinimo.message}</span>}
                </div>
            </div>
        </ComponentCard>
    );
};

export default StockForm;
