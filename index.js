const express = require('express');
const translate = require('translate');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Configure the engine to use Google (free tier)
translate.engine = 'google'; 

// POST Endpoint for external apps
// Example: POST to /api/translate with { "text": "Hello", "lang": "ar" }
app.post('/api/translate', async (req, res) => {
    try {
        const { text, lang } = req.body;
        if (!text) return res.status(400).json({ error: "No text provided" });

        // Translates to target language (default: Arabic)
        const translated = await translate(text, lang || 'ar'); 
        res.json({ original: text, translated: translated, target_lang: lang || 'ar' });
    } catch (err) {
        res.status(500).json({ error: "Translation failed", details: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => console.log(`Translator server active on port ${PORT}`));
