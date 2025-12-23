import { useEffect, useState } from "react";

export default function Pilotos() {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/pilotos") // ajusta si tu endpoint es distinto
      .then((res) => res.json())
      .then((data) => {
        setPilotos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full px-6 py-4">
      {/* TÍTULO */}
      <h1 className="text-2xl font-bold mb-4">
        Pilotos NASCAR Gaming Series – Lista de Entradas – Tiempo Completo
      </h1>

      {/* BOTÓN REGRESAR */}
      <button className="mb-4 text-sm text-blue-600 hover:underline">
        ← Regresar al inicio
      </button>

      {/* CONTENEDOR TIPO CARD */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Cargando pilotos...
          </div>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            {/* ENCABEZADO */}
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">NÚMERO</th>
                <th className="px-3 py-2 text-left font-semibold">NOMBRE</th>
                <th className="px-3 py-2 text-left font-semibold">APELLIDO</th>
                <th className="px-3 py-2 text-left font-semibold">
                  FECHA NACIMIENTO
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  LUGAR ORIGEN
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  JEFE EQUIPO
                </th>
                <th className="px-3 py-2 text-left font-semibold">EQUIPO</th>
                <th className="px-3 py-2 text-left font-semibold">
                  CATEGORÍA
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  MARCA VEHÍCULO
                </th>
              </tr>
            </thead>

            {/* CUERPO */}
            <tbody>
              {pilotos.map((p) => (
                <tr
                  key={p.numero}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{p.numero}</td>
                  <td className="px-3 py-2">{p.nombre}</td>
                  <td className="px-3 py-2">{p.apellido}</td>
                  <td className="px-3 py-2">{p.fecha_nacimiento}</td>
                  <td className="px-3 py-2">{p.lugar_origen}</td>
                  <td className="px-3 py-2">{p.jefe_equipo}</td>
                  <td className="px-3 py-2">{p.equipo}</td>
                  <td className="px-3 py-2">{p.categoria}</td>
                  <td className="px-3 py-2">{p.marca_vehiculo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FOOTER */}
      <p className="mt-3 text-xs text-gray-500">
        © 2025 NASCAR Gaming Series · Datos oficiales de pilotos
      </p>
    </div>
  );
}
