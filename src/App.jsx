import { useState, useEffect } from 'react'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [pilotos, setPilotos] = useState([])
  const [estadisticas, setEstadisticas] = useState([])
  const [eventos, setEventos] = useState([])
  const [resultados, setResultados] = useState([])
  const [ganadores, setGanadores] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedEventoId, setSelectedEventoId] = useState(null)
  const [campeonatoEquipos, setCampeonatoEquipos] = useState([])
  const [campeonatoFabricantes, setCampeonatoFabricantes] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTimezone, setSelectedTimezone] = useState('America/Mexico_City')
  const [showCampeonatoMenu, setShowCampeonatoMenu] = useState(false)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [licencias, setLicencias] = useState([])
  
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '-'
    const fecha = fechaISO.split('T')[0]
    const [año, mes, dia] = fecha.split('-')
    return `${dia}/${mes}/${año}`
  }

useEffect(() => {
    fetch('http://localhost:5173/api/eventos')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error(err))

    fetch('http://localhost:5173/api/ganadores')
      .then(res => res.json())
      .then(data => setGanadores(data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if (currentView === 'details') {
      fetchPilotos()
      const interval = setInterval(fetchPilotos, 5000)
      return () => clearInterval(interval)
    }
    if (currentView === 'estadisticas') {
      fetchEstadisticas()
      const interval = setInterval(fetchEstadisticas, 5000)
      return () => clearInterval(interval)
    }
    if (currentView === 'calendario') {
      fetchEventos()
      fetchGanadores()
      const interval = setInterval(() => {
        fetchEventos()
        fetchGanadores()
      }, 5000)
      return () => clearInterval(interval)
    }
    if (currentView === 'campeonato-fabricantes') {
    fetchCampeonatoFabricantes()
    const interval = setInterval(fetchCampeonatoFabricantes, 5000)
    return () => clearInterval(interval)
    }
    if (currentView === 'resultados') {
      fetchResultados()
      fetchEventos()
      const interval = setInterval(fetchResultados, 5000)
      return () => clearInterval(interval)
    }
    if (currentView === 'campeonato-equipos') {
    fetchCampeonatoEquipos()
    const interval = setInterval(fetchCampeonatoEquipos, 5000)
    return () => clearInterval(interval)
    }
    if (currentView === 'licencias') {
    fetchLicencias()
    const interval = setInterval(fetchLicencias, 5000)
    return () => clearInterval(interval)
    }
  }, [currentView])

const fetchPilotos = async () => {
  try {
    setLoading(true)
    setError(null)

  const res = await fetch('http://localhost:5173/api/pilotos')
    if (!res.ok) throw new Error('Error al obtener pilotos')

    const data = await res.json()
    setPilotos(data)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

const fetchCampeonatoFabricantes = async () => {
  setLoading(true)
  setError(null)
  try {
    const response = await fetch('http://localhost:5173/api/campeonato-fabricantes')
    if (!response.ok) throw new Error('Error al cargar campeonato de fabricantes')
    const data = await response.json()
    setCampeonatoFabricantes(data)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

const fetchCampeonatoEquipos = async () => {
  setLoading(true)
  setError(null)
  try {
    const response = await fetch('http://localhost:5173/api/campeonato-equipos')
    if (!response.ok) throw new Error('Error al cargar campeonato de equipos')
    const data = await response.json()
    setCampeonatoEquipos(data)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  const fetchEstadisticas = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5173/api/estadisticas')
      if (!response.ok) throw new Error('Error al cargar estadísticas')
      const data = await response.json()
      setEstadisticas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchEventos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5173/api/eventos')
      if (!response.ok) throw new Error('Error al cargar eventos')
      const data = await response.json()
      setEventos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchResultados = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5173/api/resultados')
      if (!response.ok) throw new Error('Error al cargar resultados')
      const data = await response.json()
      setResultados(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

const fetchGanadores = async () => {
  try {
    const response = await fetch('http://localhost:5173/api/ganadores')
    if (!response.ok) throw new Error('Error al cargar ganadores')
    const data = await response.json()
    
    const ganadoresMap = {}
    data.forEach(g => {
      if (!ganadoresMap[g.IdEventoCarrera]) {
        ganadoresMap[g.IdEventoCarrera] = {}
      }
      ganadoresMap[g.IdEventoCarrera] = {
        pole: g.GanadorPole,
        carrera: g.GanadorCarrera,
        numeroPole: g.NumeroPole,
        numeroCarrera: g.NumeroCarrera
      }
    })
    setGanadores(ganadoresMap)
  } catch (err) {
    console.error('Error fetching ganadores:', err)
  }
}

const fetchLicencias = async () => {
  setLoading(true)
  setError(null)
  try {
    const response = await fetch('http://localhost:5173/api/licencias')
    if (!response.ok) throw new Error('Error al cargar licencias')
    const data = await response.json()
    setLicencias(data)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

// HOME VIEW
  useEffect(() => {
    if (currentView === 'home') {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000)
      return () => clearInterval(timer)
    }
  }, [currentView])

// HOME VIEW DOS
  useEffect(() => {
    if (currentView === 'home' && eventos.length) {
      const proximaCarrera = eventos
        .filter(e => new Date(e.Fecha) >= new Date())
        .sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha))[0]

      if (!proximaCarrera) return

      const calcularCountdown = () => {
        const fechaCarrera = new Date(proximaCarrera.Fecha)
        const horaCarrera = proximaCarrera.Hora ? proximaCarrera.Hora.split('T')[1] : '20:00:00'
        const [hora, minuto] = horaCarrera.split(':')
        fechaCarrera.setHours(parseInt(hora), parseInt(minuto), 0, 0)
        const ahora = new Date()
        const diferencia = fechaCarrera - ahora

        if (diferencia > 0) {
          const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
          const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))
          const segundos = Math.floor((diferencia % (1000 * 60)) / 1000)
          setCountdown({ days: dias, hours: horas, minutes: minutos, seconds: segundos })
        } else {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        }
      }

      calcularCountdown()
      const countdownTimer = setInterval(calcularCountdown, 1000)
      return () => clearInterval(countdownTimer)
    }
  }, [currentView, eventos])

// HOME VIEW TRES
  if (currentView === 'home') {
    const proximaCarrera = eventos
      .filter(e => new Date(e.Fecha) >= new Date())
      .sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha))[0]

    const timezones = [
      { value: 'America/Mexico_City', label: 'México (GMT-6)' },
      { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (GMT-3)' },
      { value: 'America/Bogota', label: 'Colombia (GMT-5)' },
      { value: 'America/El_Salvador', label: 'El Salvador (GMT-6)' },
      { value: 'America/Costa_Rica', label: 'Costa Rica (GMT-6)' }
    ]

    const formatTime = (date, tz) => {
      return date.toLocaleTimeString('es-ES', { 
        timeZone: tz, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      })
    }

    const formatDate = (date, tz) => {
      return date.toLocaleDateString('es-ES', { 
        timeZone: tz,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return (
      <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: 'white', padding: '0', margin: '0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            
            {/* LOGO NASCAR CUP SERIES */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <img 
                src="/NASCAR_Cup_Series_logo.svg" 
                alt="NASCAR Cup Series" 
                style={{ height: '150px', marginBottom: '20px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'block'
                }}
              />
              <h1 style={{ fontSize: '52px', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)', display: 'none' }}>
                NASCAR GAMING SERIES
              </h1>
              <p style={{ fontSize: '18px', color: '#999', marginTop: '10px' }}>Sponsored By Alpina</p>
            </div>

            {/* MENÚ DE NAVEGACIÓN - AHORA ARRIBA */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
              
              {/* PILOTOS */}
              <button 
                onClick={() => setCurrentView('details')}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '20px 35px',
                  fontSize: '18px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  flex: '1 1 auto',
                  minWidth: '200px'
                }}
              >
                🏎️ PILOTOS
              </button>

              {/* CALENDARIO */}
              <button 
                onClick={() => setCurrentView('calendario')}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '20px 35px',
                  fontSize: '18px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  flex: '1 1 auto',
                  minWidth: '200px'
                }}
              >
                📅 CALENDARIO
              </button>

              {/* CAMPEONATO (con dropdown) */}
              <div style={{ position: 'relative', flex: '1 1 auto', minWidth: '200px' }}>
                <button 
                  onClick={() => setShowCampeonatoMenu(!showCampeonatoMenu)}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: '20px 35px',
                    fontSize: '18px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.4)',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  🏆 CAMPEONATO {showCampeonatoMenu ? '▲' : '▼'}
                </button>
                
                {showCampeonatoMenu && (
                  <div style={{ 
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '10px',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    border: '2px solid #16a34a',
                    zIndex: 10
                  }}>
                    <button 
                      onClick={() => {
                        setShowCampeonatoMenu(false)
                        setCurrentView('estadisticas')
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        padding: '20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderBottom: '1px solid #444',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      📊 Campeonato de Pilotos
                    </button>
                    <button 
                      onClick={() => {
                        setShowCampeonatoMenu(false)
                        setCurrentView('campeonato-equipos')
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        padding: '20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderBottom: '1px solid #444',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      🏁 Campeonato de Equipos
                    </button>
                    <button 
                      onClick={() => {
                        setShowCampeonatoMenu(false)
                        setCurrentView('campeonato-fabricantes')
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        padding: '20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      🏭 Campeonato de Fabricantes
                    </button>
                  </div>
                )}
              </div>
              
              {/* DESCARGAS */}
              <button 
                onClick={() => setCurrentView('descargas')}
                style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  padding: '20px 35px',
                  fontSize: '18px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  flex: '1 1 auto',
                  minWidth: '200px'
                }}
              >
                🔥 DESCARGAS
              </button>

              {/* REGLAMENTO */}
              <button 
                onClick={() => setCurrentView('reglamento')}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '20px 35px',
                  fontSize: '18px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  flex: '1 1 auto',
                  minWidth: '200px'
                }}
              >
                📋 REGLAMENTO
              </button>
            </div>

            {/* RELOJ Y ZONA HORARIA */}
            <div style={{ 
              backgroundColor: '#2d2d2d', 
              borderRadius: '16px', 
              padding: '30px', 
              marginBottom: '30px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              border: '2px solid #dc2626'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#dc2626', fontFamily: 'monospace' }}>
                    {formatTime(currentTime, selectedTimezone)}
                  </div>
                  <div style={{ fontSize: '16px', color: '#999', marginTop: '5px' }}>
                    {formatDate(currentTime, selectedTimezone)}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#999', marginBottom: '8px' }}>
                    Zona Horaria:
                  </label>
                  <select 
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    style={{
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      border: '2px solid #dc2626',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    {timezones.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* PRÓXIMA CARRERA */}
            {proximaCarrera && (
              <div style={{ 
                backgroundColor: '#2d2d2d', 
                borderRadius: '16px', 
                padding: '30px', 
                marginBottom: '40px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                border: '2px solid #f59e0b'
              }}>
                <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  🏁 PRÓXIMA CARRERA
                </h2>
                
                {/* CRONÓMETRO REGRESIVO */}
                <div style={{ 
                  backgroundColor: '#1a1a1a', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', fontFamily: 'monospace' }}>
                      {String(countdown.days).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>DÍAS</div>
                  </div>
                  <div style={{ fontSize: '48px', color: '#f59e0b', fontWeight: 'bold' }}>:</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', fontFamily: 'monospace' }}>
                      {String(countdown.hours).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>HORAS</div>
                  </div>
                  <div style={{ fontSize: '48px', color: '#f59e0b', fontWeight: 'bold' }}>:</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', fontFamily: 'monospace' }}>
                      {String(countdown.minutes).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>MINUTOS</div>
                  </div>
                  <div style={{ fontSize: '48px', color: '#f59e0b', fontWeight: 'bold' }}>:</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', fontFamily: 'monospace' }}>
                      {String(countdown.seconds).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>SEGUNDOS</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '24px', marginBottom: '10px', color: 'white' }}>{proximaCarrera.NombreEvento}</h3>
                    <p style={{ fontSize: '18px', color: '#999', marginBottom: '5px' }}>📍 {proximaCarrera.Estadio}</p>
                    <p style={{ fontSize: '16px', color: '#999' }}>{proximaCarrera.Ciudad}, {proximaCarrera.Estado}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '20px', color: '#f59e0b', marginBottom: '10px' }}>
                      📅 {formatearFecha(proximaCarrera.Fecha)}
                    </p>
                    <p style={{ fontSize: '18px', color: '#999' }}>
                      🕐 {proximaCarrera.Hora ? proximaCarrera.Hora.split('T')[1].substring(0, 5) : '--:--'} {proximaCarrera.ZonaHoraria}
                    </p>
                    <p style={{ fontSize: '16px', color: '#999', marginTop: '10px' }}>
                      🏁 {proximaCarrera.NumeroVueltas} vueltas · {proximaCarrera.DistanciaMillas} millas
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* INFO FOOTER */}
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
              <p style={{ fontSize: '14px' }}>
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
            NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.
          </p>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
            Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    )
}

// RESULTADOS VIEW
  if (currentView === 'resultados') {
    // Filtrar resultados según el evento seleccionado
    let resultadosFiltrados = resultados;
    if (selectedEventoId !== null) {
      resultadosFiltrados = resultados.filter(r => r.IdEventoCarrera === selectedEventoId);
    }

    const resultadosPorEvento = resultadosFiltrados.reduce((acc, resultado) => {
      if (!acc[resultado.IdEventoCarrera]) {
        acc[resultado.IdEventoCarrera] = []
      }
      acc[resultado.IdEventoCarrera].push(resultado)
      return acc
    }, {})

    return (
      <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#1a1a1a', color: 'white', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, width: '100%' }}>
          <div style={{ padding: '20px 40px', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', width: '100%', boxSizing: 'border-box' }}>
            <h1 style={{ fontSize: '32px', margin: 0 }}>🏆 Resultados de la carrera - NASCAR Gaming Series</h1>
            <button 
              onClick={() => {
                setSelectedEventoId(null);
                setCurrentView('calendario');
              }}
              style={{
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ← Regresar al calendario
            </button>
          </div>

          {error && (
            <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '15px', margin: '0 40px 20px 40px', borderRadius: '8px' }}>
              <strong>❌ Error:</strong> {error}
            </div>
          )}

          <div style={{ padding: '0 40px 20px', width: '100%', boxSizing: 'border-box' }}>
            {Object.keys(resultadosPorEvento).length > 0 ? (
              Object.entries(resultadosPorEvento).map(([eventoId, resultadosEvento]) => {
                const resultadosOrdenados = [...resultadosEvento].sort((a, b) => a.Fin - b.Fin)
                const evento = eventos.find(e => e.IdEvento === parseInt(eventoId))
                const nombreEvento = evento ? evento.NombreEvento : `Evento #${eventoId}`

                return (
                  <div key={eventoId} style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#f59e0b', borderBottom: '2px solid #f59e0b', paddingBottom: '10px' }}>
                      {nombreEvento}
                    </h2>
                    <div style={{ backgroundColor: 'white', overflow: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', width: '100%' }}>
                      <table style={{ width: '100%', minWidth: '1400px', borderCollapse: 'collapse', border: '2px solid #d1d5db' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f3f4f6' }}>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '5%' }}>FIN</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '5%' }}>INICIO</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '6%' }}>Nº</th>
                            <th style={{ padding: '15px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '12%' }}>PILOTO</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '8%' }}>INTERVALOS</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '6%' }}>VUELTAS</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '6%' }}>V. LÍDER</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>PUNTOS</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>PTS ETAPA 1</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>PTS ETAPA 2</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '8%' }}>ESTADO</th>
                            <th style={{ padding: '15px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '5%' }}>PP</th>
                            <th style={{ padding: '15px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '15%' }}>PENALIDAD</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultadosOrdenados.map((resultado, index) => {
                            let bgColor = 'white'
                            if (index === 0) bgColor = '#fef3c7'
                            else if (index === 1) bgColor = '#f3f4f6'
                            else if (index === 2) bgColor = '#fef2f2'

                            return (
                              <tr key={resultado.IdResultado} style={{ backgroundColor: bgColor }}>
                                <td style={{ padding: '15px 12px', border: '2px solid #d1d5db', color: '#111827', textAlign: 'center', fontWeight: 'bold', fontSize: '15px' }}>
                                  {resultado.Fin}
                                </td>
                                <td style={{ padding: '15px 12px', border: '2px solid #d1d5db', color: '#111827', textAlign: 'center', fontWeight: 'bold', fontSize: '15px' }}>{resultado.Inicio}</td>
                                <td style={{ padding: '15px 12px', border: '2px solid #d1d5db', color: '#111827', textAlign: 'center' }}>
                                  <img 
                                    src={`/numeros/${resultado.NumeroPiloto}.png`}
                                    alt={`#${resultado.NumeroPiloto}`}
                                    style={{ height: '40px', display: 'inline-block' }}
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                      e.target.nextElementSibling.style.display = 'inline-block'
                                    }}
                                  />
                                  <span style={{ backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '6px 14px', borderRadius: '25px', fontSize: '15px', display: 'none' }}>
                                    {resultado.NumeroPiloto}
                                  </span>
                                </td>
                                <td style={{ padding: '15px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '15px', fontWeight: '500' }}>{resultado.Piloto}</td>
                                <td style={{ padding: '15px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>{resultado.Intervalos}</td>
                                <td style={{ padding: '15px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>{resultado.Vueltas}</td>
                                <td style={{ padding: '15px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>{resultado.VueltasLideradas}</td>
                                <td style={{ padding: '15px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>{resultado.Puntos || 0}</td>
                                <td style={{ padding: '15px 12px', color: '#16a34a', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>{resultado.PuntosEtapa1 !== null && resultado.PuntosEtapa1 !== undefined ? resultado.PuntosEtapa1 : '0.00'}</td>
                                <td style={{ padding: '15px 12px', color: '#16a34a', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>{resultado.PuntosEtapa2 !== null && resultado.PuntosEtapa2 !== undefined ? resultado.PuntosEtapa2 : '0.00'}</td>
                                <td style={{ padding: '15px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>{resultado.Estado}</td>
                                <td style={{ padding: '15px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>{resultado.PP}</td>
                                <td style={{ padding: '15px 12px', color: '#dc2626', border: '2px solid #d1d5db', fontSize: '14px' }}>{resultado.Penalidad || 'NULL'}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      <div style={{ backgroundColor: '#f3f4f6', padding: '15px 20px', borderTop: '2px solid #d1d5db', display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#111827' }}>
                        <span>Total de participantes: <strong>{resultadosEvento.length}</strong></span>
                        <span>🏆 Ganador: <strong>{resultadosOrdenados[0]?.Piloto || 'N/A'}</strong></span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              !loading && (
                <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏆</div>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>No hay resultados disponibles para este evento</p>
                </div>
              )
            )}

            {loading && resultados.length === 0 && (
              <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
                <p style={{ fontSize: '20px' }}>Cargando resultados desde SQL Server...</p>
              </div>
            )}
          </div>
        </div>

        <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
            NASCAR® and its marks are trademarks of the National Association for Stock Car Auto Racing, LLC. All other trademarks are the property of their respective owners.
          </p>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
            Copyright © 2025 NASCAR Digital Media, LLC. All rights reserved.
          </p>
        </footer>
      </div>
    )
}

// CAMPEONATO DE FABRICANTES VIEW
if (currentView === 'campeonato-fabricantes') {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', padding: '0', margin: '0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: '20px 40px', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
          <h1 style={{ fontSize: '32px', margin: 0 }}>🏭 Campeonato de Fabricantes NASCAR Gaming Series</h1>
          <button 
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Regresar al inicio
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '15px', margin: '0 40px 20px 40px', borderRadius: '8px' }}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        <div style={{ padding: '0 40px' }}>
          {campeonatoFabricantes.length > 0 ? (
            <div style={{ backgroundColor: 'white', overflow: 'visible', margin: '0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #d1d5db', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '10%' }}>POS</th>
                    <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '40%' }}>FABRICANTE</th>
                    <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '20%' }}>PUNTOS</th>
                    <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '15%' }}>DETRÁS</th>
                    <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '15%' }}>VICTORIAS</th>
                  </tr>
                </thead>
                <tbody>
                  {campeonatoFabricantes.map((fabricante, index) => {
                    let bgColor = 'white'
                    if (index === 0) bgColor = '#fef3c7'
                    else if (index === 1) bgColor = '#f3f4f6'
                    else if (index === 2) bgColor = '#fef2f2'

                    return (
                      <tr key={index} style={{ backgroundColor: bgColor }}>
                        <td style={{ padding: '18px 12px', border: '2px solid #d1d5db', color: '#111827', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                          {fabricante.POS}
                        </td>
                        <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '17px', fontWeight: '600' }}>
                          {fabricante.MANUFACTURER || 'Sin Marca'}
                        </td>
                        <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}>
                          {fabricante.POINTS || 0}
                        </td>
                        <td style={{ padding: '18px 12px', color: fabricante.BEHIND === 'LEADER' ? '#16a34a' : '#dc2626', border: '2px solid #d1d5db', fontSize: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                          {fabricante.BEHIND}
                        </td>
                        <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '17px', textAlign: 'center', fontWeight: 'bold' }}>
                          {fabricante.WINS || 0}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div style={{ backgroundColor: '#f3f4f6', padding: '18px 20px', borderTop: '2px solid #d1d5db', display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#111827' }}>
                <span>Total de fabricantes: <strong style={{ fontSize: '17px' }}>{campeonatoFabricantes.length}</strong></span>
                <span>Última actualización: <strong>{new Date().toLocaleTimeString()}</strong></span>
              </div>
            </div>
          ) : (
            !loading && (
              <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏭</div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>No hay datos del campeonato de fabricantes</p>
              </div>
            )
          )}

          {loading && campeonatoFabricantes.length === 0 && (
            <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <p style={{ fontSize: '20px' }}>Cargando campeonato de fabricantes desde SQL Server...</p>
            </div>
          )}
        </div>
      </div>

      <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
          NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.
        </p>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
          Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}

// CAMPEONATO DE EQUIPOS VIEW
if (currentView === 'campeonato-equipos') {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', padding: '0', margin: '0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: '20px 40px', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
          <h1 style={{ fontSize: '32px', margin: 0 }}>🏆 Campeonato de Equipos NASCAR Gaming Series</h1>
          <button 
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Regresar al inicio
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '15px', margin: '0 40px 20px 40px', borderRadius: '8px' }}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        <div style={{ padding: '0 40px' }}>
          {campeonatoEquipos.length > 0 ? (
            <div style={{ backgroundColor: 'white', overflow: 'visible', margin: '0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #d1d5db', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '10%' }}>Posición</th>
                    <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '60%' }}>Equipo</th>
                    <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '30%' }}>Puntos Totales</th>
                  </tr>
                </thead>
                <tbody>
                  {campeonatoEquipos.map((equipo, index) => {
                    let bgColor = 'white'
                    if (index === 0) bgColor = '#fef3c7'
                    else if (index === 1) bgColor = '#f3f4f6'
                    else if (index === 2) bgColor = '#fef2f2'

                    return (
                      <tr key={index} style={{ backgroundColor: bgColor }}>
                        <td style={{ padding: '18px 12px', border: '2px solid #d1d5db', color: '#111827', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '17px', fontWeight: '600' }}>
                          {equipo.Equipo || 'Sin Equipo'}
                        </td>
                        <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}>
                          {equipo.PuntosTotalesEquipo || 0}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div style={{ backgroundColor: '#f3f4f6', padding: '18px 20px', borderTop: '2px solid #d1d5db', display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#111827' }}>
                <span>Total de equipos: <strong style={{ fontSize: '17px' }}>{campeonatoEquipos.length}</strong></span>
                <span>Última actualización: <strong>{new Date().toLocaleTimeString()}</strong></span>
              </div>
            </div>
          ) : (
            !loading && (
              <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏆</div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>No hay datos del campeonato de equipos</p>
              </div>
            )
          )}

          {loading && campeonatoEquipos.length === 0 && (
            <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <p style={{ fontSize: '20px' }}>Cargando campeonato de equipos desde SQL Server...</p>
            </div>
          )}
        </div>
      </div>

      <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
          NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.
        </p>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
          Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}

// CALENDARIO VIEW
if (currentView === 'calendario') {

  const eventosPorMes = eventos.reduce((acc, evento) => {

    const fechaStr = String(evento.Fecha).substring(0, 10)
    const [year, month, day] = fechaStr.split('-')
    const fecha = new Date(Number(year), Number(month) - 1, Number(day))


    const mesNombre = fecha
      .toLocaleDateString('es-ES', { month: 'long' })
      .toUpperCase()

    const key = `${mesNombre} DE ${fecha.getFullYear()}`
    if (!acc[key]) acc[key] = []

    acc[key].push({ ...evento, fechaCorregida: fecha })
    return acc
  }, {})

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* HEADER */}
      <div style={{ backgroundColor: '#111827', padding: '28px 40px' }}>
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h1 style={{ color: 'white', fontSize: '34px', margin: 0 }}>
            📅 CALENDARIO NASCAR GAMING SERIES
          </h1>

          <button
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              padding: '12px 22px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Regresar al inicio
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          {Object.entries(eventosPorMes).map(([mes, lista]) => (
            <div key={mes} style={{ marginBottom: '60px' }}>
              <h2
                style={{
                  textAlign: 'center',
                  fontSize: '32px',
                  color: '#111827',
                  borderBottom: '4px solid #dc2626',
                  paddingBottom: '10px',
                  marginBottom: '30px'
                }}
              >
                {mes}
              </h2>

              {lista.map(evento => {

                const fecha = evento.fechaCorregida
                const dia = fecha.getDate()

                const mesCorto = fecha
                  .toLocaleDateString('es-ES', { month: 'short' })
                  .toUpperCase()
                  .replace('.', '')

                const hora = evento.Hora
                  ? evento.Hora.split('T')[1].substring(0, 5)
                  : '--:--'

                const ganadorEvento = ganadores[evento.IdEvento]

                return (
                  <div
                    key={evento.IdEvento}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      padding: '30px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      marginBottom: '25px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>

                      {/* FECHA Y HORA */}
                      <div style={{ minWidth: '120px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b7280' }}>
                          {mesCorto}
                        </div>

                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc2626' }}>
                          {dia}
                        </div>

                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                          {hora}
                        </div>
                      </div>

                      {/* INFO EVENTO */}
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: '26px',
                            margin: 0,
                            fontWeight: 'bold',
                            color: '#000000'
                          }}
                        >
                          {evento.NombreEvento}
                        </h3>

                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>
                          {evento.Estadio}
                        </div>

                        <div style={{ fontSize: '15px', color: '#555' }}>
                          {evento.Ciudad}, {evento.Estado} · {evento.NumeroVueltas} vueltas / {evento.DistanciaMillas} millas
                        </div>

                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                          Zona horaria: {evento.ZonaHoraria}
                        </div>

                        {ganadorEvento && (
                          <div style={{ marginTop: '10px', fontSize: '14px', color: '#111827' }}>
                            🟡 <strong>Pole:</strong>{' '}
                            {ganadorEvento.PilotoPole || ganadorEvento.pole_piloto || ganadorEvento.pole || ''}
                            <br />
                            🏁 <strong>Ganador:</strong>{' '}
                            {ganadorEvento.PilotoGanador || ganadorEvento.carrera_piloto || ganadorEvento.carrera || ''}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '26px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedEventoId(evento.IdEvento)
                          setCurrentView('resultados')
                        }}
                        style={{
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          padding: '12px 26px',
                          borderRadius: '8px',
                          fontSize: '15px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        📊 Ver Resultados Completos
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          ))}

        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
          NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC.
          Todas las demás marcas comerciales son propiedad de sus respectivos dueños.
        </p>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
          Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.
        </p>
      </footer>

    </div>
  )
}

// REGLAMENTO VIEW
  if (currentView === 'reglamento') {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#1a1a1a', color: 'white', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, width: '100%', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ padding: '20px 40px', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', position: 'sticky', top: 0, zIndex: 100 }}>
            <h1 style={{ fontSize: '32px', margin: 0, color: '#ffffffff' }}>📋 REGLAMENTO 2026 - NASCAR GAMING SERIES</h1>
            <button 
              onClick={() => setCurrentView('home')}
              style={{
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ← Regresar al inicio
            </button>
          </div>

          <div style={{ padding: '40px' }}>
            {/* GRUPO */}
            <div style={{ marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '2px solid #2563eb' }}>
              <h3 style={{ color: '#2563eb', fontSize: '24px', marginBottom: '15px', borderBottom: '3px solid #2563eb', paddingBottom: '10px' }}>
                👥 GRUPO
              </h3>
              <div style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '12px' }}><strong>1.</strong> No se permiten publicaciones o comentarios racistas hacia otros miembros.</p>
                <p style={{ marginBottom: '12px' }}><strong>2.</strong> Cualquier publicación o comentario de insultos, spam o peleas, será eliminado y se le limitará a una la cantidad de publicaciones y comentarios que puede hacer cada 24 horas.</p>
                <p style={{ marginBottom: '0' }}><strong>3.</strong> La publicación de otras Ligas de nr2003 serán eliminadas y el miembro autor de la publicación, se le limitará a una la cantidad de publicaciones y comentarios que puede hacer cada 24 horas.</p>
              </div>
            </div>

            {/* DISCORD */}
            <div style={{ marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '2px solid #5865f2' }}>
              <h3 style={{ color: '#5865f2', fontSize: '24px', marginBottom: '15px', borderBottom: '3px solid #5865f2', paddingBottom: '10px' }}>
                💬 DISCORD
              </h3>
              <div style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '12px' }}><strong>1.</strong> El uso del Discord es obligatorio.</p>
                <p style={{ marginBottom: '12px' }}><strong>2.</strong> Durante prácticas y happy hour está permitido hablar libremente.</p>
                <p style={{ marginBottom: '12px' }}><strong>3.</strong> Está prohibido hablar durante la sesión de clasificación. No acatar esta regla te hará iniciar la carrera desde el carril de Pits.</p>
                <p style={{ marginBottom: '12px' }}><strong>4.</strong> Durante la carrera y bajo bandera verde está prohibido hablar a menos que sea para avisar una entrada al carril de pits, rotura de motor, un accidente o una queja.</p>
                <p style={{ marginBottom: '12px' }}><strong>5.</strong> Durante el transcurso de la carrera, solo se permitirá hablar bajo el estado de bandera amarilla (Se recomienda NO hablar al salir del carril de pits, para poder escuchar a los spotters).</p>
                <p style={{ marginBottom: '12px' }}><strong>6.</strong> Está prohibido insultar, denigrar, gritar u ofender a otro piloto ya sea por burla ofensiva o despiste personal a causa de un accidente.</p>
                <p style={{ marginBottom: '0' }}><strong>7.</strong> Al finalizar la carrera, habrá media hora para revisar accidentes pendientes o sin reclamar.</p>
              </div>
            </div>

            {/* SERVER */}
            <div style={{ marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '2px solid #16a34a' }}>
              <h3 style={{ color: '#16a34a', fontSize: '24px', marginBottom: '15px', borderBottom: '3px solid #16a34a', paddingBottom: '10px' }}>
                🖥️ SERVER
              </h3>
              <div style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '12px' }}><strong>1.</strong> El chat del servidor solo será utilizado para quienes no cuentan con un micrófono.</p>
                <p style={{ marginBottom: '12px' }}><strong>2.</strong> La sesión de prácticas tendrá una duración de 25 minutos.</p>
                <p style={{ marginBottom: '12px' }}><strong>3.</strong> Si alguien es visto interfiriendo o saboteando las prácticas, será penalizado con una bandera negra, impidiéndole salir a pista hasta la siguiente sesión.</p>
                <p style={{ marginBottom: '12px' }}><strong>4.</strong> Si un piloto cuenta con más de 400 de Ping o un cual menor a 49, se le dará aviso para ir al fondo del grupo. No acatar este aviso se sanciona con una bandera negra.</p>
                <p style={{ marginBottom: '0' }}><strong>5.</strong> Se recomienda usar la sesión de Happy Hour para practicar la entrada al carril de pits y practicar la parada en su caja de pits.</p>
              </div>
            </div>

            {/* MECÁNICAS */}
            <div style={{ marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '2px solid #dc2626' }}>
              <h3 style={{ color: '#dc2626', fontSize: '24px', marginBottom: '15px', borderBottom: '3px solid #dc2626', paddingBottom: '10px' }}>
                🔧 MECÁNICAS
              </h3>
              <div style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.8' }}>
                <p style={{ backgroundColor: '#7f1d1d', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '15px' }}>
                  ⚠️ ATENCIÓN: Al no cumplir cualquiera de las siguientes reglas, un administrador te colocará una bandera negra, la cual debes cumplir en estado de carrera bajo bandera verde. También se dará una penalización de -3 vueltas en el export en caso de que el incidente sea revisado a penas al finalizar la carrera o no te hagas penalizar de la forma en la que te lo solicite un administrador en el momento. Además, cualquier penalización se puede aplicar después de los resultados oficiales.
                </p>
                <p style={{ marginBottom: '12px' }}><strong>1.</strong> Contaremos con <strong>un</strong> reinicio al iniciar la carrera, solo si ocurre un accidente antes de que el líder termine la vuelta 5.</p>
                <p style={{ marginBottom: '12px' }}><strong>2.</strong> No contaremos con Overtime.</p>
                <p style={{ marginBottom: '12px' }}><strong>3.</strong> En óvalos se hará uso de banderas amarillas automáticas del juego, pero las banderas amarillas serán recortadas en la medida de lo posible por los administradores por medio de un comando específico.</p>
                <p style={{ marginBottom: '12px' }}><strong>4.</strong> En circuitos <strong>NO</strong> se hará uso de las banderas amarillas automáticas del juego, pero los administradoras las activarán de forma manual por medio de un comando específico, si hay un accidente que involucre 3 autos o más en pista.</p>
                <p style={{ marginBottom: '12px' }}><strong>5.</strong> Al salir una bandera amarilla, las posiciones se congelan automáticamente en caso de terminar etapa o carrera.</p>
                <p style={{ marginBottom: '12px' }}><strong>6.</strong> Usaremos 2 etapas <strong>(bajo bandera verde)</strong> cuya vuelta está especificada en el calendario en todas las pistas.</p>
                <p style={{ marginBottom: '12px' }}><strong>6.1.</strong> Ahora todos los Stages acabarán bajo bandera verde tomando las siguientes medidas:</p>
                <p style={{ paddingLeft: '20px', marginBottom: '12px' }}><strong>6.1.1.</strong> Si a falta de 5 o menos vueltas para acabar una etapa sale una bandera amarilla, y esta impide que la etapa termine bajo bandera verde, la vuelta final del Stage será extendida hasta el reinicio dando la vuelta de reinicio como la última vuelta del Stage.</p>
                <p style={{ paddingLeft: '20px', marginBottom: '12px' }}><strong>6.1.2.</strong> Si sale una bandera amarilla en la última vuelta de una etapa y fue por generar un accidente innecesario serás penalizado.</p>
                <p style={{ paddingLeft: '20px', marginBottom: '12px' }}><strong>6.1.3.</strong> Los primeros 10 serán los ganadores de las etapas. 1=5pts | 2=4pts | 3=3pts | 4=3pts | 5=2pts | 6=2pts | 7=2pts | 8=1pts | 9=1pts | 10=0.5pts.</p>
                <p style={{ paddingLeft: '20px', marginBottom: '12px' }}><strong>6.1.4.</strong> En la carrera final de temporada, se hará uso de 4 en suma de puntos de etapa.</p>
                <p style={{ marginBottom: '12px' }}><strong>7.</strong> Se utilizará la suma de puntos similar al sistema actual de Nascar.</p>
                <p style={{ marginBottom: '12px' }}><strong>8.</strong> De forma obligatoria todos los pilotos deben dar un aviso para entrar a los pits en la misma vuelta, y debe dar el aviso mínimo antes finalizar el recorrido de la recta posterior en óvalos o antes de que falten 2 curvas para la entrada a pits en circuitos.</p>
                <p style={{ marginBottom: '12px' }}><strong>9.</strong> Ahora es obligatorio dar aviso de que vas al carril de pits por medio del chat, así tengas micrófono.</p>
                <p style={{ marginBottom: '12px' }}><strong>10.</strong> Si sale una bandera amarilla faltando 5 vueltas para el final (3 en circuitos) se congelarán las posiciones de acuerdo cuando salió la amarilla.</p>
                <p style={{ marginBottom: '12px' }}><strong>11.</strong> Está prohibido bloquear de forma reiterado en pista hasta que falten 2 vueltas para el final. Sin embargo, aun faltando 2 vueltas para el final, está prohibido realizar bloqueos peligrosos y/o que puedan provocar un accidente.</p>
                <p style={{ marginBottom: '12px' }}><strong>12.</strong> En caso de que un piloto haga bloqueos bruscos de forma reiterada, un administrador te colocará una bandera negra, la cual debes cumplir en estado de carrera bajo bandera verde.</p>
                <p style={{ marginBottom: '12px' }}><strong>13.</strong> Está prohibido cambiar de carril antes de cruzar la línea de meta.</p>
                <p style={{ marginBottom: '12px' }}><strong>14.</strong> Ni el líder, ni ningún otro piloto tiene permitido poner en marcha o movimiento su auto si el Pace car aún no ha iniciado su marcha.</p>
                <p style={{ marginBottom: '12px' }}><strong>14.1.</strong> Ningún piloto tiene permitido poner en marcha o movimiento su auto si el piloto de adelante aún no ha iniciado la marcha del suyo.</p>
                <p style={{ marginBottom: '12px' }}><strong>15.</strong> Está totalmente prohibido hacer un adelantamiento cruzando la doble línea amarilla en Daytona, Atlanta y Talladega.</p>
                <p style={{ marginBottom: '12px' }}><strong>16.</strong> Si empujas a otro piloto en la entrada al carril de pits, causando que este supere el límite de velocidad y sea penalizado por el juego bajo el estado de bandera amarilla, debes hacerte penalizar con un "eoll", e ir al fondo del grupo.</p>
                <p style={{ marginBottom: '12px' }}><strong>17.</strong> Si empujas a otro piloto en la entrada al carril de pits, causando que este supere el límite de velocidad y sea penalizado por el juego bajo el estado de bandera verde, debes cumplir una bandera negra haciendo un paso por el carril de pits (pass through).</p>
                <p style={{ marginBottom: '12px' }}><strong>18.</strong> La entrada al carril de pits en estado de carrera bajo bandera amarilla debe se hacer en 1 sola fila india.</p>
                <p style={{ marginBottom: '0' }}><strong>19.</strong> Al transitar por el carril de pits, es obligatorio ir por el carril derecho y sólo puedes empezar a bajar si estás a un aproximado de 4 a 5 cajas de pits de distancia de tu propia caja.</p>
              </div>
            </div>

            {/* BANDERAS NEGRAS */}
            <div style={{ marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '2px solid #000', boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px', borderBottom: '3px solid #fff', paddingBottom: '10px' }}>
                🏴 BANDERAS NEGRAS
              </h3>
              <div style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '12px' }}><strong>1.</strong> Para pedir que un administrador le quite una bandera negra, debe escribir en el texto del juego "<strong>#*tu numero*bl@ck flag</strong>".</p>
                <p style={{ marginBottom: '12px' }}><strong>2.</strong> Puedes solicitar que te quiten una bandera negra si otro piloto se queda a la hora un reinicio de carrera.</p>
                <p style={{ marginBottom: '12px' }}><strong>3.</strong> Puedes solicitar que te quiten una bandera negra si después de un accidente tu auto cruza la zona de penalización.</p>
                <p style={{ marginBottom: '12px' }}><strong>4.</strong> Si has sido penalizado con "eoll" y quieres volver a ingresar al carril de pits, debes esperar a ser rebasado. De no cumplir esta regla, no se removerá la bandera negra.</p>
                <p style={{ marginBottom: '12px' }}><strong>5.</strong> Las banderas negras removidas por los administradores serán revisadas al final de la carrera.</p>
                <p style={{ marginBottom: '0' }}><strong>6.</strong> Esconder un falso pedido de remoción de bandera negra o "BF" u ocultar el motivo real del motivo de la bandera negra para sacar una ventaja, se castiga con una penalización de -3 vueltas en el export y no podrá volver a solicitar una remoción de bandera negra sea cual sea el motivo de esta a no ser que esta sea generada intencionalmente por otro piloto para afectar al piloto con la sanción, hasta el final de temporada.</p>
              </div>
            </div>

            {/* ACCIDENTES */}
            <div style={{ marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '2px solid #f59e0b' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '24px', marginBottom: '15px', borderBottom: '3px solid #f59e0b', paddingBottom: '10px' }}>
                💥 ACCIDENTES
              </h3>
              <div style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '12px' }}><strong>1.</strong> Si estás seguro de haber causado un accidente, debes reclamarlo como tuyo enviando al chat la letra A y tu número. EJ: A# (se recomienda enviarlo 2 veces seguidas).</p>
                <p style={{ marginBottom: '12px' }}><strong>2.</strong> Si causas un accidente bajo bandera amarilla, se suma tu cuenta de accidentes causados para ser llamado a parquear tu auto y debes reclamarlo enviando al chat la letra A y tu número. EJ: A#.</p>
                <p style={{ marginBottom: '12px' }}><strong>3.</strong> Si bajo bandera amarilla, perdiste el control de tu auto, pero no afectaste a ningún otro piloto ni cancelaste un reinicio de carrera, el accidente NO se suma a tu cuenta de accidentes para ser llamado a parquear tu auto, pero puede que afecte de forma negativa tu licencia.</p>
                <p style={{ marginBottom: '12px' }}><strong>4.</strong> Si bajo bandera verde, perdiste el control de tu auto, pero no afectaste a ningún otro piloto, ni causaste una bandera amarilla, el accidente NO se suma a tu cuenta de accidentes para ser llamado a parquear tu auto, pero puede que afecte de forma negativa tu licencia.</p>
                <p style={{ marginBottom: '12px' }}><strong>5.</strong> Si causas la pérdida del control del auto a otro piloto y no se genera la bandera amarilla, debes reclamar el accidente como tuyo con la letra A y tu número en el chat y debes hacer un paso por el carril de pits en estado de carrera bajo bandera verde.</p>
                <p style={{ marginBottom: '12px' }}><strong>6.</strong> Si causaste un accidente que genere una bandera amarilla, debes entrar al carril de pits, y exceder el límite de velocidad de +3 MPH. EJ: Si el límite son 45 MPH, debes pasar por el carril de pits a 48 MPH.</p>
                <p style={{ marginBottom: '12px' }}><strong>7.</strong> Si no estás seguro de si el accidente fue culpa tuya tienes 2 opciones. Entrar al carril de pits y hacerte penalizar, o no entrar. PERO, de ser hallado culpable del accidente y no haber entrado al carril de pits a hacerse penalizar, serás penalizado con -3 vueltas en el export.</p>
                <p style={{ marginBottom: '12px' }}><strong>8.</strong> Si ninguno de los involucrados sabe de quién fue el accidente, se recomienda que los involucrados se hagan penalizar en pits, y al final de carrera, se hará una revisión de los accidentes sin reclamar.</p>
                <p style={{ marginBottom: '12px' }}><strong>9.</strong> Si causas 1(C), 2(B) o 3(A) accidentes (dependiendo de tu licencia A, B o C), serás parqueado.</p>
                <p style={{ marginBottom: '12px', backgroundColor: '#7f1d1d', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}><strong>10. IMPORTANTE ➜</strong> Cualquier choque, o maniobra intencional, derivado de un accidente previo, será penalizado siendo expulsado de la carrera y suspendido de todas las categorías por una fecha, quedando bajo probatoria el resto de la temporada.</p>
                <p style={{ marginBottom: '12px' }}><strong>11.</strong> Si un conductor es visto y reportado teniendo una conducción peligrosa en la que afecte de forma reiterada a varios pilotos aun cuando este conductor no logre causar un accidente, será llamado a estacionar su auto y se le dará la licencia C.</p>
                <p style={{ marginBottom: '12px' }}><strong>12.</strong> Dar informes falsos sobre conducción peligrosa, da sanción de -3 vueltas en la exportación y suspensión de 1 fecha.</p>
                <p style={{ marginBottom: '12px' }}><strong>12.1.</strong> Ten en cuenta que, si un piloto te empuja, accidenta o te arruina la carrera, serán los administradores quienes apliquen una penalización. No te arruines a ti mismo cobrando con otro accidente.</p>
                <p style={{ marginBottom: '12px' }}><strong>13.</strong> Si alguien te ha causado problemas que impliquen daños en tu auto, debes reclamarlo inmediatamente a un Administrador.</p>
                <p style={{ marginBottom: '12px' }}><strong>14.</strong> Si te encuentras a una distancia considerable de un accidente, en la que incluso usando el ABS puedas frenar con tiempo de sobra, y en cambio decides intentar esquivar el accidente de una forma peligrosa o sin siquiera mermar tu velocidad, serás penalizado con -3 vueltas en el export final. (así esquives o no el accidente).</p>
                <p style={{ marginBottom: '0' }}><strong>15.</strong> Si un auto queda estacionado, estancado, enganchado o atrapado después de un accidente, debe retirarlo de inmediato ya sea llamando a la grúa o retirándose.</p>
              </div>
            </div>

            {/* WAVE AROUND & LUCKY DOG */}
            <div style={{ marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '2px solid #a855f7' }}>
              <h3 style={{ color: '#a855f7', fontSize: '24px', marginBottom: '15px', borderBottom: '3px solid #a855f7', paddingBottom: '10px' }}>
                🔄 WAVE AROUND & LUCKY DOG
              </h3>
              <div style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '12px' }}><strong>1.</strong> Los que deseen tomar el Wave around, deben quedarse en pista y esperar que todos los líderes entren al carril de pits. Si un líder de competencia decide no ingresar al carril de pits, debes ingresar al carril de pits para partir al fondo del grupo.</p>
                <p style={{ marginBottom: '12px' }}><strong>2.</strong> Para tomar el Lucky Dog, debes estar primero de los pilotos con una vuelta perdida, debes pasar al carril de pits junto con los líderes, exceder el límite de velocidad en uno de los sectores del carril de pits e ir al fondo de la parrilla antes de que la carrera se reinicie.</p>
                <p style={{ marginBottom: '12px' }}><strong>2.1.</strong> No se otorgará el Lucky Dog a falta de 2 vuelta o menos para el final.</p>
                <p style={{ marginBottom: '12px' }}><strong>3.</strong> Ningún auto con una vuelta perdida debe quedar entre los líderes al momento de un reinicio. No acatar esta regla se penaliza con una bandera negra la cual se debe cumplir bajo bandera verde.</p>
                <p style={{ marginBottom: '12px' }}><strong>4.</strong> Todos los autos que estén -1 Lap (vuelta) o más, están obligados a partir últimos, se les va hacer un eoll.</p>
                <p style={{ marginBottom: '0' }}><strong>5.</strong> Si en carrera hay de 3 autos o menos con vuelta perdida a la hora de un reinicio, estos deberán entrar en la primera vuelta al carril de pits junto con los líderes, pero deben exceder el límite de velocidad en no más de +3 MPH por encima de lo permitido. (ejemplo: límite 55 MPH, ir a 57 MPH)</p>
              </div>
            </div>

            {/* LICENCIAS */}
            <div style={{ marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '2px solid #06b6d4' }}>
              <h3 style={{ color: '#06b6d4', fontSize: '24px', marginBottom: '15px', borderBottom: '3px solid #06b6d4', paddingBottom: '10px' }}>
                🎓 LICENCIAS
              </h3>
              <div style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '12px' }}><strong>→ Licencia A</strong></p>
                <p style={{ marginBottom: '12px' }}><strong>→ Licencia B</strong></p>
                <p style={{ marginBottom: '15px' }}><strong>→ Licencia C</strong></p>
                <p style={{ marginBottom: '15px' }}>Todas las licencias son bienvenidas a participar en cualquier categoría de la liga, y las licencias se otorgan en base a varios factores.</p>
                <p style={{ marginBottom: '8px' }}><strong>→ Conducción</strong></p>
                <p style={{ marginBottom: '8px' }}><strong>→ Control del auto en pista</strong></p>
                <p style={{ marginBottom: '8px' }}><strong>→ Constancia</strong></p>
                <p style={{ marginBottom: '15px' }}><strong>→ Toma de decisiones en diversas circunstancias.</strong> EJ: ceder espacios, ceder el paso, aceptación de errores, conducta, etc...</p>
                <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', marginTop: '20px', marginBottom: '15px' }}>
                <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '10px' }}>¿Cómo subir de licencia?</p>
                <p style={{ marginBottom: '0' }}>Si eres licencia C o B, en el calendario de la liga hay carreras llamadas (Fechas de licencia) marcadas en color verde. Al finalizar estas carreras, los administradores podrán decidir si subirte de licencia dependiendo de si cumpliste con los valores mencionados en el segundo punto.</p>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', marginBottom: '0' }}>
                <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '10px' }}>¿Cómo subir de licencia?</p>
                <p style={{ marginBottom: '0' }}>Si eres nuevo, iniciando con licencia C, y dependiendo de si cumples con los valores mencionados en el anterior punto, irás subiendo de licencia.</p>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', marginTop: '15px' }}>
                <p style={{ marginBottom: '0' }}> Si NO eres nuevo, para esta nueva temporada se te asignará una licencia basada en tu actuación en la temporada anterior.</p>
                </div>
                <div style={{ backgroundColor: '#7f1d1d', padding: '15px', borderRadius: '8px', marginTop: '15px', border: '2px solid #dc2626' }}>
                <p style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '10px' }}>Límites por licencia</p>
                <p style={{ marginBottom: '8px' }}>Cada licencia tiene un LÍMITE máximo de accidentes. Si llegas al límite de accidentes causados, serás llamado a estacionar tu auto y volverás a tu licencia anterior.</p>
                <p style={{ marginBottom: '8px' }}><strong>→ Licencia C:</strong> Se te perdonará 1 accidente.</p>
                <p style={{ marginBottom: '8px' }}><strong>→ Licencia B:</strong> Se te perdonaran 2 accidentes.</p>
                <p style={{ marginBottom: '0' }}><strong>→ Licencia A:</strong> Se te perdonarán 3 accidentes.</p>
                </div>
                </div>
              </div>

              {/* CHASE FOR THE GAMING */}
                <div style={{ marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '2px solid #fbbf24' }}>
                <h3 style={{ color: '#fbbf24', fontSize: '24px', marginBottom: '15px', borderBottom: '3px solid #fbbf24', paddingBottom: '10px' }}>
                🏆 CHASE FOR THE GAMING
                </h3>
                <div style={{ color: '#e5e7eb', fontSize: '16px', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '12px' }}><strong>1.</strong> Los 10 primeros pilotos en la tabla por puntos avanzan.</p>
                <p style={{ marginBottom: '12px' }}><strong>2.</strong> El puesto 11 y 12 se definen por victoria igual vía puntos quien esta mejor acomodado.</p>
                <p style={{ marginBottom: '12px' }}><strong>3.</strong> Cada clasificado recibe 5.000 puntos base.</p>
                <p style={{ marginBottom: '12px' }}><strong>4.</strong> +12 puntos adicionales por cada victoria que logre en las 26 primeras carreras.</p>
                <p style={{ marginBottom: '12px' }}><strong>5.</strong> +1 punto adicional por ganar una etapa en las 26 primeras carreras.</p>
                <p style={{ marginBottom: '12px' }}><strong>6.</strong> Solo esos 12 pilotos podrán disputar el campeonato.</p>
                <p style={{ marginBottom: '12px' }}><strong>7.</strong> Se va continuar el sistema clásico de puntuación de carrera.</p>
                <p style={{ marginBottom: '0' }}><strong>8.</strong> El piloto con más puntos tras la final en Homestead-Miami Speedway será el campeón.</p>
              </div>
            </div>
          </div>
        </div>
        <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
              NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.
              </p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
              Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.
              </p>
        </footer>
     </div>
    )
}

// ESTADISTICAS VIEW
if (currentView === 'estadisticas') {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', padding: '0', margin: '0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: '20px 40px', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
          <h1 style={{ fontSize: '32px', margin: 0 }}>📊 Clasificación NASCAR Gaming Series</h1>
          <button 
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ← Regresar al inicio
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '15px', margin: '0 40px 20px 40px', borderRadius: '8px' }}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        <div style={{ padding: '0 40px' }}>
          {estadisticas.length > 0 ? (
            <div style={{ backgroundColor: 'white', overflow: 'auto', margin: '0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <table style={{ width: '100%', minWidth: '1800px', borderCollapse: 'collapse', border: '2px solid #d1d5db' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '4%' }}>POS</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '4%' }}>NO</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '13%' }}>DRIVER</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>MFR</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '8%' }}>POINTS (STAGE)</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>BEHIND</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '6%' }}>STARTS</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '5%' }}>WINS</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '6%' }}>TOP 5s</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '6%' }}>TOP 10s</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '5%' }}>DNFs</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>LAPS LED</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>PLAYOFF POINTS</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>AVG START</th>
                  <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>AVG FINISH</th>
                </tr>
              </thead>
              <tbody>
                {estadisticas.map((stat, index) => {
                  let bgColor = 'white'
                  if (index === 0) bgColor = '#fef3c7'
                  else if (index === 1) bgColor = '#f3f4f6'
                  else if (index === 2) bgColor = '#fef2f2'

                  return (
                    <tr key={index} style={{ backgroundColor: bgColor }}>
                      <td style={{ padding: '18px 12px', border: '2px solid #d1d5db', color: '#111827', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                        {stat.POS}
                      </td>
                      <td style={{ padding: '18px 12px', border: '2px solid #d1d5db', color: '#111827', textAlign: 'center' }}>
                        <img 
                          src={`/numeros/${stat.NO}.png`}
                          alt={`#${stat.NO}`}
                          style={{ height: '40px', display: 'inline-block' }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextElementSibling.style.display = 'inline-block'
                          }}
                        />
                        <span style={{ backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '6px 14px', borderRadius: '25px', fontSize: '15px', display: 'none' }}>
                          {stat.NO}
                        </span>
                      </td>
                      <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '15px', fontWeight: '500' }}>
                        {stat.DRIVER}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px' }}>
                        {stat.MFR}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {stat.PointsStage || 0}
                      </td>
                      <td style={{ padding: '18px 12px', color: stat.BEHIND === 'LIDER' ? '#16a34a' : '#dc2626', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {stat.BEHIND}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>
                        {stat.STARTS}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#16a34a', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {stat.WINS}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>
                        {stat.Top5s}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>
                        {stat.Top10s}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#dc2626', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>
                        {stat.DNFs}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center' }}>
                        {stat.LapsLed}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {stat.PlayoffPoints}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#9333ea', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {stat.AvgStart || '0.00'}
                      </td>
                      <td style={{ padding: '18px 12px', color: '#9333ea', border: '2px solid #d1d5db', fontSize: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {stat.AvgFinish || '0.00'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
              <div style={{ backgroundColor: '#f3f4f6', padding: '18px 20px', borderTop: '2px solid #d1d5db', display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#111827' }}>
                <span>Total de pilotos: <strong style={{ fontSize: '17px' }}>{estadisticas.length}</strong></span>
                <span>Última actualización: <strong>{new Date().toLocaleTimeString()}</strong></span>
              </div>
            </div>
          ) : (
            !loading && (
              <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📊</div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>No hay estadísticas en la base de datos</p>
              </div>
            )
          )}

          {loading && estadisticas.length === 0 && (
            <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <p style={{ fontSize: '20px' }}>Cargando estadísticas desde SQL Server...</p>
            </div>
          )}
        </div>

        <div style={{ padding: '20px 40px' }}>
        </div>
      </div>

      <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
          NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.
        </p>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
          Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}

// DESCARGAS VIEW
if (currentView === 'descargas') {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#1a1a1a', color: 'white', padding: '0', margin: '0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '40px' }}>
        {/* Header */}
        <div style={{ padding: '20px 40px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', margin: 0 }}>📥 DESCARGAS - NASCAR GAMING SERIES</h1>
          <button 
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Regresar al inicio
          </button>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
          
          {/* PANEL 1: NR2003 INSTALADOR ORIGINAL */}
          <div style={{ 
            backgroundColor: '#d1d5db', 
            borderRadius: '20px', 
            padding: '30px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              NR2003 INSTALADOR ORIGINAL
            </h2>

            {/* Imagen del juego */}
            <div style={{ 
              backgroundColor: '#1a1a1a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>
                  🏁 Sponsored by NHSL 2026
                </div>
                <div style={{ 
                  fontSize: '48px',
                  marginBottom: '10px'
                }}>
                  🏎️
                </div>
                <div style={{ 
                  color: '#dc2626',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  NASCAR Racing
                </div>
                <div style={{ 
                  color: '#999',
                  fontSize: '14px'
                }}>
                  2003 SEASON
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div style={{ color: '#1a1a1a', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>JUEGO BASE</h3>
              
              <div style={{ 
                backgroundColor: '#d1d5db',
                color: 'black',
                padding: '8px 15px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 'bold',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                ARCHIVOS DE INSTALACIÓN
              </div>

              <a 
                href="https://drive.google.com/drive/folders/1yCu_SivS303kDp5v4BYZAMT4yG58JqW6"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button style={{
                  width: '100%',
                  backgroundColor: '#ec4848ff',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}>
                  DESCARGAR
                </button>
              </a>

              <div style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '10px' }}>
                <p style={{ margin: '5px 0' }}>• INSTALADOR ORIGINAL</p>
                <p style={{ margin: '5px 0' }}>• PARCHE</p>
                <p style={{ margin: '5px 0' }}>• CRACK</p>
                <p style={{ margin: '5px 0' }}>• SONIDOS DE MOTOR GEN6</p>
              </div>

              <div style={{ 
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '15px'
              }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>TUTORIAL</p>
                <a 
                  href="https://www.youtube.com/watch?v=8ay2cC0EA8c"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <button style={{
                    width: '100%',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    📺 YOUTUBE
                  </button>
                </a>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '10px', lineHeight: '1.4' }}>
                  <p style={{ margin: '3px 0' }}>• INSTALACIÓN DEL JUEGO</p>
                  <p style={{ margin: '3px 0' }}>• CONFIGURACIÓN DE GRÁFICOS</p>
                  <p style={{ margin: '3px 0' }}>• TODAS LAS CONFIGURACIONES DEL JUEGO</p>
                  <p style={{ margin: '3px 0' }}>• CONFIGURACIÓN ONLINE</p>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 2: NR2003 COMPLEMENTOS */}
          <div style={{ 
            backgroundColor: '#d1d5db', 
            borderRadius: '20px', 
            padding: '30px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              NR2003 COMPLEMENTOS
            </h2>

            {/* Imagen */}
            <div style={{ 
              backgroundColor: '#1a1a1a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>
                  🏁 Sponsored by NHSL 2026
                </div>
                <div style={{ 
                  fontSize: '48px',
                  marginBottom: '10px'
                }}>
                  📁
                </div>
                <div style={{ 
                  color: '#dc2626',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  COMPLEMENTOS
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div style={{ color: '#1a1a1a' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>COMPLEMENTOS</h3>
              
              {/* ARCHIVOS / FILES */}
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
                  ARCHIVOS / FILES (NHSL.exe, Core, Shared)
                </p>
                <a 
                  href="https://drive.google.com/drive/folders/1-xHiFtgS2nWNbGvtslwSdvz3vlxP2Hs6"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <button style={{
                    width: '100%',
                    backgroundColor: '#ec4848ff',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    DESCARGAR
                  </button>
                </a>
              </div>

              {/* MODS */}
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>MODS</p>
                <a 
                  href="https://stunodracing.net/index.php?resources/fcrd-ncs22-v1.12791/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <button style={{
                    width: '100%',
                    backgroundColor: '#ec4848ff',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    DESCARGAR
                  </button>
                </a>
              </div>


              {/* TEMPLATES */}
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>TEMPLATES</p>
                <button style={{
                  width: '100%',
                  backgroundColor: '#ec4848ff',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  DESCARGAR
                </button>
              </div>
            </div>
          </div>

          {/* PANEL 3: PROGRAMAS */}
          <div style={{ 
            backgroundColor: '#d1d5db', 
            borderRadius: '20px', 
            padding: '30px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              PROGRAMAS
            </h2>

            {/* Imagen */}
            <div style={{ 
              backgroundColor: '#1a1a1a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>
                  🏁 Sponsored by NHSL 2026
                </div>
                <div style={{ 
                  fontSize: '48px',
                  marginBottom: '10px'
                }}>
                  💻
                </div>
                <div style={{ 
                  color: '#dc2626',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  COMPLEMENTOS
                </div>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <a 
                href="https://discord.com/download"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button style={{
                  width: '100%',
                  backgroundColor: '#4b5563',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  DESCARGAR - DISCORD
                </button>
              </a>

              <a 
                href="https://www.radmin-vpn.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button style={{
                  width: '100%',
                  backgroundColor: '#4b5563',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  DESCARGAR - RADMIN
                </button>
              </a>

              <div style={{ 
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                RED ID: BryanM13
              </div>

              <div style={{ 
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                CLAVE: BRYANGAMING13
              </div>

                            <div style={{ 
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                IP DEL SERVER - NR2003: 26.29.38.62
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
          NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.
        </p>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
          Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}

// LICENCIAS VIEW
if (currentView === 'licencias') {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', padding: '0', margin: '0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: '20px 40px', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
          <h1 style={{ fontSize: '32px', margin: 0 }}>🎓 Licencias NASCAR Gaming Series</h1>
          <button 
            onClick={() => setCurrentView('details')}
            style={{
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Regresar a Pilotos
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '15px', margin: '0 40px 20px 40px', borderRadius: '8px' }}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        <div style={{ padding: '0 40px' }}>
          {licencias.length > 0 ? (
            <div style={{ backgroundColor: 'white', overflow: 'visible', margin: '0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #d1d5db', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '10%' }}>NÚMERO PILOTO</th>
                    <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '25%' }}>PILOTO</th>
                    <th style={{ padding: '18px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '15%' }}>LICENCIA ACTUAL</th>
                    <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '50%' }}>ESTADO LICENCIA</th>
                  </tr>
                </thead>
                <tbody>
                  {licencias.map((lic, index) => {
                    let bgColor = 'white'
                    let licenciaColor = '#111827'
                    
                    if (lic.LicenciaActual === 'A') {
                      licenciaColor = '#16a34a'
                    } else if (lic.LicenciaActual === 'B') {
                      licenciaColor = '#2563eb'
                    } else if (lic.LicenciaActual === 'C') {
                      licenciaColor = '#f59e0b'
                    } else if (lic.LicenciaActual === 'S') {
                      licenciaColor = '#dc2626'
                    }

                    return (
                      <tr key={index} style={{ backgroundColor: bgColor }}>
                        <td style={{ padding: '18px 12px', border: '2px solid #d1d5db', textAlign: 'center' }}>
                          <img 
                            src={`/numeros/${lic.NumeroPiloto}.png`}
                            alt={`#${lic.NumeroPiloto}`}
                            style={{ height: '40px', display: 'inline-block' }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextElementSibling.style.display = 'inline-block'
                            }}
                          />
                          <span style={{ backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '6px 14px', borderRadius: '25px', fontSize: '15px', display: 'none' }}>
                            {lic.NumeroPiloto}
                          </span>
                        </td>
                        <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '15px', fontWeight: '500' }}>
                          {lic.Piloto}
                        </td>
                        <td style={{ padding: '18px 12px', border: '2px solid #d1d5db', textAlign: 'center' }}>
                          <span style={{ 
                            backgroundColor: licenciaColor, 
                            color: 'white', 
                            fontWeight: 'bold', 
                            padding: '8px 20px', 
                            borderRadius: '8px', 
                            fontSize: '18px', 
                            display: 'inline-block' 
                          }}>
                            {lic.LicenciaActual}
                          </span>
                        </td>
                        <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px' }}>
                          {lic.EstadoLicencia}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div style={{ backgroundColor: '#f3f4f6', padding: '18px 20px', borderTop: '2px solid #d1d5db', display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#111827' }}>
                <span>Total de pilotos: <strong style={{ fontSize: '17px' }}>{licencias.length}</strong></span>
                <span>Última actualización: <strong>{new Date().toLocaleTimeString()}</strong></span>
              </div>
            </div>
          ) : (
            !loading && (
              <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎓</div>
                <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>No hay datos de licencias</p>
              </div>
            )
          )}

          {loading && licencias.length === 0 && (
            <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <p style={{ fontSize: '20px' }}>Cargando licencias desde SQL Server...</p>
            </div>
          )}
        </div>
      </div>

      <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
          NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.
        </p>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
          Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}

// PILOTOS VIEW
return (
  <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', padding: '0', margin: '0', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1 }}>
      <div style={{ padding: '20px 40px', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
        <h1 style={{ fontSize: '32px', margin: 0 }}>🏎️ Pilotos NASCAR Gaming Series - Lista De Entradas - Tiempo Completo</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setCurrentView('licencias')}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🎓 Licencias
          </button>
          <button 
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ← Regresar al inicio
          </button>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '15px', margin: '0 40px 20px 40px', borderRadius: '8px' }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      <div style={{ padding: '0 40px' }}>
        {pilotos.length > 0 ? (
          <div style={{ backgroundColor: 'white', overflow: 'visible', margin: '0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #d1d5db', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '7%' }}>Número</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '9%' }}>Nombre</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '11%' }}>Apellido</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '12%' }}>Fecha Nacimiento</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '15%' }}>Lugar Origen</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '11%' }}>Jefe Equipo</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '14%' }}>Equipo</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '13%' }}>Categoría</th>
                  <th style={{ padding: '18px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#111827', border: '2px solid #d1d5db', width: '8%' }}>Marca Vehículo</th>
                </tr>
              </thead>
              <tbody>
                {pilotos.map((piloto) => (
                  <tr key={piloto.IdPiloto} style={{ backgroundColor: 'white' }}>
                    <td style={{ padding: '18px 12px', border: '2px solid #d1d5db', color: '#111827', textAlign: 'center' }}>
                      <img 
                        src={`/numeros/${piloto.Numero}.png`}
                        alt={`#${piloto.Numero}`}
                        style={{ height: '40px', display: 'inline-block' }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextElementSibling.style.display = 'inline-block'
                        }}
                      />
                      <span style={{ backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '6px 14px', borderRadius: '25px', fontSize: '15px', display: 'none' }}>
                        {piloto.Numero}
                      </span>
                    </td>
                    <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '15px' }}>{piloto.Nombre}</td>
                    <td style={{ padding: '18px 12px', color: '#111827', border: '2px solid #d1d5db', fontSize: '15px' }}>{piloto.Apellido}</td>
                    <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px' }}>
                      {formatearFecha(piloto.FechaNacimiento)}
                    </td>
                    <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px' }}>{piloto.LugarOrigen || '-'}</td>
                    <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px' }}>{piloto.JefeEquipo || '-'}</td>
                    <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px' }}>{piloto.Equipo || '-'}</td>
                    <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px' }}>{piloto.Categoria || '-'}</td>
                    <td style={{ padding: '18px 12px', color: '#374151', border: '2px solid #d1d5db', fontSize: '15px' }}>{piloto.MarcaVehiculo || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ backgroundColor: '#f3f4f6', padding: '18px 20px', borderTop: '2px solid #d1d5db', display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#111827' }}>
              <span>Total de pilotos: <strong style={{ fontSize: '17px' }}>{pilotos.length}</strong></span>
              <span>Última actualización: <strong>{new Date().toLocaleTimeString()}</strong></span>
            </div>
          </div>
        ) : (
          !loading && (
            <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏎️</div>
              <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>No hay pilotos en la base de datos</p>
            </div>
          )
        )}

        {loading && pilotos.length === 0 && (
          <div style={{ backgroundColor: 'white', padding: '60px', margin: '0', borderRadius: '8px', textAlign:'center', color: '#6b7280' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
            <p style={{ fontSize: '20px' }}>Cargando pilotos desde SQL Server...</p>
          </div>
        )}
      </div>
    </div>

    <footer style={{ backgroundColor: '#000000', color: 'white', padding: '20px 40px', textAlign: 'center', marginTop: 'auto' }}>
      <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.6' }}>
        NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.
      </p>
      <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
        Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.
      </p>
    </footer>
  </div>
)

}

export default App