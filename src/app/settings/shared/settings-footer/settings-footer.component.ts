import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-settings-footer',
  templateUrl: './settings-footer.component.html',
  styleUrls: ['./settings-footer.component.scss']
})
export class SettingsFooterComponent implements OnInit {
  @Output() save = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  onSave() {
    this.save.emit();
  }
}
