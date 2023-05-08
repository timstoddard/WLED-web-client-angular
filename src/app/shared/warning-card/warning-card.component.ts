import { Component, Input, Optional } from '@angular/core';

@Component({
  selector: 'app-warning-card',
  templateUrl: './warning-card.component.html',
  styleUrls: ['./warning-card.component.scss']
})
export class WarningCardComponent {
  @Input() @Optional() title = '';
}
