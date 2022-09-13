import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-settings-header',
  templateUrl: './settings-header.component.html',
  styleUrls: ['./settings-header.component.scss']
})
export class SettingsHeaderComponent implements OnInit {
  @Input() helpUrl!: string;
  @Output() save = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  onSave() {
    this.save.emit();
  }
}
