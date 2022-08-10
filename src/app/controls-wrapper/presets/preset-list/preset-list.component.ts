import { Component, Input, OnInit } from '@angular/core';
import { Preset, PresetsService } from '../presets.service';

@Component({
  selector: 'app-preset-list',
  templateUrl: './preset-list.component.html',
  styleUrls: ['./preset-list.component.scss']
})
export class PresetListComponent implements OnInit {
  @Input() presets: Preset[] = [];

  constructor(private presetsService: PresetsService) { }

  ngOnInit() {
  }
}
