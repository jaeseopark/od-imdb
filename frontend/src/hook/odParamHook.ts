import { useSearchParams } from "react-router-dom";

const removeTrailingSlash = (s: string) => decodeURI(s).replace(/\/$/, "");

export const useOpenDirectoryParam = () => {
  const [params] = useSearchParams();
  const od = params.get("od");
  if (od) {
    return removeTrailingSlash(decodeURIComponent(od));
  }
  return null;
};
