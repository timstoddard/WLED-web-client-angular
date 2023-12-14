import { OriginConnectionPosition, OverlayConnectionPosition, ConnectionPositionPair } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OverlayPositionService {
  private originLeftBottom: OriginConnectionPosition = {
    originX: 'start',
    originY: 'bottom',
  };
  private overlayLeftTop: OverlayConnectionPosition = {
    overlayX: 'start',
    overlayY: 'top',
  };
  private originCenterBottom: OriginConnectionPosition = {
    originX: 'center',
    originY: 'bottom',
  };
  private overlayCenterTop: OverlayConnectionPosition = {
    overlayX: 'center',
    overlayY: 'top',
  };
  private originRightBottom: OriginConnectionPosition = {
    originX: 'end',
    originY: 'bottom',
  };
  private overlayRightTop: OverlayConnectionPosition = {
    overlayX: 'end',
    overlayY: 'top',
  };
  private originCenter: OriginConnectionPosition = {
    originX: 'center',
    originY: 'center',
  };
  private overlayCenter: OverlayConnectionPosition = {
    overlayX: 'center',
    overlayY: 'center',
  };

  private createConnectionPositionPair = (origin: OriginConnectionPosition, overlay: OverlayConnectionPosition) =>
    (offsetXPx = 0, offsetYPx = 0) =>
      new ConnectionPositionPair(origin, overlay, offsetXPx, offsetYPx);

  leftBottomPosition = this.createConnectionPositionPair(this.originLeftBottom, this.overlayLeftTop);
  centerBottomPosition = this.createConnectionPositionPair(this.originCenterBottom, this.overlayCenterTop);
  rightBottomPosition = this.createConnectionPositionPair(this.originRightBottom, this.overlayRightTop);
  centeredPosition = this.createConnectionPositionPair(this.originCenter, this.overlayCenter);
}
