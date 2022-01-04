import styled from "styled-components";
import { useOpenDirectoryParam } from "../hook/odParamHook";

const SpacedLabel = styled.label`
  margin: 0 5px;
`;

const RecursiveBreadcrumb = ({
  url,
  readonly,
}: {
  url: URL;
  readonly?: boolean;
}) => {
  const lastComponent = url.pathname.split("/").pop();

  const getParent = () => {
    const parentPath = url.pathname.substring(0, url.pathname.lastIndexOf("/"));
    if (parentPath.length === 0) {
      return <a href={`?od=${url.origin}`}>{url.hostname}</a>;
    }
    return <RecursiveBreadcrumb url={new URL(parentPath, url.origin)} />;
  };

  const getComponentName = () => {
    if (readonly) {
      return <label>{lastComponent}</label>;
    }
    return <a href={`?od=${url.href}`}>{lastComponent}</a>;
  };

  return (
    <span>
      {getParent()}
      <SpacedLabel>/</SpacedLabel>
      {getComponentName()}
    </span>
  );
};

const Breadcrumb = () => {
  const od = useOpenDirectoryParam() as string;
  return <RecursiveBreadcrumb url={new URL(od)} readonly />;
};

export default Breadcrumb;
