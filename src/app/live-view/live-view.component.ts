import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {

  // TODO this component should contain an implementation for live view
  // both WITH and WITHOUT web sockets. see existing html files:
  // liveview.htm & liveviewws.htm

  constructor() { }

  ngOnInit(): void {
  }

}
