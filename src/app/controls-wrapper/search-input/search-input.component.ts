import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormService } from '../../shared/form-service';
import { OverlayPositionService } from '../../shared/overlay-position.service';
import { UnsubscriberComponent } from '../../shared/unsubscriber/unsubscriber.component';
import { expandFade } from 'src/app/shared/animations';

export interface SearchableItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  animations: [expandFade()],
})
export class SearchInputComponent extends UnsubscriberComponent implements OnInit {
  /** Header title. */
  @Input() headerText: string = '';
  /** Search icon hover label. */
  @Input() label: string = '';
  @Input() selectedItem$!: Observable<SearchableItem>;
  @Input() settingsDialogComponentType!: ComponentType<any>;
  @Output() searchValueChanges = new EventEmitter<string>();
  @ViewChild('searchInput', { read: ElementRef }) searchInputElement!: ElementRef<HTMLInputElement>;
  searchText!: FormControl;
  showInput!: boolean;
  isContextMenuOpen!: boolean;

  constructor(
    private formService: FormService,
    private overlayPositionService: OverlayPositionService,
    private dialog: MatDialog,
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
    this.focusSearchInput();
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
      setTimeout(() => this.focusSearchInput());
    }
  }

  toggleContextMenu() {
    this.isContextMenuOpen = !this.isContextMenuOpen;
  }

  getOverlayPositions() {
    const rightPosition = this.overlayPositionService.rightBottomPosition();
    return [rightPosition];
  }

  openContextMenu() {
    const { settingsDialogComponentType: dialogType } = this;
    const dialogRef = this.dialog.open(dialogType);
  }

  private createFormControl() {
    const control = this.formService.createFormControl<string>('');

    this.handleUnsubscribe(control.valueChanges)
      .subscribe(() => this.onChange());

    return control;
  }

  private focusSearchInput() {
    try {
      this.searchInputElement.nativeElement.focus();
    } catch (e) {
      console.warn(`Unable to focus search input: ${e}`)
    }
  }
}
