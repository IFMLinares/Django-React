

// React and hooks
import { useEffect, useState } from "react";
// Custom select component
import Select from "../../form/Select";
// Card container for section
import ComponentCard from "../../common/ComponentCard";
// Input field for attribute name/value
import Input from "../../form/input/InputField";
// API call to get attribute names
import { listAttributesNames } from "../../../endpoints/api";


// Attribute type for each attribute
type Attribute = { name: string; value: string };

// Props for AttributeForm: register (React Hook Form), errors, attributes state, setAttributes, setValue
interface AttributeFormProps {
    register: any;
    errors: any;
    attributes: Attribute[];
    setAttributes: (attrs: Attribute[]) => void;
    setValue: any;
}


// AttributeForm: Form section for managing product attributes
const AttributeForm: React.FC<AttributeFormProps> = ({ register, errors, attributes, setAttributes, setValue }) => {
    // List of available attribute names for select dropdown
    const [attributeNames, setAttributeNames] = useState<{ value: string; label: string }[]>([]);
    // Currently selected attribute name to add
    const [selectedName, setSelectedName] = useState("");

    // Fetch attribute names from API on mount
    useEffect(() => {
        async function fetchNames() {
            const names = await listAttributesNames();
            setAttributeNames(names.map((attr: any) => ({ value: attr.name, label: attr.name })));
        }
        fetchNames();
    }, []);


    // Add a new attribute to the list
    const handleAddAttribute = () => {
        if (selectedName) {
            setAttributes([...attributes, { name: selectedName, value: "" }]);
            setSelectedName("");
        }
    };


    // Update the value of an attribute
    const handleValueChange = (index: number, value: string) => {
        const updated = [...attributes];
        updated[index].value = value;
        setAttributes(updated);
    };


    // Remove an attribute from the list and sync with React Hook Form
    const handleRemove = (index: number) => {
        const updated = attributes.filter((_, i) => i !== index);
        setAttributes(updated);
        setValue("attributes", updated);
    };

    return (
        <ComponentCard title="Atributos Generales">
            {/* Select and add button for new attribute */}
            <div className="flex gap-2 mb-4">
                <Select
                    options={attributeNames}
                    placeholder="Selecciona atributo"
                    onChange={e => setSelectedName(e.target.value)}
                    defaultValue=""
                    key={attributes.length}
                    className="border rounded px-2 py-1"
                />
                <button
                    type="button"
                    className="px-4 py-2 bg-brand-500 text-white rounded"
                    onClick={handleAddAttribute}
                >
                    Añadir
                </button>
            </div>
            {/* List of added attributes */}
            <div className="space-y-2">
                {attributes.map((attr, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                        {/* Attribute name (disabled input) */}
                        <Input
                            {...register(`attributes.${idx}.name`)}
                            value={attr.name}
                            disabled
                            className="w-1/3"
                        />
                        {/* Attribute value input */}
                        <Input
                            {...register(`attributes.${idx}.value`)}
                            value={attr.value}
                            onChange={e => handleValueChange(idx, e.target.value)}
                            placeholder={`Ingrese ${attr.name.toLowerCase()}`}
                            className="w-2/3"
                        />
                        {/* Remove attribute button */}
                        <button
                            type="button"
                            className="text-red-500"
                            onClick={() => handleRemove(idx)}
                        >
                            Eliminar
                        </button>
                        {/* Validation error for value */}
                        {errors.attributes && errors.attributes[idx]?.value && (
                            <span className="text-red-500 text-xs">{errors.attributes[idx].value.message}</span>
                        )}
                    </div>
                ))}
            </div>
        </ComponentCard>
    );
};

export default AttributeForm;
