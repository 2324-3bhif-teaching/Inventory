"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const addDeviceButton = document.getElementById("addDeviceButton");
    const devicePopup = document.getElementById("devicePopup");
    const closePopup = document.getElementById("closePopup");
    const deviceForm = document.getElementById("deviceForm");
    const deviceTypeDropdown = document.getElementById("deviceType");
    const contentContainer = document.getElementById("content");
    const editPopup = document.getElementById("editPopup");
    const closeEPopup = document.getElementById("closeEditPopup");
    const editForm = document.getElementById("editForm");
    const editItemNumber = document.getElementById("editItemNumber");
    const editItemName = document.getElementById("editItemName");
    const editCategory = document.getElementById("editCategory");
    const editDescription = document.getElementById("editDescription");
    const editAvailable = document.getElementById("editAvailable");
    const editDamaged = document.getElementById("editDamaged");
    if (contentContainer && addDeviceButton && devicePopup && closePopup && deviceForm && deviceTypeDropdown) {
        const fetchItemsAndUpdateList = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const itemsResponse = yield fetch('http://localhost:3000/api/items');
                if (!itemsResponse.ok)
                    throw new Error("Failed to fetch items");
                const items = yield itemsResponse.json();
                contentContainer.innerHTML = "";
                items.forEach((item) => {
                    var _a, _b, _c;
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
                    (_a = cardContent.querySelector(".toggle-details")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                        extraContent.classList.toggle("show-content");
                    });
                    (_b = extraContent.querySelector(".editButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
                        openEditPopup(item);
                    });
                    (_c = extraContent.querySelector(".deleteButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                        const confirmDelete = confirm("Sind Sie sicher, dass Sie diesen Artikel löschen möchten?");
                        if (confirmDelete) {
                            yield deleteItem(item.ItemNumber);
                            yield fetchItemsAndUpdateList();
                        }
                    }));
                    contentContainer.appendChild(card);
                });
            }
            catch (error) {
                console.error("Error fetching and updating items:", error);
            }
        });
        const openEditPopup = (item) => {
            populateEditForm(item);
            editPopup.style.display = "block";
            editPopup.style.display = "block";
        };
        const closeEditPopup = () => {
            editPopup.style.display = "none";
        };
        const deleteItem = (itemNumber) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield fetch(`http://localhost:3000/api/items/${itemNumber}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    alert("Item deleted successfully.");
                    yield fetchItemsAndUpdateList();
                }
                else {
                    console.error("Failed to delete item.");
                }
            }
            catch (error) {
                console.error("Error deleting item:", error);
            }
        });
        const populateCategoryDropdown = () => __awaiter(void 0, void 0, void 0, function* () {
            if (deviceTypeDropdown) {
                deviceTypeDropdown.innerHTML = "";
                try {
                    const response = yield fetch('http://localhost:3000/api/categories');
                    if (response.ok) {
                        const categories = yield response.json();
                        categories.forEach((category) => {
                            const option = document.createElement("option");
                            if (typeof category.name === "string") {
                                option.value = category.name;
                            }
                            option.textContent = category.name;
                            deviceTypeDropdown.appendChild(option);
                        });
                    }
                    else {
                        console.error("Error fetching categories");
                    }
                }
                catch (error) {
                    console.error("Error fetching categories:", error);
                }
            }
        });
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
            deviceForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
                event.preventDefault();
                const deviceName = document.getElementById("deviceName").value;
                const deviceType = document.getElementById("deviceType").value;
                const description = document.getElementById("deviceDescription").value;
                const available = document.getElementById("deviceAvailable").checked ? 'Y' : 'N';
                const damaged = document.getElementById("deviceDamaged").checked ? 'Y' : 'N';
                const newDevice = {
                    itemName: deviceName,
                    description,
                    category: deviceType,
                    available,
                    damaged,
                    picture: null,
                };
                const response = yield fetch('http://localhost:3000/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newDevice),
                });
                if (response.ok) {
                    alert("Gerät erfolgreich hinzugefügt!");
                    yield fetchItemsAndUpdateList();
                    document.getElementById("deviceName").value = '';
                    document.getElementById("deviceType").value = '';
                    document.getElementById("deviceDescription").value = '';
                    document.getElementById("deviceAvailable").checked = false;
                    document.getElementById("deviceDamaged").checked = false;
                    if (devicePopup) {
                        devicePopup.style.display = "none";
                    }
                }
                else {
                    alert("Fehler beim Hinzufügen des Geräts.");
                }
                if (devicePopup) {
                    devicePopup.style.display = "none";
                }
            }));
        }
    }
    const fetchItemsAndUpdateList = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!contentContainer) {
                console.error("Content container not found in DOM.");
                return;
            }
            const itemsResponse = yield fetch('http://localhost:3000/api/items');
            if (!itemsResponse.ok)
                throw new Error("Failed to fetch items");
            const items = yield itemsResponse.json();
            contentContainer.innerHTML = "";
            items.forEach((item) => {
                var _a, _b, _c;
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
                (_a = cardContent.querySelector(".toggle-details")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                    extraContent.classList.toggle("show-content");
                });
                (_b = extraContent.querySelector(".editButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
                    openEditPopup(item);
                });
                (_c = extraContent.querySelector(".deleteButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    const confirmDelete = confirm("Sind Sie sicher, dass Sie diesen Artikel löschen möchten?");
                    if (confirmDelete) {
                        yield deleteItem(item.ItemNumber);
                        yield fetchItemsAndUpdateList();
                    }
                }));
                contentContainer.appendChild(card);
            });
        }
        catch (error) {
            console.error("Error fetching and updating items:", error);
        }
    });
    const populateEditForm = (item) => {
        editItemNumber.value = item.ItemNumber.toString();
        editItemName.value = item.ItemName;
        editCategory.value = item.Category;
        editDescription.value = item.Description;
        editAvailable.checked = item.Available === 'Y';
        editDamaged.checked = item.Damaged === 'Y';
    };
    const openEditPopup = (item) => {
        populateEditForm(item);
        editPopup.style.display = "block";
        editPopup.style.display = "block";
    };
    const closeEditPopup = () => {
        editPopup.style.display = "none";
    };
    const deleteItem = (itemNumber) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:3000/api/items/${itemNumber}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                alert("Item deleted successfully.");
                yield fetchItemsAndUpdateList();
            }
            else {
                console.error("Failed to delete item.");
            }
        }
        catch (error) {
            console.error("Error deleting item:", error);
        }
    });
    if (!contentContainer || !editPopup || !closeEPopup || !editForm || !editItemNumber || !editItemName || !editCategory || !editDescription || !editAvailable || !editDamaged) {
        console.error("Some elements are missing in the DOM.");
        return;
    }
    const fetchCategories = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categoryResponse = yield fetch('http://localhost:3000/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!categoryResponse.ok) {
                console.error("Failed to fetch categories from server.");
                return [];
            }
            return yield categoryResponse.json();
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    });
    const fetchItems = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/api/items', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.error("Failed to fetch items from server.");
                return [];
            }
            return yield response.json();
        }
        catch (error) {
            console.error("Error fetching items:", error);
            return [];
        }
    });
    const saveItem = (event) => __awaiter(void 0, void 0, void 0, function* () {
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
            const response = yield fetch(`http://localhost:3000/api/items/${itemNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                alert("Item saved successfully.");
                yield fetchItemsAndUpdateList();
                closeEditPopup();
            }
            else {
                console.error("Failed to save item.");
            }
        }
        catch (error) {
            console.error("Error saving item:", error);
        }
    });
    closeEPopup.addEventListener("click", closeEditPopup);
    editForm.addEventListener("submit", saveItem);
    window.addEventListener("click", (event) => {
        if (event.target === editPopup) {
            closeEditPopup();
        }
    });
    const categories = yield fetchCategories();
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        editCategory.appendChild(option);
    });
    const items = yield fetchItems();
    items.forEach((item) => {
        var _a, _b, _c;
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
        (_a = cardContent.querySelector(".toggle-details")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            extraContent.classList.toggle("show-content");
        });
        (_b = extraContent.querySelector(".editButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            openEditPopup(item);
        });
        (_c = extraContent.querySelector(".deleteButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
            const confirmDelete = confirm("Sind Sie sicher, dass Sie diesen Artikel löschen möchten?");
            if (confirmDelete) {
                yield deleteItem(item.ItemNumber);
            }
        }));
        contentContainer.appendChild(card);
    });
}));
