"use client"

import {
  ColumnDef,
  ColumnFilter,
  ColumnFiltersState,
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
import { robotoMono } from "@/ui/fonts"
import { Button } from "./button"
import { useTranslations } from "next-intl"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  tableTitle?: React.ReactNode
  rightContent?: React.ReactNode
  filteredColumn?: string
  filterPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
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
      <div className="flex justify-between items-center">
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
                  No results.
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

        <p>{ t('page', { current: table.getState().pagination.pageIndex + 1, total: table.getPageCount() }) }</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('actions.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t('actions.next')}
        </Button>
      </div>
    </div>
  )
}
