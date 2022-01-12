import { Editor } from './editor';
import { openFile } from './file-utils';
import { QueuedRequester } from './queued-requester';
import { FileTree } from './file-tree';

const ce = (a: string) => document.createElement(a);

// TODO make this an angular component
export class FileUploader {
  // let xmlHttp;
  private fileTree: FileTree;
  private input: HTMLInputElement;
  private path: HTMLInputElement;
  private editor: Editor;
  private requests: QueuedRequester;

  constructor(element: HTMLElement, fileTree: FileTree, editor: Editor, requests: QueuedRequester) {
    this.fileTree = fileTree;
    this.editor = editor;
    this.requests = requests;

    this.input = ce('input') as HTMLInputElement;
    this.input.type = 'file';
    this.input.multiple = false;
    this.input.name = 'data';
    element.appendChild(this.input);

    this.path = ce('input') as HTMLInputElement;
    this.path.id = 'upload-path';
    this.path.type = 'text';
    this.path.name = 'path';
    this.path.defaultValue = '/';
    element.appendChild(this.path);

    const button = ce('button');
    button.innerHTML = 'Upload';
    element.appendChild(button);

    const mkfile = ce('button');
    mkfile.innerHTML = 'Create';
    element.appendChild(mkfile);

    const savefile = ce('button');
    savefile.innerHTML = ' Save ';
    element.appendChild(savefile);

    mkfile.onclick = (e) => {
      if (this.path.value.indexOf('.') === -1) return;
      this.createPath(this.path.value);
      openFile(this.editor, this.path!.value);
    };

    savefile.onclick = (e) => {
      editor.getEditor().execCommand('saveCommand');
    };

    button.onclick = (e) => {
      if (!this.input.files || this.input.files.length === 0) {
        return;
      }
      const formData = new FormData();
      formData.append('data', this.input.files[0], this.path.value);
      this.requests.add({
        method: 'POST',
        url: '/edit',
        params: formData,
        callback: this.httpPostProcessRequest,
      });
    };
    this.input.onchange = (e) => {
      if (!this.input.files || this.input.files.length === 0)
        return;
      let filename = this.input.files[0].name;
      const name = /(.*)\.[^.]+$/.exec(filename)![1];
      let ext = /(?:\.([^.]+))?$/.exec(filename)![1];
      if (typeof name !== undefined) {
        filename = name;
      }
      if (typeof ext !== undefined) {
        if (ext === 'html')
          ext = 'htm';
        else if (ext === 'jpeg')
          ext = 'jpg';
        filename = `${filename}.${ext}`;
      }
      if (this.path.value === '/' || this.path.value.lastIndexOf('/') === 0) {
        this.path.value = '/' + filename;
      } else {
        this.path.value = this.path.value.substring(0, this.path.value.lastIndexOf('/') + 1) + filename;
      }
    };
  }

  private createPath(p: string) {
    const formData = new FormData();
    formData.append('path', p);
    this.requests.add({
      method: 'PUT',
      url: '/edit',
      params: formData,
      callback: this.httpPostProcessRequest,
    });
  }

  private httpPostProcessRequest = (status: number, responseText: string) => {
    if (status != 200) {
      alert(`ERROR ${status}: ${responseText}`);
    } else {
      this.fileTree.refreshFiles(this.path.value);
    }
  }
}
