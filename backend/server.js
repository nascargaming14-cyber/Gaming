import express from 'express'
import cors from 'cors'
import sql from 'mssql'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

/* =========================
   CONFIGURACIÓN BASE
========================= */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({
  origin: '*', // permite que cualquier página vea los datos
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

/* =========================
   SQL SERVER CONFIG
========================= */

const config = {
  user: 'sa',
  password: '981495',
  server: 'IRVINARCE\\INSTALACIONDAWER',
  database: 'GAMING',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: 'INSTALACIONDAWER'
  }
}

sql.connect(config)
  .then(() => console.log('✅ Conectado a SQL Server – GAMING'))
  .catch(err => console.error('❌ Error SQL:', err.message))

/* =========================
   ENDPOINTS API
========================= */

// PILOTOS
app.get('/api/pilotos', async (req, res) => {
  try {
    const pool = await sql.connect(config)
    const result = await pool.request()
      .query('SELECT * FROM Pilotos ORDER BY Numero')
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// RESULTADOS
app.get('/api/resultados', async (req, res) => {
  try {
    const pool = await sql.connect(config)
    const result = await pool.request().query(`
      SELECT 
        RC.IdEventoCarrera,
        RC.Fin,
        RC.Inicio,
        RC.NumeroPiloto,
        RC.Piloto,
        RC.Intervalos,
        RC.Vueltas,
        RC.VueltasLideradas,
        ISNULL(P.Puntos, 0) AS Puntos,
        ISNULL(PE1.Puntos, 0) AS PuntosEtapa1,
        ISNULL(PE2.Puntos, 0) AS PuntosEtapa2,
        RC.Estado,
        RC.PP,
        RC.Penalidad
      FROM ResultadosCarrera RC
      LEFT JOIN Puntos P ON RC.Id_Puntos = P.Posicion
      LEFT JOIN Puntos_Etapa PE1 ON RC.Id_FinalS1 = PE1.Posicion
      LEFT JOIN Puntos_Etapa PE2 ON RC.Id_FinalS2 = PE2.Posicion
      ORDER BY RC.IdEventoCarrera, RC.Fin
    `)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// EVENTOS
app.get('/api/eventos', async (req, res) => {
  try {
    const pool = await sql.connect(config)
    const result = await pool.request()
      .query('SELECT * FROM EventosCarrera ORDER BY Fecha')
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// CAMPEONATO DE EQUIPOS
app.get('/api/campeonato-equipos', async (req, res) => {
  try {
    const pool = await sql.connect(config)
    const result = await pool.request().query(`
      WITH MejorPilotoPorEquipo AS (
        SELECT
          RC.IdEventoCarrera,
          P.Equipo,
          RC.NumeroPiloto,
          RC.Fin,
          PU.Puntos,
          RC.Estado,
          ROW_NUMBER() OVER (
            PARTITION BY RC.IdEventoCarrera, P.Equipo
            ORDER BY RC.Fin ASC
          ) AS RankingEquipo
        FROM ResultadosCarrera RC
        INNER JOIN Pilotos P
          ON RC.NumeroPiloto = P.Numero
        INNER JOIN Puntos PU
          ON RC.Id_Puntos = PU.Posicion
      )
      SELECT
        Equipo,
        SUM(
          CASE
            WHEN Estado = 'Accidente' THEN Puntos - 25
            ELSE Puntos
          END
        ) AS PuntosTotalesEquipo
      FROM MejorPilotoPorEquipo
      WHERE RankingEquipo = 1
      GROUP BY Equipo
      ORDER BY PuntosTotalesEquipo DESC
    `)
    
    console.log('✅ Datos de equipos obtenidos:', result.recordset.length, 'equipos')
    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error en campeonato-equipos:', err)
    res.status(500).json({ error: err.message })
  }
})

// CAMPEONATO DE FABRICANTES
app.get('/api/campeonato-fabricantes', async (req, res) => {
  try {
    const pool = await sql.connect(config)
    const result = await pool.request().query(`
      WITH MejorPilotoPorMarca AS (
        SELECT
          RC.IdEventoCarrera,
          P.MarcaVehiculo,
          RC.Fin,
          PU.Puntos,
          RC.Estado,
          ROW_NUMBER() OVER (
            PARTITION BY RC.IdEventoCarrera, P.MarcaVehiculo
            ORDER BY RC.Fin ASC
          ) AS RankingMarca
        FROM ResultadosCarrera RC
        INNER JOIN Pilotos P
          ON RC.NumeroPiloto = P.Numero
        INNER JOIN Puntos PU
          ON RC.Id_Puntos = PU.Posicion
      ),
      PuntosPorMarca AS (
        SELECT
          MarcaVehiculo,
          SUM(
            CASE
              WHEN Estado = 'Accidente' THEN Puntos - 25
              ELSE Puntos
            END
          ) AS PuntosTotales,
          SUM(
            CASE
              WHEN Fin = 1 THEN 1
              ELSE 0
            END
          ) AS Victorias
        FROM MejorPilotoPorMarca
        WHERE RankingMarca = 1
        GROUP BY MarcaVehiculo
      ),
      ClasificacionFinal AS (
        SELECT
          MarcaVehiculo,
          PuntosTotales,
          Victorias,
          MAX(PuntosTotales) OVER () - PuntosTotales AS Detras
        FROM PuntosPorMarca
      )
      SELECT
        ROW_NUMBER() OVER (ORDER BY PuntosTotales DESC) AS POS,
        MarcaVehiculo AS MANUFACTURER,
        PuntosTotales AS POINTS,
        CASE
          WHEN Detras = 0 THEN 'LIDER'
          ELSE CONCAT('-', Detras)
        END AS BEHIND,
        Victorias AS WINS
      FROM ClasificacionFinal
      ORDER BY PuntosTotales DESC
    `)
    
    console.log('✅ Datos de fabricantes obtenidos:', result.recordset.length, 'fabricantes')
    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error en campeonato-fabricantes:', err)
    res.status(500).json({ error: err.message })
  }
})

// ESTADÍSTICAS
app.get('/api/estadisticas', async (req, res) => {
  try {
    const pool = await sql.connect(config)
    const result = await pool.request().query(`
      WITH EstadisticasPiloto AS (
        SELECT
          P.Numero                                  AS No,
          CONCAT(P.Nombre, ' ', P.Apellido)         AS Driver,
          P.MarcaVehiculo                           AS MFR,
          -- Puntos base (Final + Stages)
          SUM(
            PU.Puntos
            + ISNULL(PE1.Puntos, 0)
            + ISNULL(PE2.Puntos, 0)
          ) AS BasePoints,
          -- Playoff Points (PP)
          SUM(
            CASE
              WHEN ISNUMERIC(RC.PP) = 1
              THEN CAST(RC.PP AS INT)
              ELSE 0
            END
          ) AS PlayoffPoints,
          COUNT(DISTINCT RC.IdEventoCarrera) AS Starts,
          SUM(CASE WHEN RC.Fin = 1 THEN 1 ELSE 0 END) AS Wins,
          SUM(CASE WHEN RC.Fin BETWEEN 1 AND 5 THEN 1 ELSE 0 END) AS Top5s,
          SUM(CASE WHEN RC.Fin BETWEEN 1 AND 10 THEN 1 ELSE 0 END) AS Top10s,
          -- DNFs solo accidentes
          SUM(CASE WHEN RC.Estado = 'Accidente' THEN 1 ELSE 0 END) AS DNFs,
          SUM(RC.VueltasLideradas) AS LapsLed,
          -- PROMEDIOS
          CAST(AVG(CAST(RC.Inicio AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS AvgStart,
          CAST(AVG(CAST(RC.Fin AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS AvgFinish
        FROM ResultadosCarrera RC
        INNER JOIN Pilotos P
          ON RC.NumeroPiloto = P.Numero
        INNER JOIN Puntos PU
          ON RC.Id_Puntos = PU.Posicion
        LEFT JOIN Puntos_Etapa PE1
          ON RC.Id_FinalS1 = PE1.Posicion
        LEFT JOIN Puntos_Etapa PE2
          ON RC.Id_FinalS2 = PE2.Posicion
        GROUP BY
          P.Numero,
          P.Nombre,
          P.Apellido,
          P.MarcaVehiculo
      ),
      ClasificacionFinal AS (
        SELECT
          *,
          (BasePoints + PlayoffPoints) AS TotalPoints,
          MAX(BasePoints + PlayoffPoints) OVER ()
            - (BasePoints + PlayoffPoints) AS Behind
        FROM EstadisticasPiloto
      )
      SELECT
        ROW_NUMBER() OVER (ORDER BY TotalPoints DESC) AS POS,
        No                                           AS NO,
        Driver                                       AS DRIVER,
        MFR                                          AS MFR,
        TotalPoints                                  AS PointsStage,
        CASE
          WHEN Behind = 0 THEN 'LIDER'
          ELSE CONCAT('-', Behind)
        END                                          AS BEHIND,
        Starts                                       AS STARTS,
        Wins                                         AS WINS,
        Top5s                                        AS Top5s,
        Top10s                                       AS Top10s,
        DNFs                                         AS DNFs,
        LapsLed                                      AS LapsLed,
        PlayoffPoints                                AS PlayoffPoints,
        -- NUEVAS COLUMNAS AL FINAL
        AvgStart                                     AS AvgStart,
        AvgFinish                                    AS AvgFinish
      FROM ClasificacionFinal
      ORDER BY TotalPoints DESC
    `)
    
    console.log('✅ Estadísticas obtenidas:', result.recordset.length, 'pilotos')
    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error en estadísticas:', err)
    res.status(500).json({ error: err.message })
  }
})

// GANADORES
app.get('/api/ganadores', async (req, res) => {
  try {
    const pool = await sql.connect(config)

    const pole = await pool.request().query(`
      SELECT IdEventoCarrera, Piloto AS GanadorPole, NumeroPiloto
      FROM ResultadosCarrera WHERE Inicio = 1
    `)

    const carrera = await pool.request().query(`
      SELECT IdEventoCarrera, Piloto AS GanadorCarrera, NumeroPiloto
      FROM ResultadosCarrera WHERE Fin = 1
    `)

    const data = {}

    pole.recordset.forEach(p => {
      data[p.IdEventoCarrera] = { ...p }
    })

    carrera.recordset.forEach(c => {
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

// LICENCIAS
app.get('/api/licencias', async (req, res) => {
  try {
    const pool = await sql.connect(config)
    const result = await pool.request().query(`
      WITH Estadisticas AS (
        SELECT
          RC.NumeroPiloto,
          COUNT(*) AS TotalCarreras,
          SUM(CASE WHEN RC.Penalidad = '-3' THEN 1 ELSE 0 END) AS Accidentes,
          MAX(CASE WHEN RC.Penalidad = '-3' THEN EC.NombreEvento END) AS EventoAccidente
        FROM ResultadosCarrera RC
        INNER JOIN EventosCarrera EC
          ON RC.IdEventoCarrera = EC.IdEvento
        GROUP BY RC.NumeroPiloto
      ),
      CalculoLicencia AS (
        SELECT
          P.Numero,
          CONCAT(P.Nombre, ' ', P.Apellido) AS Piloto,
          ISNULL(E.TotalCarreras, 0) AS TotalCarreras,
          ISNULL(E.Accidentes, 0) AS Accidentes,
          ISNULL(E.TotalCarreras, 0) - ISNULL(E.Accidentes, 0) AS CarrerasLimpias,
          E.EventoAccidente,
          2
          + ((ISNULL(E.TotalCarreras, 0) - ISNULL(E.Accidentes, 0)) / 3)
          - (ISNULL(E.Accidentes, 0) / 3) AS NivelLicencia
        FROM Pilotos P
        LEFT JOIN Estadisticas E
          ON P.Numero = E.NumeroPiloto
      )
      SELECT
        Numero AS NumeroPiloto,
        Piloto,
        CASE
          WHEN NivelLicencia <= 0 THEN 'S'
          WHEN NivelLicencia = 1 THEN 'C'
          WHEN NivelLicencia = 2 THEN 'B'
          ELSE 'A'
        END AS LicenciaActual,
        CASE
          WHEN TotalCarreras = 0 THEN
            'Sin participaciones registradas'
          WHEN Accidentes = 0 THEN
            'Continúas con tu Licencia ' +
            CASE
              WHEN NivelLicencia = 3 THEN 'A'
              WHEN NivelLicencia = 2 THEN 'B'
              ELSE 'C'
            END
          WHEN NivelLicencia <= 0 THEN
            'Penalizado 1 carrera por accidente en el evento ' + EventoAccidente
          WHEN (CarrerasLimpias / 3) > (Accidentes / 3) THEN
            'Subes de licencia por buen comportamiento'
          ELSE
            'Bajas de licencia por acumulación de accidentes'
        END AS EstadoLicencia
      FROM CalculoLicencia
      ORDER BY Numero ASC
    `)
    
    console.log('✅ Licencias obtenidas:', result.recordset.length, 'pilotos')
    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error en licencias:', err)
    res.status(500).json({ error: err.message })
  }
})

/* =========================
   FRONTEND BUILD
========================= */

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  const indexFile = path.join(__dirname, 'dist', 'index.html')
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile)
  } else {
    res.status(404).send('Frontend no compilado')
  }
})

/* ========================= */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Backend activo en puerto ${PORT}`);
});
