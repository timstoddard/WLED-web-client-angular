import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent extends UnsubscribingComponent implements OnInit {
  @Output() searchValueChanges = new EventEmitter();
  @ViewChild('searchInput', { read: ElementRef }) searchInputElement!: ElementRef<HTMLInputElement>;
  searchText!: FormControl;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.searchText = this.createFormControl();
  }

  onChange = () => {
    this.searchValueChanges.emit(this.searchText.value);
  }

  cancelSearch = () => {
    this.searchText.reset('');
    this.searchValueChanges.emit(this.searchText.value);
    this.searchInputElement.nativeElement.focus();
  }

  private createFormControl() {
    const control =  this.formBuilder.control('');
    control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.onChange());
    return control;
  }
}
