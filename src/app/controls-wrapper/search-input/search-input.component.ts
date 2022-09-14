import { OriginConnectionPosition, OverlayConnectionPosition, ConnectionPositionPair } from '@angular/cdk/overlay';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormService } from '../../shared/form-utils';
import { UnsubscribingComponent } from '../../shared/unsubscribing/unsubscribing.component';

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
  @Input() selectedName!: Observable<string>;
  @Output() searchValueChanges = new EventEmitter<string>();
  @ViewChild('searchInput', { read: ElementRef }) searchInputElement!: ElementRef<HTMLInputElement>;
  searchText!: FormControl;
  showInput!: boolean;
  isContextMenuOpen!: boolean;

  constructor(private formSerivce: FormService) {
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
    const OFFSET_X_PX = 0;
    const OFFSET_Y_PX = 12;
    const originRightSide: OriginConnectionPosition = {
      originX: 'end',
      originY: 'bottom',
    };
    const overlayRightSide: OverlayConnectionPosition = {
      overlayX: 'end',
      overlayY: 'top',
    };
    const rightSidePosition = new ConnectionPositionPair(originRightSide, overlayRightSide, OFFSET_X_PX, OFFSET_Y_PX);
    return [rightSidePosition];
  }

  private createFormControl() {
    const control = this.formSerivce.formBuilder.control('');

    this.handleUnsubscribe<string>(control.valueChanges)
      .subscribe(() => this.onChange());

    return control;
  }
}
