import { useMemo } from "react";
import cls from "classnames";
import { TableInstance, useTable } from "react-table";
import prettyBytes from "pretty-bytes";

import { Entity } from "./service";
import MovieSummary from "./MovieSummary";
import EntitySummary from "./EntitySummary";

import styled from "styled-components";
import Breadcrumb from "./Breadcrumb";

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

const getColumns = (initData?: Entity[]) => {
  if (!initData) return null;

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
      accessor: "size",
      Header: "Size",
      Cell: ({ value }: { value: number }) => {
        if (!value) return null;
        return prettyBytes(value);
      },
    },
    {
      accessor: "timestamp_ms",
      Header: "Modified",
      Cell: ({ value }: { value: number }) => {
        if (!value) return null;
        return new Date(value).toLocaleString();
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

const Spacer = styled.div``;

const TableView = ({ initData }: TableViewProps) => {
  const readOnlyColumns = useMemo(() => getColumns(initData) || [], [initData]);
  const readOnlyData = useMemo<Entity[]>(() => initData || [], [initData]);
  const tableInstance = useTable({
    // @ts-ignore
    columns: readOnlyColumns,
    data: readOnlyData,
  });

  return (
    <div>
      <div>
        <Breadcrumb />
        <Spacer />
        <div>
          <input type="text" placeholder="search" />
        </div>
      </div>
      <div>
        <TableElement {...tableInstance} />
      </div>
    </div>
  );
};

export default TableView;
