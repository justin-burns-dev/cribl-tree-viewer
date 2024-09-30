import { ITreeNode } from "../types/tree";

export const getMockFileSystemData = (): ITreeNode => ({
  type: 'folder',
  name: 'Files',
  modified: new Date('7/6/2020'),
  size: 0,
  children: [
    {
      type: 'folder',
      name: 'Documents',
      modified: new Date('7/6/2020'),
      size: 0,
      children: [
        {
          type: 'file',
          name: 'Description1.rtf',
          modified: new Date('7/6/2020'),
          size: 1024
        },
        {
          type: 'file',
          name: 'Description2.txt',
          modified: new Date('7/6/2020'),
          size: 2048 
        }
      ]
    },
    {
      type: 'folder',
      name: 'Images',
      modified: new Date('7/6/2020'),
      size: 0
    },
    {
      type: 'folder',
      name: 'System',
      modified: new Date('7/6/2020'),
      size: 0
    }
  ]
});
