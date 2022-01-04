import prettyBytes from "pretty-bytes";
import { Column } from "react-table";
import { Entity } from "../../typedef/entity";
import EntitySummary from "../row/EntitySummary";
import MovieSummary from "../row/MovieSummary";

const COLUMNS: Column<Entity>[] = [
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

export default COLUMNS;
