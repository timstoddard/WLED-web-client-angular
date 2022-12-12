import { Component, Input } from '@angular/core';
import { expandFade } from '../../../shared/animations';
import { AppPreset } from '../../../shared/app-types';
import { PresetsService } from '../presets.service';

@Component({
  selector: 'app-preset-list',
  templateUrl: './preset-list.component.html',
  styleUrls: ['./preset-list.component.scss'],
  animations: [expandFade],
})
export class PresetListComponent {
  @Input() presets: AppPreset[] = [];
  showCreateForm: boolean;

  constructor(private presetsService: PresetsService) {
    this.showCreateForm = false;
  }

  toggleCreatePresetForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  toggleExpanded(presetId: number) {
    this.presetsService.togglePresetExpanded(presetId);
  }

  renderPresetName(preset: AppPreset) {
    const label = preset.quickLoadLabel ?
      `(${preset.quickLoadLabel})`
      : '';
    return label
      ? `${preset.name} ${label}`
      : preset.name;
  }

  expandAll() {
    this.presetsService.expandAll();
  }

  collapseAll() {
    this.presetsService.collapseAll();
  }
}
