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
    const contentContainer = document.getElementById("content");
    if (!contentContainer) {
        console.error("Content container not found.");
        return;
    }
    try {
        const response = yield fetch('http://localhost:3000/api/items', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch items from server.");
            return;
        }
        const items = yield response.json();
        items.forEach((item) => {
            var _a;
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
            const isAvailableChecked = (item.Available === 'Y');
            const isDamagedChecked = (item.Damaged === 'Y');
            extraContent.innerHTML = `
            <input type="text" value="${item.Category}">

             <input type="checkbox" id="available-${item.ItemID}" name="available" ${isAvailableChecked ? "checked" : ""}>
            <label for="available-${item.ItemID}">Verfügbar</label><br>

             <input type="checkbox" id="damaged-${item.ItemID}" name="damaged" ${isDamagedChecked ? "checked" : ""}>
            <label for="damaged-${item.ItemID}">Beschädigt</label><br>

            <textarea rows="3" placeholder="Beschreibung...">${item.Description || ""}</textarea>
            
            <button>Löschen</button>
            <button id="saveButton">Speichern</button>
`;
            card.appendChild(extraContent);
            (_a = cardContent.querySelector(".toggle-details")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                extraContent.classList.toggle("show-content");
            });
            contentContainer.appendChild(card);
        });
    }
    catch (error) {
        console.error("Error fetching items:", error);
    }
}));
