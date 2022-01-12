import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Editor } from './editor';
import { FileUploader } from './file-uploader';
import { QueuedRequester } from './queued-requester';
import { FileTree } from './file-tree';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('uploader', { read: ElementRef }) fileUploader!: ElementRef;
  @ViewChild('fileTree', { read: ElementRef }) fileTree!: ElementRef;
  @ViewChild('editor', { read: ElementRef }) editor!: ElementRef;
  private requests!: QueuedRequester;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.requests = new QueuedRequester();

    const vars: { [key: string]: string } = {};
    // TODO get these from angular router query params
    window.location.href
      .replace(/[?&]+([^=&]+)=([^&]*)/gi,
        (m, key, value) => {
          vars[key] = value;
          return '';
        });
    const editor = new Editor(this.editor.nativeElement, this.requests,
      vars['file'], vars['theme'], vars['type'], vars['lang']);
    const fileTree = new FileTree(this.fileTree.nativeElement, editor, this.requests);
    const uploader = new FileUploader(this.fileUploader.nativeElement, fileTree, editor, this.requests);
  }
}
