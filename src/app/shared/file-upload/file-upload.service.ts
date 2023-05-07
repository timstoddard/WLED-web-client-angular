import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api-service/api.service';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  constructor(private apiService: ApiService) {}

  upload(file: File, url: string): Observable<any> {
    return this.apiService.file.upload(file, url);
  }
}
