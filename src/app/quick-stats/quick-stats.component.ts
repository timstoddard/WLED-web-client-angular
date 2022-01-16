import { Component, OnInit } from '@angular/core';

/*
  server.on("/quickStats", HTTP_GET, [](AsyncWebServerRequest *request){
    String version = (String)VERSION);
    String uptime = (String)millis());
    String freeHeap = (String)ESP.getFreeHeap());
    // now put these all into a json object and return it
    // request->send(200, "text/plain", (String)VERSION);
    // request->send(200, "text/plain", (String)millis());
    // request->send(200, "text/plain", (String)ESP.getFreeHeap());
  });
*/

interface QuickStats {
  version: string;
  uptime: string;
  freeHeap: string;
}

interface QuickStatsItem {
  name: string;
  value: string;
}

@Component({
  selector: 'app-quick-stats',
  templateUrl: './quick-stats.component.html',
  styleUrls: ['./quick-stats.component.scss']
})
export class QuickStatsComponent implements OnInit {
  stats: QuickStats;
  items: QuickStatsItem[];

  constructor() {
    this.stats = {
      version: '0.13.0-b6',
      uptime: '7382904321',
      freeHeap: '42TB',
    };
    this.items = this.formatItems(this.stats);
  }

  ngOnInit() {
  }

  private formatItems(stats: QuickStats): QuickStatsItem[] {
    return [
      {
        name: 'Version',
        value: stats.version,
      },
      {
        name: 'Uptime',
        value: stats.uptime,
      },
      {
        name: 'Free Heap Space',
        value: stats.freeHeap,
      },
    ];
  }
}
