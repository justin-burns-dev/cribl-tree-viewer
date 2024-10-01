import { ITreeNode } from "../../types/tree";
import { getFolderIcon } from "../../utils/icon";
import { findNodeByUrl, generateNodeUrl } from "../../utils/tree";

export class FolderTreeView extends HTMLElement {
  static tagName = "folder-tree-view";

  private _treeData?: ITreeNode;
  private _currentDir: string = "";
  private expandedNodes = new Map<string, boolean>();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  set treeData(value: ITreeNode) {
    this._treeData = value;
    this.currentDir = this._treeData.name;
    this.expandedNodes.clear();
    this.render();
  }

  set currentDir(value: string) {
    this._currentDir = value;
    this.expandPath(value);
    this.render();
  }

  get currentDir() {
    return this._currentDir;
  }

  private expandPath(path: string) {
    const parts = path.split("/");
    let currentPath = "";
    parts.forEach((part) => {
      currentPath += part;
      this.expandedNodes.set(currentPath, true);
      currentPath += "/";
    });
  }

  private render() {
    if (this.shadowRoot && this._treeData) {
      this.shadowRoot.innerHTML = `
        <style>
          ${FolderTreeView.styles}
        </style>
        <div class="folder-tree-view">
          ${this.renderTree(this._treeData)}
        </div>
      `;
    }
  }

  private renderTree(
    node: ITreeNode,
    parentPath: string = ""
  ): string {
    const nodeUrl = generateNodeUrl(node, parentPath);
    const isFolder = node.type === "folder";
    const isExpanded = this.expandedNodes.get(nodeUrl) || false;
    const isSelected = this._currentDir === nodeUrl;

    const hasChildFolders = node.children?.some(
      (child) => child.type === "folder"
    );

    if (!isFolder) return "";

    return `
      <div class="tree-node">
        <div class="filename-wrapper ${!hasChildFolders ? 'indent' : ''}">
          ${
            hasChildFolders
              ? `
              <span class="toggle-btn"  data-url="${nodeUrl}">
                ${ hasChildFolders ? (isExpanded ? "▼ " : "▶ ") : ""}
              </span>
              `
              : ''
          }
          <img class="folder-icon" src="${getFolderIcon()}"/>
          <span class="filename  ${isSelected ? "selected" : ""}"  data-url="${nodeUrl}">
            ${node.name}
          </span>
        </div>
        ${
          node.children
            ? `<div class='children ${ isExpanded ? 'expanded' : 'collapsed' }'>
                ${node.children
                  .map((child) => this.renderTree(child, nodeUrl))
                  .join("")}
                </div>`
            : ""
        }
      </div>
    `;
  }

  private attachEventListeners() {
    this.shadowRoot?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("toggle-btn")) {
        const nodeUrl = target.dataset.url;
        
        if (nodeUrl) {
          this.handleNodeToggle(nodeUrl);
        }
      } else if (target.classList.contains("filename")) {
        const nodeUrl = target.dataset.url;

        if (nodeUrl) {
          this.expandPath(nodeUrl);
          this.handleNodeClick(nodeUrl);
        }
      }
    });
  }

  private handleNodeToggle(nodeUrl: string) {
    const node = findNodeByUrl(this._treeData!, nodeUrl);
    if (node && node.type === "folder") {
      const isExpanded = this.expandedNodes.get(nodeUrl) || false;

      this.expandedNodes.set(nodeUrl, !isExpanded);
      this.render();
    }
  }

  private handleNodeClick(nodeUrl: string) {
    const node = findNodeByUrl(this._treeData!, nodeUrl);
    if (node) {
      this._currentDir = nodeUrl;

      this.render();
      this.dispatchNodeSelectedEvent(nodeUrl);
    }
  }

  private dispatchNodeSelectedEvent(nodeUrl: string) {
    this.dispatchEvent(
      new CustomEvent('node-selected', {
        detail: { nodeUrl },
      })
    );
  }

  static styles = `
    .folder-tree-view {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      font-family: sans-serif;
      padding: 10px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .tree-node {
      width: 100%;
      box-sizing: border-box;
    }

    .tree-node .filename {
      cursor: pointer;
      user-select: none;
      padding: 5px;
      flex: 1;
    }

    .tree-node .filename-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .tree-node .filename.selected {
      background-color: #eeeeee;
    }

    .tree-node .filename:hover:not(.selected) {
      background-color: #eef1f7;
    }

    .tree-node .children {
      padding-left: 20px;
    }

    .tree-node .children.collapsed {
      display: none;
    }

    .tree-node .toggle-btn {
      cursor: pointer;
      user-select: none;
      width: 20px;
    }

    .tree-node .indent {
      padding-left: 20px;
    }

    .folder-icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  `;
}

if (!customElements.get(FolderTreeView.tagName)) {
  customElements.define(FolderTreeView.tagName, FolderTreeView);
}
