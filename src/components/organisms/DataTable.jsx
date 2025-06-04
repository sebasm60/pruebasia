import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export const DataTable = ({ data, columns, caption }) => {
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { pagination, sorting },
  });

  const pageSizes = Array.from(new Set([5, 10, 15, 20]));

  return (
    <div className="space-y-6 w-full">
      {caption && (
        <caption className="text-left text-lg font-semibold px-4 py-2 text-gray-700 block">
          {caption}
        </caption>
      )}

      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">

          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 text-black">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns?.length} className="h-24 text-center text-gray-500">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="bg-gray-50">
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <th key={footer.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    {flexRender(footer.column.columnDef.footer, footer.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-700 px-2 gap-1">
        <div className="flex items-center gap-4">
          <label>
            <span className="mr-2">Filas por página:</span>
            <select
              className="border rounded px-2 py-1"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
        </div>
        <div className="flex gap-1 items-center">

          {/* Flecha izquierda (anterior) */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1 border rounded disabled:opacity-40 hover:bg-gray-100 text-gray-700"
            title="Anterior"
          >
            <IoIosArrowBack />
          </button>

          {/* Números de página */}
          {Array.from({ length: table.getPageCount() }).map((_, i) => (
            <button
              key={i}
              onClick={() => table.setPageIndex(i)}
              className={`px-2 py-1 border rounded 
      ${table.getState().pagination.pageIndex === i
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}

          {/* Flecha derecha (siguiente) */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1 border rounded disabled:opacity-40 hover:bg-gray-100 text-gray-700"
            title="Siguiente"
          >
            <IoIosArrowForward />
          </button>

        </div>
      </div>
    </div>
  );
};
