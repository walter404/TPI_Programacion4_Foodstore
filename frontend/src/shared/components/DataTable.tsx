import { flexRender, type Table } from '@tanstack/react-table'
import Button from '@/shared/ui/Button'

interface Props<T> {
  table: Table<T>
  placeholderBusqueda?: string
  mensajeVacio?: string
  sinBusqueda?: boolean
}

/** Tabla de presentación: la página crea la instancia con useReactTable (orden, filtro y paginación del lado del cliente). */
export default function DataTable<T>({ table, placeholderBusqueda = 'Buscar...', mensajeVacio = 'Sin resultados.', sinBusqueda = false }: Props<T>) {
  const filas = table.getRowModel().rows
  const { pageIndex } = table.getState().pagination
  const totalFiltradas = table.getFilteredRowModel().rows.length

  return (
    <div>
      {!sinBusqueda && (
      <input
        type="search"
        aria-label="Buscar en la tabla"
        value={(table.getState().globalFilter as string | undefined) ?? ''}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        placeholder={placeholderBusqueda}
        className="mb-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none sm:w-72"
      />
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-100">
            {table.getHeaderGroups().map((grupo) => (
              <tr key={grupo.id}>
                {grupo.headers.map((header) => {
                  const ordenable = header.column.getCanSort()
                  const sentido = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      onClick={ordenable ? header.column.getToggleSortingHandler() : undefined}
                      className={`px-4 py-3 font-semibold text-slate-700 ${ordenable ? 'cursor-pointer select-none hover:bg-slate-200' : ''}`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sentido === 'asc' && ' ▲'}
                      {sentido === 'desc' && ' ▼'}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filas.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-4 py-8 text-center text-slate-500">
                  {mensajeVacio}
                </td>
              </tr>
            ) : (
              filas.map((fila) => (
                <tr key={fila.id} className="hover:bg-slate-50">
                  {fila.getVisibleCells().map((celda) => (
                    <td key={celda.id} className="px-4 py-3 text-slate-700">
                      {flexRender(celda.column.columnDef.cell, celda.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span>
          {totalFiltradas} registro(s) · Página {pageIndex + 1} de {Math.max(table.getPageCount(), 1)}
        </span>
        <div className="flex gap-2">
          <Button variante="secundario" tamano="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button variante="secundario" tamano="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
