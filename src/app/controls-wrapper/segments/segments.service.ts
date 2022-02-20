import { Injectable } from '@angular/core';
import { Store, createState } from '@ngneat/elf';
import {
  UIEntitiesRef,
  deleteAllEntities,
  deleteEntities,
  getEntity,
  hasEntity,
  selectAll,
  selectEntities,
  selectEntitiesCount,
  unionEntities,
  updateEntities,
  upsertEntities,
  withEntities,
  withUIEntities,
} from '@ngneat/elf-entities';
import { WledSegment } from '../../shared/api-types';
import { ApiService } from '../../shared/api.service';
import { Segment } from '../../shared/app-types';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UnsubscribingService } from '../../shared/unsubscribing.service';
import { ControlsServicesModule } from '../controls-services.module';

@Injectable({ providedIn: ControlsServicesModule })
export class SegmentsService extends UnsubscribingService {
  private segmentsStore: Store;
  private segmentsLength: number = 0;
  private ledCount: number = 1429; // TODO get this from api data (info.leds.count)

  constructor (
    private apiService: ApiService,
    private localStorageService: LocalStorageService,
  ) {
    super();
    this.segmentsStore = new Store({
      name: 'segments',
      ...createState(withEntities<WledSegment>(), withUIEntities<Segment>()),
    });

    this.segmentsStore
      .combine({
        entities: this.segmentsStore.pipe(selectAll()),
        UIEntities: this.segmentsStore.pipe(selectEntities({ ref: UIEntitiesRef })),
      })
      .pipe(unionEntities());

    this.segmentsStore
      .pipe(selectEntitiesCount())
      .subscribe((count) => {
        this.segmentsLength = count;
      });
  }

  getSegmentsStore() {
    return this.segmentsStore;
  }

  getLastSegment() {
    return this.segmentsStore.query(getEntity(this.segmentsLength - 1, { ref: UIEntitiesRef })) as Segment;
  }

  loadApiSegments(segments: WledSegment[]) {
    for (const segment of segments) {
      let name: string;
      let isExpanded;
      if (this.segmentsStore.query(hasEntity(segment.id, { ref: UIEntitiesRef }))) {
        const {
          name: existingName,
          isExpanded: existingIsExpanded,
        } = this.segmentsStore.query(getEntity(segment.id, { ref: UIEntitiesRef }));
        name = existingName;
        isExpanded = existingIsExpanded;
      } else {
        name = this.loadSegmentName(segment.id);
        isExpanded = false;
      }
      const uiSegment: Segment = {
        ...segment,
        name,
        isExpanded,
      };
      this.segmentsStore.update(
        upsertEntities(segment),
        upsertEntities(uiSegment, { ref: UIEntitiesRef }));
    }
  }

  setSegmentName(segmentId: number, name: string) {
    if (!this.segmentsStore.query(hasEntity(segmentId))) {
      console.warn(`Segment with id ${segmentId}, it does not exist.`);
      return;
    }
    if (!name) {
      name = this.getDefaultName(segmentId);
    }
    this.segmentsStore.update(
      updateEntities(segmentId, segment => segment),
      updateEntities(segmentId, { name }, { ref: UIEntitiesRef }));
    const key = `segment-${segmentId}-name`;
    this.localStorageService.set(key, name);
  }

  selectSegment(segmentId: number, isSelected: boolean) {
    return this.apiService.selectSegment(segmentId, isSelected);
  }

  selectOnlySegment(segmentId: number) {
    return this.apiService.selectOnlySegment(segmentId, this.segmentsLength);
  }

  selectAllSegments() {
    return this.apiService.selectAllSegments(this.segmentsLength);
  }

  toggleSegmentExpanded(segmentId: number) {
    if (!this.segmentsStore.query(hasEntity(segmentId))) {
      console.warn(`Segment with id ${segmentId}, it does not exist.`);
      return;
    }
    this.segmentsStore.update(
      updateEntities(segmentId, segment => segment),
      updateEntities(segmentId, segment => ({
        ...segment,
        isExpanded: !segment.isExpanded,
      }), { ref: UIEntitiesRef }));
  }

  updateSegment(options: {
    segmentId: number,
    name: string,
    start: number,
    stop: number,
    useSegmentLength: boolean,
    offset?: number,
    grouping?: number,
    spacing?: number,
  }) {
    return this.apiService.updateSegment(options);
  }

  deleteSegment(segmentId: number) {
    this.segmentsStore.update(deleteEntities(segmentId));
    if (this.segmentsLength < 2) {
      return null;
    } else {
      this.segmentsStore.update(deleteEntities(segmentId));
      return this.apiService.deleteSegment(segmentId);
    }
  }

  resetSegments() {
    this.segmentsStore.update(deleteAllEntities());
    return this.apiService.resetSegments(this.ledCount, this.segmentsLength);
  }

  setSegmentOn(segmentId: number, isOn: boolean) {
    return this.apiService.setSegmentOn(segmentId, isOn);
  }

  setSegmentBrightness(segmentId: number, brightness: number) {
    return this.apiService.setSegmentBrightness(segmentId, brightness);
  }

  setSegmentReverse(segmentId: number, isReverse: boolean) {
    return this.apiService.setSegmentReverse(segmentId, isReverse);
  }

  setSegmentMirror(segmentId: number, isMirror: boolean) {
    return this.apiService.setSegmentMirror(segmentId, isMirror);
  }

  getSegmentsLength() {
    return this.segmentsLength;
  }

  private loadSegmentName(segmentId: number) {
    let segmentName = this.getDefaultName(segmentId);
    try {
      const key = `SEGMENT_NAME_${segmentId}`;
      const storedSegmentName = this.localStorageService.get(key) as string;
      if (storedSegmentName) {
        segmentName = storedSegmentName;
      }
    } catch (e) {
      console.warn(`Segment name could not be loaded (id ${segmentId})`);
      console.error(e);
    }
    return segmentName;
  }

  private getDefaultName(segmentId: number) {
    return `Segment ${segmentId + 1}`;
  }
}
