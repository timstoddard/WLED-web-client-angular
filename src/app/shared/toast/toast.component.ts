import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  text = '';
  isOpen = false;
  isError = false;
  private toastTimeout = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    clearTimeout(this.toastTimeout);
  }

  showToast = (text: string, isError: boolean = false) => {
    // TODO if error, update `connind` bg color
    // if (error) {
    //   document.getElementById('connind')!.style.backgroundColor = '#831';
    // }

    this.text = text;
    this.isError = isError;
    clearTimeout(this.toastTimeout);

    // TODO handle this in css (animation still seems to work in the app...)
    // toastElement.style.animation = 'none';

    const toastElement = document.getElementById('toast')!;
    this.toastTimeout = setTimeout(() => {
      toastElement.className = toastElement.className.replace('show', '');
    }, 2900) as unknown as number;
  };

  getToastClass() {
    return this.isError ? 'error' : 'show';
  }
}
