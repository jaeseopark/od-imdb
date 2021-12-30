import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { fetchData, Entity } from "./service";
import TableView from "./TableView";

const DivWithMargin = styled.div`
  margin: 20px;
`;

function App() {
  const [searchParams] = useSearchParams();
  const [od] = useState<string | null>(searchParams.get("od"));
  const [data, setData] = useState<Entity[]>();

  useEffect(() => {
    if (od) {
      fetchData(od).then(setData);
    }
  }, [od]);

  let content;

  if (!od) {
    content = (
      <p>
        You have not specified the <b>?od=</b> query parameter.
      </p>
    );
  } else if (!data) {
    content = <p>Fetching...</p>;
  } else {
    const newOd = od.substring(0, od.lastIndexOf("/"));
    content = (
      <div>
        <div>
          <a href={`?od=${newOd}`}>Back</a>
        </div>
        <TableView initData={data} />
      </div>
    );
  }

  return <DivWithMargin>{content}</DivWithMargin>;
}

export default App;
