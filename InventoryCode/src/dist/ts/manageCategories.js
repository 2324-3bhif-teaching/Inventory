"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const categoryForm = document.getElementById("categoryForm");
    const categoryList = document.getElementById("categoryList");
    const addCategoryButton = document.getElementById("addCategoryButton");
    const manageCategoriesButton = document.getElementById("manageCategoriesButton");
    if (categoryForm && categoryList && addCategoryButton && manageCategoriesButton) {
        const fetchCategories = () => {
            fetch('http://localhost:3000/api/categories')
                .then(response => response.json())
                .then(categories => {
                categoryList.innerHTML = "";
                categories.forEach((category) => {
                    const listItem = document.createElement("li");
                    if (typeof category.name === "string") {
                        listItem.textContent = category.name;
                    }
                    const editButton = document.createElement("button");
                    editButton.textContent = "Bearbeiten";
                    editButton.addEventListener("click", () => {
                        const newName = prompt("Neuer Kategoriename:", category.name);
                        if (newName && newName !== category.name) {
                            fetch(`http://localhost:3000/api/categories/${category.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ name: newName })
                            })
                                .then(() => fetchCategories())
                                .catch(err => console.error("Error updating category:", err));
                        }
                    });
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Löschen";
                    deleteButton.addEventListener("click", () => {
                        if (confirm(`Kategorie "${category.name}" wirklich löschen?`)) {
                            fetch(`http://localhost:3000/api/categories/${category.id}`, {
                                method: "DELETE"
                            })
                                .then(() => fetchCategories())
                                .catch(err => console.error("Error deleting category:", err));
                        }
                    });
                    listItem.appendChild(editButton);
                    listItem.appendChild(deleteButton);
                    categoryList.appendChild(listItem);
                });
            })
                .catch(err => console.error("Error fetching categories:", err));
        };
        if (manageCategoriesButton) {
            manageCategoriesButton.addEventListener("click", fetchCategories);
            addCategoryButton.addEventListener("click", () => {
                const newCategoryName = document.getElementById("newCategoryName").value;
                if (newCategoryName) {
                    fetch('http://localhost:3000/api/categories', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ name: newCategoryName })
                    })
                        .then(() => {
                        fetchCategories();
                        document.getElementById("newCategoryName").value = "";
                    })
                        .catch(err => console.error("Error adding category:", err));
                }
            });
        }
    }
});
