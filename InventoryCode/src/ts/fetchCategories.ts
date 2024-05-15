document.addEventListener("DOMContentLoaded", () => {
    const categoryDropdown = document.getElementById("categoryDropdown");

    if(categoryDropdown) {
        fetch('http://localhost:3000/api/categories')
            .then(response => response.json())
            .then(categories => {
                categories.forEach((category: { name: string | null; }) => {
                    const option = document.createElement("option");
                    if (typeof category.name === "string") {
                        option.value = category.name;
                    }
                    option.textContent = category.name;
                    categoryDropdown.appendChild(option);
                });
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
            });
    }
    const manageCategoriesButton = document.getElementById("manageCategoriesButton");
    const categoryModal = document.getElementById("categoryModal");
    const closeModal = document.getElementById("closeModal");

    if (manageCategoriesButton && categoryModal && closeModal) {
        manageCategoriesButton.addEventListener("click", () => {
            categoryModal.style.display = "block";
        });

        closeModal.addEventListener("click", () => {
            categoryModal.style.display = "none";
        });
    }
});

