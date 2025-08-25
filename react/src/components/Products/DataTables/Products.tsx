import DataTable, { TableColumn } from "react-data-table-component";

// Tipo para producto real
type Product = {
    id: number;
    name: string;
    price_base: number;
    descripcion: string;
    inventario?: {
        unidad_medida: string;
        cantidad: number;
        stock_minimo: number;
    };
    images?: { imagen: string }[];
    // ...otros campos
};

type ProductsDataTablesProps = {
    data: Product[];
};

// Columnas para productos reales
const columns: TableColumn<Product>[] = [
    {
        name: "Nombre",
        selector: row => row.name,
        sortable: true,
        cell: row => <span className="font-medium text-gray-800">{row.name}</span>,
    },
    {
        name: "Precio Base",
        selector: row => row.price_base,
        sortable: true,
        cell: row => <span className="text-gray-800">${row.price_base}</span>,
    },
    {
        name: "Descripción",
        selector: row => row.descripcion,
        sortable: true,
        cell: row => <span className="text-gray-800">{row.descripcion}</span>,
    },
    {
        name: "Stock",
        selector: row => row.inventario?.cantidad ?? 0,
        sortable: true,
        cell: row => <span className="text-gray-800">{row.inventario?.cantidad ?? 0}</span>,
    },
    {
        name: "Unidad",
        selector: row => row.inventario?.unidad_medida ?? "",
        sortable: true,
        cell: row => <span className="text-gray-800">{row.inventario?.unidad_medida ?? ""}</span>,
    },
    {
        name: "Imagen",
        cell: row => (
            row.images && row.images.length > 0 ?
                <img src={row.images[0].imagen} alt={row.name} className="w-8 h-8 rounded" />
                : <span className="text-gray-400">Sin imagen</span>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    },
];

export default function ProductsDataTables({ data }: ProductsDataTablesProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <DataTable
                title="Productos"
                columns={columns}
                data={data}
                pagination
                highlightOnHover
                responsive
                customStyles={{
                    headCells: {
                        style: {
                            fontWeight: "600",
                            fontSize: "14px",
                            backgroundColor: "#f9fafb",
                        },
                    },
                    rows: {
                        style: {
                            fontSize: "14px",
                        },
                    },
                }}
            />
        </div>
    );
}