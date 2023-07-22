const express = require('express');
const router = express.Router();

// Get cart items
router.get('/', (req, res) => {
res.json({
    msg:"hello from backend"
})
});

module.exports = router;
