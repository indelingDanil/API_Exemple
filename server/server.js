const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const dataPath = path.join(__dirname, 'items.json');

// Загрузка данных
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

// Сохранение данных
function saveItems(items) {
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
}

// Массив данных
let items = loadItems();

// Справочник регионов
const regions = {
  "01": "Республика Адыгея (Адыгея)",
  "02": "Республика Башкортостан",
  "03": "Республика Бурятия",
  "04": "Республика Алтай",
  "05": "Республика Дагестан",
  "06": "Республика Ингушетия",
  "07": "Кабардино-Балкарская Республика",
  "08": "Республика Калмыкия",
  "09": "Карачаево-Черкесская Республика",
  "10": "Республика Карелия",
  "11": "Республика Коми",
  "12": "Республика Марий Эл",
  "13": "Республика Мордовия",
  "14": "Республика Саха (Якутия)",
  "15": "Республика Северная Осетия - Алания",
  "16": "Республика Татарстан (Татарстан)",
  "17": "Республика Тыва",
  "18": "Удмуртская Республика",
  "19": "Республика Хакасия",
  "20": "Чеченская Республика",
  "21": "Чувашская Республика - Чувашия",
  "22": "Алтайский край",
  "23": "Краснодарский край",
  "24": "Красноярский край",
  "25": "Приморский край",
  "26": "Ставропольский край",
  "27": "Хабаровский край",
  "28": "Амурская область",
  "29": "Архангельская область",
  "30": "Астраханская область",
  "31": "Белгородская область",
  "32": "Брянская область",
  "33": "Владимирская область",
  "34": "Волгоградская область",
  "35": "Вологодская область",
  "36": "Воронежская область",
  "37": "Ивановская область",
  "38": "Иркутская область",
  "39": "Калининградская область",
  "40": "Калужская область",
  "41": "Камчатский край",
  "42": "Кемеровская область - Кузбасс",
  "43": "Кировская область",
  "44": "Костромская область",
  "45": "Курганская область",
  "46": "Курская область",
  "47": "Ленинградская область",
  "48": "Липецкая область",
  "49": "Магаданская область",
  "50": "Московская область",
  "51": "Мурманская область",
  "52": "Нижегородская область",
  "53": "Новгородская область",
  "54": "Новосибирская область",
  "55": "Омская область",
  "56": "Оренбургская область",
  "57": "Орловская область",
  "58": "Пензенская область",
  "59": "Пермский край",
  "60": "Псковская область",
  "61": "Ростовская область",
  "62": "Рязанская область",
  "63": "Самарская область",
  "64": "Саратовская область",
  "65": "Сахалинская область",
  "66": "Свердловская область",
  "67": "Смоленская область",
  "68": "Тамбовская область",
  "69": "Тверская область",
  "70": "Томская область",
  "71": "Тульская область",
  "72": "Тюменская область",
  "73": "Ульяновская область",
  "74": "Челябинская область",
  "75": "Забайкальский край",
  "76": "Ярославская область",
  "77": "Москва",
  "78": "Санкт-Петербург",
  "79": "Еврейская автономная область",
  "83": "Ненецкий автономный округ",
  "86": "Ханты-Мансийский автономный округ - Югра",
  "87": "Чукотский автономный округ",
  "89": "Ямало-Ненецкий автономный округ",
  "90": "Запорожская область",
  "91": "Республика Крым",
  "92": "Севастополь",
  "93": "Донецкая Народная Республика",
  "94": "Луганская Народная Республика",
  "95": "Херсонская область",
  "99": "Иные территории, включая город и космодром Байконур"
};

// Определение региона по коду
function getRegionByInn(inn) {
  const regionCode = inn.slice(0, 2);
  return regions[regionCode] || "Неизвестный регион";
}

// Определение типа лица
function getTypeByInn(inn) {
  return inn.length === 10 ? "Юридическое лицо" : inn.length === 12 ? "Физическое лицо" : "Неизвестный тип";
}

// POST запрос для добавления нового элемента
app.post('/api/items', (req, res) => {
  const { inn } = req.body;

  if (!inn || !/^\d{10,12}$/.test(inn)) {
    return res.status(400).json({ error: 'ИНН должен содержать 10 или 12 цифр' });
  }

  const region = getRegionByInn(inn);
  const type = getTypeByInn(inn);

  const newItem = {
    id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
    inn,
    region,
    type
  };

  items.push(newItem);
  saveItems(items);
  res.status(201).json(newItem);
});

// GET запрос для получения всех элементов
app.get('/api/items', (req, res) => {
  res.json(items);
});

// DELETE запрос для удаления элемента по ID
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Элемент не найден' });
  }

  items.splice(itemIndex, 1);
  saveItems(items);
  res.json({ success: true });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
