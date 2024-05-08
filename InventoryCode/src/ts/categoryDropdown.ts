import {Category} from "./types";

document.addEventListener("DOMContentLoaded", () => {
    const categoryDropdown = document.getElementById("deviceType") as HTMLSelectElement;

    fetch('http://localhost:3000/api/categories')
        .then(response => response.json())
        .then((categories: Category[]) => {
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.name;
                option.textContent = category.name;
                categoryDropdown.appendChild(option);
            });
        })
        .catch(err => {
            console.error("Error fetching categories:", err);
        });
});