import { useEffect, useState } from "react";

export default function App() {
  const [view, setView] = useState("home");
  const [pilotos, setPilotos] = useState([]);
  const [campeonato, setCampeonato] = useState([]);

  useEffect(() => {
    if (view === "pilotos") {
      fetch("http://localhost:3001/api/pilotos")
        .then(res => res.json())
        .then(data => setPilotos(data));
    }

    if (view === "campeonato") {
      fetch("http://localhost:3001/api/campeonato/pilotos")
        .then(res => res.json())
        .then(data => setCampeonato(data));
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans">

      {/* NAVBAR */}
      <div className="bg-black text-white px-6 py-4 flex gap-6 font-semibold">
        <button onClick={() => setView("home")} className="hover:text-yellow-400">
          HOME
        </button>
        <button onClick={() => setView("pilotos")} className="hover:text-yellow-400">
          PILOTOS
        </button>
        <button onClick={() => setView("campeonato")} className="hover:text-yellow-400">
          CAMPEONATO
        </button>
      </div>

      {/* HOME */}
      {view === "home" && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-extrabold mb-6">
            NASCAR Gaming Series
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Plataforma oficial de estadísticas, pilotos y clasificación general
            de la NASCAR Gaming Series. Información en tiempo real, diseño profesional
            y datos oficiales.
          </p>
        </div>
      )}

      {/* PILOTOS */}
      {view === "pilotos" && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-extrabold mb-6">
            Pilotos NASCAR Gaming Series
          </h1>

          <div className="overflow-x-auto bg-white shadow border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-3 py-3">NO</th>
                  <th className="px-3 py-3">NOMBRE</th>
                  <th className="px-3 py-3">APELLIDO</th>
                  <th className="px-3 py-3">ORIGEN</th>
                  <th className="px-3 py-3">EQUIPO</th>
                  <th className="px-3 py-3">CATEGORÍA</th>
                  <th className="px-3 py-3">MARCA</th>
                </tr>
              </thead>
              <tbody>
                {pilotos.map(p => (
                  <tr key={p.numero} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 font-bold">{p.numero}</td>
                    <td className="px-3 py-2">{p.nombre}</td>
                    <td className="px-3 py-2">{p.apellido}</td>
                    <td className="px-3 py-2">{p.origen}</td>
                    <td className="px-3 py-2">{p.equipo}</td>
                    <td className="px-3 py-2">{p.categoria}</td>
                    <td className="px-3 py-2">{p.marca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CAMPEONATO */}
      {view === "campeonato" && (
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex justify-between items-center mb-4">
            <button className="bg-gray-200 hover:bg-gray-300 text-xs font-semibold px-4 py-2 uppercase">
              Visit Playoffs Hub ▶
            </button>
            <div className="text-sm text-gray-600">
              📅 After Phoenix · Race 36 of 36
            </div>
          </div>

          <div className="overflow-x-auto bg-white border shadow">
            <table className="w-full border-collapse text-sm">

              <thead>
                <tr className="border-b-4 border-yellow-400 text-left bg-white">
                  <th className="px-2 py-3">POS</th>
                  <th className="px-2 py-3">NO.</th>
                  <th className="px-2 py-3">DRIVER</th>
                  <th className="px-2 py-3">MFR</th>
                  <th className="px-2 py-3">POINTS (STAGE)</th>
                  <th className="px-2 py-3">BEHIND</th>
                  <th className="px-2 py-3">STARTS</th>
                  <th className="px-2 py-3">WINS</th>
                  <th className="px-2 py-3">TOP 5s</th>
                  <th className="px-2 py-3">TOP 10s</th>
                  <th className="px-2 py-3">DNFs</th>
                  <th className="px-2 py-3">LAPS LED</th>
                  <th className="px-2 py-3">PLAYOFF PTS</th>
                </tr>
              </thead>

              <tbody>
                {campeonato.map(row => (
                  <tr key={row.pos} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2 font-bold">{row.pos}</td>
                    <td className="px-2 py-2 font-bold">{row.no}</td>
                    <td className="px-2 py-2 font-semibold">{row.driver}</td>
                    <td className="px-2 py-2">{row.mfr}</td>
                    <td className="px-2 py-2 font-bold">{row.points}</td>
                    <td className={`px-2 py-2 font-bold ${row.behind === "LIDER" ? "text-green-600" : "text-red-600"}`}>
                      {row.behind}
                    </td>
                    <td className="px-2 py-2">{row.starts}</td>
                    <td className="px-2 py-2">{row.wins}</td>
                    <td className="px-2 py-2">{row.top5s}</td>
                    <td className="px-2 py-2">{row.top10s}</td>
                    <td className="px-2 py-2">{row.dnfs}</td>
                    <td className="px-2 py-2">{row.lapsLed}</td>
                    <td className="px-2 py-2 font-bold">{row.playoffPoints}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
}
