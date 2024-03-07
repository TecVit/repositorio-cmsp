const express = require('express');
const puppeteerCode = require('./index.js');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());


app.get('/coletarPDF', async (req, res) => {
    const ensino = req.query.ensino;
    const materia = req.query.materia;
    const serie = req.query.serie;
    try {
      const coleta = await puppeteerCode.coletarPDF(ensino, serie, materia);
      res.json(coleta);
    } catch (error) {
      res.status(500).send('Erro interno do servidor');
    }
});

app.get('/coletarMaterias', async (req, res) => {
  const ensino = req.query.ensino;
  const serie = req.query.serie;
  console.log(serie)
    try {
      const materias = await puppeteerCode.coletarMaterias(ensino, serie);
      res.json(materias);
    } catch (error) {
      res.status(500).send('Erro interno do servidor');
    }
});

app.get('/coletarTipoEnsino', async (req, res) => {
    try {
      const ensinos = await puppeteerCode.coletarTipoEnsino();
      res.json(ensinos);
    } catch (error) {
      res.status(500).send('Erro interno do servidor');
    }
});

app.listen(port, () => {
  console.log(`Servidor Express em execução em http://localhost:${port}`);
});