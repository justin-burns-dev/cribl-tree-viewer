import  "./FolderTreeView";
import  "./FileListView";

import type { FolderTreeView } from "./FolderTreeView";
import type { FileListView } from "./FileListView";

import { ITreeNode } from "../../types/tree";

export class FileExplorer extends HTMLElement {
  static tagName = 'file-explorer';

  private _treeData?: ITreeNode;
  private _folderTreeView: FolderTreeView | null;
  private _fileListView: FileListView | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._folderTreeView = null;
    this._fileListView = null;
  }

  connectedCallback() {
    this.render();
  }

  set treeData(value: ITreeNode) {
    this._treeData = value;
    this.render();
  }

  private render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          ${FileExplorer.styles}
        </style>
        File Explorer
        <div class="file-explorer">
          <folder-tree-view></folder-tree-view>
          <file-list-view></file-list-view>
        </div>
      `;
    }
    
    this._folderTreeView = this.shadowRoot?.querySelector('folder-tree-view') as FolderTreeView;
    this._fileListView = this.shadowRoot?.querySelector('file-list-view') as FileListView;

    if (this._treeData) {
      this._folderTreeView.treeData = this._treeData;
      this._fileListView.treeData = this._treeData;
    }

    this._folderTreeView.addEventListener('node-selected', (event) => {
      const { nodeUrl } = (event as CustomEvent).detail;
      console.log('Node selected:', nodeUrl);
    });

    this._fileListView.addEventListener('node-selected', (event) => {
      const { nodeUrl } = (event as CustomEvent).detail;
      console.log('Node selected:', nodeUrl);
    });

    this._fileListView.addEventListener('path-changed', (event) => {
      const { nodeUrl } = (event as CustomEvent).detail;
      console.log('Path changed:', nodeUrl);
    });
  }

  static styles = `
   .file-explorer {
      display: flex;
      margin: 10px;
      border: 1px solid gray;
    }

    folder-tree-view {
      border-right: 1px solid gray;
      flex: 0.3;
      padding: 5px;
    }

    file-list-view {
      flex: 0.7;
    }
  `
}

if (!customElements.get('my-component')) {
  customElements.define(FileExplorer.tagName, FileExplorer);
}