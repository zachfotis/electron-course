const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  subscribeStatistics: (callback: (statistics: any) => void) => {
    callback('Subscribed to statistics');
  },
  getStaticData: () => console.log('Getting static data'),
});
