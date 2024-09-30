import { ITreeNode } from "../../types/tree";

export class FileListView extends HTMLElement {
  static tagName = 'file-list-view';

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
          ${FileListView.styles}
        </style>
        <div class="file-list-view">
          File List View
        </div>
      `;
    }
  }

  static styles = `
   .file-list-view {
      display: flex;
      font-family: sans-serif;
    }
  `
}

if (!customElements.get(FileListView.tagName)) {
  customElements.define(FileListView.tagName, FileListView);
}