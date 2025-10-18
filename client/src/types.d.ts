import type { Edge, Node } from "@xyflow/react";

export {};
// Extend the Window interface to include GRAPH_DATA
declare global {
  interface Window {
    GRAPH_DATA: {
      metadata: Metadata;
      graph: {
        title: string;
        nodes: Node[];
        edges: Edge[];
      };
    };
  }
}

export type GraphData = {
  title: string;
  nodes: Node[];
  edges: Edge[];
};

export type ProjectRecord = {
  id: string;
  name: string;
  path: string;
  createdAt: string; // ISO
  graph: GraphData;
};

type Metadata = {
  projectType: string;
  framework: string;
  ignorePatterns: string[];
  description: string;
};
