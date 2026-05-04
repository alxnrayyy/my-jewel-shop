const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

module.exports = {
    getAll: () => JSON.parse(fs.readFileSync(dbPath, 'utf8')),
    saveAll: (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)),
    getById: (id) => JSON.parse(fs.readFileSync(dbPath, 'utf8')).find(i => i.id === parseInt(id))
};