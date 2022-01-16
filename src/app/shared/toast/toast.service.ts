export class ToastService {
  constructor() {}

  showToast = (text: string, isError: boolean = false) => {
    // TODO call toast component
  }

  showErrorToast = () => {
    this.showToast('Connection to light failed!', true);
  };

  clearErrorToast = () => {
    document.getElementById('toast')!.className =
      document.getElementById('toast')!.className.replace('error', '');
  }
}
