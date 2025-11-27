const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirs = [
    'uploads',
    'uploads/servers',
    'uploads/products',
    'uploads/gallery',
    'uploads/guides',
];

// Ensure all directories exist
uploadDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
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
        
        // Ensure directory exists
        const fullPath = path.join(process.cwd(), uploadPath);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, uniqueSuffix + ext);
    }
});

const imageFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar (JPEG, PNG, GIF, WEBP)!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: imageFilter
});

module.exports = upload;