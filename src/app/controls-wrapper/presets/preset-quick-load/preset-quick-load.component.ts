import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { AppPreset } from '../../../shared/app-types/app-presets';
import { PostResponseHandler } from '../../../shared/post-response-handler';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { PresetsService } from '../presets.service';
import { expandFade, expandVerticalPadding, expandText } from '../../../shared/animations';
import { AppStateService } from '../../../shared/app-state/app-state.service';

@Component({
  selector: 'app-preset-quick-load',
  templateUrl: './preset-quick-load.component.html',
  styleUrls: ['./preset-quick-load.component.scss'],
  animations: [
    expandFade(),
    expandText(1.25, 0.9),
    expandVerticalPadding(8, 3),
  ],
})
export class PresetQuickLoadComponent extends UnsubscriberComponent implements OnInit {
  @Input()
  get presets(): AppPreset[] { return this.presetsWithLabels; }
  set presets(presets: AppPreset[]) {
    // only display presets with a quick load label
    this.presetsWithLabels = presets
      .filter(preset => !!preset.quickLoadLabel);
  }
  @Input() title = '';
  isExpanded = true;
  currentPresetId = -1;
  private presetsWithLabels: AppPreset[] = [];

  @HostBinding('@expandVerticalPadding')
  get expandVerticalPadding() { return this.isExpanded; }

  constructor(
    private presetsService: PresetsService,
    private postResponseHandler: PostResponseHandler,
    private appStateService: AppStateService,
  ) {
    super();
  }

  ngOnInit() {
    this.appStateService.getWLEDState(this.ngUnsubscribe)
      .subscribe(({ currentPresetId }) => {
        this.currentPresetId = currentPresetId;
      });
  }

  loadPreset(presetId: number) {
    this.handleUnsubscribe(
      this.presetsService.loadPreset(presetId))
      .subscribe(this.postResponseHandler.handleFullJsonResponse());
  }
}
