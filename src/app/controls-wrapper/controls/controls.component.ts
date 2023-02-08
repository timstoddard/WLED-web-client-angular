import { Component } from '@angular/core';
import { PresetsService } from '../presets/presets.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {
  constructor(private presetsService: PresetsService) {
  }

  getPresets() {
    return this.presetsService.getPresets();

    /* const presetsList = this.presetsService.getPresets();
    const generatedList = [];
    const PRESET_LIST_MULTIPLIER = 1;
    for (let i = 0; i < PRESET_LIST_MULTIPLIER; i++) {
      generatedList.push(...presetsList.map(p => ({
        ...p,
        quickLoadLabel: `${p.quickLoadLabel}_${i}`,
      })));
    }
    return generatedList; */
  }
}
