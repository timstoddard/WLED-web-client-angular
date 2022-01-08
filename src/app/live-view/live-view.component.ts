import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {
  @ViewChild('liveView') liveViewCanvas!: ElementRef<HTMLCanvasElement>;
  updateTimeout: number = 0;
  // TODO how to figure this out?
  private hasWebSocket: boolean = false;

  constructor() { }

  ngOnInit() {
    if (this.hasWebSocket) {
      this.updateWithWebSocket();
    } else {
      this.update();
    }
  }

  /**
   * Updates canvas to show live LED view. Does not use web sockets.
   */
  private update() {
    // if (document.hidden) {
    //   clearTimeout(this.updateTimeout);
    //   this.updateTimeout = setTimeout(this.update, 250) as unknown as number;
    //   return;
    // }

    // TODO wire up after creating API for this
    fetch('/json/live')
      .then(res => {
        if (!res.ok) {
          clearTimeout(this.updateTimeout);
          this.updateTimeout = setTimeout(this.update, 2500) as unknown as number;
        }
        return res.json();
      })
      .then(json => {
        // TODO
        // this logic was written to fill the background of a div, need to translate it to work with a canvas
        const len = json.leds.length;
        let str = "linear-gradient(90deg,";
        for (let i = 0; i < len; i++) {
          let leddata = json.leds[i];
          if (leddata.length > 6)
            leddata = leddata.substring(2);
          str += "#" + leddata;
          if (i < len - 1)
            str += ","
        }
        str += ")";
        this.liveViewCanvas.nativeElement.style.background = str;
        clearTimeout(this.updateTimeout);
        // TODO make this value (40) configurable?
        this.updateTimeout = setTimeout(this.update, 40) as unknown as number;
      })
      .catch(() => {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(this.update, 2500) as unknown as number;
      });
  }

  /**
   * Updates canvas to show live LED view. Uses web sockets.
   */
  private updateWithWebSocket() {
    // TODO rewrite this so it works
    /*const ws = top.window.ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.info("Use top WS for peek");
      ws.send("{'lv':true}");
    } else {
      console.info("Peek ws opening");
      ws = new WebSocket("ws://" + document.location.host + "/ws");
      ws.onopen = () => {
        console.info("Peek WS opened");
        ws.send("{'lv':true}");
      }
    }
    ws.addEventListener('message', this.getLiveJson);*/
  }

  private getLiveJson(event: any) {
    try {
      const json = JSON.parse(event.data);
      if (json && json.leds) {
        requestAnimationFrame(() => this.updatePreview(json.leds));
      }
    }
    catch (err) {
      console.error("Live-Preview ws error:", err);
    }
  }

  private updatePreview(leds: any[]) {
    const len = leds.length;
    let str = "linear-gradient(90deg,";
    for (let i = 0; i < len; i++) {
      let leddata = leds[i];
      if (leddata.length > 6) leddata = leddata.substring(2);
      str += "#" + leddata;
      if (i < len - 1) str += ","
    }
    str += ")";
    this.liveViewCanvas.nativeElement.style.background = str;
  }
}
