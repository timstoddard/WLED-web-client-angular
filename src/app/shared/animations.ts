import {
  AUTO_STYLE,
  trigger,
  style,
  animate,
  transition,
  state,
  group,
  query,
  animateChild,
} from '@angular/animations';

const DEFAULT_ENTER_STEP_DURATION_MS = 180;
const DEFAULT_LEAVE_STEP_DURATION_MS = 150;

export const expandFade = (
  enterDurationMs = DEFAULT_ENTER_STEP_DURATION_MS,
  leaveDurationMs = DEFAULT_LEAVE_STEP_DURATION_MS,
  initialScale = 0.9,
) => trigger('expand', [
  transition(':enter', [
    style({
      height: 0,
      opacity: 0,
    }),
    animate(enterDurationMs, style({
      height: AUTO_STYLE,
      opacity: 0,
      transform: `scale(${initialScale})`,
    })),
    animate(enterDurationMs, style({
      height: AUTO_STYLE,
      opacity: 1,
      transform: 'scale(1)',
    })),
  ]),
  transition(':leave', [
    style({
      height: AUTO_STYLE,
      opacity: 1,
      transform: 'scale(1)',
    }),
    animate(leaveDurationMs / 2, style({
      height: AUTO_STYLE,
      opacity: 0,
      transform: `scale(${initialScale})`,
    })),
    animate(leaveDurationMs, style({
      height: 0,
      opacity: 0,
    })),
  ]),
]);

export const fade = (
  enterDurationMs = DEFAULT_ENTER_STEP_DURATION_MS,
  leaveDurationMs = DEFAULT_LEAVE_STEP_DURATION_MS,
  initialScale = 0.9,
) => trigger('fade', [
  transition(':enter', [
    group([
      style({
        opacity: 0,
        transform: `scale(${initialScale})`,
      }),
      animate(enterDurationMs, style({
        opacity: 1,
        transform: 'scale(1)',
      })),
      query('@*', animateChild(), { optional: true }),
    ])
  ]),
  transition(':leave', [
    group([
      style({
        opacity: 1,
        transform: 'scale(1)',
      }),
      animate(leaveDurationMs, style({
        opacity: 0,
        transform: `scale(${initialScale})`,
      })),
      query('@*', animateChild(), { optional: true }),
    ])
  ]),
]);

export const expandText = (
  expandedFontSizeEm: number,
  minimizedFontSizeEm: number,
  enterDurationMs = DEFAULT_ENTER_STEP_DURATION_MS,
  leaveDurationMs = DEFAULT_LEAVE_STEP_DURATION_MS,
) => trigger('expandText', [
  // expanded
  state('true', style({
    fontSize: `${expandedFontSizeEm}em`,
  })),
  // minimized
  state('false', style({
    fontSize: `${minimizedFontSizeEm}em`,
  })),
  // expand
  transition('0 => 1', animate(enterDurationMs)),
  // minimize
  transition('1 => 0', animate(leaveDurationMs)),
]);

export const expandVerticalPadding = (
  expandedPaddingPx: number,
  minimizedPaddingPx: number,
  enterDurationMs = DEFAULT_ENTER_STEP_DURATION_MS,
  leaveDurationMs = DEFAULT_LEAVE_STEP_DURATION_MS,
) => trigger('expandVerticalPadding', [
  // expanded
  state('true', style({
    paddingBottom: `${expandedPaddingPx}px`,
    paddingTop: `${expandedPaddingPx}px`,
  })),
  // minimized
  state('false', style({
    paddingBottom: `${minimizedPaddingPx}px`,
    paddingTop: `${minimizedPaddingPx}px`,
  })),
  // expand
  transition('0 => 1', group([
    animate(enterDurationMs),
    query('@*', animateChild(), { optional: true }),
  ])),
  // minimize
  transition('1 => 0', group([
    animate(leaveDurationMs),
    query('@*', animateChild(), { optional: true }),
  ])),
]);
