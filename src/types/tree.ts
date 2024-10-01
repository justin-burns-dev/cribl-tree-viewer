export interface ITreeNode {
  type: 'file' | 'folder';
  name: string;
  modified: Date;
  size: number;
  children?: ITreeNode[];
}