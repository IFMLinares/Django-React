import { useState, useEffect } from "react";
import Select from "../../form/Select";
import Input from "../../form/input/InputField";
import ComponentCard from "../../common/ComponentCard";
import { listAttributesNames } from "../../../endpoints/api";
import Button from "../../ui/button/Button";
import { BoxIcon } from "../../../icons";

interface Attribute {
    name: string;
    value: string;
}

interface Variant {
    attributes: Attribute[];
    cantidad: number;
    stockMinimo: number;
}


interface VariantFormProps {
    register: any;
    errors: any;
    variants: Variant[];
    setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
    setValue: any;
}

const VariantForm: React.FC<VariantFormProps> = ({ register, errors, variants, setVariants, setValue }) => {
    const [attributeNames, setAttributeNames] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        async function fetchNames() {
            const names = await listAttributesNames();
            setAttributeNames(names.map((attr: any) => ({ value: attr.name, label: attr.name })));
        }
        fetchNames();
    }, []);

    return (
        <ComponentCard title="Variantes">
            {variants.map((variant, vIdx) => (
                <div key={vIdx} className="mb-6 border-b pb-4 dark:border-gray-700">
                    <div className="mb-2 font-medium text-brand-500">Variante #{vIdx + 1}</div>
                    {/* Sección de atributos de la variante */}
                    <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Atributos de la variante</div>
                    {variant.attributes.map((attr, aIdx) => (
                        <div key={aIdx} className="flex gap-2 items-center mb-2">
                            <div className="w-1/3">
                                <label className="block text-xs text-gray-500 mb-1">Nombre atributo</label>
                                <Select
                                    options={attributeNames}
                                    placeholder="Nombre atributo"
                                    defaultValue={attr.name}
                                    {...register(`variants.${vIdx}.attributes.${aIdx}.name`)}
                                    onChange={e => {
                                        const value = e.target.value;
                                        const newVariants = [...variants];
                                        newVariants[vIdx].attributes[aIdx].name = value;
                                        setVariants(newVariants);
                                        setValue("variants", newVariants);
                                    }}
                                    className="w-full"
                                />
                            </div>
                            <div className="w-1/3">
                                <label className="block text-xs text-gray-500 mb-1">Valor atributo</label>
                                <Input
                                    {...register(`variants.${vIdx}.attributes.${aIdx}.value`)}
                                    value={attr.value}
                                    onChange={e => {
                                        const newVariants = [...variants];
                                        newVariants[vIdx].attributes[aIdx].value = e.target.value;
                                        setVariants(newVariants);
                                        setValue("variants", newVariants);
                                    }}
                                    placeholder="Valor"
                                    className="w-full"
                                />
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                startIcon={<BoxIcon className="size-5" />}
                                className="!text-red-500 !border-red-500"
                                onClick={() => {
                                    const newVariants = [...variants];
                                    newVariants[vIdx].attributes.splice(aIdx, 1);
                                    setVariants(newVariants);
                                    setValue("variants", newVariants);
                                }}
                            >Eliminar</Button>
                            {errors.variants && errors.variants[vIdx]?.attributes && errors.variants[vIdx].attributes[aIdx]?.value && (
                                <span className="text-red-500 text-xs">{errors.variants[vIdx].attributes[aIdx].value.message}</span>
                            )}
                        </div>
                    ))}
                    {/* Línea de separación */}
                    <hr className="my-4 border-t border-gray-300 dark:border-gray-700" />
                    {/* Sección de inventario de la variante */}
                    <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Inventario de la variante</div>
                    <div className="flex gap-2 items-center mb-2">
                        <div className="w-1/4">
                            <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
                            <Input
                                type="number"
                                {...register(`variants.${vIdx}.cantidad`)}
                                value={variant.cantidad}
                                onChange={e => {
                                    const value = e.target.value;
                                    const newVariants = [...variants];
                                    newVariants[vIdx].cantidad = value === "" ? 0 : Number(value);
                                    setVariants(newVariants);
                                    setValue("variants", newVariants);
                                }}
                                placeholder="Cantidad de la variante"
                                className="w-full"
                            />
                        </div>
                        <div className="w-1/4">
                            <label className="block text-xs text-gray-500 mb-1">Stock mínimo</label>
                            <Input
                                type="number"
                                {...register(`variants.${vIdx}.stockMinimo`)}
                                value={variant.stockMinimo}
                                onChange={e => {
                                    const value = e.target.value;
                                    const newVariants = [...variants];
                                    newVariants[vIdx].stockMinimo = value === "" ? 0 : Number(value);
                                    setVariants(newVariants);
                                    setValue("variants", newVariants);
                                }}
                                placeholder="Stock mínimo de la variante"
                                className="w-full"
                            />
                        </div>
                        {errors.variants && errors.variants[vIdx]?.cantidad && (
                            <span className="text-red-500 text-xs">{errors.variants[vIdx].cantidad.message}</span>
                        )}
                        {errors.variants && errors.variants[vIdx]?.stockMinimo && (
                            <span className="text-red-500 text-xs">{errors.variants[vIdx].stockMinimo.message}</span>
                        )}
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        startIcon={<BoxIcon className="size-5" />}
                        className="mt-2"
                        onClick={() => {
                            const newVariants = [...variants];
                            newVariants[vIdx].attributes.push({ name: "", value: "" });
                            setVariants(newVariants);
                            setValue("variants", newVariants);
                        }}
                    >Añadir más atributos</Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        startIcon={<BoxIcon className="size-5" />}
                        className="ml-2 !text-red-500 !border-red-500"
                        onClick={() => {
                            const newVariants = variants.filter((_, idx) => idx !== vIdx);
                            setVariants(newVariants);
                            setValue("variants", newVariants);
                        }}
                    >Eliminar variante</Button>
                </div>
            ))}
            <Button
                type="button"
                size="md"
                variant="outline"
                startIcon={<BoxIcon className="size-5" />}
                className="mt-2"
                // onClick={() => setVariants([...variants, { attributes: [{ name: "", value: "" }] }])}
                onClick={() => {
                    
                    const newVariants = [
                        ...variants,
                        { attributes: [{ name: "", value: "" }], cantidad: 0, stockMinimo: 0 }
                    ];
                    setVariants(newVariants);
                    setValue("variants", newVariants);
                }}
            >Añadir variante</Button>
        </ComponentCard>
    );
};

export default VariantForm;
