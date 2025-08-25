
// Card container for the product section
import ComponentCard from "../../common/ComponentCard";
// Label component for form fields
import Label from "../../form/Label";
// Input field for text and numbers
import Input from "../../form/input/InputField";
// TextArea for product description
import TextArea from "../../form/input/TextArea.tsx";


// Props for ProductForm: register (React Hook Form) and errors (validation)
interface ProductFormProps {
    register: any;
    errors: any;
}


// ProductForm: Form section for basic product data
const ProductForm: React.FC<ProductFormProps> = ({ register, errors }) => (
    <ComponentCard title="Nuevo Producto">
        {/* Product name field */}
        <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
                type="text"
                id="name"
                {...register("name")}
                required
                className="w-full bg-white text-gray-900 border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
            {/* Validation error for name */}
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
        </div>
        {/* Product base price field */}
        <div>
            <Label htmlFor="priceBase">Precio Base</Label>
            <Input
                type="number"
                id="priceBase"
                {...register("priceBase")}
                required
                className="w-full bg-white text-gray-900 border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
            {/* Validation error for priceBase */}
            {errors.priceBase && <span className="text-red-500 text-xs">{errors.priceBase.message}</span>}
        </div>
        {/* Product description field */}
        <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <TextArea
                {...register("descripcion")}
                rows={4}
                className="w-full bg-white text-gray-900 border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
            {/* Validation error for descripcion */}
            {errors.descripcion && <span className="text-red-500 text-xs">{errors.descripcion.message}</span>}
        </div>
    </ComponentCard>
);

export default ProductForm;
