import {
  AUTO_STYLE,
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';

const ANIMATION_DURATION_MS = 250;

export const expandFade = trigger('expand', [
  transition(':enter', [
    style({
      height: 0,
      opacity: 0,
    }),
    animate(`${ANIMATION_DURATION_MS}ms`, style({
      height: AUTO_STYLE,
      opacity: 0,
    })),
    animate(`${ANIMATION_DURATION_MS}ms`, style({
      height: AUTO_STYLE,
      opacity: 1,
    })),
  ]),
  transition(':leave', [
    style({
      height: AUTO_STYLE,
      opacity: 1,
    }),
    animate(`${ANIMATION_DURATION_MS}ms`, style({
      height: AUTO_STYLE,
      opacity: 0,
    })),
    animate(`${ANIMATION_DURATION_MS}ms`, style({
      height: 0,
      opacity: 0,
    })),
  ]),
]);
