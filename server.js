const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Настройка CORS
app.use(cors());

// Настройка Multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Маршрут для обычной версии
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Маршрут для админской версии
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Маршрут для загрузки изображений
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Файл не загружен.');
  }
  res.send({ filename: req.file.filename });
});

// Маршрут для получения списка изображений
app.get('/images', (req, res) => {
  const uploadDir = 'uploads/';
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send('Ошибка при чтении файлов.');
    }
    const images = files.map(file => ({
      filename: file,
      url: `https://github.com/infinitie14027/infinitie_bp.git${PORT}/uploads/${file}`,
    }));
    res.send(images);
  });
});

// Маршрут для удаления изображения
app.delete('/images/:filename', (req, res) => {
  const filePath = path.join('uploads/', req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send('Ошибка при удалении файла.');
    }
    res.send('Файл удалён.');
  });
});

// Статическая папка для загруженных файлов
app.use('/uploads', express.static('uploads'));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на https://github.com/infinitie14027/infinitie_bp.git${PORT}`);
});