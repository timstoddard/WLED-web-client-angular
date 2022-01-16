import { Component, Input, OnInit } from '@angular/core';

export interface Node {
  name: string;
  type: number;
  ip: any; // TODO type (string?)
  vid: number;
}

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class NodesComponent implements OnInit {
  @Input() nodes: Node[] = [];
  @Input() info: any; // TODO type

  constructor() { }

  ngOnInit() {
    // TODO can we presort nodes?
    this.nodes.sort((a, b) => (a.name).localeCompare(b.name));
  }

  getName(node: Node) {
    return node.name === 'WLED'
      ? node.ip
      : node.name;
  }

  getType(nodeType: number) {
    switch (nodeType) {
      case 32:
        return 'ESP32';
      case 82:
        return 'ESP8266';
      default:
        return '?'; // TODO better default? (maybe "unknown"?)
    }
  }
}
