const express = require('express');
const router = express.Router();
const store = require('./store');

// Функция для отрисовки страницы товаров
router.get('/view-items', (req, res) => {
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
});

// Дополнительные API маршруты (если нужны для тестов)
router.get('/api/items', (req, res) => res.json(store.getAll()));

// САМАЯ ВАЖНАЯ СТРОКА ДЛЯ ЭКСПОРТА
module.exports = router;