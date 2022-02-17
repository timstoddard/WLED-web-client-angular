import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { AppConfig } from '../../shared/app-config';
import { Segment } from '../../shared/app-types';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';
import { getInput } from '../utils';
import { SegmentsService } from './segments.service';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss'],
})
export class SegmentsComponent extends UnsubscribingComponent implements OnInit {
  @Input() cfg!: AppConfig; // TODO get from service/reducer
  segments: Segment[] = [];
  noNewSegments: boolean = false;
  private lowestUnused!: number;
  private maxSegmentId!: number;
  private maxSeg!: number;
  private confirmedResetSegments = false;
  private ledCount = 0;

  constructor(
    private segmentsService: SegmentsService,
  ) {
    super();
  }

  ngOnInit() {
    this.segmentsService.getSegmentsStore()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((segments) => {
        this.segments = segments.ids
          .map((id: number) => segments.UIEntities[id]);

        this.lowestUnused = 0;
        this.maxSegmentId = 0;
        this.noNewSegments = false;
        this.maxSeg = 0;
    
        // TODO what do this logic do?
        /* for (let i = 0; i < this.segments.length; i++) {
          const segment = this.segments[i];
          let segmentId: number;
          try {
            segmentId = parseInt(`${segment.id}`, 10);
          } catch (e) {
            segmentId = i;
          }
          if (segmentId === this.lowestUnused) {
            this.lowestUnused = segmentId + 1;
          }
          if (segmentId > this.maxSegmentId) {
            this.maxSegmentId = segmentId;
          }
        } */
    
        /* if (this.lowestUnused >= this.maxSeg) {
          this.noNewSegments = true;
        } else if (this.noNewSegments) {
          this.resetUtil();
          this.noNewSegments = false;
        }
        for (let i = 0; i <= this.maxSegmentId; i++) {
          // this.updateLen(i);
          // updateSliderTrail(getInput(`seg${i}bri`));
          // if (this.segments.length < 2) {
          //   document.getElementById(`segd${this.lSeg}`)!.style.display = 'none';
          // }
        } */
      });
  }

  addSegment() {
    // TODO
  }

  deleteSegment(segmentId: number) {
    this.segmentsService.deleteSegment(segmentId);
  }

  // TODO handle adding a segment
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

  // TODO reset add button after add segment form is submitted
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
      ? 'Confirm Reset'
      : 'Reset Segments';
  }

  resetSegments() {
    if (!this.confirmedResetSegments) {
      // bt.style.color = '#f00';
      this.confirmedResetSegments = true;
    } else {
      // bt.style.color = '#fff';
      this.confirmedResetSegments = false;
      this.segmentsService.resetSegments();
    }
  }
}
