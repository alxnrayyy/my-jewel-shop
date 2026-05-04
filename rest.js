const store = require('./store');

module.exports = {
    list: (req, res) => res.json(store.getAll()),
    
    item: (req, res) => {
        const item = store.getById(req.params.id);
        item ? res.json(item) : res.status(404).send('Не найдено');
    },

    create: (req, res) => {
        const items = store.getAll();
        const newItem = { id: Date.now(), ...req.body };
        items.push(newItem);
        store.saveAll(items);
        res.status(201).json(newItem);
    },

    update: (req, res) => {
        let items = store.getAll();
        const index = items.findIndex(i => i.id === parseInt(req.params.id));
        if (index !== -1) {
            items[index] = { ...items[index], ...req.body };
            store.saveAll(items);
            res.json(items[index]);
        } else { res.status(404).send('Не найдено'); }
    },

    remove: (req, res) => {
        let items = store.getAll();
        const newItems = items.filter(i => i.id !== parseInt(req.params.id));
        store.saveAll(newItems);
        res.status(204).send();
    },

    renderUI: (req, res) => {
    let items = store.getAll();
    const { search, sort, page = 1 } = req.query;
    const limit = 4; 

    if (search) {
        items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (sort === 'asc') {
        items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'desc') {
        items.sort((a, b) => b.name.localeCompare(a.name));
    }

    const totalPages = Math.ceil(items.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    res.render('items', { 
        items: paginatedItems, 
        currentPage: Number(page), 
        totalPages,
        search: search || '',
        sort: sort || ''
    });

    module.exports = router;
}
};