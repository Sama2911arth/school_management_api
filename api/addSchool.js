const db = require('../db/connection');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        await db.query(query, [name, address, parseFloat(latitude), parseFloat(longitude)]);
        res.status(201).json({ message: 'School added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
