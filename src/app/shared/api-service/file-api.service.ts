import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiFilePath, ApiPath } from './api-paths';
import { MOCK_API_RESPONSE } from 'src/app/controls-wrapper/mock-api-data';

@Injectable({ providedIn: 'root' })
export class FileApiService {
  constructor(
    private apiService: ApiService,
  ) {
  }

  /**
   * Uploads a single file to a provided URL.
   * @param file the file to upload
   * @param path the path prefix to upload to
   * @returns post reponse observable
   */
  uploadFile = (file: File, name: string) => {
    const formData = new FormData();
    formData.append('file', file, name);
    return this.apiService.httpPost(
      ApiPath.FILE_UPLOAD_PATH,
      formData,
      MOCK_API_RESPONSE,
      { responseType: 'text' },
    );
  }

  downloadExternalFile = (url: string) => {
    // TODO implement this (maybe use angular http.get directly)
    // return this.httpGet(
    //   url,
    //   {},
    //   { responseType: 'blob' },
    // );
  }

  getDownloadPresetsUrl = () => {
    return this.apiService.buildApiUrl(ApiFilePath.PRESETS_JSON_FILE);
  }

  getDownloadConfigUrl = () => {
    return this.apiService.buildApiUrl(ApiFilePath.CONFIG_JSON_FILE);
  }
}
