interface Item {
    ItemID: number;
    ItemName: string;
    Description: string;
    Category: string;
    Available: boolean;
    Damaged: boolean;
    Picture?: string;
}

document.addEventListener("DOMContentLoaded", async () => {
    const contentContainer = document.getElementById("content");

    if (!contentContainer) {
        console.error("Content container not found.");
        return;
    }

    try {
        const categoryResponse = await fetch('http://localhost:3000/api/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!categoryResponse.ok) {
            console.error("Failed to fetch categories from server.");
            return;
        }

        const categories = await categoryResponse.json();

        const response = await fetch('http://localhost:3000/api/items', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch items from server.");
            return;
        }

        const items: Item[] = await response.json();

        items.forEach((item) => {
            const card = document.createElement("div");
            card.classList.add("card");

            if (item.Picture) {
                const img = document.createElement("img");
                img.src = `data:image/jpeg;base64,${item.Picture}`;
                img.alt = `${item.ItemName} Image`;
                card.appendChild(img);
            }

            const cardContent = document.createElement("div");
            cardContent.classList.add("cardContent");

            cardContent.innerHTML = `
                <h2 id="itemId">${item.ItemNumber}</h2>
                <h3>${item.ItemName}</h3>
                <button class="toggle-details"><i class="fa-solid fa-plus fa-3x"></i></button>
            `;

            card.appendChild(cardContent);

            const extraContent = document.createElement("div");
            extraContent.classList.add("extra-content");

            const categoryDropdown = document.createElement("select");
            categoryDropdown.name = `category-${item.ItemID}`;
            categoryDropdown.id = `category-${item.ItemID}`;

            categories.forEach((category: { name: string | null; }) => {
                const option = document.createElement("option");
                if (typeof category.name === "string") {
                    option.value = category.name;
                }
                option.textContent = category.name;
                if (category.name === item.Category) {
                    option.selected = true;
                }
                categoryDropdown.appendChild(option);
            });

            const isAvailableChecked = (item.Available === 'Y');
            const isDamagedChecked = (item.Damaged === 'Y');

            extraContent.appendChild(categoryDropdown);

            extraContent.innerHTML = `
             <input type="checkbox" id="available-${item.ItemID}" name="available" ${
                isAvailableChecked ? "checked" : ""
            }>
            <label for="available-${item.ItemID}">Verfügbar</label><br>

             <input type="checkbox" id="damaged-${item.ItemID}" name="damaged" ${
                isDamagedChecked ? "checked" : ""
            }>
            <label for="damaged-${item.ItemID}">Beschädigt</label><br>

            <textarea rows="3" placeholder="Beschreibung...">${item.Description || ""}</textarea>
            
            <button>Löschen</button>
            <button id="saveButton">Speichern</button>
`;

            card.appendChild(extraContent);


            cardContent.querySelector(".toggle-details")?.addEventListener("click", () => {
                extraContent.classList.toggle("show-content");
            });

            contentContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching items:", error);
    }
});
