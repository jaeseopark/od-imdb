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
  runtime_minutes?: number;

  // optional fields (not on the server side)
  bitrate?: number;
};

const populateBitrate = (entity: Entity) => {
  if (entity.size && entity.runtime_minutes) {
    entity.bitrate = (entity.size / entity.runtime_minutes) * (8 / 60);
  }
  return entity;
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
    .then((json: { entities: Entity[] }) => json.entities.map(populateBitrate));
};
