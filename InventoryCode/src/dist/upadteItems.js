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
const saveButton = document.getElementById('saveButton');
const itemIdInput = document.getElementById('itemId');
const itemNameInput = document.getElementById('itemName');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const availableInput = document.getElementById('available');
const damagedInput = document.getElementById('damaged');
// Event-Handler für den "Speichern"-Button
saveButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = parseInt(itemIdInput.value, 10);
    const data = {
        itemName: itemNameInput.value,
        description: descriptionInput.value,
        category: categoryInput.value,
        available: availableInput.checked ? 'Y' : 'N',
        damaged: damagedInput.checked ? 'Y' : 'N',
    };
    try {
        const response = yield fetch(`/item/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            alert("Item updated successfully.");
        }
        else {
            alert("Error updating item.");
        }
    }
    catch (error) {
        console.error("Error updating item:", error);
        alert("Error updating item.");
    }
}));
