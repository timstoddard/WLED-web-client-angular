import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WledApiResponse } from '../../shared/api-types';
import { ApiService } from '../../shared/api.service';
import { Segment } from '../../shared/app-types';
import { ControlsServicesModule } from '../controls-services.module';
import { findRouteData, getInput } from '../utils';

@Injectable({ providedIn: ControlsServicesModule })
export class SegmentsService {
  constructor (
    private apiService: ApiService,
    private route: ActivatedRoute) {}

  getSegments() {
    const segments = (findRouteData('data', this.route) as WledApiResponse).state.seg;
    const formattedSegments = [];
    let i = 0;
    for (const segment of segments) {
      // add a test name // TODO for later, what default?
      const withName: Segment = Object.assign({}, segment, { name: `seg ${i++}` });
      formattedSegments.push(withName);
    }
    return [
      formattedSegments[0],
      formattedSegments[0],
      formattedSegments[0],
      formattedSegments[0],
      formattedSegments[0],
      formattedSegments[0],
      formattedSegments[0],
      formattedSegments[0],
      formattedSegments[0],
      formattedSegments[0],
    ];
  }

  selSegEx(segmentId: number, lastSegment: number) {
    const seg = [];
    for (let i = 0; i <= lastSegment; i++) {
      seg.push({ sel: i === segmentId });
    }
    const obj = { seg: seg };
    this.requestJson(obj);
  }

  selSeg(segmentId: number, isSelected: boolean) {
    const obj = { seg: { id: segmentId, sel: isSelected } };
    this.requestJson(obj, false);
  }

  setSeg(segmentId: number) {
    const name = getInput(`seg${segmentId}t`).value;
    const start = parseInt(getInput(`seg${segmentId}s`)!.value);
    const stop = parseInt(getInput(`seg${segmentId}e`)!.value);
    if (stop <= start) {
      this.delSeg(segmentId);
      return;
    }
    const obj = {
      seg: {
        id: segmentId,
        n: name,
        start: start,
        // TODO get config value somehow
        stop: 0, // (this.cfg.comp.seglen ? start : 0) + stop,
        // added these 3 to appease typescript
        grp: 0,
        spc: 0,
        of: 0,
      },
    };
    if (getInput(`seg${segmentId}grp`)) {
      const grp = parseInt(getInput(`seg${segmentId}grp`).value);
      const spc = parseInt(getInput(`seg${segmentId}spc`).value);
      const ofs = parseInt(getInput(`seg${segmentId}of`).value);
      obj.seg.grp = grp;
      obj.seg.spc = spc;
      obj.seg.of = ofs;
    }
    this.requestJson(obj);
  }

  delSeg(segmentId: number) {
    var obj = {
      seg: {
        id: segmentId,
        stop: 0,
      },
    };
    this.requestJson(obj, false);
  }

  setRev(segmentId: number) {
    // const rev = document.getElementById(`seg${segmentId}rev`)!.checked;
    const rev = true;
    const obj = { seg: { id: segmentId, rev: rev } };
    this.requestJson(obj, false);
  }

  setMi(segmentId: number) {
    // const mi = document.getElementById(`seg${segmentId}mi`)!.checked;
    const mi = true;
    const obj = { seg: { id: segmentId, mi: mi } };
    this.requestJson(obj, false);
  }

  setSegPwr(segmentId: number) {
    // TODO toggle segment power and call api to update
    // var obj = { seg: { id: segmentId, on: !powered[segmentId] } };
    // this.requestJson(obj);
  }

  setSegBri(segmentId: number) {
    // const bri = parseInt(getInput(`seg${segmentId}bri`)!.value);
    const bri = 1;
    var obj = { seg: { id: segmentId, bri: bri } };
    this.requestJson(obj);
  }

  private requestJson = (a: any, b?: boolean) => '';
}
