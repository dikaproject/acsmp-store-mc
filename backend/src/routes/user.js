const router = require('express').Router();
const { getAllUsers, getUserById, updateUser, createUser, deleteUser } = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/create', auth, adminOnly, createUser);
router.get('/get', auth, adminOnly, getAllUsers);
router.get('/get/:id', auth, adminOnly, getUserById);
router.put('/update/:id', auth, adminOnly, updateUser);
router.delete('/delete/:id', auth, adminOnly, deleteUser);

module.exports = router;