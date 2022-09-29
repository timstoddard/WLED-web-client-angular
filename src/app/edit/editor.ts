// TODO import as non-commonjs module
import { Ace, edit } from 'ace-builds';
import { QueuedRequester } from './queued-requester';

const ge = (a: string) => document.getElementById(a);

// TODO make this an angular component
export class Editor {
  private editor: Ace.Editor;
  private requests: QueuedRequester;
  private fileName: string = '';
  private lang: string = '';
  private type: string = '';

  constructor(
    element: HTMLElement,
    requests: QueuedRequester,
    file: string = '/index.html',
    theme: string = 'monokai',
    type: string = 'text/plain',
    lang?: string,
  ) {
    if (typeof lang === 'undefined') {
      lang = getLangFromFilename(file);
    }

    if (typeof type === 'undefined') {
      type = lang === 'c_cpp'
        ? 'text/plain'
        : `text/${lang}`;
    }

    this.editor = edit(element); // creates ace editor
    this.requests = requests;

    if (lang !== 'plain') {
      this.editor.getSession().setMode(`ace/mode/${lang}`);
    }
    this.editor.setTheme(`ace/theme/${theme}`);
    // TODO how to set this?
    // this.editor.$blockScrolling = Infinity;
    this.editor.getSession().setUseSoftTabs(true);
    this.editor.getSession().setTabSize(2);
    this.editor.setHighlightActiveLine(true);
    this.editor.setShowPrintMargin(false);
    this.editor.commands.addCommand({
      name: 'saveCommand',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      exec: (editor) => {
        this.httpPost(file, `${editor.getValue()}`, type);
      },
      readOnly: false,
    });
    this.editor.commands.addCommand({
      name: 'undoCommand',
      bindKey: { win: 'Ctrl-Z', mac: 'Command-Z' },
      exec: (editor) => {
        editor.getSession().getUndoManager().undo(editor.getSession(), false);
      },
      readOnly: false,
    });
    this.editor.commands.addCommand({
      name: 'redoCommand',
      bindKey: { win: 'Ctrl-Shift-Z', mac: 'Command-Shift-Z' },
      exec: (editor) => {
        editor.getSession().getUndoManager().redo(editor.getSession(), false);
      },
      readOnly: false,
    });
    this.httpGet(file);
  }

  getEditor() {
    return this.editor;
  }

  loadUrl(fileName: string) {
    this.fileName = fileName;
    this.lang = getLangFromFilename(this.fileName);
    this.type = `text/${this.lang}`;
    if (this.lang !== 'plain') {
      this.editor.getSession().setMode(`ace/mode/${this.lang}`);
    }
    this.httpGet(this.fileName);
  }

  private httpPostProcessRequest = (status: number, responseText: string) => {
    if (status != 200) {
      alert(`ERROR ${status}: ${responseText}`);
    }
  }

  private httpPost = (fileName: string, data: BlobPart /* TODO correct type? */, type: string) => {
    const formData = new FormData();
    formData.append('data', new Blob([data], { type: type }), fileName);
    this.requests.add({
      method: 'POST',
      url: '/edit',
      params: formData,
      callback: this.httpPostProcessRequest,
    });
  }

  private httpGetProcessRequest(status: number, responseText: string) {
    ge('preview')!.style.display = 'none';
    ge('editor')!.style.display = 'block';
    if (status == 200) {
      this.editor.setValue(responseText);
    } else {
      this.editor.setValue('');
    }
    this.editor.clearSelection();
  }

  private httpGet(url: string) {
    this.requests.add({
      method: 'GET',
      url: '/edit',
      params: { edit: url },
      callback: this.httpGetProcessRequest,
    });
  }
}

const getLangFromFilename = (filename: string) => {
  const ext = /(?:\.([^.]+))?$/.exec(filename)![1];
  let lang = 'plain';
  if (typeof ext !== undefined) {
    switch (ext) {
      case 'txt':
        lang = 'plain';
        break;
      case 'hex':
        lang = 'plain';
        break;
      case 'conf':
        lang = 'plain';
        break;
      case 'htm':
        lang = 'html';
        break;
      case 'js':
        lang = 'javascript';
        break;
      case 'h':
        lang = 'c_cpp';
        break;
      case 'c':
        lang = 'c_cpp';
        break;
      case 'cpp':
        lang = 'c_cpp';
        break;
      case 'css':
      case 'scss':
      case 'php':
      case 'html':
      case 'json':
      case 'xml':
      case 'ini':
        lang = ext;
        break;
      default:
        break;
    }
  }
  return lang;
}
