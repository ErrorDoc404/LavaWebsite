const fs = require('fs');

module.exports = (client) => {
    fs.readdir('./erelaStats/', async (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const node = require(`../erelaStats/${file}`);
            let stateName = file.split('.')[0];
            client.manager.on(stateName, node.run.bind(null, client));
            client.log(`Loaded nodes '${stateName}'`);
        });
    });
}