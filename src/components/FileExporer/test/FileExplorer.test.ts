import { FileListView } from '../FileListView';
import { FolderTreeView } from '../FolderTreeView';
import { FileExplorer } from '../index';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

describe('FileExplorer', () => {
  let fileExplorer: FileExplorer;

  beforeEach(() => {
    fileExplorer = new FileExplorer();
    document.body.appendChild(fileExplorer);
  });

  afterEach(() => {
    document.body.removeChild(fileExplorer);
  });

  it('should render correctly', () => {
    expect(fileExplorer.shadowRoot?.innerHTML).toContain('<div class="file-explorer">');
  });

  it('should update currentDir on node-selected event from folder-tree-view', () => {
    const folderTreeView = fileExplorer.shadowRoot?.querySelector('folder-tree-view');
    const event = new CustomEvent('node-selected', { detail: { nodeUrl: 'root/folder1' } });
    folderTreeView?.dispatchEvent(event);

    expect(fileExplorer.currentDir).toBe('root/folder1');
  });

  it('should update selectedUrl on node-selected event from file-list-view', () => {
    const fileListView = fileExplorer.shadowRoot?.querySelector('file-list-view');
    const event = new CustomEvent('node-selected', { detail: { nodeUrl: 'root/file1.txt' } });
    fileListView?.dispatchEvent(event);

    expect(fileExplorer.selectedUrl).toBe('root/file1.txt');
  });

  it('should update currentDir on path-changed event from file-list-view', () => {
    const fileListView = fileExplorer.shadowRoot?.querySelector('file-list-view');
    const event = new CustomEvent('path-changed', { detail: { nodeUrl: 'root/folder2' } });
    fileListView?.dispatchEvent(event);

    expect(fileExplorer.currentDir).toBe('root/folder2');
  });

  it('should update file-list-view currentDir on node-selected event from folder-tree-view', () => {
    const folderTreeView = fileExplorer.shadowRoot?.querySelector('folder-tree-view') as FolderTreeView;
    const fileListView = fileExplorer.shadowRoot?.querySelector('file-list-view') as FileListView;
    const event = new CustomEvent('node-selected', { detail: { nodeUrl: 'root/folder1' } });
    folderTreeView?.dispatchEvent(event);

    expect(fileExplorer.currentDir).toBe('root/folder1');
    expect(fileListView?.currentDir).toBe('root/folder1');
  });

  it('should update folder-tree-view selectedFolder on node-selected event from file-list-view', () => {
    const folderTreeView = fileExplorer.shadowRoot?.querySelector('folder-tree-view') as FolderTreeView;
    const fileListView = fileExplorer.shadowRoot?.querySelector('file-list-view') as FileListView;
    const event = new CustomEvent('path-changed', { detail: { nodeUrl: 'root/folder1' } });
    fileListView?.dispatchEvent(event);

    expect(fileExplorer.currentDir).toBe('root/folder1');
    expect(folderTreeView?.currentDir).toBe('root/folder1');
  });
});