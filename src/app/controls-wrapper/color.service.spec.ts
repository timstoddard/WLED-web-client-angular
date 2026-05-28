import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ColorService, CurrentColor } from './color.service';
import { AppStateService } from '../shared/app-state/app-state.service';
import { SegmentApiService } from '../shared/api-service/segment-api.service';

describe('ColorService', () => {
  let service: ColorService;
  let mockColorPicker: any;
  let mockSegmentApiService: any;
  let mockAppStateService: any;

  beforeEach(() => {
    mockColorPicker = {
      color: {
        set: jasmine.createSpy(),
        setChannel: jasmine.createSpy(),
        hexString: '#ff0000',
        rgb: { r: 255, g: 0, b: 0 },
        kelvin: 6500,
        value: 100,
      },
      on: jasmine.createSpy(),
      off: jasmine.createSpy(),
      emit: jasmine.createSpy(),
    };

    mockSegmentApiService = {
      setColor: jasmine.createSpy().and.returnValue(of(null)),
      setWhiteBalance: jasmine.createSpy().and.returnValue(of(null)),
    };

    mockAppStateService = {
      getInfo: jasmine.createSpy().and.returnValue(of({
        ledInfo: { lightCapabilities: {} }
      })),
    };

    TestBed.configureTestingModule({
      providers: [
        ColorService,
        { provide: AppStateService, useValue: mockAppStateService },
        { provide: SegmentApiService, useValue: mockSegmentApiService },
      ],
    });
    service = TestBed.inject(ColorService);
    service.setColorPicker(mockColorPicker);
  });

  describe('setColorPicker', () => {
    it('registers color:change listener on new picker', () => {
      expect(mockColorPicker.on).toHaveBeenCalledWith('color:change', service.emitNewColor);
    });

    it('removes listener from old picker before setting new one', () => {
      const newPicker = { ...mockColorPicker, on: jasmine.createSpy(), off: jasmine.createSpy() };
      service.setColorPicker(newPicker);
      expect(mockColorPicker.off).toHaveBeenCalledWith('color:change', service.emitNewColor);
    });
  });

  describe('setColorPickerColor', () => {
    it('calls color.set when hsv value > 0', () => {
      service.setColorPickerColor('#ff0000');
      expect(mockColorPicker.color.set).toHaveBeenCalled();
    });

    it('sets hsv value to 0 when color value is 0', () => {
      service.setColorPickerColor('#000000');
      expect(mockColorPicker.color.setChannel).toHaveBeenCalledWith('hsv', 'v', 0);
    });
  });

  describe('setWhiteChannel', () => {
    it('updates white channel when value differs', () => {
      service.setWhiteChannel(100);
      expect(mockColorPicker.emit).toHaveBeenCalledWith('color:change');
    });

    it('does not emit when value is the same', () => {
      service.setWhiteChannel(0); // already 0
      expect(mockColorPicker.emit).not.toHaveBeenCalled();
    });

    it('does not emit when shouldCallApi is false', () => {
      service.setWhiteChannel(100, false);
      expect(mockColorPicker.emit).not.toHaveBeenCalled();
    });
  });

  describe('validateAndSetHex', () => {
    it('returns true for valid 6-digit hex', () => {
      expect(service.validateAndSetHex('ff0000')).toBe(true);
    });

    it('returns true for valid 6-digit hex with #', () => {
      expect(service.validateAndSetHex('#ff0000')).toBe(true);
    });

    it('returns true for valid 3-digit hex', () => {
      expect(service.validateAndSetHex('f00')).toBe(true);
    });

    it('returns true for valid 8-digit hex and parses white channel', () => {
      expect(service.validateAndSetHex('ff0000ff')).toBe(true);
    });

    it('returns false for invalid hex string', () => {
      expect(service.validateAndSetHex('zzzzzz')).toBe(false);
    });

    it('returns false for wrong length (e.g. 5 digits)', () => {
      expect(service.validateAndSetHex('ff000')).toBe(false);
    });

    it('trims whitespace before validating', () => {
      expect(service.validateAndSetHex('  ff0000  ')).toBe(true);
    });

    it('sets white channel to 0 for 6-digit hex', () => {
      service.validateAndSetHex('ff0000');
      const colors: CurrentColor[] = [];
      service.getCurrentColorData().subscribe(c => colors.push(c));
      service.emitNewColor();
      expect(colors[0].whiteChannel).toBe(0);
    });

    it('parses white channel correctly for 8-digit hex', () => {
      service.validateAndSetHex('ff0000ff');
      const colors: CurrentColor[] = [];
      service.getCurrentColorData().subscribe(c => colors.push(c));
      service.emitNewColor();
      expect(colors[0].whiteChannel).toBe(255);
    });
  });

  describe('emitNewColor', () => {
    it('emits current color data to subscribers', () => {
      const colors: CurrentColor[] = [];
      service.getCurrentColorData().subscribe(c => colors.push(c));
      service.emitNewColor();
      expect(colors.length).toBe(1);
      expect(colors[0].rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('pads white channel hex to 2 digits', () => {
      service.setWhiteChannel(5, false);
      const colors: CurrentColor[] = [];
      service.getCurrentColorData().subscribe(c => colors.push(c));
      service.emitNewColor();
      expect(colors[0].hex).toMatch(/05$/);
    });

    it('calls segmentApiService.setColor with correct args', () => {
      service.emitNewColor();
      expect(mockSegmentApiService.setColor)
        .toHaveBeenCalledWith(255, 0, 0, 0, 0);
    });
  });

  describe('setSlot', () => {
    it('updates selected slot', () => {
      service.setSlot(2);
      service.emitNewColor();
      expect(mockSegmentApiService.setColor)
        .toHaveBeenCalledWith(jasmine.any(Number), jasmine.any(Number), jasmine.any(Number), jasmine.any(Number), 2);
    });
  });
});
