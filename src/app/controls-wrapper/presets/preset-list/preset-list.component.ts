import { Component, Input } from '@angular/core';
import { Preset, PresetsService } from '../presets.service';

const NO_PRESET_ID = -1;

@Component({
  selector: 'app-preset-list',
  templateUrl: './preset-list.component.html',
  styleUrls: ['./preset-list.component.scss']
})
export class PresetListComponent {
  @Input() presets: Preset[] = [];
  editPresetId: number;
  showCreateForm: boolean;

  constructor(private presetsService: PresetsService) {
    this.editPresetId = NO_PRESET_ID;
    this.showCreateForm = false;
  }

  toggleCreatePresetForm() {
    this.showCreateForm = !this.showCreateForm;
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
