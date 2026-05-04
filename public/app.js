document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-icon').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('.card').dataset.id;
            if (confirm('Удалить?')) {
                const res = await fetch(`/items/${id}`, { method: 'DELETE' });
                if (res.ok) location.reload();
            }
        });
    });

    document.querySelectorAll('.edit-icon').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const card = e.target.closest('.card');
            const id = card.dataset.id;
            const name = prompt("Название:", card.querySelector('h2').innerText);
            const price = prompt("Цена:", card.querySelector('p').innerText.replace(' ₽', ''));
            if (name && price) {
                await fetch(`/items/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price: Number(price) })
                });
                location.reload();
            }
        });
    });

    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', async () => {
            const name = document.getElementById('nameInp').value;
            const price = document.getElementById('priceInp').value;
            await fetch('/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price: Number(price) })
            });
            location.reload();
        });
    }
});