export {};
// Extend the Window interface to include GRAPH_DATA
declare global {
  interface Window {
    GRAPH_DATA: {
      title: string;
      nodes: any[];
      edges: any[];
    };
  }
}
