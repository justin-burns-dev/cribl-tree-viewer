import { ITreeNode } from "../../types/tree";
import { formatFileSize } from "../../utils/file";
import { getIconForNode } from "../../utils/icon";
import { findNodeByUrl, generateNodeUrl } from "../../utils/tree";

export class FileListView extends HTMLElement {
  static tagName = 'file-list-view';

  private _treeData?: ITreeNode;
  private _selectedFile: string = '';
  private _currentDir: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  set treeData(value: ITreeNode) {
    this._treeData = value;
    this._currentDir = this._treeData?.name;
    this.render();
  }

  set currentDir(value: string) {
    this._currentDir = value;
    this._selectedFile = value;
    this.render();
  }

  get currentDir() {
    return this._currentDir;
  }

  get selectedFile() {
    return this._selectedFile;
  }

  private render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          ${FileListView.styles}
        </style>
        <div class="file-list-view">
          <table>
            <thead>
              <tr>
                <th class="col-icon"> &nbsp; </th>
                <th class="col-name">Name</th>
                <th class="col-date">Date Modified</th>
                <th class="col-size">File Size</th>
              </tr>
            </thead>
            <tbody>
              ${this._treeData ? this.renderTableRows() : ''}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  private renderTableRows(): string {
      const currentNode = findNodeByUrl(this._treeData!, this._currentDir);

      return currentNode?.children?.map(child => {
        const url = generateNodeUrl(child, this._currentDir);
        const isFolder = child.type === 'folder';
        return `
          <tr class="file-item ${this._selectedFile === url ? 'selected' : ''}" data-url="${url}">
            <td class="col-icon"> <div class="file-icon"> <img src="${getIconForNode(child)}"/> </div< </td>
            <td class="col-name">${child.name}</td>
            <td class="col-date">${child.modified.toLocaleDateString()}</td>
            <td class="col-size">${!isFolder ? formatFileSize(child.size) : ''}</td>
          </tr>
        `;
      }).join('') ?? '';
  }

  private attachEventListeners() {   
    let singleClicked: number | null = null;
    this.shadowRoot?.addEventListener('click', (event) => {
      const row = (event.target as HTMLElement).closest('tr');
      if (row) {
        const url = row.getAttribute('data-url');
        if (url) {
          this._selectedFile = url;
          this.dispatchEvent(new CustomEvent('node-selected', { detail: { nodeUrl: url } }));
          
          if (singleClicked) {
            const node = findNodeByUrl(this._treeData!, url);
            if (node?.type === 'folder') {
              this.currentDir = url;
              this.dispatchEvent(new CustomEvent('path-changed', { detail: { nodeUrl: url } }));
            }
          }          
          
          this.render();

          singleClicked = setTimeout(() => {
            singleClicked = null;
          }, 200); 
        }
      }
    });
  }

  static styles = `
   .file-list-view {
      font-family: sans-serif;
      width: 100%;
      height: 100%;
      overflow: auto;
    }

    table {
      width: 100%;
      border-spacing: 0; 
    }

    .col-icon {
      width: 20px;
      padding-left: 30px;
      text-align: center;
      vertical-align: baseline;
    }

    .col-name {
      width: auto;
      text-align: left;
    }

    .col-date {
      width: 150px;
      text-align: left;
    }

    .col-size {
      width: 100px;
      text-align: right;
      padding-right: 10px;
    }

    th, td {
      padding: 8px;
      box-sizing: border-box;
      border-collapse: collapse;
    }

    thead {
      background-color: white;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    thead th{
      border-bottom: 2px solid #ccc;
    }

    .file-item {
      cursor: pointer;
      user-select: none;
    }

    .file-item:hover {
      background-color: #eef1f7;
    }

    .file-item.selected {
      background-color: #eeeeee;
    }

    .file-icon {
      display: flex;
    }

    .file-icon img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  `
}

if (!customElements.get(FileListView.tagName)) {
  customElements.define(FileListView.tagName, FileListView);
}