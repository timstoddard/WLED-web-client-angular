export interface WLEDNodesResponse {
  nodes: WLEDNode[];
}

// TODO verify these field types
export interface WLEDNode {
  name: string;
  ip: string;
  type: number;
  vid: string;
}
