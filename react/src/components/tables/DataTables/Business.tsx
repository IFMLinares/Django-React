import DataTable, { TableColumn } from "react-data-table-component";

// Datos de ejemplo
const data = [
    {
        id: 1,
        user: {
            image: "/images/user/user-21.jpg",
            name: "Carla George",
            email: "demoemail@gmail.com",
            role: "Integration Specialist",
        },
        salary: "$80,000",
        location: "Chicago",
        status: "Pending",
    },
    {
        id: 2,
        user: {
            image: "/images/user/user-22.jpg",
            name: "John Doe",
            email: "john@example.com",
            role: "Developer",
        },
        salary: "$90,000",
        location: "New York",
        status: "Active",
    },
    // ...más datos
];

// Columnas con renderizado personalizado
const columns: TableColumn<typeof data[0]>[] = [
    {
        name: "",
        cell: row => (
            <div className="flex items-center gap-3">
                <img src={row.user.image} alt={row.user.name} className="w-8 h-8 rounded-full" />
                <div>
                    <div className="font-medium text-gray-800 dark:text-white">{row.user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{row.user.email}</div>
                </div>
            </div>
        ),
        sortable: true,
        minWidth: "200px",
    },
    {
        name: "Rol",
        selector: row => row.user.role,
        sortable: true,
        cell: row => <span className="text-gray-800 dark:text-white">{row.user.role}</span>,
    },
    {
        name: "Salario",
        selector: row => row.salary,
        sortable: true,
        cell: row => <span className="text-gray-800 dark:text-white">{row.salary}</span>,
    },
    {
        name: "Ubicación",
        selector: row => row.location,
        sortable: true,
        cell: row => <span className="text-gray-800 dark:text-white">{row.location}</span>,
    },
    {
        name: "Estado",
        selector: row => row.status,
        sortable: true,
        cell: row => (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${row.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
                {row.status}
            </span>
        ),
    },
    {
        name: "Acciones",
        cell: row => (
            <div className="flex gap-2">
                <button className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">🗑️</button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">✏️</button>
            </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    },
];

export default function BusinessDataTable() {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Negocios</h2>
            </div>
            <DataTable
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
                            backgroundColor: "var(--datatable-head-bg, #f9fafb)",
                            color: "var(--datatable-head-color, #1f2937)",
                            borderBottom: "1px solid #e5e7eb",
                        },
                    },
                    rows: {
                        style: {
                            fontSize: "14px",
                            backgroundColor: "var(--datatable-row-bg, #fff)",
                            color: "var(--datatable-row-color, #1f2937)",
                        },
                    },
                    table: {
                        style: {
                            backgroundColor: "var(--datatable-table-bg, #fff)",
                        },
                    },
                    pagination: {
                        style: {
                            backgroundColor: "var(--datatable-pagination-bg, #fff)",
                            color: "var(--datatable-pagination-color, #1f2937)",
                        },
                    },
                }}
            />
            <style>{`
                html.dark {
                    --datatable-head-bg: #18181b;
                    --datatable-head-color: #f3f4f6;
                    --datatable-row-bg: #23272f;
                    --datatable-row-color: #f3f4f6;
                    --datatable-table-bg: #18181b;
                    --datatable-pagination-bg: #18181b;
                    --datatable-pagination-color: #f3f4f6;
                }
            `}</style>
        </div>
    );
}