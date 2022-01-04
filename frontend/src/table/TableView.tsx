import { useMemo } from "react";
import { TableInstance, useTable } from "react-table";
import cls from "classnames";
import styled from "styled-components";

import { Entity } from "../typedef/entity";
import COLUMNS from "./column/init";
import Breadcrumb from "../main/Breadcrumb";

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

type TableViewProps = {
  entities: Entity[];
};

const TableView = ({ entities }: TableViewProps) => {
  const columns = useMemo(() => COLUMNS, []);
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
