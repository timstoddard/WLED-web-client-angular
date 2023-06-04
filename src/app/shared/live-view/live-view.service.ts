import { Injectable } from '@angular/core';

export interface LiveViewData {
  leds: string[];
  n: number;
}

const FPS_RUNNING_AVG_LIST_MAX_LENGTH = 30;

@Injectable({ providedIn: 'root' }) // TODO create live view services module?
export class LiveViewService {
  private runningAvgFps: number;
  private fpsList: number[];
  private fpsSum: number;
  private lastUpdateTime;

  constructor() {
    this.runningAvgFps = 0;
    this.fpsList = [];
    this.fpsSum = 0;
    this.lastUpdateTime = 0;
  }

  getBackgroundString = (leds: string[]) => {
    const hexList = leds.map(ledData => {
      const hexFormatted = ledData.length > 6
        ? ledData.substring(2)
        : ledData;
      return `#${hexFormatted}`;
    }).join(',');
    return `linear-gradient(90deg,${hexList})`;
  }

  getBackgroundStringFromUint8Array = (arr: Uint8Array) => {
    const length = arr.length;
    const initArrIndex = arr[1] === 2 ? 4 : 2;
    let colors = '';

    const f = (n: number) => Math.floor(n * 1.5);
    for (let i = initArrIndex; i < length; i += 3) {
      const r = f(arr[i]);
      const g = f(arr[i + 1]);
      const b = f(arr[i + 2]);
      colors += `rgb(${r},${g},${b})`;
      if (i < length - 3) {
        colors += ',';
      }
    }
    const backgroundString = `linear-gradient(90deg,${colors})`;
    return backgroundString;
  }

  updateRunningAvgFps = () => {
    // calculate current fps
    const elapsedMs = Date.now() - this.lastUpdateTime;
    const fps = 1000 / elapsedMs;
    this.lastUpdateTime = Date.now();

    // save current fps value
    this.fpsList.push(fps);
    this.fpsSum += fps;

    // only consider most recent fps values for avg calculation
    while (this.fpsList.length > FPS_RUNNING_AVG_LIST_MAX_LENGTH) {
      // remove older fps values
      const removedFps = this.fpsList.shift()!;
      this.fpsSum -= removedFps;
    }

    // recalculate average fps
    const avgFps = Math.floor(this.fpsSum / this.fpsList.length);
    this.runningAvgFps = avgFps;

    return this.runningAvgFps;
  }
}
