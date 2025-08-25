
// Tipo para producto real
import { ColumnDef } from "@tanstack/react-table";
import { TanstackTable } from "../../tables/Tanstack/table";

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
};

type ProductsDataTablesProps = {
    data: Product[];
};

type ProductColumnMeta = {
    headerClassName?: string;
    cellClassName?: string;
};

type ProductColumn = ColumnDef<Product> & { meta?: ProductColumnMeta };

const columns: ProductColumn[] = [
    {
        accessorKey: "name",
        header: () => <span>Nombre</span>,
        cell: (info: any) => <span>{info.getValue() as string}</span>,
        meta: {
            cellClassName: "font-medium"
        }
    },
    {
        accessorKey: "price_base",
        header: () => <span>Precio Base</span>,
        cell: (info: any) => {
            const value = info.getValue();
            return <span>${String(value)}</span>;
        },
    },
    {
        accessorKey: "descripcion",
        header: () => <span>Descripción</span>,
        cell: (info: any) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: "inventario.cantidad",
        header: () => <span>Stock</span>,
        cell: (info: any) => {
            const row = info.row.original;
            return <span>{row.inventario?.cantidad ?? 0}</span>;
        },
    },
    {
        accessorKey: "inventario.unidad_medida",
        header: () => <span>Unidad</span>,
        cell: (info: any) => {
            const row = info.row.original;
            return <span>{row.inventario?.unidad_medida ?? ""}</span>;
        },
    },
    {
        accessorKey: "images",
        header: () => <span>Imagen</span>,
        cell: (info: any) => {
            const row = info.row.original;
            return row.images && row.images.length > 0 ? (
                <img src={row.images[0].imagen} alt={row.name} className="w-8 h-8 rounded" />
            ) : (
                <span className="text-gray-400 dark:text-gray-500">Sin imagen</span>
            );
        },
        meta: {
            cellClassName: "text-gray-400 dark:text-gray-500"
        }
    },
];

export default function ProductsDataTables({ data }: ProductsDataTablesProps) {
    return (
        <TanstackTable
            columns={columns}
            data={data}
            title="Productos"
            globalFilterPlaceholder="Buscar..."
            headerClassName="font-semibold"
            cellClassName="text-gray-800 dark:text-gray-200"
        />
    );
}