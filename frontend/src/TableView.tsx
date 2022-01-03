import { useMemo } from "react";
import cls from "classnames";
import { Column, TableInstance, useTable } from "react-table";
import prettyBytes from "pretty-bytes";

import { Entity } from "./service";
import MovieSummary from "./MovieSummary";
import EntitySummary from "./EntitySummary";

import styled from "styled-components";
import Breadcrumb from "./Breadcrumb";

type TableViewProps = {
  entities: Entity[];
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

const getColumns = (): Column<Entity>[] => {
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
      Cell: ({ row }: { row: { original: Entity } }) => (
        <MovieSummary data={row.original} />
      ),
    },
    {
      accessor: "bitrate",
      Header: "Avg kbps",
      Cell: ({ row }: { row: { original: Entity } }) => {
        if (row.original.bitrate) {
          return Math.round(row.original.bitrate / 1000);
        }
        return null;
      },
    },
    {
      accessor: "size",
      Header: "Size",
      Cell: ({ value }: { value: number }) => {
        if (!value) return null;
        return prettyBytes(value);
      },
    },
    {
      accessor: "timestamp_ms",
      Header: "Modified (UTC)",
      Cell: ({ value }: { value: number }) => {
        if (!value) return null;
        return new Date(value).toUTCString();
      },
    },
  ];
};

const TableElement = ({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
}: TableInstance<Entity>) => (
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

const TableView = ({ entities }: TableViewProps) => {
  const columns = useMemo(() => getColumns(), []);
  const data = useMemo(() => entities, [entities]);
  const tableInstance = useTable({ columns, data });

  return (
    <div>
      <div>
        <Breadcrumb />
      </div>
      <div>
        <TableElement {...tableInstance} />
      </div>
    </div>
  );
};

export default TableView;
