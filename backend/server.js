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

// Servir archivos estáticos del frontend desde la carpeta dist que está un nivel arriba
// IMPORTANTE: La carpeta dist está en GAMING/dist, y este archivo está en GAMING/backend/
app.use('/Gaming', express.static(path.join(__dirname, '..', 'dist')))

/* ================================
   CONEXIÓN POSTGRESQL (RAILWAY)
================================ */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL (Railway)'))
  .catch(err => console.error('❌ Error PostgreSQL:', err))


// PILOTOS
app.get('/api/pilotos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM "Pilotos" ORDER BY "Numero"')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// RESULTADOS
app.get('/api/resultados', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        RC."IdEventoCarrera",
        RC."Fin",
        RC."Inicio",
        RC."NumeroPiloto",
        RC."Piloto",
        RC."Intervalos",
        RC."Vueltas",
        RC."VueltasLideradas",
        COALESCE(P."Puntos", 0) AS "Puntos",
        COALESCE(PE1."Puntos", 0) AS "PuntosEtapa1",
        COALESCE(PE2."Puntos", 0) AS "PuntosEtapa2",
        RC."Estado",
        RC."PP",
        RC."Penalidad"
      FROM "ResultadosCarrera" RC
      LEFT JOIN "Puntos" P ON RC."Id_Puntos" = P."Posicion"
      LEFT JOIN "Puntos_Etapa" PE1 ON RC."Id_FinalS1" = PE1."Posicion"
      LEFT JOIN "Puntos_Etapa" PE2 ON RC."Id_FinalS2" = PE2."Posicion"
      ORDER BY RC."IdEventoCarrera", RC."Fin"
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// EVENTOS
app.get('/api/eventos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM "EventosCarrera" ORDER BY "Fecha"')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ======================================================
   ENDPOINT: CAMPEONATO DE EQUIPOS
====================================================== */
app.get('/api/campeonato-equipos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      WITH MejorPilotoPorEquipo AS (
        SELECT
          RC."IdEventoCarrera",
          P."Equipo",
          RC."NumeroPiloto",
          RC."Fin",
          PU."Puntos",
          RC."Estado",
          ROW_NUMBER() OVER (
            PARTITION BY RC."IdEventoCarrera", P."Equipo"
            ORDER BY RC."Fin" ASC
          ) AS "RankingEquipo"
        FROM "ResultadosCarrera" RC
        INNER JOIN "Pilotos" P ON RC."NumeroPiloto" = P."Numero"
        INNER JOIN "Puntos" PU ON RC."Id_Puntos" = PU."Posicion"
      )
      SELECT
        "Equipo",
        SUM(
          CASE
            WHEN "Estado" = 'Accidente' THEN "Puntos" - 25
            ELSE "Puntos"
          END
        ) AS "PuntosTotalesEquipo"
      FROM MejorPilotoPorEquipo
      WHERE "RankingEquipo" = 1
      GROUP BY "Equipo"
      ORDER BY "PuntosTotalesEquipo" DESC
    `)

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ======================================================
   ENDPOINT: CAMPEONATO DE MARCAS
====================================================== */
app.get('/api/campeonato-fabricantes', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      WITH MejorPilotoPorMarca AS (
        SELECT
          RC."IdEventoCarrera",
          P."MarcaVehiculo",
          RC."Fin",
          PU."Puntos",
          RC."Estado",
          ROW_NUMBER() OVER (
            PARTITION BY RC."IdEventoCarrera", P."MarcaVehiculo"
            ORDER BY RC."Fin" ASC
          ) AS "RankingMarca"
        FROM "ResultadosCarrera" RC
        INNER JOIN "Pilotos" P ON RC."NumeroPiloto" = P."Numero"
        INNER JOIN "Puntos" PU ON RC."Id_Puntos" = PU."Posicion"
      ),
      PuntosPorMarca AS (
        SELECT
          "MarcaVehiculo",
          SUM(
            CASE
              WHEN "Estado" = 'Accidente' THEN "Puntos" - 25
              ELSE "Puntos"
            END
          ) AS "PuntosTotales",
          SUM(
            CASE
              WHEN "Fin" = 1 THEN 1 ELSE 0
            END
          ) AS "Victorias"
        FROM MejorPilotoPorMarca
        WHERE "RankingMarca" = 1
        GROUP BY "MarcaVehiculo"
      ),
      ClasificacionFinal AS (
        SELECT
          "MarcaVehiculo",
          "PuntosTotales",
          "Victorias",
          MAX("PuntosTotales") OVER () - "PuntosTotales" AS "Detras"
        FROM PuntosPorMarca
      )
      SELECT
        ROW_NUMBER() OVER (ORDER BY "PuntosTotales" DESC) AS "POS",
        "MarcaVehiculo" AS "MANUFACTURER",
        "PuntosTotales" AS "POINTS",
        CASE
          WHEN "Detras" = 0 THEN 'LIDER'
          ELSE CONCAT('-', "Detras")
        END AS "BEHIND",
        "Victorias" AS "WINS"
      FROM ClasificacionFinal
      ORDER BY "PuntosTotales" DESC
    `)

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ======================================================
   ENDPOINT: CAMPEONATO DE PILOTOS
====================================================== */
app.get('/api/estadisticas', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      WITH EstadisticasPiloto AS (
        SELECT
          P."Numero" AS "No",
          CONCAT(P."Nombre", ' ', P."Apellido") AS "Driver",
          P."MarcaVehiculo" AS "MFR",
          SUM(
            PU."Puntos"
            + COALESCE(PE1."Puntos", 0)
            + COALESCE(PE2."Puntos", 0)
          ) AS "BasePoints",
          SUM(
            CASE
              WHEN RC."PP" ~ '^[0-9]+$' THEN CAST(RC."PP" AS INT)
              ELSE 0
            END
          ) AS "PlayoffPoints",
          COUNT(DISTINCT RC."IdEventoCarrera") AS "Starts",
          SUM(CASE WHEN RC."Fin" = 1 THEN 1 ELSE 0 END) AS "Wins",
          SUM(CASE WHEN RC."Fin" BETWEEN 1 AND 5 THEN 1 ELSE 0 END) AS "Top5s",
          SUM(CASE WHEN RC."Fin" BETWEEN 1 AND 10 THEN 1 ELSE 0 END) AS "Top10s",
          SUM(CASE WHEN RC."Estado" = 'Accidente' THEN 1 ELSE 0 END) AS "DNFs",
          SUM(RC."VueltasLideradas") AS "LapsLed",
          CAST(AVG(RC."Inicio") AS DECIMAL(10,2)) AS "AvgStart",
          CAST(AVG(RC."Fin") AS DECIMAL(10,2)) AS "AvgFinish"
        FROM "ResultadosCarrera" RC
        INNER JOIN "Pilotos" P ON RC."NumeroPiloto" = P."Numero"
        INNER JOIN "Puntos" PU ON RC."Id_Puntos" = PU."Posicion"
        LEFT JOIN "Puntos_Etapa" PE1 ON RC."Id_FinalS1" = PE1."Posicion"
        LEFT JOIN "Puntos_Etapa" PE2 ON RC."Id_FinalS2" = PE2."Posicion"
        GROUP BY P."Numero", P."Nombre", P."Apellido", P."MarcaVehiculo"
      ),
      ClasificacionFinal AS (
        SELECT
          *,
          ("BasePoints" + "PlayoffPoints") AS "TotalPoints",
          MAX("BasePoints" + "PlayoffPoints") OVER ()
          - ("BasePoints" + "PlayoffPoints") AS "Behind"
        FROM EstadisticasPiloto
      )
      SELECT
        ROW_NUMBER() OVER (ORDER BY "TotalPoints" DESC) AS "POS",
        "No",
        "Driver",
        "MFR",
        "TotalPoints" AS "POINTS (STAGE)",
        CASE
          WHEN "Behind" = 0 THEN 'LIDER'
          ELSE CONCAT('-', "Behind")
        END AS "BEHIND",
        "Starts",
        "Wins",
        "Top5s" AS "TOP 5s",
        "Top10s" AS "TOP 10s",
        "DNFs",
        "LapsLed" AS "LAPS LED",
        "PlayoffPoints" AS "PLAYOFF POINTS",
        "AvgStart" AS "AVG START",
        "AvgFinish" AS "AVG FINISH"
      FROM ClasificacionFinal
      ORDER BY "TotalPoints" DESC
    `)

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GANADORES
app.get('/api/ganadores', async (req, res) => {
  try {
    const pole = await pool.query(`
      SELECT "IdEventoCarrera", "Piloto" AS "GanadorPole", "NumeroPiloto"
      FROM "ResultadosCarrera" WHERE "Inicio" = 1
    `)

    const carrera = await pool.query(`
      SELECT "IdEventoCarrera", "Piloto" AS "GanadorCarrera", "NumeroPiloto"
      FROM "ResultadosCarrera" WHERE "Fin" = 1
    `)

    const data = {}

    pole.rows.forEach(p => {
      data[p.IdEventoCarrera] = { ...p }
    })

    carrera.rows.forEach(c => {
      data[c.IdEventoCarrera] = {
        ...data[c.IdEventoCarrera],
        ...c
      }
    })

    res.json(Object.values(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ======================================================
   ENDPOINT: LICENCIAS
====================================================== */
app.get('/api/licencias', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      WITH Estadisticas AS (
        SELECT
          RC."NumeroPiloto",
          COUNT(*) AS "TotalCarreras",
          SUM(CASE WHEN RC."Penalidad" = '-3' THEN 1 ELSE 0 END) AS "Accidentes",
          MAX(CASE WHEN RC."Penalidad" = '-3' THEN EC."NombreEvento" END) AS "EventoAccidente"
        FROM "ResultadosCarrera" RC
        INNER JOIN "EventosCarrera" EC ON RC."IdEventoCarrera" = EC."IdEvento"
        GROUP BY RC."NumeroPiloto"
      ),
      CalculoLicencia AS (
        SELECT
          P."Numero",
          CONCAT(P."Nombre", ' ', P."Apellido") AS "Piloto",
          COALESCE(E."TotalCarreras", 0) AS "TotalCarreras",
          COALESCE(E."Accidentes", 0) AS "Accidentes",
          COALESCE(E."TotalCarreras", 0) - COALESCE(E."Accidentes", 0) AS "CarrerasLimpias",
          E."EventoAccidente",
          2 + ((COALESCE(E."TotalCarreras", 0) - COALESCE(E."Accidentes", 0)) / 3)
            - (COALESCE(E."Accidentes", 0) / 3) AS "NivelLicencia"
        FROM "Pilotos" P
        LEFT JOIN Estadisticas E ON P."Numero" = E."NumeroPiloto"
      )
      SELECT
        "Numero" AS "NumeroPiloto",
        "Piloto",
        CASE
          WHEN "NivelLicencia" <= 0 THEN 'S'
          WHEN "NivelLicencia" = 1 THEN 'C'
          WHEN "NivelLicencia" = 2 THEN 'B'
          ELSE 'A'
        END AS "LicenciaActual",
        CASE
          WHEN "TotalCarreras" = 0 THEN 'Sin participaciones registradas'
          WHEN "Accidentes" = 0 THEN
            'Continúas con tu Licencia ' ||
            CASE
              WHEN "NivelLicencia" = 3 THEN 'A'
              WHEN "NivelLicencia" = 2 THEN 'B'
              ELSE 'C'
            END
          WHEN "NivelLicencia" <= 0 THEN
            'Penalizado 1 carrera por accidente en el evento ' || "EventoAccidente"
          WHEN ("CarrerasLimpias" / 3) > ("Accidentes" / 3) THEN
            'Subes de licencia por buen comportamiento'
          ELSE
            'Bajas de licencia por acumulación de accidentes'
        END AS "EstadoLicencia"
      FROM CalculoLicencia
      ORDER BY "Numero" ASC
    `)

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ================================
   EJEMPLO ENDPOINT
================================ */

app.get('/test', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()')
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ================================
   SERVIDOR
================================ */

// Ruta catch-all para servir el frontend en cualquier ruta
// IMPORTANTE: Esta debe ir AL FINAL después de todas las rutas de API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

const PORT = process.env.PORT || 8080

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`)
})