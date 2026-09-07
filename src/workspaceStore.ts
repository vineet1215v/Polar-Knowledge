export type SourceType = "publication" | "dataset" | "expedition" | "media" | "event" | "station" | "researcher";

export interface WorkspaceSource {
  id: string;
  type: SourceType;
  title: string;
  meta: string;
  version?: string;
  date?: string;
  origin?: string;
}

export const typeIcon: Record<SourceType, string> = {
  publication: "",
  dataset: "",
  expedition: "",
  media: "",
  event: "",
  station: "",
  researcher: "",
};
