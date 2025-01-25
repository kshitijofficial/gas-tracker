const express = require('express')
const db = require('../config/db')
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query(`
          SELECT 
            (data->0->'block'->>'timestamp'):: TEXT AS timestamp,
            (data->0->'block'->>'gasUsed'):: TEXT AS gasUsed
            FROM "latest-blocks"
            ORDER BY from_block_number DESC
            LIMIT 10;
        `)
        res.json(rows)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;