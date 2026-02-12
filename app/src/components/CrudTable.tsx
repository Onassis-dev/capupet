import {
  EditIcon,
  Ban,
  MoreHorizontal,
  Trash,
  CircleDashed,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table";
import type { QueryStatus } from "@tanstack/react-query";
import { cn } from "@workspace/ui/lib/utils";
import { useI18n } from "@/hooks/use-i18n";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Button } from "@workspace/ui/components/ui/button";

interface props {
  columns: Column[];
  rows: Row[] | undefined;
  status: QueryStatus;
  selectRow: Dispatch<SetStateAction<Record<string, unknown> | null>>;
  setOpenDelete?: Dispatch<SetStateAction<boolean>>;
  setOpenEdit?: Dispatch<SetStateAction<boolean>>;
  onRowClick?: (row: Row) => void;
}

interface Row {
  id: number | string;
  [key: string]: unknown;
}

export interface Column {
  key: string;
  title: string;
  hide?: boolean;
  transform?: (e: unknown, row: Row) => unknown;
  icon?: boolean;
  full?: boolean;
}

export const CrudTable = ({
  columns,
  rows,
  status,
  selectRow,
  setOpenDelete,
  setOpenEdit,
  onRowClick,
}: props) => {
  const t = useI18n({
    noResults: {
      es: "No se encontraron resultados",
      en: "No results found",
    },
    noResultsText: {
      es: "Tu búsqueda no encontró ningún resultado",
      en: "Your search did not find any results",
    },
    errorText: {
      es: "Hubo un problema al completar la petición",
      en: "There was a problem completing the request",
    },
    register: {
      es: "Registrar",
      en: "Register",
    },
    view: {
      es: "Ver",
      en: "View",
    },
    download: {
      es: "Descargar",
      en: "Download",
    },
    edit: {
      es: "Editar",
      en: "Edit",
    },
    unarchive: {
      es: "Desarchivar",
      en: "Unarchive",
    },
    delete: {
      es: "Eliminar",
      en: "Delete",
    },
    archive: {
      es: "Archivar",
      en: "Archive",
    },
    toggleMenu: {
      es: "Alternar menú",
      en: "Toggle menu",
    },
  });

  return (
    <div className="relative sm:w-full overflow-hidden -ml-4 sm:ml-0 w-screen">
      <Table>
        <TableHeader className="h-12">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                className={cn(
                  column.hide ? "hidden sm:table-cell" : "",
                  column.full ? "w-full" : ""
                )}
                key={column.key}
              >
                {column.title}
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {status === "success" &&
            rows?.map((row) => (
              <TableRow
                className="w-full cursor-pointer"
                onClick={() => (onRowClick ? onRowClick(row) : undefined)}
                key={row.id}
              >
                {columns?.map((column) => {
                  const cellContent = row[column.key];

                  return (
                    <TableCell
                      key={column.key}
                      className={cn(
                        column.hide ? "hidden sm:table-cell" : "",
                        column.icon ? "pr-0!" : ""
                      )}
                    >
                      <span>
                        {column?.transform
                          ? (column.transform(cellContent, row) as ReactNode)
                          : (cellContent as string)}
                      </span>
                    </TableCell>
                  );
                })}

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="size-9"
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t("toggleMenu")}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {setOpenEdit && (
                        <DropdownMenuItem
                          onClick={() => {
                            selectRow(row);
                            setOpenEdit(true);
                          }}
                        >
                          <EditIcon className="size-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                      )}

                      {setOpenDelete && (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            selectRow(row);
                            setOpenDelete(true);
                          }}
                        >
                          <Trash className="size-4" />
                          {t("delete")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

          {status === "success" && !rows?.length && (
            <TableRow>
              <TableCell colSpan={100}>
                <div className="w-full justify-center flex flex-col items-center h-56">
                  <CircleDashed
                    strokeWidth={1.1}
                    className="size-10 mb-3 rounded-xl"
                  />
                  <span className="mb-1">{t("noResults")}</span>
                  <span className="text-muted-foreground">
                    {t("noResultsText")}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {status === "pending" &&
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((column, j) => (
                  <TableCell
                    className={column.hide ? "hidden sm:table-cell" : ""}
                    key={j}
                  >
                    <Skeleton className="h-4" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {(status === "error" || (status === "success" && !rows)) && (
            <TableRow>
              <TableCell colSpan={100}>
                <div className="w-full justify-center flex flex-col items-center text-muted-foreground h-40">
                  <Ban strokeWidth={1.2} className="size-12 mb-4" />
                  <span>{t("errorText")}</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
