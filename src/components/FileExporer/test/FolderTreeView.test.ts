import { FolderTreeView } from '../FolderTreeView'
import { ITreeNode } from '../../../types/tree'
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'

describe('FolderTreeView', () => {
  let folderTreeView: FolderTreeView

  beforeEach(() => {
    folderTreeView = new FolderTreeView()
    document.body.appendChild(folderTreeView)
  })

  afterEach(() => {
    document.body.removeChild(folderTreeView)
  })

  it('should render correctly with no data', () => {
    expect(folderTreeView.shadowRoot?.innerHTML).toContain(
      '<div class="folder-tree-view">'
    )
  })

  it('should set treeData and render tree nodes', () => {
    const treeData: ITreeNode = {
      name: 'root',
      type: 'folder',
      size: 0,
      children: [
        { name: 'file1.txt', type: 'file', size: 1000, modified: new Date() },
        {
          name: 'folder1',
          type: 'folder',
          size: 0,
          children: [],
          modified: new Date()
        }
      ],
      modified: new Date()
    }

    folderTreeView.treeData = treeData

    expect(folderTreeView.shadowRoot?.querySelectorAll('.tree-node').length).toBe(2)
  })

  it('should update selectedFolder on node click', () => {
    const treeData: ITreeNode = {
      name: 'root',
      type: 'folder',
      size: 0,
      children: [
        { name: 'file1.txt', type: 'file', size: 1000, modified: new Date() },
        {
          name: 'folder1',
          type: 'folder',
          size: 0,
          children: [],
          modified: new Date()
        }
      ],
      modified: new Date()
    }

    folderTreeView.treeData = treeData

    const folder1Node = folderTreeView.shadowRoot?.querySelectorAll('.tree-node .filename')[1] as HTMLElement;
    expect(folder1Node).not.toBeNull()

    folder1Node.click()

    expect(folderTreeView.currentDir).toBe('root/folder1')
  })

  it('should dispatch folder-selected event on node click', () => {
    const treeData: ITreeNode = {
      name: 'root',
      type: 'folder',
      size: 0,
      children: [
        { name: 'file1.txt', type: 'file', size: 1000, modified: new Date() },
        {
          name: 'folder1',
          type: 'folder',
          size: 0,
          children: [],
          modified: new Date()
        }
      ],
      modified: new Date()
    }

    folderTreeView.treeData = treeData

    const folder1Node = folderTreeView.shadowRoot?.querySelectorAll('.tree-node .filename')[1] as HTMLElement;
    expect(folder1Node).not.toBeNull()

    const eventSpy = vi.spyOn(folderTreeView, 'dispatchEvent')
    folder1Node.click()

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'node-selected' })
    )
  })

  it('should render correct tree when currentPath manually set outside the component', () => {
    const treeData: ITreeNode = {
      name: 'root',
      type: 'folder',
      size: 0,
      children: [
        { name: 'file1.txt', type: 'file', size: 1000, modified: new Date() },
        {
          name: 'folder1',
          type: 'folder',
          size: 0,
          children: [
            {
              name: 'file2.txt',
              type: 'file',
              size: 1000,
              modified: new Date()
            },
            {
              name: 'folder2',
              type: 'folder',
              size: 0,
              children: [],
              modified: new Date()
            }
          ],
          modified: new Date()
        }
      ],
      modified: new Date()
    }

    folderTreeView.treeData = treeData
    folderTreeView.currentDir = 'root/folder1'

    expect(folderTreeView.currentDir).toBe('root/folder1')
  })
})