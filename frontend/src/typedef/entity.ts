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
