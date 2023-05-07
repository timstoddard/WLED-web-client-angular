import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-settings-header',
  templateUrl: './settings-header.component.html',
  styleUrls: ['./settings-header.component.scss']
})
export class SettingsHeaderComponent {
  @Input() helpUrl!: string;
  @Output() save = new EventEmitter();

  onSave() {
    this.save.emit();
  }
}
