const express = require('express');
const cors = require('cors'); // Импорт CORS
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());

// Middleware для обработки JSON
app.use(bodyParser.json());

// Путь к файлу данных
const dataPath = path.join(__dirname, 'items.json');

// Функция для загрузки данных
function loadItems() {
  if (fs.existsSync(dataPath)) {
    try {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error('Error parsing JSON file:', error);
      return [];
    }
  }
  return [];
}

// Функция для сохранения данных
function saveItems(items) {
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
}

// Инициализация массива
let items = loadItems();

// GET запрос для получения всех элементов
app.get('/api/items', (req, res) => {
  res.json(items);
});

// POST запрос для добавления нового элемента
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newItem = { id: items.length > 0 ? items[items.length - 1].id + 1 : 1, name };
  items.push(newItem);
  saveItems(items);
  res.status(201).json(newItem);
});

// DELETE запрос для удаления элемента по ID
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items.splice(itemIndex, 1);
  saveItems(items);
  res.json({ success: true });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
