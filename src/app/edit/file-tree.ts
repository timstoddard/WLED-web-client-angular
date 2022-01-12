import { Editor } from './editor';
import { openFile } from './file-utils';
import { QueuedRequester } from './queued-requester';

const ge = (a: string) => document.getElementById(a);
const ce = (a: string) => document.createElement(a);

// TODO make this an angular component
export class FileTree {
  private preview: HTMLElement;
  private treeRoot: HTMLElement;
  private editor: Editor;
  private requests: QueuedRequester;

  constructor(element: HTMLElement, editor: Editor, requests: QueuedRequester) {
    this.requests = requests;
    this.preview = ge('preview')!;
    this.treeRoot = ce('div');
    this.editor = editor;
    this.treeRoot.className = 'tvu';
    element.appendChild(this.treeRoot);
    this.httpGet(this.treeRoot, '/');
  }

  /**
   * Redownloads the file tree starting at `/`.
   * 
   * @param path TODO unused
   */
  refreshFiles = (path: string /* TODO unused */) => {
    this.treeRoot.removeChild(this.treeRoot.childNodes[0]);
    this.httpGet(this.treeRoot, '/');
  };

  private loadDownload = (path: string) => {
    const downloadElement = ge('download-frame')! as HTMLInputElement;
    downloadElement.src = `/edit?download=${path}`;
  }

  private loadPreview = (path: string) => {
    ge('editor')!.style.display = 'none';
    this.preview.style.display = 'block';
    this.preview.innerHTML = `<img
        src="/edit?edit=${path}&_cb=${Date.now()}"
        style="max-width:100%; max-height:100%; margin:auto; display:block;" />`
  }

  private showContextMenu = (event: MouseEvent, path: string, isFile: boolean /* TODO unused */) => {
    const divContext = ce('div');
    const scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
    const scrollLeft = document.body.scrollLeft ? document.body.scrollLeft : document.documentElement.scrollLeft;
    const left = event.clientX + scrollLeft;
    const top = event.clientY + scrollTop;
    divContext.className = 'cm';
    divContext.style.display = 'block';
    divContext.style.left = `${left}px`;
    divContext.style.top = `${top}px`;
    this.generateFileMenu(divContext, path);
    document.body.appendChild(divContext);
    const width = divContext.offsetWidth;
    const height = divContext.offsetHeight;
    // TODO seems to be a hover effect? can we do this in css?
    divContext.onmouseout = (e) => {
      if (
        e.clientX < left ||
        e.clientX > (left + width) ||
        e.clientY < top ||
        e.clientY > (top + height)
      ) {
        if (document.body.getElementsByClassName('cm').length > 0)
          document.body.removeChild(divContext);
      }
    };
  }

  private generateFileMenu = (el: HTMLElement, path: string) => {
    const list = ce('ul');
    el.appendChild(list);
    const action = ce('li');
    list.appendChild(action);

    if (isImageFile(path)) {
      action.innerHTML = '<span>Preview</span>';
      action.onclick = (e) => {
        this.loadPreview(path);
        if (document.body.getElementsByClassName('cm').length > 0)
          document.body.removeChild(el);
      };
    } else if (isTextFile(path)) {
      action.innerHTML = '<span>Edit</span>';
      action.onclick = (e: Event) => {
        const fileInput = (e.target! as HTMLInputElement).files![0];
        openFile(this.editor, fileInput.name);
        if (document.body.getElementsByClassName('cm').length > 0)
          document.body.removeChild(el);
      };
    }

    const download = ce('li');
    list.appendChild(download);
    download.innerHTML = '<span>Download</span>';
    download.onclick = (e) => {
      this.loadDownload(path);
      if (document.body.getElementsByClassName('cm').length > 0)
        document.body.removeChild(el);
    };

    const delFile = ce('li');
    list.appendChild(delFile);
    delFile.innerHTML = '<span>Delete</span>';
    delFile.onclick = (e) => {
      this.httpDelete(path);
      if (document.body.getElementsByClassName('cm').length > 0)
        document.body.removeChild(el);
    };
  }

  private createTreeLeaf = (path: string, name: string, size: any /* TODO unused */) => {
    const leaf = ce('li');
    leaf.id = `${(path == '/') ? '' : path}/${name}`;
    const label = ce('span');
    label.innerHTML = name;
    leaf.appendChild(label);
    leaf.onclick = (e: Event) => {
      if (isTextFile(leaf.id.toLowerCase())) {
        const fileInput = (e.target! as HTMLInputElement).files![0];
        openFile(this.editor, fileInput.name);
      } else if (isImageFile(leaf.id.toLowerCase())) {
        this.loadPreview(leaf.id);
      }
    };
    leaf.oncontextmenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showContextMenu(e, leaf.id, true);
    };
    return leaf;
  }

  private addList = (parent: HTMLElement, path: string, items: any[] /* TODO type */) => {
    const list = ce('ul');
    parent.appendChild(list);
    const length = items.length;
    for (let i = 0; i < length; i++) {
      if (items[i].type === 'file')
        list.appendChild(this.createTreeLeaf(path, items[i].name, items[i].size));
    }
  }

  private delCb = (path: string /* TODO unused */) => {
    return (status: number, responseText: string) => {
      if (status != 200) {
        alert(`ERROR ${status}: ${responseText}`);
      } else {
        this.treeRoot.removeChild(this.treeRoot.childNodes[0]);
        this.httpGet(this.treeRoot, '/');
      }
    }
  }

  private httpDelete = (filename: string) => {
    const formData = new FormData();
    formData.append('path', filename);
    this.requests.add({
      method: 'DELETE',
      url: '/edit',
      params: formData,
      callback: this.delCb(filename),
    });
  }

  private getCb = (parent: HTMLElement, path: string) => {
    return (status: number, responseText: string) => {
      if (status == 200)
        this.addList(parent, path, JSON.parse(responseText));
    }
  }

  private httpGet = (parent: HTMLElement, path: string) => {
    this.requests.add({
      method: 'GET',
      url: '/edit',
      params: { list: path },
      callback: this.getCb(parent, path),
    });
  }
}

const isTextFile = (path: string) => {
  if (!path) {
    return;
  }
  const extension = /(?:\.([^.]+))?$/.exec(path)![1];
  switch (extension) {
    case 'c':
    case 'conf':
    case 'cpp':
    case 'css':
    case 'h':
    case 'hex':
    case 'htm':
    case 'html':
    case 'ini':
    case 'js':
    case 'json':
    case 'php':
    case 'txt':
    case 'xml':
      return true;
    default:
      return false;
  }
}

const isImageFile = (path: string) => {
  if (!path) {
    return;
  }
  const extension = /(?:\.([^.]+))?$/.exec(path)![1];
  switch (extension) {
    case 'gif':
    case 'jpg':
    case 'png':
      return true;
    default:
      return false;
  }
}
