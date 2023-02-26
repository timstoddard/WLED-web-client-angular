import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { AppPreset } from '../../../shared/app-types/app-presets';
import { PostResponseHandler } from '../../../shared/post-response-handler';
import { UnsubscriberComponent } from '../../../shared/unsubscriber/unsubscriber.component';
import { PresetsService } from '../presets.service';
import { expandFade } from '../../../shared/animations';

@Component({
  selector: 'app-preset-quick-load',
  templateUrl: './preset-quick-load.component.html',
  styleUrls: ['./preset-quick-load.component.scss'],
  animations: [expandFade()],
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
  private presetsWithLabels: AppPreset[] = [];

  @HostBinding('class.is-minimized')
  get isMinimized() { return !this.isExpanded; }

  constructor(
    private presetsService: PresetsService,
    private postResponseHandler: PostResponseHandler,
  ) {
    super();
  }

  ngOnInit() {
  }

  loadPreset(presetId: number) {
    this.handleUnsubscribe(
      this.presetsService.loadPreset(presetId))
      .subscribe(this.postResponseHandler.handleFullJsonResponse());
  }
}
