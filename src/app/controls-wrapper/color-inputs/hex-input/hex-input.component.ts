import { AfterViewInit, Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ColorService, CurrentColor } from '../../color.service';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';
import { UnsubscriberComponent } from 'src/app/shared/unsubscriber/unsubscriber.component';

@Component({
  selector: 'app-hex-input',
  templateUrl: './hex-input.component.html',
  styleUrls: ['./hex-input.component.scss']
})
export class HexInputComponent extends UnsubscriberComponent implements AfterViewInit {
  @Input() hexInput!: AbstractControl;
  hexColorInput: InputConfig = {
    type: 'text',
    getFormControl: () => this.getFormControl(),
    placeholder: 'ffffff',
    widthPx: 100,
    maxLength: 8,
    autocomplete: false,
  };

  constructor(private colorService: ColorService) {
    super();
  }

  ngAfterViewInit() {
    // using timeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    // since we cannot subscribe in ngOnInit (see below comment)
    setTimeout(() => {
      // have to do this here instead of in ngOnInit so that the ColorPicker exists
      this.handleUnsubscribe(
        this.colorService.getCurrentColorData())
        .subscribe((colorData: CurrentColor) => {
          this.hexInput.patchValue(colorData.hex);
        });
    });
  }

  getFormControl() {
    return this.hexInput as FormControl;
  }

  hexEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.colorService.validateAndSetHex(this.hexInput.value);
    }
  }
}
