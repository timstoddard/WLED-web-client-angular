import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormService } from '../../shared/form-service';
import { OverlayPositionService } from '../../shared/overlay-position.service';
import { UnsubscriberComponent } from '../../shared/unsubscribing/unsubscriber.component';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent extends UnsubscriberComponent implements OnInit {
  /** Header title. */
  @Input() headerText: string = '';
  /** Search icon hover label. */
  @Input() label: string = '';
  @Input() selectedName$!: Observable<string>;
  @Output() searchValueChanges = new EventEmitter<string>();
  @ViewChild('searchInput', { read: ElementRef }) searchInputElement!: ElementRef<HTMLInputElement>;
  searchText!: FormControl;
  showInput!: boolean;
  isContextMenuOpen!: boolean;

  constructor(
    private formSerivce: FormService,
    private overlayPositionService: OverlayPositionService,
  ) {
    super();
  }

  ngOnInit() {
    this.searchText = this.createFormControl();
    this.showInput = false;
    this.isContextMenuOpen = false;
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
      } else {
        this.showInput = false;
      }
      event.stopImmediatePropagation();
    }
  }

  toggleSearchInput() {
    this.showInput = !this.showInput;
    if (this.showInput) {
      // TODO possible to do this without timeout?
      setTimeout(() => {
        this.searchInputElement.nativeElement.focus();
      })
    }
  }

  toggleContextMenu() {
    this.isContextMenuOpen = !this.isContextMenuOpen;
  }

  getOverlayPositions() {
    const rightPosition = this.overlayPositionService.rightBottomPosition(0, 8);
    return [rightPosition];
  }

  private createFormControl() {
    const control = this.formSerivce.createFormControl<string>('');

    this.handleUnsubscribe(control.valueChanges)
      .subscribe(() => this.onChange());

    return control;
  }
}
