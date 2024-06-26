interface Item {
    ItemNumber: number;
    ItemName: string;
    Description: string;
    Category: string;
    Available: string;
    Damaged: string;
    Picture: string;
}


document.addEventListener("DOMContentLoaded", async () => {
    const domain = "localhost:3000";

    const addDeviceButton = document.getElementById("addDeviceButton") as HTMLButtonElement;
    const devicePopup = document.getElementById("devicePopup") as HTMLDivElement;
    const closePopup = document.getElementById("closePopup") as HTMLDivElement;
    const deviceForm = document.getElementById("deviceForm") as HTMLFormElement;
    const deviceTypeDropdown = document.getElementById("deviceType");
    const contentContainer = document.getElementById("content") as HTMLDivElement;
    const editPopup = document.getElementById("editPopup") as HTMLDivElement;
    const closeEPopup = document.getElementById("closeEditPopup") as HTMLDivElement;
    const editForm = document.getElementById("editForm") as HTMLFormElement;
    const editItemNumber = document.getElementById("editItemNumber") as HTMLInputElement;
    const editItemName = document.getElementById("editItemName") as HTMLInputElement;
    const editCategory = document.getElementById("editCategory") as HTMLSelectElement;
    const editDescription = document.getElementById("editDescription") as HTMLTextAreaElement;
    const editAvailable = document.getElementById("editAvailable") as HTMLInputElement;
    const editDamaged = document.getElementById("editDamaged") as HTMLInputElement;
    const categoryDropdown = document.getElementById("categoryDropdown") as HTMLSelectElement
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const fileLabelText = document.getElementById("fileLabelText") as HTMLSpanElement;
    const editFileInput = document.getElementById("editFileInput") as HTMLInputElement;
    const editFileLabelText = document.getElementById("editFileLabelText") as HTMLSpanElement;
    const homeButton = document.getElementById("homeButton") as HTMLButtonElement;

    fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files.length > 0) {
            fileLabelText.textContent = '✓ Bild hochgeladen';
        } else {
            fileLabelText.textContent = 'Bild auswählen';
        }
    });

    editFileInput.addEventListener("change", () => {
        if (editFileInput.files && editFileInput.files.length > 0) {
            editFileLabelText.textContent = '✓ Bild hochgeladen';
        } else {
            editFileLabelText.textContent = 'Bild auswählen';
        }
    });

    function getSelectedCategory() {
        return categoryDropdown ? categoryDropdown.value : "all";
    }

    function setSelectedCategory(category: any) {
        if (categoryDropdown) {
            categoryDropdown.value = category;
        }
    }

    const fetchItemsAndUpdateList = async () => {
        try {
            const itemsResponse = await fetch(`http://${domain}/api/items`);
            if (!itemsResponse.ok) throw new Error("Failed to fetch items");
            const items = await itemsResponse.json();

            contentContainer.innerHTML = "";

            items.forEach((item: Item) => {
                createCard(item);
            });

            const urlParams = new URLSearchParams(window.location.search);
            const itemId = urlParams.get("item");
            if (itemId) {
                showOnlyItem(itemId);
            }
        } catch (error) {
            console.error("Error fetching and updating items:", error);
        }
    };
    const populateCategoryDropdown = async () => {
        if (deviceTypeDropdown) {
            deviceTypeDropdown.innerHTML = "";
            try {
                const response = await fetch(`http://${domain}/api/categories`);
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
            const fileInput = document.getElementById("fileInput") as HTMLInputElement;

            const newDevice = {
                itemName: deviceName,
                description: description,
                category: deviceType,
                available: available,
                damaged: damaged,
                picture: ""
            };

            const selectedCategory = getSelectedCategory();

            const response = await fetch(`http://${domain}/api/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDevice),
            });

            let res = await response.json();

            if (response.ok) {
                alert("Gerät erfolgreich hinzugefügt!");

                (document.getElementById("deviceName") as HTMLInputElement).value = '';
                (document.getElementById("deviceType") as HTMLInputElement).value = '';
                (document.getElementById("deviceDescription") as HTMLInputElement).value = '';
                (document.getElementById("deviceAvailable") as HTMLInputElement).checked = false;
                (document.getElementById("deviceDamaged") as HTMLInputElement).checked = false;

                if (devicePopup) {
                    devicePopup.style.display = "none";
                }

                if (fileInput.files && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    await uploadImage(file, res.value);
                }

                (document.getElementById("fileInput") as HTMLInputElement).value = '';

                setSelectedCategory(selectedCategory);
                await fetchItemsAndUpdateList();
                await filterItemsByCategory();
            } else {
                alert("Fehler beim Hinzufügen des Geräts.");
            }
            if (devicePopup) {
                devicePopup.style.display = "none";
            }

        });
    }

    const uploadImage = async (file: string | Blob, itemId : number) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await fetch(`http://${domain}/api/items/${itemId}/upload`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                return (await response.json()).value;
            } else {
                console.error('Failed to upload image. Error ' + response.status);
                return null;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
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
            const response = await fetch(`http://${domain}/api/items/${itemNumber}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const selectedCategory = getSelectedCategory();

            if (response.ok) {
                alert("Item deleted successfully.");
                await fetchItemsAndUpdateList();
                setSelectedCategory(selectedCategory);
                await filterItemsByCategory();
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
            const categoryResponse = await fetch(`http://${domain}/api/categories`, {
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

    const saveItem = async (event: { preventDefault: () => void; }) => {
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

            const currentItem = {
                ItemNumber: itemNumber,
                ItemName: itemName,
                Category: category,
                Available: available,
                Damaged: damaged,
                Description: description,
                Picture: "",
            };

            const currentImage = document.querySelector(`#item_${itemNumber} img`) as HTMLImageElement;
            if (currentImage) {
                currentItem.Picture = currentImage.src;
            }

            const payload = {
                itemName,
                description,
                category,
                available,
                damaged,
                picture: currentItem.Picture,
            };

            const selectedCategory = getSelectedCategory();

            const response = await fetch(`http://${domain}/api/items/${itemNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Erfolgreich gespeichert.");

                const fileInput = document.getElementById("editFileInput") as HTMLInputElement;
                let imageUploaded = false;

                if (fileInput.files && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const itemId = parseInt(editItemNumber.value, 10);

                    const imageUrl = await uploadImage(file, itemId);
                    if (imageUrl) {
                        imageUploaded = true;
                    } else {
                        console.error("Fehler beim Hochladen des Bildes.");
                    }
                }

                await fetchItemsAndUpdateList();
                setSelectedCategory(selectedCategory);
                await filterItemsByCategory();
                closeEditPopup();
            } else {
                console.error("Speichern fehlgeschlagen.");
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

    const filterItemsByCategory = async () => {
        const selectedCategory = getSelectedCategory();
        try {
            const itemsResponse = await fetch(`http://${domain}/api/items`);
            if (!itemsResponse.ok) throw new Error("Failed to fetch items");
            const items = await itemsResponse.json();

            contentContainer.innerHTML = "";

            items.forEach((item: any) => {
                if (selectedCategory === "all" || item.Category === selectedCategory) {
                    createCard(item);
                }
            });
        } catch (error) {
            console.error("Error fetching and updating items:", error);
        }
    };

    if (categoryDropdown && contentContainer) {
        categoryDropdown.addEventListener("change", async () => {
            const query = searchInput.value.trim().toLowerCase();
            await searchItems(query);
        });
    }

    await fetchItemsAndUpdateList();

    function createCard(item: any) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add(item.ItemNumber);
        card.id = `item_${item.ItemNumber}`;

        const image = document.createElement("img");
        console.log(item.Picture);
        image.src = item.Picture;
        image.alt = "Image";
        card.appendChild(image);

        const cardContent = document.createElement("div");
        cardContent.classList.add("cardContent");

        cardContent.innerHTML = `
            <h2>${item.ItemNumber}</h2>
            <h3>${item.ItemName}</h3>`;
        card.appendChild(cardContent);

        const extraContent = document.createElement("div");
        extraContent.classList.add("extra-content");

        extraContent.innerHTML = `
                        <p>Kategorie: ${item.Category}</p>
                        <p>Beschreibung: ${item.Description}</p>
                        <p>Verfügbar: ${item.Available === 'Y' ? "Ja" : "Nein"}</p>
                        <p>Beschädigt: ${item.Damaged === 'Y' ? "Ja" : "Nein"}</p>
                        <button class="editButton"><i class="fa-solid fa-pen"></i></button>
                        <button class="deleteButton"><i class="fa-solid fa-trash"></i></button>
                        <button class = "qrButton"><i class="fa-solid fa-qrcode"></i></button>`;

        card.appendChild(extraContent);

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

        const qrButton = extraContent.querySelector(".qrButton") as HTMLButtonElement;
        qrButton.addEventListener("click", () => {
            showQRCode(item);
        });

        contentContainer.appendChild(card);
    }

    function printQRCode(qrCodeImage: any, qrCodeSize: any) {
        const printWindow = window.open("", "_blank")!;
        printWindow.document.write(`<img src="${qrCodeImage.src}" style="width:${qrCodeSize}px; height:${qrCodeSize}px;" alt="QR-Code">`);
        printWindow.document.close();
        printWindow.onload = function () {
            printWindow.print();
            printWindow.close();
        };
    }

    function toggleHomeButton(show: boolean) {
        if (homeButton) {
            homeButton.style.display = show ? "block" : "none";
        }
    }

    function showOnlyItem(itemId: string) {
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            if (card.id !== `item_${itemId}`) {
                card.classList.add("hidden");
            } else {
                card.classList.remove("hidden");
            }
        });
        toggleHomeButton(true);
    }

    homeButton.addEventListener("click", () => {
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            card.classList.remove("hidden");
        });
        toggleHomeButton(false);
        history.pushState(null, '', window.location.pathname);
    });

    function showQRCode(item: any) {
        const popup = document.getElementById("QRPopup") as HTMLDivElement;
        const qrCodeImage = document.getElementById("qrCodeImage") as HTMLImageElement;
        const closeButton = document.getElementById("QRCloseButton") as HTMLSpanElement;
        const printButton = document.getElementById("printButton") as HTMLButtonElement;
        const qrCodeSizeInput = document.getElementById("qrCodeSize") as HTMLInputElement;

        qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(window.location.origin + window.location.pathname + "?item=" + item.ItemNumber)}&size=100x100`;
        popup.style.display = "block";

        closeButton.addEventListener("click", () => {
            popup.style.display = "none";
        });

        printButton.addEventListener("click", () => {
            printQRCode(qrCodeImage, qrCodeSizeInput.value);
        });
    }
    const searchButton = document.getElementById("searchButton") as HTMLButtonElement;
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;

    searchButton.addEventListener("click", async () => {
        const query = searchInput.value.trim().toLowerCase();
        await searchItems(query);
    });

    searchInput.addEventListener("keypress", async (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.trim().toLowerCase();
            await searchItems(query);
        }
    });

    async function searchItems(query: string) {
        const selectedCategory = getSelectedCategory();
        try {
            const itemsResponse = await fetch(`http://${domain}/api/items`);
            if (!itemsResponse.ok) throw new Error("Failed to fetch items");
            const items = await itemsResponse.json();

            const filteredItems = items.filter((item: { ItemName: string; Description: string; Category: string; }) => {
                const matchesSearch = item.ItemName.toLowerCase().includes(query) ||
                    item.Description.toLowerCase().includes(query);
                const matchesCategory = selectedCategory === "all" || item.Category === selectedCategory;
                return matchesSearch && matchesCategory;
            });

            contentContainer.innerHTML = "";

            filteredItems.forEach((item: any) => {
                createCard(item);
            });
        } catch (error) {
            console.error("Error searching items:", error);
        }
    }
    await fetchItemsAndUpdateList();

    const cancelSearchButton = document.getElementById("cancelSearchButton") as HTMLButtonElement;

    cancelSearchButton.addEventListener("click", async () => {
        searchInput.value = "";
        await fetchItemsAndUpdateList();
        await filterItemsByCategory();
    });
});