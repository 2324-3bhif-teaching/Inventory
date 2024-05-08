document.addEventListener("DOMContentLoaded", () => {
    const addDeviceButton = document.getElementById("addDeviceButton");
    const devicePopup = document.getElementById("devicePopup");
    const closePopup = document.getElementById("closePopup");
    const deviceForm = document.getElementById("deviceForm");
    const deviceTypeDropdown = document.getElementById("deviceType");

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
            const deviceType = (document.getElementById("deviceType")as HTMLInputElement).value;
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

                (document.getElementById("deviceName") as HTMLInputElement).value = '';
                (document.getElementById("deviceType")as HTMLInputElement).value = '';
                (document.getElementById("deviceDescription") as HTMLInputElement).value = '';
                (document.getElementById("deviceAvailable") as HTMLInputElement).checked = false;
                (document.getElementById("deviceDamaged") as HTMLInputElement).checked = false;

            } else {
                alert("Fehler beim Hinzufügen des Geräts.");
            }

            if (devicePopup) {
                devicePopup.style.display = "none";
            }
        });
    }
});
