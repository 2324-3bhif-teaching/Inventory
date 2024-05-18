interface Item {
    ItemNumber: number;
    ItemName: string;
    Description: string;
    Category: string;
    Available: string;
    Damaged: string;
}

document.addEventListener("DOMContentLoaded", async () => {
    const addDeviceButton = document.getElementById("addDeviceButton");
    const devicePopup = document.getElementById("devicePopup");
    const closePopup = document.getElementById("closePopup");
    const deviceForm = document.getElementById("deviceForm");
    const deviceTypeDropdown = document.getElementById("deviceType");
    const contentContainer = document.getElementById("content");
    const editPopup = document.getElementById("editPopup") as HTMLDivElement;
    const closeEPopup = document.getElementById("closeEditPopup") as HTMLDivElement;
    const editForm = document.getElementById("editForm") as HTMLFormElement;
    const editItemNumber = document.getElementById("editItemNumber") as HTMLInputElement;
    const editItemName = document.getElementById("editItemName") as HTMLInputElement;
    const editCategory = document.getElementById("editCategory") as HTMLSelectElement;
    const editDescription = document.getElementById("editDescription") as HTMLTextAreaElement;
    const editAvailable = document.getElementById("editAvailable") as HTMLInputElement;
    const editDamaged = document.getElementById("editDamaged") as HTMLInputElement;


    if (contentContainer && addDeviceButton && devicePopup && closePopup && deviceForm && deviceTypeDropdown) {

        const fetchItemsAndUpdateList = async () => {
            try {
                const itemsResponse = await fetch('http://localhost:3000/api/items');
                if (!itemsResponse.ok) throw new Error("Failed to fetch items");
                const items = await itemsResponse.json();

                contentContainer.innerHTML = "";

                items.forEach((item: any) => {
                    const card = document.createElement("div");
                    card.classList.add("card");

                    const cardContent = document.createElement("div");
                    cardContent.classList.add("cardContent");

                    cardContent.innerHTML = `
                <h2>${item.ItemNumber}</h2>
                <h3>${item.ItemName}</h3>
                <button class="toggle-details"><i class="fa-solid fa-chevron-down"></i></button>
            `;

                    card.appendChild(cardContent);

                    const extraContent = document.createElement("div");
                    extraContent.classList.add("extra-content");

                    extraContent.innerHTML = `
                <p>Kategorie: ${item.Category}</p>
                <p>Beschreibung: ${item.Description}</p>
                <p>Verfügbar: ${item.Available === 'Y' ? "Ja" : "Nein"}</p>
                <p>Beschädigt: ${item.Damaged === 'Y' ? "Ja" : "Nein"}</p>
                <button class="editButton">Bearbeiten</button>
                <button class="deleteButton">Löschen</button>`;

                    card.appendChild(extraContent);

                    cardContent.querySelector(".toggle-details")?.addEventListener("click", () => {
                        extraContent.classList.toggle("show-content");
                    });

                    extraContent.querySelector(".editButton")?.addEventListener("click", () => {
                        openEditPopup(item);
                    });

                    extraContent.querySelector(".deleteButton")?.addEventListener("click", async () => {
                        const confirmDelete = confirm("Sind Sie sicher, dass Sie diesen Artikel löschen möchten?");
                        if (confirmDelete) {
                            await deleteItem(item.ItemNumber);
                            await fetchItemsAndUpdateList();
                        }
                    });

                    contentContainer.appendChild(card);
                });
            } catch (error) {
                console.error("Error fetching and updating items:", error);
            }
        };

        const openEditPopup = (item: Item) => {
            populateEditForm(item);
            editPopup.style.display = "block";
            editPopup.style.display = "block";
        };

        const closeEditPopup = () => {
            editPopup.style.display = "none";
        };

        const deleteItem = async (itemNumber: number) => {
            try {
                const response = await fetch(`http://localhost:3000/api/items/${itemNumber}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    alert("Item deleted successfully.");
                    await fetchItemsAndUpdateList();
                } else {
                    console.error("Failed to delete item.");
                }
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        };

        const populateCategoryDropdown = async () => {
            if (deviceTypeDropdown) {
                deviceTypeDropdown.innerHTML = "";

                try {
                    const response = await fetch('http://localhost:3000/api/categories');
                    if (response.ok) {
                        const categories = await response.json();
                        categories.forEach((category: { name: string | null; }) => {
                            const option = document.createElement("option");
                            if (typeof category.name === "string") {
                                option.value = category.name;
                            }
                            option.textContent = category.name;
                            deviceTypeDropdown.appendChild(option);
                        });
                    } else {
                        console.error("Error fetching categories");
                    }
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }
            }
        };

        if (addDeviceButton) {
            addDeviceButton.addEventListener("click", () => {
                if (devicePopup) {
                    populateCategoryDropdown();
                    devicePopup.style.display = "block";
                }
            });
        }

        if (closePopup) {
            closePopup.addEventListener("click", () => {
                if (devicePopup) {
                    devicePopup.style.display = "none";
                }
            });
        }

        if (deviceForm) {
            deviceForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                const deviceName = (document.getElementById("deviceName") as HTMLInputElement).value;
                const deviceType = (document.getElementById("deviceType") as HTMLInputElement).value;
                const description = (document.getElementById("deviceDescription") as HTMLInputElement).value;
                const available = (document.getElementById("deviceAvailable") as HTMLInputElement).checked ? 'Y' : 'N';
                const damaged = (document.getElementById("deviceDamaged") as HTMLInputElement).checked ? 'Y' : 'N';

                const newDevice = {
                    itemName: deviceName,
                    description,
                    category: deviceType,
                    available,
                    damaged,
                    picture: null,
                };

                const response = await fetch('http://localhost:3000/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newDevice),
                });

                if (response.ok) {
                    alert("Gerät erfolgreich hinzugefügt!");

                    await fetchItemsAndUpdateList();

                    (document.getElementById("deviceName") as HTMLInputElement).value = '';
                    (document.getElementById("deviceType") as HTMLInputElement).value = '';
                    (document.getElementById("deviceDescription") as HTMLInputElement).value = '';
                    (document.getElementById("deviceAvailable") as HTMLInputElement).checked = false;
                    (document.getElementById("deviceDamaged") as HTMLInputElement).checked = false;

                    if (devicePopup) {
                        devicePopup.style.display = "none";
                    }
                } else {
                    alert("Fehler beim Hinzufügen des Geräts.");
                }
                if (devicePopup) {
                    devicePopup.style.display = "none";
                }
            });
        }
    }

    const fetchItemsAndUpdateList = async () => {
        try {

            if (!contentContainer) {
                console.error("Content container not found in DOM.");
                return;
            }

            const itemsResponse = await fetch('http://localhost:3000/api/items');
            if (!itemsResponse.ok) throw new Error("Failed to fetch items");
            const items = await itemsResponse.json();

            contentContainer.innerHTML = "";

            items.forEach((item: any) => {
                const card = document.createElement("div");
                card.classList.add("card");

                const cardContent = document.createElement("div");
                cardContent.classList.add("cardContent");

                cardContent.innerHTML = `
                <h2>${item.ItemNumber}</h2>
                <h3>${item.ItemName}</h3>
                <button class="toggle-details"><i class="fa-solid fa-chevron-down"></i></button>
            `;

                card.appendChild(cardContent);

                const extraContent = document.createElement("div");
                extraContent.classList.add("extra-content");

                extraContent.innerHTML = `
                <p>Kategorie: ${item.Category}</p>
                <p>Beschreibung: ${item.Description}</p>
                <p>Verfügbar: ${item.Available === 'Y' ? "Ja" : "Nein"}</p>
                <p>Beschädigt: ${item.Damaged === 'Y' ? "Ja" : "Nein"}</p>
                <button class="editButton">Bearbeiten</button>
                <button class="deleteButton">Löschen</button>`;

                card.appendChild(extraContent);

                cardContent.querySelector(".toggle-details")?.addEventListener("click", () => {
                    extraContent.classList.toggle("show-content");
                });

                extraContent.querySelector(".editButton")?.addEventListener("click", () => {
                    openEditPopup(item);
                });

                extraContent.querySelector(".deleteButton")?.addEventListener("click", async () => {
                    const confirmDelete = confirm("Sind Sie sicher, dass Sie diesen Artikel löschen möchten?");
                    if (confirmDelete) {
                        await deleteItem(item.ItemNumber);
                        await fetchItemsAndUpdateList();
                    }
                });

                contentContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching and updating items:", error);
        }
    };

    const populateEditForm = (item: Item) => {
        editItemNumber.value = item.ItemNumber.toString();
        editItemName.value = item.ItemName;
        editCategory.value = item.Category;
        editDescription.value = item.Description;
        editAvailable.checked = item.Available === 'Y';
        editDamaged.checked = item.Damaged === 'Y';
    };

    const openEditPopup = (item: Item) => {
        populateEditForm(item);
        editPopup.style.display = "block";
        editPopup.style.display = "block";
    };

    const closeEditPopup = () => {
        editPopup.style.display = "none";
    };

    const deleteItem = async (itemNumber: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/items/${itemNumber}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert("Item deleted successfully.");
                await fetchItemsAndUpdateList();
            } else {
                console.error("Failed to delete item.");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    if (!contentContainer || !editPopup || !closeEPopup || !editForm || !editItemNumber || !editItemName || !editCategory || !editDescription || !editAvailable || !editDamaged) {
        console.error("Some elements are missing in the DOM.");
        return;
    }

    const fetchCategories = async () => {
        try {
            const categoryResponse = await fetch('http://localhost:3000/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!categoryResponse.ok) {
                console.error("Failed to fetch categories from server.");
                return [];
            }

            return await categoryResponse.json();
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/items', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch items from server.");
                return [];
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching items:", error);
            return [];
        }
    };


    const saveItem = async (event: Event) => {
        event.preventDefault();

        const confirmSave = confirm("Möchten Sie die Änderungen wirklich speichern?");
        if (!confirmSave) {
            return;
        }

        try {
            const itemNumber = parseInt(editItemNumber.value, 10);
            const itemName = editItemName.value;
            const category = editCategory.value;
            const available = editAvailable.checked ? 'Y' : 'N';
            const damaged = editDamaged.checked ? 'Y' : 'N';
            const description = editDescription.value;

            const payload = {
                itemName,
                description,
                category,
                available,
                damaged,
            };

            const response = await fetch(`http://localhost:3000/api/items/${itemNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Item saved successfully.");
                await fetchItemsAndUpdateList();
                closeEditPopup();
            } else {
                console.error("Failed to save item.");
            }
        } catch (error) {
            console.error("Error saving item:", error);
        }
    };


    closeEPopup.addEventListener("click", closeEditPopup);
    editForm.addEventListener("submit", saveItem);

    window.addEventListener("click", (event) => {
        if (event.target === editPopup) {
            closeEditPopup();
        }
    });

    const categories = await fetchCategories();

    categories.forEach((category: { name: string }) => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        editCategory.appendChild(option);
    });

    const items = await fetchItems();

    items.forEach((item: any) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardContent = document.createElement("div");
        cardContent.classList.add("cardContent");

        cardContent.innerHTML = `
            <h2>${item.ItemNumber}</h2>
            <h3>${item.ItemName}</h3>
            <button class="toggle-details"><i class="fa-solid fa-chevron-down"></i></button>
        `;

        card.appendChild(cardContent);

        const extraContent = document.createElement("div");
        extraContent.classList.add("extra-content");

        extraContent.innerHTML = `
            <p>Kategorie: ${item.Category}</p>
            <p>Beschreibung: ${item.Description}</p>
            <p>Verfügbar: ${item.Available === 'Y' ? "Ja" : "Nein"}</p>
            <p>Beschädigt: ${item.Damaged === 'Y' ? "Ja" : "Nein"}</p>
            <button class="editButton">Bearbeiten</button>
            <button class="deleteButton">Löschen</button>`;

        card.appendChild(extraContent);

        cardContent.querySelector(".toggle-details")?.addEventListener("click", () => {
            extraContent.classList.toggle("show-content");
        });

        extraContent.querySelector(".editButton")?.addEventListener("click", () => {
            openEditPopup(item);
        });

        extraContent.querySelector(".deleteButton")?.addEventListener("click", async () => {
            const confirmDelete = confirm("Sind Sie sicher, dass Sie diesen Artikel löschen möchten?");
            if (confirmDelete) {
                await deleteItem(item.ItemNumber);
            }
        });

        contentContainer.appendChild(card);
    });
});