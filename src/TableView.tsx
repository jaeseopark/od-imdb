import { useMemo } from "react";
import cls from "classnames";
import { useTable } from "react-table";
import prettyBytes from "pretty-bytes";

import { Entity } from "./service";
import MovieSummary from "./MovieSummary";
import EntitySummary from "./EntitySummary";

import styled from "styled-components";

type TableViewProps = {
  initData?: Entity[];
};

const Table = styled.table`
  td {
    min-width: 200px;
  }

  tbody {
    tr {
      &.shaded {
        background-color: #fafafa;
      }
    }
  }
`;

const TableView = ({ initData }: TableViewProps) => {
  const columns = useMemo(() => {
    if (initData) {
      return [
        {
          accessor: "name",
          Header: "Name",
          Cell: ({ row }: { row: { original: Entity } }) => {
            const { original: entity } = row;
            return <EntitySummary entity={entity} />;
          },
        },
        {
          accessor: "title",
          Header: "Title",
          minWidth: 200,
          Cell: ({ row }: { row: { original: Entity } }) => (
            <MovieSummary data={row.original} />
          ),
        },
        {
          accessor: "size",
          Header: "Size",
          minWidth: 200,
          Cell: ({ value }: { value: number }) => {
            if (!value) return null;
            return prettyBytes(value);
          },
        },
        {
          accessor: "timestamp_ms",
          Header: "Modified",
          minWidth: 200,
          Cell: ({ value }: { value: number }) => {
            if (!value) return null;
            return new Date(value).toLocaleString();
          },
        },
      ];
    }
    return [];
  }, [initData]);

  const readonlyData = useMemo<Entity[]>(() => initData || [], [initData]);

  // @ts-ignore
  const tableInstance = useTable({ columns, data: readonlyData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <Table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          const trCls = cls({ shaded: i % 2 === 0 });
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className={trCls}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TableView;
