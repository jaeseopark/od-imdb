import styled from "styled-components";
import { Entity } from "./service";

import dirSvg from "./dir.svg";

const DirImg = styled.img`
  width: 20px;
  height: 20px;
  margin: 0 5px -4px 0;
`;

const EntitySummary = ({ entity }: { entity: Entity }) => {
  const { name, is_directory: isDirectory, parent_url } = entity;
  const url = [parent_url, name].join("/");

  if (isDirectory) {
    return (
      <div>
        <DirImg src={dirSvg} />
        <a href={`?od=${url}`}>{name}</a>
      </div>
    );
  }

  // leaf node
  return <a href={url}>{name}</a>;
};

export default EntitySummary;
