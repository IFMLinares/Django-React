import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef as BaseColumnDef,
} from "@tanstack/react-table";

type TableColumnMeta = {
    headerClassName?: string;
    cellClassName?: string;
};

export type ColumnDef<T> = BaseColumnDef<T> & { meta?: TableColumnMeta };

export type TanstackTableProps<T extends object> = {
    columns: ColumnDef<T>[];
    data: T[];
    title?: string;
    globalFilterPlaceholder?: string;
    className?: string;
    headerClassName?: string;
    cellClassName?: string;
    meta?: any;
};

export function TanstackTable<T extends object>({
    columns,
    data,
    title,
    globalFilterPlaceholder = "Buscar...",
    className = "",
    headerClassName = "font-semibold",
    cellClassName = "text-gray-800 dark:text-gray-200",
    meta,
}: TanstackTableProps<T>) {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [pageSize, setPageSize] = React.useState(10);
    const [pageIndex, setPageIndex] = React.useState(0);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: updater => {
            if (typeof updater === "function") {
                const newState = updater({ pageIndex, pageSize });
                setPageIndex(newState.pageIndex);
                setPageSize(newState.pageSize);
            } else if (updater && typeof updater === "object") {
                if ("pageIndex" in updater) setPageIndex(updater.pageIndex);
                if ("pageSize" in updater) setPageSize(updater.pageSize);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: false,
        meta,
    });

    return (
        <div className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 ${className}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                {title && (
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                )}
                <div className="flex flex-col md:flex-row gap-2 items-center">
                    <input
                        value={globalFilter ?? ""}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder={globalFilterPlaceholder}
                        className="px-3 py-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-primary-500"
                    />
                    <label className="text-xs text-gray-600 dark:text-gray-400 ml-2">Items por página:</label>
                    <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="px-2 py-1 border rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                    >
                        {[5, 10, 20, 50, 100].map((size: number) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        {table.getHeaderGroups().map((headerGroup: any) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header: any) => {
                                    // Permite pasar extra clases por columnDef.headerClassName
                                    const meta = header.column.columnDef.meta as TableColumnMeta | undefined;
                                    const extraHeaderClass = meta?.headerClassName || "";
                                    return (
                                        <th
                                            key={header.id}
                                            className={`px-4 py-2 text-left text-xs ${headerClassName} text-gray-700 dark:text-gray-200 ${extraHeaderClass}`}
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900">
                        {table.getRowModel().rows.map((row: any) => (
                            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                {row.getVisibleCells().map((cell: any) => {
                                    // Permite pasar extra clases por columnDef.cellClassName
                                    const meta = cell.column.columnDef.meta as TableColumnMeta | undefined;
                                    const extraCellClass = meta?.cellClassName || "";
                                    return (
                                        <td key={cell.id} className={`px-4 py-2 text-sm ${cellClassName} ${extraCellClass}`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Paginación */}
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </div>
                <div className="flex gap-2">
                    <button
                        className="px-2 py-1 border rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 disabled:opacity-50"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        « Primero
                    </button>
                    <button
                        className="px-2 py-1 border rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        ‹ Anterior
                    </button>
                    <button
                        className="px-2 py-1 border rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente ›
                    </button>
                    <button
                        className="px-2 py-1 border rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 disabled:opacity-50"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        Última »
                    </button>
                </div>
            </div>
        </div>
    );
}
