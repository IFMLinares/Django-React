import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { productSchema } from "../../validators/productSchema";
import { getDetailProduct, updateProduct } from "../../endpoints/api";
import { BoxIcon } from "../../icons";
import ProductForm from "../../components/Products/forms/ProductForm";
import AttributeForm from "../../components/Products/forms/AttributeForm";
import StockForm from "../../components/Products/forms/StockForm";
import Button from "../../components/ui/button/Button";
import SuccessModal from "../../components/ui/modal/successModal";
import VariantForm from "../../components/Products/forms/VariantForm";
import TypeProduct from "../../components/Products/forms/TypeProduct";
import LoaderModal from "../../components/ui/modal/loaderModal";
import ErrorModal from "../../components/ui/modal/errorModal";


// Tipos para los datos del producto
type Attribute = { name: string; value: string };
type UnidadMedida = { value: string; label: string };
type Variant = {
    attributes: Attribute[];
    cantidad: number;
    stockMinimo: number;
};

export default function EditProduct() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [errorModal, setErrorModal] = useState({ open: false, message: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [unidadMedida, setUnidadMedida] = useState<UnidadMedida[]>([]);
    const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: { tipoProducto: "simple" }
    });

    useEffect(() => {
        async function fetchProduct() {
            try {
                const product = await getDetailProduct(parseInt(id || "0"));
                console.log(product);
                setValue("name", product.name);
                setValue("priceBase", product.price_base);
                setValue("descripcion", product.descripcion);
                setAttributes(product.attributes || []);
                setValue("stock", product.inventario ? {
                    tipoUnidad: product.inventario.unidad_medida,
                    cantidad: product.inventario.cantidad,
                    stockMinimo: product.inventario.stock_minimo,
                } : undefined);
                const mappedVariants = (product.variants || []).map((v: any) => ({
                    attributes: v.variant_attributes || [],
                    cantidad: v.inventario_variante?.cantidad ?? 0,
                    stockMinimo: v.inventario_variante?.stock_minimo ?? 0,
                }));
                setVariants(mappedVariants);
                // Importante: sincronizar con react-hook-form para que los inputs muestren valores
                setValue("variants", mappedVariants, { shouldValidate: false, shouldDirty: false });
                setValue("tipoProducto", product.variants && product.variants.length > 0 ? "variantes" : "simple");
            } catch (error) {
                setErrorModal({ open: true, message: "No se pudo cargar el producto." });
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [id, setValue]);

    // Manejar el envío del formulario
    const onSubmit = async (data: any) => {
        setIsSaving(true);
        const payload: any = {
            name: data.name,
            price_base: data.priceBase,
            descripcion: data.descripcion,
            tipoProducto: data.tipoProducto,
            attributes: attributes,
            inventario: data.stock ? {
                unidad_medida: data.stock.tipoUnidad,
                cantidad: data.stock.cantidad,
                stock_minimo: data.stock.stockMinimo,
            } : undefined,
            variants: variants.length > 0 ? variants.map(v => ({
                attributes: v.attributes,
                cantidad: v.cantidad,
                stock_minimo: v.stockMinimo,
            })) : undefined,
        };
        try {
            await updateProduct(parseInt(id || "0"), payload);
            setSuccessModal(true);
        } catch (error) {
            setErrorModal({ open: true, message: "Error al actualizar el producto." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <LoaderModal isOpen={isLoading || isSaving} />
            <ErrorModal
                isOpen={errorModal.open}
                message={errorModal.message}
                onClose={() => setErrorModal({ open: false, message: "" })}
            />
            <SuccessModal
                isOpen={successModal}
                onClose={() => setSuccessModal(false)}
                message="Producto actualizado correctamente"
                buttonText="Cerrar"
                buttonAction={() => setSuccessModal(false)}
            />
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TypeProduct
                        register={register}
                        tipoProducto={watch("tipoProducto")}
                        setTipoProducto={value => setValue("tipoProducto", value)}
                    />
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="space-y-6">
                            <ProductForm register={register} errors={errors} />
                        </div>
                        <div className="space-y-6">
                            <AttributeForm
                                register={register}
                                errors={errors}
                                attributes={attributes}
                                setAttributes={setAttributes}
                                setValue={setValue}
                            />
                            <StockForm
                                register={register}
                                errors={errors}
                                unidadMedida={unidadMedida}
                                setUnidadMedida={setUnidadMedida}
                                setValue={setValue}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mt-6">
                        <div className="space-y-6">
                            {watch("tipoProducto") === "variantes" && (
                                <VariantForm register={register} errors={errors} variants={variants} setVariants={setVariants} setValue={setValue} />
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end mt-8">
                        <Button
                            type="submit"
                            size="md"
                            variant="primary"
                            startIcon={<BoxIcon className="size-5" />}
                        >
                            Enviar
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}