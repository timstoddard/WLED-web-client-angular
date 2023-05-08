import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CheckboxComponent } from '../shared/checkbox/checkbox.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FormControlRequirementsComponent } from './form-control-requirements/form-control-requirements.component';
import { TextInputComponent } from '../shared/text-input/text-input.component';
import { WarningCardComponent } from './warning-card/warning-card.component';

const COMPONENTS = [
  CheckboxComponent,
  FileUploadComponent,
  FormControlRequirementsComponent,
  TextInputComponent,
  WarningCardComponent,
];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ]
})
export class SharedComponentsModule { }
