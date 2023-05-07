import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CheckboxComponent } from '../shared/checkbox/checkbox.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FormControlRequirementsComponent } from './form-control-requirements/form-control-requirements.component';
import { TextInputComponent } from '../shared/text-input/text-input.component';

const COMPONENTS = [
  CheckboxComponent,
  FileUploadComponent,
  FormControlRequirementsComponent,
  TextInputComponent,
];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ]
})
export class SharedComponentsModule { }
