import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileApiService } from '../api-service/file-api.service';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  constructor(private fileApiService: FileApiService) {}

  upload(file: File, url: string): Observable<any> {
    return this.fileApiService.uploadFile(file, url);
  }
}
