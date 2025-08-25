// Página principal para ver el detalle de un producto
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getDetailProduct } from "../../endpoints/api";
import LoaderModal from "../../components/ui/modal/loaderModal";
import ErrorModal from "../../components/ui/modal/errorModal";
import Button from "../../components/ui/button/Button";

export default function DetailProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });
    const [product, setProduct] = useState<any | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            if (!id) {
                setErrorModal({ open: true, message: "ID de producto no válido." });
                return;
            }
            setIsLoading(true);
            try {
                const data = await getDetailProduct(Number(id));
                setProduct(data);
            } catch (error) {
                setErrorModal({ open: true, message: "No se pudo cargar el producto." });
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (isLoading) return <LoaderModal isOpen={true} />;
    if (errorModal.open) return <ErrorModal isOpen={true} message={errorModal.message} onClose={() => setErrorModal({ open: false, message: "" })} />;
    if (!product) return null;

    return (
        <>
            <PageMeta title={`Detalle de ${product.name}`} description={product.descripcion || ""} />
            <PageBreadcrumb pageTitle="Detalle de Producto" />
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mt-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{product.name}</h2>
                    <Button variant="outline" size="sm" onClick={() => navigate("/products")}>Volver al listado</Button>
                </div>
                {/* Imagenes */}
                {product.images && product.images.length > 0 && (
                    <div className="mb-6 flex gap-4 flex-wrap">
                        {product.images.map((img: any, idx: number) => (
                            <img key={idx} src={`${img.imagen}`} alt={`Imagen ${idx + 1}`} className="w-32 h-32 object-cover rounded-lg border" />
                        ))}
                    </div>
                )}
                {/* Categorías */}
                {product.categories && product.categories.length > 0 && (
                    <div className="mb-6">
                        <div className="mb-2 text-sm text-gray-500 dark:text-gray-300 font-semibold">Categorías</div>
                        <ul className="flex gap-2 flex-wrap">
                            {product.categories.map((cat: any, idx: number) => (
                                <li key={idx} className="bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-white px-3 py-1 rounded-full text-sm font-medium">{cat.nombre}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="mb-2 text-sm text-gray-500 dark:text-gray-300">Precio base</div>
                        <div className="text-lg font-semibold text-primary-600 dark:text-white">${product.price_base}</div>
                    </div>
                    <div>
                        <div className="mb-2 text-sm text-gray-500 dark:text-gray-300">Descripción</div>
                        <div className="text-gray-800 dark:text-gray-200">{product.descripcion || "Sin descripción"}</div>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="mb-2 text-sm text-gray-500 font-semibold">Atributos</div>
                    {product.attributes && product.attributes.length > 0 ? (
                        <ul className="list-disc pl-6">
                            {product.attributes.map((attr: any, idx: number) => (
                                <li key={idx} className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">{attr.name}</span>: {attr.value}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-400">Sin atributos</div>
                    )}
                </div>
                <div className="mb-6">
                    <div className="mb-2 text-sm text-gray-500 dark:text-gray-300 font-semibold">Inventario</div>
                    {product.inventario ? (
                        <div className="flex gap-6">
                            <div className="text-gray-700 dark:text-gray-200">
                                <span className="font-medium">Unidad:</span> {product.inventario.unidad_medida}
                            </div>
                            <div className="text-gray-700 dark:text-white">
                                <span className="font-medium">Cantidad:</span> {product.inventario.cantidad}
                            </div>
                            <div className="text-gray-700 dark:text-gray-200">
                                <span className="font-medium">Stock mínimo:</span> {product.inventario.stock_minimo}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 dark:text-gray-500">Sin inventario</div>
                    )}
                </div>
                <div className="mb-6">
                    <div className="mb-2 text-sm text-gray-500 font-semibold">Variantes</div>
                    {product.variants && product.variants.length > 0 ? (
                        <ul className="list-disc pl-6">
                            {product.variants.map((variant: any, idx: number) => (
                                <li key={idx} className="text-gray-700 dark:text-gray-300">
                                    <div className="font-medium">Variante {idx + 1}</div>
                                    {variant.variant_attributes && variant.variant_attributes.length > 0 && (
                                        <ul className="list-disc pl-4">
                                            {variant.variant_attributes.map((va: any, vIdx: number) => (
                                                <li key={vIdx}>{va.name}: {va.value}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {variant.inventario_variante && (
                                        <div className="flex gap-4 mt-2">
                                            <span className="font-medium">Cantidad:</span> {variant.inventario_variante.cantidad}
                                            <span className="font-medium">Stock mínimo:</span> {variant.inventario_variante.stock_minimo}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-400">Sin variantes</div>
                    )}
                </div>
            </div>
        </>
    );
}
