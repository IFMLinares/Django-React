import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
// import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import ProductsDataTables from "../../components/Products/DataTables/Products";
import { listProducts } from "../../endpoints/api";
import { useEffect, useState } from "react";

export default function ProductsTables() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const businessId = 1; // Cambia esto según tu lógica
                const response = await listProducts(businessId);
                setProducts(response);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <PageMeta
                title="Productos"
                description=""
            />
            <PageBreadcrumb pageTitle="Productos" />
            <div className="space-y-6">
                <ComponentCard title="Tabla de Productos">
                    <ProductsDataTables data={products} />
                </ComponentCard>
            </div>
        </>
    );
}
