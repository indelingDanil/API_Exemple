document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:3000/api/items";
    const itemsList = document.getElementById("items-list");
    const itemForm = document.getElementById("item-form");
    const itemInput = document.getElementById("item-input");
  
    // Загрузить элементы
    async function fetchItems() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch items");
        const items = await response.json();
        renderItems(items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }
  
    // Добавить новый элемент
    async function addItem(name) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error("Failed to add item");
        fetchItems();
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  
    // Удалить элемент
    async function deleteItem(id) {
      try {
        const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete item");
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  
    // Отображение элементов
    function renderItems(items) {
      itemsList.innerHTML = "";
      items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteItem(item.id));
        li.appendChild(deleteButton);
        itemsList.appendChild(li);
      });
    }
  
    // Обработка формы
    itemForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = itemInput.value.trim();
      if (name) addItem(name);
      itemInput.value = "";
    });
  
    // Загрузить данные при загрузке страницы
    fetchItems();
  });
  