import styled from "styled-components";
import { Entity } from "./service";

import dirSvg from "./dir.svg";
import { useSearchParams } from "react-router-dom";

const DirImg = styled.img`
  width: 20px;
  height: 20px;
  margin: 0 5px -4px 0;
`;

type EntitySummaryProps = { entity: Entity };

const removeTrailingSlash = (s: string) => s.replace(/\/$/, "");

const EntitySummary = ({ entity }: EntitySummaryProps) => {
  const [searchParams] = useSearchParams();
  const parentUrl = searchParams.get("od");

  const { name, is_directory: isDirectory } = entity;
  const url = [removeTrailingSlash(parentUrl as string), name].join("/");

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
