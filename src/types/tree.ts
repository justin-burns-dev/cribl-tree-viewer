export interface ITreeNode {
  type: 'file' | 'folder';
  name: string;
  modified: Date | string;
  size: number;
  children?: ITreeNode[];
}