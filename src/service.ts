export type Entity = {
  name: string;
  parent_url: string;
  is_directory: boolean;
  timestamp_ms: number;
  size?: number;
  title?: string;
  rating?: number;
  votes?: number;
  year?: number;
  end_year?: number;
  genre?: string[];
  external_link?: string;
};

const removeTrailingSlash = (s: string) => s.replace(/\/$/, "");

export const fetchData = (od: string): Promise<Entity[]> => {
  const encodedUri = encodeURIComponent(od);
  return fetch(`http://localhost:2014/lookup?od=${encodedUri}`)
    .then((r) => r.json())
    .then((json: { entities: Entity[] }) => json.entities)
    .then((entities) =>
      entities.map((entity) => ({
        ...entity,
        parent_url: removeTrailingSlash(entity.parent_url),
      }))
    );
};
