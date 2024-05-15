const form = document.getElementById('addItemForm') as HTMLFormElement;

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent the form from submitting

    const formData = {
        itemName: (document.getElementById('itemName') as HTMLInputElement).value,
        description: (document.getElementById('description') as HTMLTextAreaElement).value,
        category: (document.getElementById('category') as HTMLInputElement).value,
        available: (document.getElementById('available') as HTMLInputElement).checked,
        damaged: (document.getElementById('damaged') as HTMLInputElement).checked,
    };

    try {
        const response = await fetch('/api/item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Item added successfully', data);
        } else {
            console.error('Error adding item');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    let popup = document.getElementById('popup') as HTMLDivElement;
    popup.style.display = 'none';
});

const itemContainer = document.getElementById('itemContainer') as HTMLDivElement;

function createItemCard(item: any): HTMLDivElement {
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = item.Picture ? `data:image/jpeg;base64,${item.Picture}` : 'img/prototypBild.jpg'; // Beispielbild
    card.appendChild(img);

    const cardContent = document.createElement('div');
    cardContent.classList.add('cardContent');

    const title = document.createElement('h2');
    title.textContent = item.ItemName;
    cardContent.appendChild(title);

    card.appendChild(cardContent);

    return card;
}

async function fetchAllItems() {
    try {
        const response = await fetch('/api/item');
        if (response.ok) {
            const items = await response.json();

            itemContainer.innerHTML = '';

            items.forEach((item: any) => {
                const card = createItemCard(item);
                itemContainer.appendChild(card);
            });
        } else {
            console.error('Error fetching items');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAllItems);

