import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Preset, PresetsService } from '../presets.service';

const NO_PRESET_ID = -1;

@Component({
  selector: 'app-preset-list',
  templateUrl: './preset-list.component.html',
  styleUrls: ['./preset-list.component.scss']
})
export class PresetListComponent implements OnInit {
  @Input() presets: Preset[] = [];
  @Output() addPreset = new EventEmitter();
  editPresetId = NO_PRESET_ID;

  constructor(private presetsService: PresetsService) { }

  ngOnInit() {
  }

  onAddPresetClick() {
    this.addPreset.emit();
  }

  toggleEditPreset(presetId: number) {
    this.editPresetId = presetId === this.editPresetId
      ? NO_PRESET_ID
      : presetId;
  }

  renderPresetName(preset: Preset) {
    const label = preset.quickLoadLabel ?
      `(${preset.quickLoadLabel})`
      : '';
    return label
      ? `${preset.name} ${label}`
      : preset.name;
  }
}
