import { getModeForPath } from 'ace-builds/src-noconflict/ext-modelist';
import { Editor } from './editor';

export const openFile = (editor: Editor, fileName: string) => {
  if (!editor || !fileName) {
    return;
  }
  const modeName = getModeForPath(fileName).mode;
  editor.getEditor().getSession().setMode(modeName);
  editor.loadUrl(fileName)
};
