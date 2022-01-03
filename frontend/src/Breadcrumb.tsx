import { useOpenDirectoryParam } from "./odParamHook";

const Breadcrumb = () => {
  const od = useOpenDirectoryParam() as string;
  const parentUrl = od.substring(0, od.lastIndexOf("/"));

  // TODO: more granular navigation

  return (
    <div>
      <a href={`?od=${parentUrl}`}>Back</a>
    </div>
  );
};

export default Breadcrumb;
