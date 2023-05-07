import { ChangeDetectorRef, Component, Input, Optional } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { UnsubscriberComponent } from '../unsubscriber/unsubscriber.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent extends UnsubscriberComponent {
  @Input() @Optional() buttonText = 'Upload';
  /** File name for the remote file system. */
  @Input() fileName!: string;
  @Input() fileExtensions = '*';
  shortLink: string = ''; // short link from api response
  loading: boolean = false;
  file?: File;
  uploadedFileName!: string;

  constructor(
    private fileUploadService: FileUploadService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  onFile(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      // only take the first file
      const file = files[0];
      const confirmMessage = [
        'Are you sure this is the correct file?',
        `Name: ${file.name}`,
        `Type: ${file.type}`,
        `Size: ${file.size} b`,
        `Last Modified: ${new Date(file.lastModified)}`,
      ].join('\n');
      const confirmUpload = confirm(confirmMessage);
      if (confirmUpload) {
        this.upload(file);
      }
    }
  }

  private upload(file: File) {
    if (!file) {
      return;
    }

    this.loading = true;
    const fileName = file.name;

    this.handleUnsubscribe(
      this.fileUploadService.upload(file, this.fileName),
    )
      .subscribe((event: any) => {
        this.uploadedFileName = fileName;
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      });
  }
}
