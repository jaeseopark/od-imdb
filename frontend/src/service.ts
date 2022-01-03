export type Entity = {
  name: string;
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

export const fetchData = (od: string): Promise<Entity[]> => {
  const encodedUri = encodeURIComponent(od);
  return fetch(`/api/lookup?od=${encodedUri}`)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
      console.error(r);
      throw new Error();
    })
    .then((json: { entities: Entity[] }) => json.entities);
};
