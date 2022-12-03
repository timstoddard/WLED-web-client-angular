import {
  AUTO_STYLE,
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';

const ENTER_ANIMATION_DURATION_MS = 420 / 2;
const LEAVE_ANIMATION_DURATION_MS = 420 / 4;

const enterDuration = `${ENTER_ANIMATION_DURATION_MS}ms`;
const leaveDuration = `${LEAVE_ANIMATION_DURATION_MS}ms`;

export const expandFade = trigger('expand', [
  transition(':enter', [
    style({
      height: 0,
      opacity: 0,
    }),
    animate(enterDuration, style({
      height: AUTO_STYLE,
      opacity: 0,
    })),
    animate(enterDuration, style({
      height: AUTO_STYLE,
      opacity: 1,
    })),
  ]),
  transition(':leave', [
    style({
      height: AUTO_STYLE,
      opacity: 1,
    }),
    animate(leaveDuration, style({
      height: AUTO_STYLE,
      opacity: 0,
    })),
    animate(leaveDuration, style({
      height: 0,
      opacity: 0,
    })),
  ]),
]);
