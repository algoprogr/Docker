import express from 'express';
import translate from 'translate';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static('public'));

translate.engine = 'google'; 

app.post('/api/translate', async (req, res) => {
    try {
        const { text, lang } = req.body;
        if (!text) return res.status(400).json({ error: "No text provided" });

        const translated = await translate(text, lang || 'ar'); 
        res.json({ original: text, translated: translated, target_lang: lang || 'ar' });
    } catch (err) {
        res.status(500).json({ error: "Translation failed" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(7860, () => console.log(`Translator active on 7860`));
