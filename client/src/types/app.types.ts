export interface FlowData {
  metadata: Metadata;
  graph: Graph;
}

export interface Graph {
  title: string;
  nodes: Node[];
  edges: Edge[];
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface Node {
  id: string;
  position: Position;
  data: NodeData;
}

export interface NodeData {
  label: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Metadata {
  projectType: string;
  framework: string;
  ignorePatterns: string[];
  description: string;
}

export interface FlowOverview {
  title: string;
  projectName: string;
  framework: string;
  dateTime: string;
  fileHash: string;
}

export interface SaveFlowBody {
  title: string;
  data: FlowData;
}

export type Flatten<T, K extends keyof T> = T[K];
