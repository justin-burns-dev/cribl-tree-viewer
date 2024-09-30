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
          type: 'folder',
          name: 'Projects',
          modified: new Date('7/6/2020'),
          size: 0,
        },
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

export const generateNodeUrl = (node: ITreeNode, parentPath: string = ''): string => {
  const path = parentPath ? `${parentPath}/${node.name}` : node.name;
  return path; 
};

export const findNodeByUrl = (tree: ITreeNode, url: string): ITreeNode | null => {
  let currentNode: ITreeNode | null = tree;
  const [rootNode, ... pathParts] = url.split('/');
  if (rootNode !== tree.name) {
    return null;
  }

  for (const part of pathParts) {
    if (currentNode && currentNode.children) {
      currentNode = currentNode.children.find(child => child.name === part) || null;
    } else {
      return null;
    }
  }

  return currentNode;
};