import { ITreeNode } from '../types/tree';
import folderIcon from '../icons/folder-solid.svg';
import fileIcon from '../icons/file-solid.svg';
import pdfIcon from '../icons/file-pdf-solid.svg';

export const getIconForNode = (node: ITreeNode): string => {
  let svgFile = '';
  if (node.type === 'folder') {
    svgFile = folderIcon;
  } else if (node.type === 'file') {
    switch (node.name.split('.').pop()) {
      case 'pdf':
        svgFile = pdfIcon;
        break;
      default:
        svgFile = fileIcon;
    }
  }
  return svgFile;
} 

export const getFolderIcon = (): string => folderIcon;