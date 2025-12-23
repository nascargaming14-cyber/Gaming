import { useState, useEffect } from 'react';

/* =======================
   HOME VIEW
======================= */
function HomeView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timezone, setTimezone] = useState('Mexico');
  const [nextRace, setNextRace] = useState(null);

  const timezones = {
    'Mexico': { offset: -6, display: 'México (GMT-6)' },
    'CostaRica': { offset: -6, display: 'Costa Rica (GMT-6)' },
    'Salvador': { offset: -6, display: 'El Salvador (GMT-6)' },
    'Colombia': { offset: -5, display: 'Colombia (GMT-5)' },
    'Argentina': { offset: -3, display: 'Argentina (GMT-3)' }
  };

  // Obtener la próxima carrera desde la API
  useEffect(() => {
    fetch('/api/calendario/proxima')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setNextRace(data);
        }
      })
      .catch(err => {
        console.error('Error al cargar próxima carrera:', err);
        setNextRace({
          nombreevento: 'Cook Out Clash at Daytona Beach',
          estadio: 'Daytona Beach and Road Course',
          ciudad: 'Daytona Beach',
          estado: 'FL',
          fecha: '2026-01-04',
          hora: '20:00:00',
          zonahoraria: 'MEX',
          numerovueltas: 40,
          distanciamillas: 100
        });
      });
  }, []);

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Actualizar countdown cada segundo
  useEffect(() => {
    if (!nextRace) return;

    const timer = setInterval(() => {
      const raceDateTime = new Date(`${nextRace.fecha}T${nextRace.hora}`);
      const now = new Date();
      const diff = raceDateTime - now;
      
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextRace]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatRaceDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!nextRace) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">Cargando información de la próxima carrera...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header con sponsor */}
      <div className="text-left mb-4">
        <h1 className="text-4xl font-bold mb-1">NASCAR GAMING SERIES</h1>
        <p className="text-gray-400 text-xs">Sponsored By Alpina</p>
      </div>

      {/* Reloj y Zona Horaria en línea */}
      <div className="mb-2">
        <div className="text-white text-lg font-bold mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-gray-400 text-xs mb-2">
          {formatDate(currentTime)}
        </div>
        <div className="text-xs text-gray-400 mb-1">Zona Horaria:</div>
        <select 
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-xs"
        >
          <option value="Mexico">{timezones.Mexico.display}</option>
          <option value="CostaRica">{timezones.CostaRica.display}</option>
          <option value="Salvador">{timezones.Salvador.display}</option>
          <option value="Colombia">{timezones.Colombia.display}</option>
          <option value="Argentina">{timezones.Argentina.display}</option>
        </select>
      </div>

      {/* Próxima carrera */}
      <div className="mb-4">
        <h2 className="text-white text-base font-bold mb-2">
          🏁 PRÓXIMA CARRERA
        </h2>
        
        {/* Countdown compacto */}
        <div className="mb-3">
          <div className="text-white text-sm mb-1">{countdown.days}</div>
          <div className="text-gray-500 text-xs mb-2">DÍAS</div>
          
          <div className="text-white text-sm mb-1">{countdown.hours.toString().padStart(2, '0')}</div>
          <div className="text-gray-500 text-xs mb-2">HORAS</div>
          
          <div className="text-white text-sm mb-1">{countdown.minutes.toString().padStart(2, '0')}</div>
          <div className="text-gray-500 text-xs mb-2">MINUTOS</div>
          
          <div className="text-white text-sm mb-1">{countdown.seconds.toString().padStart(2, '0')}</div>
          <div className="text-gray-500 text-xs">SEGUNDOS</div>
        </div>

        {/* Detalles de la carrera */}
        <div>
          <h3 className="text-white text-base font-bold mb-2">{nextRace.nombreevento}</h3>
          <div className="text-pink-400 text-xs mb-1">
            📍 {nextRace.estadio}
          </div>
          <div className="text-gray-400 text-xs mb-2">{nextRace.ciudad}, {nextRace.estado}</div>
          <div className="text-blue-400 text-xs mb-1">📅 {formatRaceDate(nextRace.fecha)}</div>
          <div className="text-gray-300 text-xs mb-1">🕐 {nextRace.hora.substring(0, 5)} {nextRace.zonahoraria}</div>
          <div className="text-gray-400 text-xs">🏁 {nextRace.numerovueltas} vueltas • {nextRace.distanciamillas} millas</div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-gray-500 text-xs leading-relaxed">
        <p className="mb-1">NASCAR® y sus marcas son marcas comerciales de la Asociación Nacional de Carreras de Autos de Serie, LLC. Todas las demás marcas comerciales son propiedad de sus respectivos dueños.</p>
        <p>Copyright © 2026 NASCAR Gaming Digital Media, LLC. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

/* =======================
   RESULTADOS VIEW
======================= */
function ResultadosView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/resultados')
      .then(res => res.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">RESULTADOS</h2>
      <div className="bg-gray-800 rounded-lg p-4">
        {data.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay resultados disponibles</p>
        ) : (
          data.map(r => (
            <div key={r.id} className="border-b border-gray-700 py-2 text-sm">
              {r.descripcion}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =======================
   PILOTOS VIEW
======================= */
function PilotosView() {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pilotos')
      .then(res => res.json())
      .then(data => {
        setPilotos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-gray-400 text-lg">Cargando pilotos...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          🏎 Pilotos NASCAR Gaming Series – Lista de Entradas – Tiempo Completo
        </h1>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded"
        >
          ← Regresar al inicio
        </button>
      </div>

      {/* CONTENEDOR BLANCO DOMINANTE */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">

        {/* SCROLL HORIZONTAL */}
        <div className="overflow-x-auto">

          <table className="min-w-full border-collapse text-sm text-gray-800">

            {/* CABECERA */}
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-bold">NÚMERO</th>
                <th className="px-4 py-3 text-left font-bold">NOMBRE</th>
                <th className="px-4 py-3 text-left font-bold">APELLIDO</th>
                <th className="px-4 py-3 text-left font-bold">FECHA NACIMIENTO</th>
                <th className="px-4 py-3 text-left font-bold">LUGAR ORIGEN</th>
                <th className="px-4 py-3 text-left font-bold">JEFE EQUIPO</th>
                <th className="px-4 py-3 text-left font-bold">EQUIPO</th>
                <th className="px-4 py-3 text-left font-bold">CATEGORÍA</th>
                <th className="px-4 py-3 text-left font-bold">MARCA VEHÍCULO</th>
              </tr>
            </thead>

            {/* CUERPO */}
            <tbody>
              {pilotos.map((p, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                      {p.numero}
                    </span>
                  </td>

                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3">{p.apellido}</td>

                  <td className="px-4 py-3">
                    {new Date(p.fechanacimiento).toLocaleDateString('es-ES')}
                  </td>

                  <td className="px-4 py-3">{p.lugarorigen}</td>
                  <td className="px-4 py-3">{p.jefeequipo}</td>
                  <td className="px-4 py-3">{p.equipo}</td>
                  <td className="px-4 py-3">{p.categoria}</td>

                  <td className="px-4 py-3 font-semibold">
                    {p.marcavehiculo}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 text-center text-xs text-gray-400">
        © 2026 NASCAR Gaming Series • Datos oficiales de pilotos
      </div>

    </div>
  );
}


/* ======================================================
   TABLA CAMPEONATO PILOTOS
====================================================== */
function CampeonatoPilotosTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campeonato/pilotos')
      .then(res => res.json())
      .then(rows => {
        setData(rows);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-gray-400 text-lg">
          Cargando clasificación...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-3 py-3">POS</th>
              <th className="px-3 py-3">NO</th>
              <th className="px-3 py-3 text-left">DRIVER</th>
              <th className="px-3 py-3">MFR</th>
              <th className="px-3 py-3">POINTS (STAGE)</th>
              <th className="px-3 py-3">BEHIND</th>
              <th className="px-3 py-3">STARTS</th>
              <th className="px-3 py-3">WINS</th>
              <th className="px-3 py-3">TOP 5s</th>
              <th className="px-3 py-3">TOP 10s</th>
              <th className="px-3 py-3">DNFs</th>
              <th className="px-3 py-3">LAPS LED</th>
              <th className="px-3 py-3">PLAYOFF POINTS</th>
              <th className="px-3 py-3">AVG START</th>
              <th className="px-3 py-3">AVG FINISH</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index === 0
                    ? 'bg-yellow-100 font-bold'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-3 py-3">{p.pos}</td>
                <td className="px-3 py-3">{p.no}</td>
                <td className="px-3 py-3 text-left">{p.driver}</td>
                <td className="px-3 py-3">{p.mfr}</td>
                <td className="px-3 py-3 font-semibold">
                  {p.totalpoints}
                </td>
                <td
                  className={`px-3 py-3 font-bold ${
                    p.behind === 'LIDER'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {p.behind}
                </td>
                <td className="px-3 py-3">{p.starts}</td>
                <td className="px-3 py-3 text-green-600 font-bold">
                  {p.wins}
                </td>
                <td className="px-3 py-3">{p.top5s}</td>
                <td className="px-3 py-3">{p.top10s}</td>
                <td className="px-3 py-3 text-red-600">
                  {p.dnfs}
                </td>
                <td className="px-3 py-3">{p.lapsled}</td>
                <td className="px-3 py-3 font-bold">
                  {p.playoffpoints}
                </td>
                <td className="px-3 py-3 text-purple-600">
                  {p.avgstart}
                </td>
                <td className="px-3 py-3 text-purple-600">
                  {p.avgfinish}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================================================
   TABLA CAMPEONATO FABRICANTES
====================================================== */
function CampeonatoFabricantesTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campeonato/fabricantes')
      .then(res => res.json())
      .then(rows => {
        setData(rows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-gray-400 text-lg">
          Cargando clasificación de fabricantes...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-center">POS</th>
              <th className="px-4 py-3 text-left">MANUFACTURER</th>
              <th className="px-4 py-3 text-center">POINTS</th>
              <th className="px-4 py-3 text-center">BEHIND</th>
              <th className="px-4 py-3 text-center">WINS</th>
            </tr>
          </thead>

          <tbody>
            {data.map((f, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index === 0
                    ? 'bg-yellow-100 font-bold'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 text-center">{f.pos}</td>
                <td className="px-4 py-3 text-left font-semibold">{f.manufacturer}</td>
                <td className="px-4 py-3 text-center font-bold text-blue-600">
                  {f.points}
                </td>
                <td
                  className={`px-4 py-3 text-center font-bold ${
                    f.behind === 'LIDER'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {f.behind}
                </td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">
                  {f.wins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================================================
   TABLA CAMPEONATO EQUIPOS
====================================================== */
function CampeonatoEquiposTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campeonato/equipos')
      .then(res => res.json())
      .then(rows => {
        setData(rows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-gray-400 text-lg">
          Cargando clasificación de equipos...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-center font-bold">POS</th>
              <th className="px-4 py-3 text-left font-bold">TEAM</th>
              <th className="px-4 py-3 text-center font-bold">POINTS</th>
              <th className="px-4 py-3 text-center font-bold">BEHIND</th>
              <th className="px-4 py-3 text-center font-bold">WINS</th>
            </tr>
          </thead>

          <tbody>
            {data.map((t, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index === 0
                    ? 'bg-yellow-100 font-bold'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 text-center">{t.pos}</td>
                <td className="px-4 py-3 text-left font-semibold text-lg">{t.team}</td>
                <td className="px-4 py-3 text-center font-bold text-blue-600 text-lg">
                  {t.points}
                </td>
                <td
                  className={`px-4 py-3 text-center font-bold ${
                    t.behind === 'LIDER'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {t.behind}
                </td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">
                  {t.wins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================
   CAMPEONATO VIEW (PRINCIPAL)
================================ */
function CampeonatoView() {
  const [subView, setSubView] = useState('pilotos');

  return (
    <div className="max-w-7xl mx-auto px-4">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          📊 Clasificación NASCAR Gaming Series
        </h1>

        <button
          onClick={() => window.location.reload()}
          className="mt-3 sm:mt-0 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded"
        >
          ← Regresar al inicio
        </button>
      </div>

      {/* SUBMENU */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSubView('pilotos')}
          className={`px-4 py-2 rounded font-semibold text-sm ${
            subView === 'pilotos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Pilotos
        </button>

        <button
          onClick={() => setSubView('equipos')}
          className={`px-4 py-2 rounded font-semibold text-sm ${
            subView === 'equipos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Equipos
        </button>

        <button
          onClick={() => setSubView('fabricantes')}
          className={`px-4 py-2 rounded font-semibold text-sm ${
            subView === 'fabricantes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Fabricantes
        </button>
      </div>

      {/* CONTENIDO */}
      {subView === 'pilotos' && <CampeonatoPilotosTable />}

      {subView === 'equipos' && <CampeonatoEquiposTable />}

      {subView === 'fabricantes' && <CampeonatoFabricantesTable />}
    </div>
  );
}

/* =======================
   CALENDARIO VIEW
======================= */
function CalendarioView() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetch('/api/calendario')
      .then(res => res.json())
      .then(setEventos)
      .catch(() => setEventos([]));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">CALENDARIO</h2>
      <div className="bg-gray-800 rounded-lg p-4">
        {eventos.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay eventos programados</p>
        ) : (
          eventos.map(e => (
            <div key={e.id} className="border-b border-gray-700 py-2 text-sm">
              {e.nombre} - {e.fecha}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =======================
   REGLAMENTO VIEW
======================= */
function ReglamentoView() {
  const [seccionActiva, setSeccionActiva] = useState('grupo');

  const secciones = {
    grupo: {
      titulo: 'GRUPO',
      contenido: [
        '1. No se permiten publicaciones o comentarios racistas hacia otros miembros.',
        '2. Cualquier publicación o comentario de insultos, spam o peleas, será eliminado y se le limitará a una la cantidad de publicaciones y comentarios que puede hacer cada 24 horas.',
        '3. La publicación de otras Ligas de nr2003 serán eliminadas y el miembro autor de la publicación, se le limitará a una la cantidad de publicaciones y comentarios que puede hacer cada 24 horas.'
      ]
    },
    discord: {
      titulo: 'DISCORD',
      contenido: [
        '1. El uso del Discord es obligatorio.',
        '2. Durante prácticas y happy hour está permitido hablar libremente.',
        '3. Está prohibido hablar durante la sesión de clasificación. No acatar esta regla te hará iniciar la carrera desde el carril de Pits.',
        '4. Durante la carrera y bajo bandera verde está prohibido hablar a menos que sea para avisar una entrada al carril de pits, rotura de motor, un accidente o una queja.',
        '5. Durante el transcurso de la carrera, solo se permitirá hablar bajo el estado de bandera amarilla (Se recomienda NO hablar al salir del carril de pits, para poder escuchar a los spotters).',
        '6. Está prohibido insultar, denigrar, gritar u ofender a otro piloto ya sea por burla ofensiva o desquite personal a causa de un accidente.',
        '7. Al finalizar la carrera, habrá media hora para revisar accidentes pendientes o sin reclamar.'
      ]
    },
    server: {
      titulo: 'SERVER',
      contenido: [
        '1. El chat del servidor solo será utilizado para quienes no cuentan con un micrófono.',
        '2. La sesión de prácticas tendrá una duración de 25 minutos.',
        '3. Si alguien es visto interfiriendo o saboteando las prácticas, será penalizado con una bandera negra, impidiéndole salir a pista hasta la siguiente sesión.',
        '4. Si un piloto cuenta con más de 400 de Ping o un cualv menor a 49, se le dará aviso para ir al fondo del grupo. No acatar este aviso se sanciona con una bandera negra.',
        '5. Se recomienda usar la sesión de Happy Hour para practicar la entrada al carril de pits y practicar la parada en su caja de pits.'
      ]
    },
    mecanicas: {
      titulo: 'MECÁNICAS',
      contenido: [
        'ATENCIÓN: Al no cumplir cualquiera de las siguientes reglas, un administrador te colocará una bandera negra, la cual debes cumplir en estado de carrera bajo bandera verde. También se dará una penalización de -3 vueltas en el export en caso de que el incidente sea revisado a penas al finalizar la carrera o no te hagas penalizar de la forma en la que te lo solicite un administrador en el momento.',
        '',
        '1. Contaremos con un reinicio al iniciar la carrera, solo si ocurre un accidente antes de que el líder termine la vuelta 5.',
        '2. No contaremos con Overtime.',
        '3. En óvalos se hará uso de banderas amarillas automáticas del juego, pero las banderas amarillas serán recortadas en la medida de lo posible por los administradores por medio de un comando específico.',
        '4. En circuitos NO se hará uso de las banderas amarillas automáticas del juego, pero los administradoras las activarán de forma manual por medio de un comando específico, si hay un accidente que involucre 3 autos o más en pista.',
        '5. Al salir una bandera amarilla, las posiciones se congelan automáticamente en caso de terminar etapa o carrera.',
        '6. Usaremos 2 etapas (bajo bandera verde) cuya vuelta está especificada en el calendario en todas las pistas.',
        '6.1. Ahora todos los Stages acabarán bajo bandera verde tomando las siguientes medidas:',
        '6.1.1. Si a falta de 5 o menos vueltas para acabar una etapa sale una bandera amarilla, y esta impide que la etapa termine bajo bandera verde, la vuelta final del Stage será extendida hasta el reinicio dando la vuelta de reinicio como la última vuelta del Stage.',
        '6.1.2. Si sale una bandera amarilla en la última vuelta de una etapa y fue por generar un accidente innecesario serás penalizado.',
        '6.1.3. Los primeros 10 serán los ganadores de las etapas. 1=5pts | 2=4pts | 3=3pts | 4=3pts | 5=2pts | 6=2pts | 7=2pts | 8=1pts | 9=1pts | 10= 0.5pts.',
        '6.1.4. En la carrera final de temporada, se hará uso de la suma de puntos de etapa.',
        '7. Se utilizará la suma de puntos similar al sistema actual de Nascar.',
        '8. De forma obligatoria todos los pilotos deben dar un aviso para entrar a los pits en la misma vuelta, y debe dar el aviso mínimo antes finalizar el recorrido de la recta posterior en óvalos o antes de que falten 1-2 curvas para la entrada a pits en circuitos.',
        '9. Ahora es obligatorio dar aviso de que vas al carril de pits por medio del chat, así tengas micrófono.',
        '10. Si sale una bandera amarilla faltando 5 vueltas para el final (3 en circuitos) se congelarán las posiciones de acuerdo cuando salió la amarilla.',
        '11. Esta prohibido bloquear de forma reiterada en pista hasta que falten 2 vueltas para el final. Sin embargo, aun faltando 2 vueltas para el final, está prohibido realizar bloqueos peligrosos y/o que puedan provocar un accidente.'
      ]
    },
    banderas: {
      titulo: 'BANDERAS NEGRAS',
      contenido: [
        '1. Para pedir que un administrador le quite una bandera negra, debe escribir en el texto del juego "#*tu numero*bl@ck flag".',
        '2. Puedes solicitar que te quiten una bandera negra si otro piloto se queda a la hora un reinicio de carrera.',
        '3. Puedes solicitar que te quiten una bandera negra si después de un accidente tu auto cruza una zona de penalización.',
        '4. Si has sido penalizado con "eoll" y quieres volver a ingresar al carril de pits, debes esperar a ser rebasado. De no cumplir esta regla, no se removerá la bandera negra.',
        '5. Las banderas negras removidas por los administradores serán revisadas al final de la carrera.',
        '6. Esconder un falso pedido de remoción de bandera negra o "BF" u ocultar el motivo real del motivo de la bandera negra para sacar una ventaja, se castiga con una penalización de -3 vueltas en el export y no podrá volver a solicitar una remoción de bandera negra sea cual sea el motivo de esta o a no ser que esta sea generada intencionalmente por otro piloto para afectar al piloto con la sanción, hasta el final de temporada.'
      ]
    },
    accidentes: {
      titulo: 'ACCIDENTES',
      contenido: [
        '1. Si estás seguro de haber causado un accidente, debes reclamarlo como tuyo enviando al chat la letra A y tu número. EJ: A# (se recomienda enviarlo 2 veces seguidas).',
        '2. Si causas un accidente bajo bandera amarilla, se suma tu cuenta de accidentes causados para ser llamado a parquear tu auto y debes reclamarlo enviando al chat la letra A y tu número. EJ: A#.',
        '3. Si bajo bandera amarilla, perdiste el control de tu auto, pero no afectaste a ningún otro piloto ni cancelaste un reinicio de carrera, el accidente NO se suma a tu cuenta de accidentes para ser llamado a parquear tu auto, pero puede que afecte de forma negativa tu licencia.',
        '4. Si bajo bandera verde, perdiste el control de tu auto, pero no afectaste a ningún otro piloto, ni causaste una bandera amarilla, el accidente NO se suma a tu cuenta de accidentes para ser llamado a parquear tu auto, pero puede que afecte de forma negativa tu licencia.',
        '5. Si causas la pérdida del control del auto a otro piloto y no se genera la bandera amarilla, debes reclamar el accidente como tuyo con la letra A y tu número en el chat y debes hacer un paso por el carril de pits en estado de carrera bajo bandera verde.',
        '6. Si causaste un accidente que genere una bandera amarilla, debes entrar al carril de pits, y exceder el límite de velocidad de +3 MPH. EJ: Si el límite son 45 MPH, debes pasar por el carril de pits a 48 MPH.',
        '7. Si no estás seguro de si el accidente fue culpa tuya tienes 2 opciones. Entrar al carril de pits y hacerte penalizar, o no entrar. PERO, de ser hallado culpable del accidente y no haber entrado al carril de pits a hacerse penalizar, serás penalizado con -3 vueltas en el export.',
        '8. Si ninguno de los involucrados sabe de quién fue el accidente, se recomienda que los involucrados se hagan penalizar en pits, y al final de carrera, se hará una revisión de los accidentes sin reclamar.',
        '9. Si causas 1(C), 2(B) o 3(A) accidentes (dependiendo de tu licencia A, B o C), serás parqueado.',
        '10. IMPORTANTE -> Cualquier choque, o maniobra intencional, derivado de un accidente previo, será penalizado siendo expulsado de la carrera y suspendido de todas las categorías por una fecha, quedando bajo probatoria el resto de la temporada.',
        '11. Si un conductor es visto y reportado teniendo una conducción peligrosa en la que afecte de forma reiterada a varios pilotos aun cuando este conductor no logre causar un accidente, será llamado a estacionar su auto y se le dará la licencia C.',
        '12. Dar informes falsos sobre conducción peligrosa, da sanción de -3 vueltas en la exportación y suspensión de 1 fecha.',
        '12.1. Ten en cuenta que, si un piloto te empuja, accidenta o te arruina la carrera, serán los administradores quienes apliquen una penalización. No te arruines a ti mismo cobrando con otro accidente.',
        '13. Si alguien te ha causado problemas que impliquen daños en tu auto, debes reclamarlo inmediatamente a un Administrador.',
        '14. Si te encuentras a una distancia considerable de un accidente, en la que incluso usando el ABS puedas frenar con tiempo de sobra, y en cambio decides intentar esquivar el accidente de una forma peligrosa o sin siquiera frenar tu velocidad, serás penalizado con -3 vueltas en el export final. (así esquives o no el accidente).',
        '15. Si un auto queda estacionado, estancado, enganchado o atrapado después de un accidente, debe retirarlo de inmediato ya sea llamando a la grúa o retirándose.'
      ]
    },
    wave: {
      titulo: 'WAVE AROUND & LUCKY DOG',
      contenido: [
        '1. Los que deseen tomar el Wave around, deben quedarse en pista y esperar que todos los líderes entren al carril de pits. Si un líder de competencia decide no ingresar al carril de pits, debes ingresar al carril de pits para partir al fondo del grupo.',
        '2. Para tomar el Lucky Dog, debes estar primero de los pilotos con una vuelta perdida, debes ingresar al carril de pits junto con los líderes, exceder el límite de velocidad en uno de los sectores del carril de pits e ir al fondo de la parrilla antes de que la carrera se reinicie.',
        '2.1. No se otorgará el Lucky Dog a falta de 2 vuelta o menos para el final.',
        '3. Ningún auto con una vuelta perdida debe quedar entre los líderes al momento de un reinicio. No acatar esta regla se penaliza con una bandera negra la cual se debe cumplir bajo bandera verde.',
        '4. Todos los autos que estén -1 Lap (vuelta) o más, están obligados a partir últimos, se les va hacer un eoll.',
        '5. Si en carrera hay de 3 autos o menos con vuelta perdida a la hora de un reinicio, estos deberán entrar en la primera vuelta al carril de pits junto con los líderes, pero deben exceder el límite de velocidad en no más de +3 MPH por encima de lo permitido. (ejemplo: límite 55 MPH, ir a 57 MPH)'
      ]
    },
    licencias: {
      titulo: 'LICENCIAS',
      contenido: [
        '--> Licencia A',
        '--> Licencia B',
        '--> Licencia C',
        '',
        'Todas las licencias son bienvenidas a participar en cualquier categoría de la liga, y las licencias se otorgan en base a varios factores.',
        '--> Conducción',
        '--> Control del auto en pista',
        '--> Constancia',
        '--> Toma de decisiones en diversas circunstancias. EJ: ceder espacios, ceder el paso, aceptación de errores, conducta, etc...',
        '',
        '¿Cómo subir de licencia?',
        'Si eres licencia C o B, en el calendario de la liga hay carreras llamadas (Fechas de licencia) marcadas en color verde. Al finalizar estas carreras, los administradores podrán decidir si subirte de licencia dependiendo de si cumpliste con los valores mencionados en el segundo punto.',
        '',
        '¿Cómo subir de licencia?',
        'Si eres nuevo, iniciando con licencia C, y dependiendo de si cumples con los valores mencionados en el anterior punto, irás subiendo de licencia.',
        'Si NO eres nuevo, para esta nueva temporada se te asignará una licencia basada en tu actuación en la temporada anterior.',
        '',
        'Límites por licencia',
        'Cada licencia tiene un LÍMITE máximo de accidentes. Si llegas al límite de accidentes causados, serás llamado a estacionar tu auto y volverás a tu licencia anterior.',
        '--> Licencia C: Se perdonarán 2 accidentes, solo si no se ha sobrepasado la mitad de carrera. En caso de ya haber sobrepasado la mitad de la carrera, solo se te perdonará 1 accidente.',
        '--> Licencia B: Se te perdonaran 2 accidentes.',
        '--> Licencia A: Se te perdonarán 3 accidentes.'
      ]
    },
    chase: {
      titulo: 'CHASE FOR THE GAMING',
      contenido: [
        '1. Los 10 primeros pilotos en la tabla por puntos avanzan.',
        '2. El puesto 11 y 12 se definen por victoria igual vía puntos quien esta mejor acomodado.',
        '3. Cada clasificado recibe 5.000 puntos base.',
        '4. +12 puntos adicionales por cada victoria que logre en las 26 primeras carreras.',
        '5. +1 punto adicional por ganar una etapa en las 26 primeras carreras.',
        '6. Solo esos 12 pilotos podrán disputar el campeonato.',
        '7. Se va continuar el sistema clásico de puntuación de carrera.',
        '8. EL piloto con más puntos tras la final en Homestead-Miami Speedway será el campeón.'
      ]
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-6">📋 REGLAMENTO NASCAR Gaming Series</h1>

      {/* MENÚ DE SECCIONES */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(secciones).map(key => (
          <button
            key={key}
            onClick={() => setSeccionActiva(key)}
            className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
              seccionActiva === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {secciones[key].titulo}
          </button>
        ))}
      </div>

      {/* CONTENIDO DE LA SECCIÓN ACTIVA */}
      <div className="bg-gray-800 rounded-lg p-6 border-2 border-blue-500">
        <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-blue-500 pb-2">
          {secciones[seccionActiva].titulo}
        </h2>
        
        <div className="space-y-3">
          {secciones[seccionActiva].contenido.map((linea, idx) => (
            <p
              key={idx}
              className={`${
                linea === '' 
                  ? 'h-2' 
                  : linea.startsWith('ATENCIÓN') || linea.startsWith('IMPORTANTE') || linea.startsWith('¿Cómo')
                    ? 'text-yellow-400 font-bold text-base'
                    : linea.startsWith('-->')
                      ? 'text-cyan-400 font-semibold'
                      : linea.match(/^\d+\./)
                        ? 'text-gray-200 text-sm leading-relaxed'
                        : 'text-gray-300 text-sm italic'
              }`}
            >
              {linea}
            </p>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 text-center text-xs text-gray-500">
        © 2026 NASCAR Gaming Series • Reglamento Oficial Temporada 2026
      </div>
    </div>
  );
}

/* =======================
   APP PRINCIPAL
======================= */
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [campeonatoSubView, setCampeonatoSubView] = useState('pilotos');
  const [campeonatoOpen, setCampeonatoOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'resultados':
        return <ResultadosView />;
      case 'pilotos':
        return <PilotosView />;
      case 'campeonato':
        return <CampeonatoView />;
      case 'calendario':
        return <CalendarioView />;
      case 'reglamento':
        return <ReglamentoView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* NAVBAR SUPERIOR */}
      <nav className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentView('home')}
            className={`px-3 py-1 font-bold text-xs transition-colors ${
              currentView === 'home' 
                ? 'text-white underline' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            HOME
          </button>
          <button 
            onClick={() => setCurrentView('resultados')}
            className={`px-3 py-1 font-bold text-xs transition-colors ${
              currentView === 'resultados' 
                ? 'text-white underline' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            RESULTADOS
          </button>
          <button 
            onClick={() => setCurrentView('pilotos')}
            className={`px-3 py-1 font-bold text-xs transition-colors ${
              currentView === 'pilotos' 
                ? 'text-white underline' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PILOTOS
          </button>
        </div>
      </nav>

      {/* BOTONES DE ACCIÓN PRINCIPALES */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setCurrentView('pilotos')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
          >
            🏎 PILOTOS
          </button>
          
          <div className="relative">
            <button 
              onClick={() => {
                setCurrentView('campeonato');
                setCampeonatoOpen(!campeonatoOpen);
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
            >
              🏆 CAMPEONATO ▼
            </button>
            
            {campeonatoOpen && currentView === 'campeonato' && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded shadow-lg border border-gray-700 overflow-hidden z-10 min-w-max">
                <button
                  onClick={() => {
                    setCampeonatoSubView('pilotos');
                    setCampeonatoOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors border-b border-gray-700 text-xs"
                >
                  🏎 Campeonato de Pilotos
                </button>
                <button
                  onClick={() => {
                    setCampeonatoSubView('equipos');
                    setCampeonatoOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors border-b border-gray-700 text-xs"
                >
                  👥 Campeonato de Equipos
                </button>
                <button
                  onClick={() => {
                    setCampeonatoSubView('fabricantes');
                    setCampeonatoOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-gray-700 transition-colors text-xs"
                >
                  🏭 Campeonato de Fabricantes
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setCurrentView('calendario')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
          >
            📅 CALENDARIO
          </button>
          <button 
            onClick={() => setCurrentView('reglamento')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors"
          >
            📋 REGLAMENTO
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="p-4">
        {renderView()}
      </div>
    </div>
  );
}