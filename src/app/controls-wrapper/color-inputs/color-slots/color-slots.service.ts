import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { UnsubscriberService } from '../../../shared/unsubscribing/unsubscriber.service';
import { ColorService, CurrentColor } from '../../color.service';

const DEFAULT_SLOT_COUNT = 3;
const DEFAULT_SLOT = 0;
const DEFAULT_COLORS = [
  'ffffff',
  'ffffff',
  'ffffff',
];
const DEFAULT_WHITE_CHANNELS = [0, 0, 0];

@Injectable()
export class ColorSlotsService extends UnsubscriberService {
  private selectedColor$: BehaviorSubject<string>;
  private slots: number[] = [];
  private selectedSlot = DEFAULT_SLOT;
  private colors = DEFAULT_COLORS;
  private whiteChannels = DEFAULT_WHITE_CHANNELS;

  constructor(
    private colorService: ColorService,
    private appStateService: AppStateService,
  ) {
    super();

    this.selectedColor$ = new BehaviorSubject<string>('');

    this.appStateService.getSelectedSegment(this.ngUnsubscribe)
      .subscribe((segment) => {
        // TODO initialize colors with WledSegment.col from api response
        const slots = [];
        for (let i = 0; i < DEFAULT_SLOT_COUNT; i++) {
          slots.push(i);
        }
        this.slots = slots;
      });

    this.handleUnsubscribe(this.colorService.getCurrentColorData())
      .subscribe(({ hex, whiteChannel }: CurrentColor) => {
        // TODO why does rgb(0,0,0) mess things up
        const hexFormatted = hex.substring(0, 6);
        this.updateSelectedSlot(hexFormatted, whiteChannel);
      });
  }

  /**
   * Selects a color slot.
   * @param slot 0, 1, or 2
   */
  selectSlot(slot: number) {
    this.selectedSlot = slot;

    const hex = this.colors[this.selectedSlot];
    const whiteChannel = this.whiteChannels[this.selectedSlot];
    // console.log('loading slot', slot + 1, hex, whiteChannel)
    this.colorService.setHex(hex, whiteChannel);
    this.colorService.setSlot(slot);

    // TODO is this needed?
    // force slider update on initial load (picker "color:change" not fired if black)
    // if (this.colorService.colorPicker.color.value === 0) {
    //   this.colorService.emitNewColor();
    // }
  }

  updateSelectedSlot(hex: string, whiteChannel: number) {
    this.colors[this.selectedSlot] = hex;
    this.whiteChannels[this.selectedSlot] = whiteChannel;
    this.selectedColor$.next(hex);
  }

  getSelectedSlot() {
    return this.selectedSlot;
  }

  getSelectedColorHex() {
    return this.colors[this.selectedSlot];
  }

  getSelectedWhiteChannel() {
    return this.whiteChannels[this.selectedSlot];
  }

  getSlots() {
    return this.slots;
  }

  getColorHex(slot: number) {
    return this.colors[slot];
  }

  getWhiteChannel(slot: number) {
    return this.whiteChannels[slot];
  }

  // TODO create util function for hex->rgb & vice versa? or use an existing lib?
  getColorRgb(slot: number) {
    // TODO assumes hex is length 6, is this always the case?
    const hex = this.colors[slot];
    const rgb = {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
    return rgb;
  }

  getSelectedColor$() {
    return this.selectedColor$;
  }

  isSlotSelected(slot: number) {
    return slot === this.selectedSlot;
  }
}
