import { OriginConnectionPosition, OverlayConnectionPosition, ConnectionPositionPair } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OverlayPositionService {
  private originLeft: OriginConnectionPosition = {
    originX: 'start',
    originY: 'bottom',
  };
  private overlayLeft: OverlayConnectionPosition = {
    overlayX: 'start',
    overlayY: 'top',
  };
  private originCenter: OriginConnectionPosition = {
    originX: 'center',
    originY: 'bottom',
  };
  private overlayCenter: OverlayConnectionPosition = {
    overlayX: 'center',
    overlayY: 'top',
  };
  private originRight: OriginConnectionPosition = {
    originX: 'end',
    originY: 'bottom',
  };
  private overlayRight: OverlayConnectionPosition = {
    overlayX: 'end',
    overlayY: 'top',
  };

  private createConnectionPositionPair = (origin: OriginConnectionPosition, overlay: OverlayConnectionPosition) =>
    (offsetXPx = 0, offsetYPx = 0) =>
      new ConnectionPositionPair(origin, overlay, offsetXPx, offsetYPx);

  leftBottomPosition = this.createConnectionPositionPair(this.originLeft, this.overlayLeft);
  centerBottomPosition = this.createConnectionPositionPair(this.originCenter, this.overlayCenter);
  rightBottomPosition = this.createConnectionPositionPair(this.originRight, this.overlayRight);
}
