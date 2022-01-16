import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
  @Output() searchValueChanges = new EventEmitter();
  @ViewChild('searchInput', { read: ElementRef }) searchInputElement!: ElementRef<HTMLInputElement>;
  searchInput!: FormControl;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchInput = this.formBuilder.control('');
  }

  search = () => {
    const searchText = this.searchInput.value.toUpperCase(); // TODO lower case?
    this.searchValueChanges.emit(searchText);

    // TODO hide cancel button if no text
    // searchField.parentElement!.getElementsByClassName('search-cancel-icon')[0].style.display = (searchText.length < 1) ? 'none' : 'inline';
    
    // TODO display filtered element list (do this in consumer template)
    // const elements = searchField.parentElement!.parentElement!.querySelectorAll('.lstI');
    // for (let i = 0; i < elements.length; i++) {
    //   const item = elements[i];
    //   const itemText = item.querySelector('.lstIname')!.innerText.toUpperCase();
    //   if (itemText.indexOf(searchText) > -1) {
    //     item.style.display = '';
    //   } else {
    //     item.style.display = 'none';
    //   }
    // }
  }

  cancelSearch = () => {
    this.searchInput.reset();
    this.searchValueChanges.emit('');
    // searchField.value = '';

    // TODO show unfiltered list (in consumer template)
    // this.search(searchField);

    this.searchInputElement.nativeElement.focus();
  }
}
