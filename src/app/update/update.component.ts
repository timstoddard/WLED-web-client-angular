import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  updateForm: FormGroup;
  isUpdating: boolean;

  constructor() {
    this.updateForm = this.createForm();
    this.isUpdating = false;
  }

  ngOnInit(): void {
    console.log(this.updateForm.controls['firmwareBinary'])
    this.updateForm.controls['firmwareBinary']
      .valueChanges.subscribe(e => console.log(e))
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
    return new FormGroup({
      firmwareBinary: new FormControl(''),
    });
  }
}
