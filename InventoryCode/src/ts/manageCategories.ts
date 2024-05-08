document.addEventListener("DOMContentLoaded", () => {
    const categoryForm = document.getElementById("categoryForm");
    const categoryList = document.getElementById("categoryList");
    const addCategoryButton = document.getElementById("addCategoryButton");
    const manageCategoriesButton = document.getElementById("manageCategoriesButton");

    if (categoryForm && categoryList && addCategoryButton && manageCategoriesButton) {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/categories');
                if (!response.ok) throw new Error("Failed to fetch categories");
                const categories = await response.json();

                categoryList.innerHTML = "";
                categories.forEach((category: { name: string  | undefined; id: any; }) => {
                    const listItem = document.createElement("li");
                    if (typeof category.name === "string") {
                        listItem.textContent = category.name;
                    }

                    const editButton = document.createElement("button");
                    editButton.textContent = "Bearbeiten";
                    editButton.addEventListener("click", async () => {
                        const newName = prompt("Neuer Kategoriename:", category.name);
                        if (newName && newName !== category.name) {
                            try {
                                const response = await fetch(`http://localhost:3000/api/categories/${category.id}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ name: newName })
                                });
                                if (!response.ok) throw new Error("Failed to update category");
                                fetchCategories();
                            } catch (err) {
                                console.error("Error updating category:", err);
                            }
                        }
                    });

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Löschen";
                    deleteButton.addEventListener("click", async () => {
                        if (confirm(`Kategorie "${category.name}" wirklich löschen?`)) {
                            try {
                                const response = await fetch(`http://localhost:3000/api/categories/${category.id}`, {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                });
                                if (!response.ok) throw new Error("Failed to delete category");
                                fetchCategories();
                            } catch (err) {
                                console.error("Error deleting category:", err);
                            }
                        }
                    });

                    listItem.appendChild(editButton);
                    listItem.appendChild(deleteButton);
                    categoryList.appendChild(listItem);
                });
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        manageCategoriesButton.addEventListener("click", fetchCategories);
        addCategoryButton.addEventListener("click", async () => {
            const newCategoryName = (document.getElementById("newCategoryName")as HTMLInputElement).value;
            if (newCategoryName) {
                try {
                    const response = await fetch('http://localhost:3000/api/categories', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ name: newCategoryName })
                    });
                    if (!response.ok) throw new Error("Failed to add category");
                    fetchCategories();
                    (document.getElementById("newCategoryName")as HTMLInputElement).value = "";
                } catch (err) {
                    console.error("Error adding category:", err);
                }
            }
        });
    }
});
