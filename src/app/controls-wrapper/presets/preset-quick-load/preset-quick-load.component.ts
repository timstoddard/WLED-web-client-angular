import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { AppPreset } from '../../../shared/app-types/app-presets';
import { ApiResponseHandler } from '../../../shared/api-response-handler';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { PresetsService } from '../presets.service';
import { expandFade, expandVerticalPadding, expandText } from '../../../shared/animations';
import { AppStateService } from '../../../shared/app-state/app-state.service';
import { timer } from 'rxjs';

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
    private apiResponseHandler: ApiResponseHandler,
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
    // TODO less hacky way of doing this
    this.handleUnsubscribe(
      this.presetsService.loadPreset(presetId))
      .subscribe(() => {
        // the issue with this first API call is that the newly selected preset isn't included in the response right away, it is a race condition
        // so, wait 100 ms then call the API again
        this.handleUnsubscribe(timer(100))
          .subscribe(() => {
            // technically don't need to set the preset again, just need the updated api response
            this.handleUnsubscribe(
              this.presetsService.loadPreset(presetId))
              .subscribe(this.apiResponseHandler.handleFullJsonResponse());
          })
      });
  }
}
