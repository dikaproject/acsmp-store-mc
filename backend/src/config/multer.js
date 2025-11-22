const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirs = [
    'uploads/servers',
    'uploads/products',
    'uploads/gallery',
    'uploads/guides',
];

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        
        if (req.baseUrl.includes('/server-types')) {
            uploadPath = 'uploads/servers/';
        } else if (req.baseUrl.includes('/products')) {
            uploadPath = 'uploads/products/';
        } else if (req.baseUrl.includes('/gallery')) {
            uploadPath = 'uploads/gallery/';
        } else if (req.baseUrl.includes('/guides')) {
            uploadPath = 'uploads/guides/';
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: imageFilter
});

module.exports = upload;

module.exports = upload;