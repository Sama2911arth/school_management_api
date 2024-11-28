const db = require('../db/connection');
const calculateDistance = require('../utils/distanceCalculator');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    try {
        const [schools] = await db.query('SELECT * FROM schools');
        const userLocation = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        };

        // Sorting schools by distance
        const sortedSchools = schools
            .map((school) => ({
                ...school,
                distance: calculateDistance(userLocation, { latitude: school.latitude, longitude: school.longitude }),
            }))
            .sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
