import { ITreeNode } from "../../types/tree";


export class FolderTreeView extends HTMLElement {
  static tagName = 'folder-tree-view';

  private _treeData?: ITreeNode;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
          ${FolderTreeView.styles}
        </style>
        <div class="folder-tree-view">
          Folder Tree View
        </div>
      `;
    }
  }

  static styles = `
   .folder-tree-view {
      display: flex;
      font-family: sans-serif;
    }
  `
}

if (!customElements.get(FolderTreeView.tagName)) {
  customElements.define(FolderTreeView.tagName, FolderTreeView);
}