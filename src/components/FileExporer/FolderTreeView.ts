import { ITreeNode } from "../../types/tree";
import { findNodeByUrl, generateNodeUrl } from "../../utils/tree";

export class FolderTreeView extends HTMLElement {
  static tagName = "folder-tree-view";

  private _treeData?: ITreeNode;
  private expandedNodes = new Map<string, boolean>();
  private _currentDir: string = "";

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
    this.render();
  }

  set currentDir(value: string) {
    this._currentDir = value;
    this.render();
  }

  get currentDir() {
    return this._currentDir;
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
    indent: number = 0,
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
        <div class="filename-wrapper">
          ${
            hasChildFolders
              ? `
              <span class="toggle-btn"  data-url="${nodeUrl}">
                ${isExpanded ? "▼ " : "▶ "}
              </span>
            `
              : ""
          }
          <span class="filename  ${
            isSelected ? "selected" : ""
          }"  data-url="${nodeUrl}">${node.name}</span>
        </div>
        ${
          node.children
            ? `<div class='children ${ isExpanded ? 'expanded' : 'collapsed' }'>
                ${node.children
                  .map((child) => this.renderTree(child, indent + 20, nodeUrl))
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
          this.handleNodeExpand(nodeUrl);
        }
      } else if (target.classList.contains("filename")) {
        const nodeUrl = target.dataset.url;
        if (nodeUrl) {
          this.handleNodeClick(nodeUrl);
        }
      }
    });
  }

  private handleNodeExpand(nodeUrl: string) {
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
    }

    .tree-node {
      width: 100%;
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
      background-color: #dad9d9;
    }

    .tree-node .filename:hover:not(.selected) {
      background-color: #f0f0f0;
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
    }
  `;
}

if (!customElements.get(FolderTreeView.tagName)) {
  customElements.define(FolderTreeView.tagName, FolderTreeView);
}
