import { useEffect, useState } from "react";
import styled from "styled-components";
import OdInputView from "./OdInputView";
import { useOpenDirectoryParam } from "./odParamHook";

import { fetchData, Entity } from "./service";
import TableView from "./TableView";

const AppDiv = styled.div`
  margin: 20px;
`;

function App() {
  const odParam = useOpenDirectoryParam();
  const [od] = useState<string | null>(odParam);
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
    content = <TableView entities={data} />;
  }

  return <AppDiv>{content}</AppDiv>;
}

export default App;
