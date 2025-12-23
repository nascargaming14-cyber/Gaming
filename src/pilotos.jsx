export default function Pilotos() {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/pilotos")
      .then((res) => res.json())
      .then((data) => {
        setPilotos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HEADER CON BOTONES */}
      <div className="bg-gray-950 px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">
          Pilotos NASCAR Gaming Series - Lista De Entradas - Tiempo Completo
        </h1>
        
        <div className="flex gap-3">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2">
            🎓 Licencias
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2">
            ← Regresar al inicio
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="px-6 py-6">
        {loading ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">Cargando pilotos...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-center font-bold text-gray-900 uppercase">NÚMERO</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase">NOMBRE</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase">APELLIDO</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase">FECHA NACIMIENTO</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase">LUGAR ORIGEN</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase">JEFE EQUIPO</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase">EQUIPO</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase">CATEGORÍA</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase">MARCA VEHÍCULO</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {pilotos.map((p, index) => (
                    <tr
                      key={p.numero}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                          {p.numero}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{p.nombre}</td>
                      <td className="px-4 py-3 text-gray-800">{p.apellido}</td>
                      <td className="px-4 py-3 text-gray-600">{p.fecha_nacimiento}</td>
                      <td className="px-4 py-3 text-gray-600">{p.lugar_origen}</td>
                      <td className="px-4 py-3 text-gray-800">{p.jefe_equipo}</td>
                      <td className="px-4 py-3 text-gray-800">{p.equipo}</td>
                      <td className="px-4 py-3 text-gray-600">{p.categoria}</td>
                      <td className="px-4 py-3 text-gray-800">{p.marca_vehiculo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}