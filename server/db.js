const getMockFileSystemData = async () => ({
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
        ... Array.from({ length: 30 }, (_, i) => ({
          type: 'folder',
          name: `Folder${i + 1}`,
          modified: new Date('7/6/2020'),
          size: 0
        })),
        {
          type: 'folder',
          name: 'Projects',
          modified: new Date('7/6/2020'),
          size: 0,
        },
        {
          type: 'file',
          name: 'Description1.pdf',
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
      size: 0,
      children: [
        {
          type: 'file',
          name: 'Description1.pdf',
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
      name: 'System',
      modified: new Date('7/6/2020'),
      size: 0,
      children: [
        {
          type: 'file',
          name: 'Description1.pdf',
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
    }
  ]
});


module.exports = {
  getMockFileSystemData
} 