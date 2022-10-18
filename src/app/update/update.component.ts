import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../shared/form-service';
import { UnsubscriberComponent } from '../shared/unsubscribing/unsubscriber.component';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent extends UnsubscriberComponent implements OnInit {
  updateForm!: FormGroup;
  isUpdating!: boolean;

  constructor(private formService: FormService) {
    super();
  }

  ngOnInit() {
    this.updateForm = this.createForm();
    this.isUpdating = false;

    this.getValueChanges(this.updateForm, 'firmwareBinary')
      .subscribe(e => console.log(e))
  }

  submitForm() {
    this.isUpdating = true;
    // TODO wire up to api
    setTimeout(() => this.isUpdating = false, 3000)

    // TODO send the file properly (headers? etc)
  }

  goBack() {
    // TODO use generic service here
  }

  private createForm() {
    // TODO just use a form control
    return this.formService.createFormGroup({
      firmwareBinary: '',
    });
  }
}
