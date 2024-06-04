const deprecated = (req, res) => {
    res.status(400).json({ success: false, message: 'This endpoint has been deprecated.' });
}

const downForMaintenance = (req, res) => {
    res.status(503).json({ success: false, message: 'This endpoint is down for maintenance.' });
}

module.exports = {
    deprecated,
    downForMaintenance
}