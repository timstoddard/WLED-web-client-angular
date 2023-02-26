import {
  AUTO_STYLE,
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';

export const expandFade = (
  enterDurationMs = 200,
  leaveDurationMs = 150,
) => trigger('expand', [
  transition(':enter', [
    style({
      height: 0,
      opacity: 0,
    }),
    animate(enterDurationMs, style({
      height: AUTO_STYLE,
      opacity: 0,
    })),
    animate(enterDurationMs, style({
      height: AUTO_STYLE,
      opacity: 1,
    })),
  ]),
  transition(':leave', [
    style({
      height: AUTO_STYLE,
      opacity: 1,
    }),
    animate(leaveDurationMs, style({
      height: AUTO_STYLE,
      opacity: 0,
    })),
    animate(leaveDurationMs, style({
      height: 0,
      opacity: 0,
    })),
  ]),
]);

export const fade = (
  enterDurationMs = 150,
  leaveDurationMs = 150,
  initialScale = 0.9,
) => trigger('fade', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: `scale(${initialScale})`,
    }),
    animate(enterDurationMs, style({
      opacity: 1,
      transform: 'scale(1)',
    })),
  ]),
  transition(':leave', [
    style({
      opacity: 1,
      transform: 'scale(1)',
    }),
    animate(leaveDurationMs, style({
      opacity: 0,
      transform: `scale(${initialScale})`,
    })),
  ]),
]);
