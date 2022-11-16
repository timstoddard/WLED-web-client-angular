import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-expand-icon',
  templateUrl: './expand-icon.component.html',
  styleUrls: ['./expand-icon.component.scss']
})
export class ExpandIconComponent {
  @Input() expanded = false;
  @Output() toggle = new EventEmitter();

  toggleExpanded() {
    this.toggle.emit();
  }
}
