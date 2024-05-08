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
document.addEventListener("DOMContentLoaded", () => {
    const addDeviceButton = document.getElementById("addDeviceButton");
    const devicePopup = document.getElementById("devicePopup");
    const closePopup = document.getElementById("closePopup");
    const deviceForm = document.getElementById("deviceForm");
    const deviceTypeDropdown = document.getElementById("deviceType");
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
                document.getElementById("deviceName").value = '';
                document.getElementById("deviceType").value = '';
                document.getElementById("deviceDescription").value = '';
                document.getElementById("deviceAvailable").checked = false;
                document.getElementById("deviceDamaged").checked = false;
            }
            else {
                alert("Fehler beim Hinzufügen des Geräts.");
            }
            if (devicePopup) {
                devicePopup.style.display = "none";
            }
        }));
    }
});
