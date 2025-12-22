import express from 'express'
import cors from 'cors'
import pkg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const { Pool } = pkg
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* =========================
   CONFIGURACIÓN GENERAL
========================= */
app.use(cors())
app.use(express.json())

/* =========================
   CONEXIÓN POSTGRESQL
========================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

pool.connect()
  .then(() => console.log('✅ PostgreSQL conectado'))
  .catch(err => console.error('❌ Error PostgreSQL:', err))

/* =========================
   ENDPOINT TEST
========================= */
app.get('/api/test', async (req, res) => {
  const { rows } = await pool.query('SELECT NOW()')
  res.json(rows[0])
})

/* =========================
   PILOTOS
========================= */
app.get('/api/pilotos', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM pilotos ORDER BY numero'
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error pilotos' })
  }
})

/* =========================
   EVENTOS
========================= */
app.get('/api/eventos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM eventoscarrera
      ORDER BY fecha
    `)
    res.json(rows)
  } catch (error) {
    console.error('Error en /api/eventos:', error)
    res.status(500).json({ error: 'Error al obtener eventos' })
  }
})


/* =========================
   RESULTADOS
========================= */
app.get('/api/resultados', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        rc.ideventocarrera,
        rc.inicio,
        rc.fin,
        rc.numeropiloto,
        rc.piloto,
        rc.vueltas,
        rc.vueltaslideradas,
        rc.estado,
        COALESCE(p.puntos,0) AS puntos
      FROM resultadoscarrera rc
      LEFT JOIN puntos p ON rc.id_puntos = p.posicion
      ORDER BY rc.ideventocarrera, rc.fin
    `)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error resultados' })
  }
})

/* =========================
   GANADORES
========================= */
app.get('/api/ganadores', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        rc.id_evento_carrera AS "IdEventoCarrera",
        MAX(CASE WHEN rc.posicion = 1 THEN p.nombre END) AS "GanadorCarrera",
        MAX(CASE WHEN rc.posicion = 1 THEN p.numero END) AS "NumeroCarrera"
      FROM resultadoscarrera rc
      JOIN pilotos p ON p.id_piloto = rc.id_piloto
      GROUP BY rc.id_evento_carrera
    `)
    res.json(rows)
  } catch (error) {
    console.error('Error en /api/ganadores:', error)
    res.status(500).json({ error: 'Error al obtener ganadores' })
  }
})


/* =========================
   LICENCIAS
========================= */
app.get('/api/licencias', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        p.numero AS numeropiloto,
        CONCAT(p.nombre,' ',p.apellido) AS piloto,
        l.licencia_actual
      FROM pilotos p
      LEFT JOIN licencias l ON p.numero = l.numeropiloto
      ORDER BY p.numero
    `)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error licencias' })
  }
})

/* =========================
   FRONTEND (DIST)
========================= */
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

app.get('*', (_, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

/* =========================
   SERVIDOR
========================= */
const PORT = process.env.PORT || 8080
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`)
})