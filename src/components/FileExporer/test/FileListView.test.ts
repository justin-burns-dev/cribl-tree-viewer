import { FileListView } from '../FileListView'
import { ITreeNode } from '../../../types/tree'
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'

describe('FileListView', () => {
  let fileListView: FileListView

  beforeEach(() => {
    fileListView = new FileListView()
    document.body.appendChild(fileListView)
  })

  afterEach(() => {
    document.body.removeChild(fileListView)
  })

  it('should render correctly with no data', () => {
    expect(fileListView.shadowRoot?.innerHTML).toContain(
      '<div class="file-list-view">'
    )
  })

  it('should set treeData and render table rows', () => {
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

    fileListView.treeData = treeData

    expect(fileListView.shadowRoot?.querySelectorAll('tbody tr').length).toBe(2)
  })

  it('should update selectedFile on row click', () => {
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

    fileListView.treeData = treeData

    const firstRow = fileListView.shadowRoot?.querySelector(
      'tbody tr'
    ) as HTMLElement
    firstRow.click()

    expect(fileListView.selectedFile).toBe('root/file1.txt')
  })

  it('should dispatch node-selected event on row click', () => {
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

    fileListView.treeData = treeData

    const firstRow = fileListView.shadowRoot?.querySelector(
      'tbody tr'
    ) as HTMLElement
    const eventSpy = vi.spyOn(fileListView, 'dispatchEvent')
    firstRow.click()

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'node-selected' })
    )
  })

  it('should update currentDir and dispatch path-changed event on double click', async () => {
    const treeData: ITreeNode = {
      name: 'root',
      type: 'folder',
      size: 0,
      children: [
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

    fileListView.treeData = treeData

    expect(fileListView.currentDir).toBe('root')

    let firstRow = fileListView.shadowRoot?.querySelector(
      'tbody tr'
    ) as HTMLElement
    const eventSpy = vi.spyOn(fileListView, 'dispatchEvent')

    firstRow.click();

    firstRow = fileListView.shadowRoot?.querySelector(
      'tbody tr'
    ) as HTMLElement
    firstRow.click()

    expect(fileListView.currentDir).toBe('root/folder1')
    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'path-changed' })
    )
  })

  it('should not update currentDir on double click if node is a file', () => {
    const treeData: ITreeNode = {
      name: 'root',
      type: 'folder',
      size: 0,
      children: [
        { name: 'file1.txt', type: 'file', size: 1000, modified: new Date() }
      ],
      modified: new Date()
    }

    fileListView.treeData = treeData

    const firstRow = fileListView.shadowRoot?.querySelector(
      'tbody tr'
    ) as HTMLElement
    const eventSpy = vi.spyOn(fileListView, 'dispatchEvent')
    firstRow.click()
    firstRow.click()

    expect(fileListView.currentDir).toBe('root')
    expect(eventSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'path-changed' })
    )
  })

  it('should render correct file size for files', () => {
    const treeData: ITreeNode = {
      name: 'root',
      type: 'folder',
      size: 0,
      children: [
        { name: 'file1.txt', type: 'file', size: 1024, modified: new Date() },
        {
          name: 'file1.txt',
          type: 'file',
          size: 1024 * 1024,
          modified: new Date()
        }
      ],
      modified: new Date()
    }

    fileListView.treeData = treeData

    const firstRow = fileListView.shadowRoot?.querySelector(
      'tbody tr'
    ) as HTMLElement
    const secondRow = fileListView.shadowRoot?.querySelectorAll(
      'tbody tr'
    )[1] as HTMLElement

    expect(firstRow.querySelector('.col-size')?.textContent).toBe('1 KB')
    expect(secondRow.querySelector('.col-size')?.textContent).toBe('1 MB')
  })

  it('should not render file size for folders', () => {
    const treeData: ITreeNode = {
      name: 'root',
      type: 'folder',
      size: 0,
      children: [
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

    fileListView.treeData = treeData

    const firstRow = fileListView.shadowRoot?.querySelector(
      'tbody tr'
    ) as HTMLElement
    const sizeCell = firstRow.querySelector('.col-size') as HTMLElement

    expect(sizeCell.textContent).toBe('')
  })

  it('should render correct icon for files and folders', () => {
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

    fileListView.treeData = treeData

    const rows = fileListView.shadowRoot?.querySelectorAll(
      'tbody tr'
    ) as NodeListOf<HTMLElement>
    const fileIcon = rows[0].querySelector('.file-icon img') as HTMLImageElement
    const folderIcon = rows[1].querySelector(
      '.file-icon img'
    ) as HTMLImageElement

    expect(fileIcon.src).toContain('file-solid')
    expect(folderIcon.src).toContain('folder-solid')
  })

  it('should render correct list when currentPath manually set outside the component', () => {
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

    fileListView.treeData = treeData
    fileListView.currentDir = 'root/folder1'

    expect(fileListView.shadowRoot?.querySelectorAll('tbody tr').length).toBe(2)
    expect(fileListView.currentDir).toBe('root/folder1')
  })
})
