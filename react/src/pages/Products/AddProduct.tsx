
// Página principal para añadir un producto
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// React Hook Form y validación
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Meta y utilidades
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { BoxIcon } from "../../icons";
import { productSchema } from "../../validators/productSchema";
import { createProduct } from "../../endpoints/api";

// Formularios de producto
import ProductForm from "../../components/Products/forms/ProductForm";
import AttributeForm from "../../components/Products/forms/AttributeForm";
import StockForm from "../../components/Products/forms/StockForm";
import VariantForm from "../../components/Products/forms/VariantForm";
// import { listAttributesNames, createAttributeName } from "../../endpoints/api";
import Button from "../../components/ui/button/Button";
import TypeProduct from "../../components/Products/forms/TypeProduct";
import LoaderModal from "../../components/ui/modal/loaderModal";
import SuccessModal from "../../components/ui/modal/successModal";
import ErrorModal from "../../components/ui/modal/errorModal";



// FormProductAdd: Página y formulario principal para añadir productos
export default function FormProductAdd() {
    // React Hook Form setup y validación
    const navigate = useNavigate();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: { tipoProducto: "simple" }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });
    // Estado para tipo de producto (simple o variantes)
    const tipoProducto = watch("tipoProducto");
    // Estado para atributos generales
    const [attributes, setAttributes] = React.useState<{ name: string; value: string }[]>([]);
    // Estado para variantes (ahora incluye cantidad y stockMinimo)
    const [variants, setVariants] = React.useState<{
        attributes: { name: string; value: string }[];
        cantidad: number;
        stockMinimo: number;
    }[]>([]);
    // Unidades de medida para stock
    const [unidadMedida, setUnidadMedida] = React.useState<{ value: string; label: string }[]>([]);

    const handleAddProduct = async (data: any) => {
        // Adaptar los nombres de los campos antes de enviar
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
        console.log("Payload adaptado:", payload);
        setIsLoading(true);
        try {
            const success = await createProduct(payload);
            if (success) {
                setSuccessModal(true);
            }
        }catch (error) {
            console.error("Error al crear el producto:", error);
            setErrorModal({ open: true, message: "Hubo un error al añadir el producto. Por favor, revisa los campos." });
        } 
        finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {/* Loader Modal */}
            <LoaderModal isOpen={isLoading} />
            {/* Success Modal */}
            <SuccessModal
                isOpen={successModal}
                onClose={() => setSuccessModal(false)}
                message="Producto añadido correctamente"
                buttonText="ir al listado de productos"
                buttonAction={() => {
                    setSuccessModal(false);
                    navigate("/products");
                }}
            />
            {/* Error Modal */}
            <ErrorModal
                isOpen={errorModal.open}
                message={errorModal.message}
                onClose={() => setErrorModal({ open: false, message: "" })}
            />
            <div>
                <form onSubmit={handleSubmit(handleAddProduct)}>
                    {/* Meta y breadcrumb */}
                    <PageMeta
                        title="Añadir Producto"
                        description="Añade un nuevo producto a tu inventario"
                    />
                    <PageBreadcrumb pageTitle="Añadir Producto" />
                    {/* Selector de tipo de producto */}
                    <TypeProduct
                        register={register}
                        tipoProducto={tipoProducto}
                        setTipoProducto={value => setValue("tipoProducto", value)}
                    />
                    {/* Grid principal de formularios */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="space-y-6">
                            {/* Formulario de datos básicos */}
                            <ProductForm register={register} errors={errors} />
                            {/* <TextAreaInput /> */}
                            {/* <InputStates /> */}
                        </div>
                        <div className="space-y-6">
                            {/* Formulario de atributos generales */}
                            <AttributeForm
                                register={register}
                                errors={errors}
                                attributes={attributes}
                                setAttributes={setAttributes}
                                setValue={setValue}
                            />
                            {/* Formulario de stock */}
                            <StockForm
                                register={register}
                                errors={errors}
                                unidadMedida={unidadMedida}
                                setUnidadMedida={setUnidadMedida}
                                setValue={setValue}
                            />
                        </div>
                    </div>
                    {/* Grid para variantes si aplica */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1 mt-6">
                        <div className="space-y-6">
                            {tipoProducto === "variantes" && (
                                <>
                                    {/* Formulario de variantes */}
                                    <VariantForm register={register} errors={errors} variants={variants} setVariants={setVariants} setValue={setValue} />
                                </>
                            )}
                        </div>
                    </div>
                    {/* Botón de envío */}
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
