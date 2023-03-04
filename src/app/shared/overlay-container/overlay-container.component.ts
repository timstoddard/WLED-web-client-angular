import { Component, HostBinding, Input } from '@angular/core';
import { fade } from '../../shared/animations';

@Component({
  selector: 'app-overlay-container',
  templateUrl: './overlay-container.component.html',
  styleUrls: ['./overlay-container.component.scss'],
  animations: [fade()],
})
export class OverlayContainerComponent {
  @Input() isOpen = false;
  @Input() hasTopBorderRadius = false;
  @HostBinding('@fade') get getIsOpen(): boolean {
    return this.isOpen;
  }
  // TODO make top border radius toggle-able
  // @HostBinding('style.borderTopLeftRadius') get left() {
  //   return this.hasTopBorderRadius ? '' : 0;
  // }
  // @HostBinding('style.borderTopRightRadius') get right() {
  //   return this.hasTopBorderRadius ? '' : 0;
  // }
}
