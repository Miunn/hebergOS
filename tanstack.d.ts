import '@tanstack/react-table' //or vue, svelte, solid, qwik, etc.
import { useTranslations, useFormatter } from "next-intl";

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    t: ReturnType<typeof useTranslations>
    formatter?: ReturnType<typeof useFormatter>
  }

  interface TableMeta<TData extends RowData> {
    t: ReturnType<typeof useTranslations>
    formatter?: ReturnType<typeof useFormatter>
  }
}