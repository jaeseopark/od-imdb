import { useSearchParams } from "react-router-dom";

const Breadcrumb = () => {
  const [searchParams] = useSearchParams();
  const od = searchParams.get("od") as string;
  const newOd = od.substring(0, od.lastIndexOf("/"));

  // TODO: more granular navigation

  return (
    <div>
      <a href={`?od=${newOd}`}>Back</a>
    </div>
  );
};

export default Breadcrumb;
