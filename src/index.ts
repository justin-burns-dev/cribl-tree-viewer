import './styles/main.css'
import './components/FileExporer'; 
import { getMockFileSystemData } from './utils/mockTree';

import { FileExplorer } from './components/FileExporer';

const fileExploreElement = document.querySelector('file-explorer') as FileExplorer;
fileExploreElement.treeData = getMockFileSystemData();