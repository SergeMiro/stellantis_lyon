const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour envoyer des requêtes JSON
app.use(express.json());

// Exemple d'API 
app.get('/api/hello', (req, res) => {
	res.send({ message: 'Hello de la part de l\'API - Backend' });
});

// Middleware pour servir des fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../build')));

// Redirige toutes les autres requêtes vers la page d'accueil
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Serveur démarré sur le port ${PORT}`);
});

