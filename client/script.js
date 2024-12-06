document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/api/items";
  const itemsList = document.getElementById("items-list");
  const itemForm = document.getElementById("item-form");
  const itemInnInput = document.getElementById("item-inn");

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
  async function addItem(inn) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inn }),
      });
      if (!response.ok) throw new Error("Failed to add INN");
      fetchItems();
    } catch (error) {
      console.error("Error adding INN:", error);
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
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `INN: ${item.inn} - Region: ${item.region} - Type: ${item.type}`;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteItem(item.id));
      li.appendChild(deleteButton);
      itemsList.appendChild(li);
    });
  }

  // Обработка формы
  itemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inn = itemInnInput.value.trim();
    if (inn.length !== 10 && inn.length !== 12) {
      alert("INN must be exactly 10 or 12 digits long!");
      return;
    }
    addItem(inn);
    itemInnInput.value = "";
  });

  // Блокировать нечисловой ввод
  itemInnInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Удаляет все нечисловые символы
  });

  // Загрузить данные при загрузке страницы
  fetchItems();
});
