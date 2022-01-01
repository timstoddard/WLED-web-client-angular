import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-settings-header',
  templateUrl: './settings-header.component.html',
  styleUrls: ['./settings-header.component.scss']
})
export class SettingsHeaderComponent implements OnInit {
  @Output() save = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  onSave() {
    this.save.emit();
  }
}
