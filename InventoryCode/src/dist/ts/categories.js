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
    const categoryDropdown = document.getElementById("categoryDropdown");
    fetchCategoriesAndUpdateDropdown();
    function fetchCategoriesAndUpdateDropdown() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:3000/api/categories');
                if (!response.ok)
                    throw new Error("Failed to fetch categories");
                const categories = yield response.json();
                if (categoryDropdown) {
                    categoryDropdown.innerHTML = "";
                    categories.forEach((category) => {
                        const option = document.createElement("option");
                        if (typeof category.name === "string") {
                            option.value = category.name;
                        }
                        option.textContent = category.name;
                        categoryDropdown.appendChild(option);
                    });
                }
            }
            catch (err) {
                console.error("Error fetching categories:", err);
            }
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
    const categoryForm = document.getElementById("categoryForm");
    const categoryList = document.getElementById("categoryList");
    const addCategoryButton = document.getElementById("addCategoryButton");
    if (categoryForm && categoryList && addCategoryButton && manageCategoriesButton) {
        manageCategoriesButton.addEventListener("click", fetchCategoriesAndUpdateList);
        addCategoryButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
            const newCategoryName = document.getElementById("newCategoryName").value;
            if (newCategoryName) {
                try {
                    const response = yield fetch('http://localhost:3000/api/categories', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ name: newCategoryName })
                    });
                    if (!response.ok)
                        throw new Error("Failed to add category");
                    yield fetchCategoriesAndUpdateList();
                    yield fetchCategoriesAndUpdateDropdown();
                    document.getElementById("newCategoryName").value = "";
                }
                catch (err) {
                    console.error("Error adding category:", err);
                }
            }
        }));
        function fetchCategoriesAndUpdateList() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch('http://localhost:3000/api/categories');
                    if (!response.ok)
                        throw new Error("Failed to fetch categories");
                    const categories = yield response.json();
                    if (categoryList) {
                        categoryList.innerHTML = "";
                        categories.forEach((category) => {
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
                }
                catch (err) {
                    console.error("Error fetching categories:", err);
                }
            });
        }
        function editCategory(category) {
            return __awaiter(this, void 0, void 0, function* () {
                const newName = prompt("Neuer Kategoriename:", category.name);
                if (newName && newName !== category.name) {
                    try {
                        const response = yield fetch(`http://localhost:3000/api/categories/${category.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ name: newName })
                        });
                        if (!response.ok)
                            throw new Error("Failed to update category");
                        yield fetchCategoriesAndUpdateList();
                        yield fetchCategoriesAndUpdateDropdown();
                    }
                    catch (err) {
                        console.error("Error updating category:", err);
                    }
                }
            });
        }
        function deleteCategory(category) {
            return __awaiter(this, void 0, void 0, function* () {
                if (confirm(`Kategorie "${category.name}" wirklich löschen?`)) {
                    try {
                        const response = yield fetch(`http://localhost:3000/api/categories/${category.id}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                        });
                        if (!response.ok)
                            throw new Error("Failed to delete category");
                        yield fetchCategoriesAndUpdateList();
                        yield fetchCategoriesAndUpdateDropdown();
                    }
                    catch (err) {
                        console.error("Error deleting category:", err);
                    }
                }
            });
        }
    }
});
