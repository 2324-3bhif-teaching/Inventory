

document.addEventListener("DOMContentLoaded", () => {
    const categoryDropdown = document.getElementById("categoryDropdown");
    const domain = "localhost:3000";

    fetchCategoriesAndUpdateDropdown();


    async function fetchCategoriesAndUpdateDropdown() {
        try {
            const response = await fetch(`http://${domain}/api/categories`);
            if (!response.ok) throw new Error("Failed to fetch categories");
            const categories = await response.json();

            if(categoryDropdown) {
                categoryDropdown.innerHTML = "";
                const allOption = document.createElement("option");
                allOption.value = "all";
                allOption.textContent = "Alle";
                categoryDropdown.appendChild(allOption);

                categories.forEach((category: { name: string | null; }) => {
                    const option = document.createElement("option");
                    if (typeof category.name === "string") {
                        option.value = category.name;
                    }
                    option.textContent = category.name;
                    categoryDropdown.appendChild(option);
                });
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
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

    const categoryForm = document.getElementById("categoryForm");
    const categoryList = document.getElementById("categoryList");
    const addCategoryButton = document.getElementById("addCategoryButton");

    if (categoryForm && categoryList && addCategoryButton && manageCategoriesButton) {
        manageCategoriesButton.addEventListener("click", fetchCategoriesAndUpdateList);

        addCategoryButton.addEventListener("click", async () => {
            const newCategoryName = (document.getElementById("newCategoryName") as HTMLInputElement).value;
            if (newCategoryName) {
                try {
                    const response = await fetch(`http://${domain}/api/categories`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ name: newCategoryName })
                    });
                    if (!response.ok) throw new Error("Failed to add category");
                    await fetchCategoriesAndUpdateList();
                    await fetchCategoriesAndUpdateDropdown();
                    (document.getElementById("newCategoryName")as HTMLInputElement).value = "";
                } catch (err) {
                    console.error("Error adding category:", err);
                }
            }
        });

        async function fetchCategoriesAndUpdateList() {
            try {
                const response = await fetch(`http://${domain}/api/categories`);
                if (!response.ok) throw new Error("Failed to fetch categories");
                const categories = await response.json();

                if(categoryList){
                    categoryList.innerHTML = "";
                    categories.forEach((category: { name: string | null; }) => {
                        const listItem = document.createElement("li");
                        listItem.textContent = category.name;

                        const editButton = document.createElement("button");
                        editButton.textContent = "Bearbeiten";
                        editButton.addEventListener("click", () => editCategory(category));

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "Löschen";
                        deleteButton.addEventListener("click", () => deleteCategory(category));

                        listItem.appendChild(editButton);
                        listItem.appendChild(deleteButton);
                        categoryList.appendChild(listItem);

                    });
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        }

        async function editCategory(category : any) {
            const newName = prompt("Neuer Kategoriename:", category.name);
            if (newName && newName !== category.name) {
                try {
                    const response = await fetch(`http://${domain}/api/categories/${category.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ name: newName })
                    });
                    if (!response.ok) throw new Error("Failed to update category");
                    await fetchCategoriesAndUpdateList();
                    await fetchCategoriesAndUpdateDropdown();
                } catch (err) {
                    console.error("Error updating category:", err);
                }
            }
        }

        async function deleteCategory(category : any) {
            if (confirm(`Kategorie "${category.name}" wirklich löschen?`)) {
                try {
                    const response = await fetch(`http://${domain}/api/categories/${category.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                    if (!response.ok) throw new Error("Failed to delete category");
                    await fetchCategoriesAndUpdateList();
                    await fetchCategoriesAndUpdateDropdown();
                } catch (err) {
                    console.error("Error deleting category:", err);
                }
            }
        }
    }
});