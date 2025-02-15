"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  ColumnMeta,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Input } from "./input"
import { Button } from "./button"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta?: ColumnMeta<TData, TValue>
  tableTitle?: React.ReactNode
  rightContent?: React.ReactNode
  filteredColumn?: string
  filterPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  tableTitle,
  rightContent,
  filteredColumn,
  filterPlaceholder
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("tables.generic");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFiltering] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    meta: meta,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFiltering,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    }
  })

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center gap-6">
        {tableTitle}

        <div className="flex gap-2">
          {filteredColumn
            ? <Input
              placeholder={filterPlaceholder}
              value={(table.getColumn(filteredColumn)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(filteredColumn)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            : null}
          {rightContent}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('empty')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-2">
        <div className="flex-1 text-sm text-muted-foreground">
          { t('actions.selection', { selected: table.getFilteredSelectedRowModel().rows.length, count: table.getFilteredRowModel().rows.length }) }
        </div>

        <p className="text-sm font-medium">{ t('page', { current: table.getState().pagination.pageIndex + 1, total: Math.max(table.getPageCount(), 1) }) }</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="hidden md:inline">{t('actions.previous')}</span>
          <ChevronLeft className="block md:hidden" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="hidden md:inline">{t('actions.next')}</span>
          <ChevronRight className="block md:hidden" />
        </Button>
      </div>
    </div>
  )
}
