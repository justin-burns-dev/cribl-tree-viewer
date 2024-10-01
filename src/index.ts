import './styles/main.css'
import './components/FileExporer'; 
import { getMockFileSystemData } from './utils/mockTree';

import { FileExplorer } from './components/FileExporer';

const fileExploreElement = document.querySelector('file-explorer') as FileExplorer;

fetch("http://localhost:3000/api/files")
  .then(response => response.json())
  .then(data => {
    fileExploreElement.treeData = data;
  });