import express from 'express';
import { fetchZapRecords } from './services/AirtableService';

const app = express();
const port = Number(process.env.PORT) || 5000;

// API endpoint pour récupérer les enregistrements
app.get('/api/zap-records', async (req, res) => {
  try {
    const records = await fetchZapRecords();
    res.json(records);
  } catch (error) {
    console.error('Erreur lors de la récupération des enregistrements:', error);
    res.status(500).send('Erreur serveur');
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
