import styled from "styled-components";
import { Entity } from "./service";

import dirSvg from "./dir.svg";
import { useOpenDirectoryParam } from "./odParamHook";

const DirImg = styled.img`
  width: 20px;
  height: 20px;
  margin: 0 5px -4px 0;
`;

type EntitySummaryProps = { entity: Entity };

const EntitySummary = ({ entity }: EntitySummaryProps) => {
  const parentUrl = useOpenDirectoryParam();

  const { name, is_directory: isDirectory } = entity;
  const url = [parentUrl, name].join("/");

  if (isDirectory) {
    return (
      <div>
        <DirImg src={dirSvg} />
        <a href={`?od=${url}`}>{name}</a>
      </div>
    );
  }

  return <a href={url}>{name}</a>;
};

export default EntitySummary;
