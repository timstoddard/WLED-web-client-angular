import { Component, OnInit } from '@angular/core';
import { Preset, PresetsService } from '../presets.service';

@Component({
  selector: 'app-preset-quick-load',
  templateUrl: './preset-quick-load.component.html',
  styleUrls: ['./preset-quick-load.component.scss']
})
export class PresetQuickLoadComponent implements OnInit {
  presets: Preset[] = [];

  constructor(private presetsService: PresetsService) { }

  ngOnInit() {
    this.presets = this.presetsService.getPresets();
  }

  loadPreset(presetId: number) {
    this.presetsService.loadPreset(presetId);
  }
}
