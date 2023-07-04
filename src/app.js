const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

// setup multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './src/uploads');
//   },
//   filename: (req, file, cb) => {
//     let fileFormat = file.originalname.split('.');
//     fileFormat = fileFormat[fileFormat.length - 1];
//     cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat);
//   },
// });
// const upload = multer({ storage });
const upload = multer({ dest: 'uploads/' });

// middleware sharp
const resizeImage = (req, res, next) => {
  if (!req.file) {
    console.log('req sharp gak ada');
    console.log(req);
    console.log(req.file);
    return next();
  }

  console.log('req sharp');
  console.log(req.file);

  sharp(req.file.path)
    .resize(800, 600) // Ubah ukuran sesuai kebutuhan Anda
    .toFile('uploads/resized_' + req.file.filename, (err) => {
      if (err) {
        return next(err);
      }

      // Hapus file asli yang diunggah
      fs.unlinkSync(req.file.path);

      // Ubah path file menjadi yang baru
      req.file.path = 'uploads/resized_' + req.file.filename;

      next();
    });
};

// route
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/images', upload.array('images'), resizeImage, (req, res) => {
  res.send('Selesai upload gambar');
});