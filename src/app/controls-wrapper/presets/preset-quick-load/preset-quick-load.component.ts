import { Component, Input, OnInit } from '@angular/core';
import { AppPreset } from '../../../shared/app-types/app-presets';
import { PresetsService } from '../presets.service';

@Component({
  selector: 'app-preset-quick-load',
  templateUrl: './preset-quick-load.component.html',
  styleUrls: ['./preset-quick-load.component.scss']
})
export class PresetQuickLoadComponent implements OnInit {
  @Input()
  get presets(): AppPreset[] { return this.presetsWithLabels; }
  set presets(presets: AppPreset[]) {
    // only display presets with a quick load label
    this.presetsWithLabels = presets
      .filter(preset => !!preset.quickLoadLabel);
  }
  private presetsWithLabels: AppPreset[] = [];

  constructor(private presetsService: PresetsService) { }

  ngOnInit() {
  }

  loadPreset(presetId: number) {
    this.presetsService.loadPreset(presetId);
  }
}
