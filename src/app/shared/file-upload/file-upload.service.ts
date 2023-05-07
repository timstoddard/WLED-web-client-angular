import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  constructor(private apiService: ApiService) {}

  upload(file: File, url: string): Observable<any> {
    return this.apiService.uploadFile(file, url);
  }
}
