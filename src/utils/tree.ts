import { ITreeNode } from "../types/tree";

export const generateNodeUrl = (node: ITreeNode, parentPath: string = ''): string => {
  const path = parentPath ? `${parentPath}/${node.name}` : node.name;
  return path; 
};

export const findNodeByUrl = (tree: ITreeNode, url: string): ITreeNode | null => {
  let currentNode: ITreeNode | null = tree;
  const [rootNode, ... pathParts] = url.split('/');
  
  if (url === '') return tree;

  if (rootNode !== tree.name) {
    return null;
  }

  if (pathParts.length === 0) {
    return tree;
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