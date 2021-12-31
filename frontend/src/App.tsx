import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import OdInputView from "./OdInputView";

import { fetchData, Entity } from "./service";
import TableView from "./TableView";

const DivWithMargin = styled.div`
  margin: 20px;
`;

function App() {
  const [searchParams] = useSearchParams();
  const [od] = useState<string | null>(searchParams.get("od"));
  const [data, setData] = useState<Entity[]>();
  const [error, setError] = useState();

  useEffect(() => {
    if (od) {
      fetchData(od)
        .then(setData)
        .catch((e) => {
          console.log(e);
          setError(e);
        });
    }
  }, [od]);

  let content;
  if (error) {
    content = <p>Uh oh, something went wrong 😢</p>;
  } else if (!od) {
    content = <OdInputView />;
  } else if (!data) {
    content = <h1>Fetching...</h1>;
  } else {
    content = <TableView initData={data} />;
  }

  return <DivWithMargin>{content}</DivWithMargin>;
}

export default App;
