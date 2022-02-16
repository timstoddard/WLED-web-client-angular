import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribingComponent } from '../../shared/unsubscribing.component';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent extends UnsubscribingComponent implements OnInit {
  /** Optional title to be shown and toggled with search input. */
  @Input() title: string = '';
  /** Input element label. */
  @Input() label: string = '';
  @Output() searchValueChanges = new EventEmitter();
  @ViewChild('searchInput', { read: ElementRef }) searchInputElement!: ElementRef<HTMLInputElement>;
  searchText!: FormControl;
  showInput!: boolean;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.searchText = this.createFormControl();
    this.showInput = !this.title;
  }

  onChange = () => {
    this.searchValueChanges.emit(this.searchText.value);
  }

  cancelSearch = () => {
    this.searchText.reset('');
    this.searchValueChanges.emit(this.searchText.value);
    this.searchInputElement.nativeElement.focus();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.searchText.value.length > 0) {
        this.cancelSearch();
      } else if (this.title) {
        this.showInput = false;
      }
      event.stopImmediatePropagation();
    }
  }

  toggleSearchInput() {
    if (this.title) {
      this.showInput = !this.showInput;
    }
  }

  private createFormControl() {
    const control =  this.formBuilder.control('');
    control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.onChange());
    return control;
  }
}
