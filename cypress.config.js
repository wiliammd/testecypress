import fs from 'fs';
export default {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
       on('task', {
        deleteFileIfExists(filePath) {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
          }
          return false;
        },
      });
    },
  },
};
