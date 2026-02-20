const { pool } = require("../../config/dbConfig.js");

// validate color hex codes
const isValidHexColor = (color) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

// Add a new custom color scheme
const addCustomColorScheme = async (req, res) => {
    const { entityId } = req.params;
    const { name, colors } = req.body; // payload (name and the full colors config)

    if (!name || !colors || !colors.light || !colors.dark) {
        return res.status(400).json({ message: "Theme name and color configurations for light and dark modes are required." });
    }

    const requiredColorKeys = ['primary', 'secondary', 'background', 'surface', 'text', 'border', 'page'];
    for (const mode of ['light', 'dark']) {
        for (const key of requiredColorKeys) {
            if (!colors[mode][key] || !isValidHexColor(colors[mode][key])) {
                return res.status(400).json({ message: `Invalid or missing color for ${mode} mode: ${key}. Must be a valid hex color.` });
            }
        }
    }

    try {
        const result = await pool.query(
            `INSERT INTO custom_color_schemes (entity_id, name, colors)
             VALUES ($1, $2, $3)
             RETURNING id, name, colors, created_at`,
            [entityId, name, colors]
        );
        res.status(201).json({ message: "Custom color scheme added successfully!", scheme: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: "A theme with this name already exists for this library. Please choose a different name." });
        }
        console.error("Error adding custom color scheme:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


// Get all custom color schemes for a library
const getCustomColorSchemes = async (req, res) => {
    const { entityId } = req.params;

    try {
        const result = await pool.query(
            `SELECT id, name, colors FROM custom_color_schemes WHERE entity_id = $1 ORDER BY created_at DESC`,
            [entityId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching custom color schemes:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


module.exports = {
    addCustomColorScheme,
    getCustomColorSchemes,

};