import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { WledSegment } from '../../shared/api-types';
import { AppConfig } from '../../shared/app-config';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { getInput } from '../utils';
import { SegmentsService } from './segments.service';

const DEFAULT_TRANSITION_TIME = 0.7; // seconds

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss'],
  // need to provide here (child of routed component) so the service can access the activated route
  providers: [SegmentsService],
})
export class SegmentsComponent extends UnsubscribingComponent implements OnInit {
  @Input() cfg!: AppConfig; // TODO get from service/reducer
  transitionTime!: FormControl;
  segments!: WledSegment[];
  noNewSegs: boolean = false;
  private segCount!: number;
  private lowestUnused!: number;
  private lSeg!: number;
  private maxSeg!: number;
  private powered!: boolean[]; // TODO this should be part of segments input array
  private confirmedResetSegments = false;
  private ledCount = 0;

  constructor(
    private segmentsService: SegmentsService,
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    this.segments = this.segmentsService.getSegments();

    this.transitionTime = this.createFormControl();

    this.segCount = 0;
    this.lowestUnused = 0;
    this.lSeg = 0; // probably "last segment"? 
    this.noNewSegs = false;
    this.powered = [true];
    this.maxSeg = 0;

    if (this.segments && this.segments.length > 0) {
      for (let y = 0; y < this.segments.length; y++) {
        this.segCount++;
  
        const inst = this.segments[y];
        // let i = parseInt(inst.id, 10);
        let i = y;
        this.powered[i] = inst.on;
        if (i == this.lowestUnused) {
          this.lowestUnused = i + 1;
        }
        if (i > this.lSeg) {
          this.lSeg = i;
        }
      }
    }

    if (this.lowestUnused >= this.maxSeg) {
      // this.noNewSegs = true;
    } else if (this.noNewSegs) {
      // this.resetUtil();
      // this.noNewSegs = false;
    }
    for (let i = 0; i <= this.lSeg; i++) {
      // this.updateLen(i);
      // updateSliderTrail(getInput(`seg${i}bri`));
      // if (this.segCount < 2) {
      //   document.getElementById(`segd${this.lSeg}`)!.style.display = 'none';
      // }
    }
  }

  updateSegmentSelected(segmentId: number) {
    const isSelected = getInput(`seg${segmentId}sel`).checked;
    this.segmentsService.selSeg(segmentId, isSelected);
  }

  selectSegmentAndUpdateAllSegments(segmentId: number) {
    this.segmentsService.selSegEx(segmentId, this.lSeg);
  }

  deleteSegment(segmentId: number) {
    if (this.segCount < 2) {
      // showToast('You need to have multiple segments to delete one!');
      return;
    }

    // TODO update expanded status
    // this.expanded[segmentId] = false;

    this.segCount--;
    this.segmentsService.delSeg(segmentId);
  }

  private setTransitionTime(seconds: number) {
    // TODO call api
  }

  private createFormControl() {
    const control = this.formBuilder.control(DEFAULT_TRANSITION_TIME);

    control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((seconds: number) => this.setTransitionTime(seconds));

    // trigger setting the name for the selected name
    // setTimeout(() => {
    //   control.setValue(DEFAULT_TRANSITION_VALUE);
    // });

    return control;
  }

  private makeSeg() {
    let ns = 0;
    if (this.lowestUnused > 0) {
      const a = parseInt(getInput(`seg${this.lowestUnused - 1}e`).value, 10);
      const b = this.cfg.comp.seglen
        ? parseInt(getInput(`seg${this.lowestUnused - 1}s`).value, 10)
        : 0;
      const ledCount = a + b;
      if (ledCount < this.ledCount) {
        ns = ledCount;
      }
    }
    let cn = `<div class="seg">
    <div class="segname newseg">
      New segment ${this.lowestUnused}
      <i class="icons edit-icon expanded" onclick="tglSegn(${this.lowestUnused})">&#xe2c6;</i>
    </div>
    <br>
    <div class="segin expanded">
      <input type="text" class="ptxt stxt noslide" id="seg${this.lowestUnused}t" autocomplete="off" maxlength=32 value="" placeholder="Enter name..."/>
      <table class="segt">
        <tr>
          <td class="segtd">Start LED</td>
          <td class="segtd">${this.cfg.comp.seglen ? "Length" : "Stop LED"}</td>
        </tr>
        <tr>
          <td class="segtd"><input class="noslide segn" id="seg${this.lowestUnused}s" type="number" min="0" max="${this.ledCount - 1}" value="${ns}" oninput="updateLen(${this.lowestUnused})"></td>
          <td class="segtd"><input class="noslide segn" id="seg${this.lowestUnused}e" type="number" min="0" max="${this.ledCount - (this.cfg.comp.seglen ? ns : 0)}" value="${this.ledCount - (this.cfg.comp.seglen ? ns : 0)}" oninput="updateLen(${this.lowestUnused})"></td>
        </tr>
      </table>
      <div class="h" id="seg${this.lowestUnused}len">${this.ledCount - ns} LED${this.ledCount - ns > 1 ? "s" : ""}</div>
      <i class="icons e-icon cnf cnf-s half" id="segc${this.lowestUnused}" onclick="setSeg(${this.lowestUnused}); resetUtil();">&#xe390;</i>
    </div>
  </div>`;
    // document.getElementById('segutil').innerHTML = cn;
  }

  private resetUtil() {
    const cn = `
      <button
        class="btn btn-s btn-i"
        (click)="makeSeg()">
        <i class="icons btn-icon">
          &#xe18a;
        </i>
        Add segment
      </button>
      <br>`;
    // document.getElementById('segutil').innerHTML = cn;
  }

  tglSegn(s: number) {
    const segment = document.getElementById(`seg${s}t`)!;
    document.getElementById(`seg${s}t`)!.style.display =
      window.getComputedStyle(segment).display === 'none'
        ? 'inline'
        : 'none';
  }

  // updates segment length upon input of segment values
  private updateLen(s: number) {
    if (!getInput(`seg${s}s`)) {
      return;
    }
    const start = parseInt(getInput(`seg${s}s`).value);
    const stop = parseInt(getInput(`seg${s}e`).value);
    const len = stop - (this.cfg.comp.seglen ? 0 : start);
    let out = '(delete)';
    if (len > 1) {
      out = `${len} LEDs`;
    } else if (len === 1) {
      out = '1 LED';
    }

    if (getInput(`seg${s}grp`) !== null) {
      const spc = parseInt(getInput(`seg${s}spc`).value);
      let grp = parseInt(getInput(`seg${s}grp`).value);
      if (grp === 0) {
        grp = 1;
      }
      const virt = Math.ceil(len / (grp + spc));
      if (!isNaN(virt) && (grp > 1 || spc > 0)) {
        out += ` (${virt} virtual)`;
      }
    }

    document.getElementById(`seg${s}len`)!.innerHTML = out;
  }

  getResetButtonText() {
    return this.confirmedResetSegments
      ? 'Confirm reset'
      : 'Reset segments';
  }

  resetSegments() {
    if (!this.confirmedResetSegments) {
      // bt.style.color = '#f00';
      this.confirmedResetSegments = true;
    } else {
      // bt.style.color = '#fff';
      this.confirmedResetSegments = false;

      // TODO api request
      const obj = {
        seg: [{
          start: 0,
          stop: this.ledCount,
          sel: true,
        }],
      };
      for (let i = 1; i <= this.lSeg; i++) {
        // TODO fix type issue
        obj.seg.push({ stop: 0 } as any);
      }
      // this.requestJson(obj);
    }
  }
}

// TODO remove after using app-color-slider in template (only here to fix type error above)
const updateSliderTrail = (slider: any) => {};
