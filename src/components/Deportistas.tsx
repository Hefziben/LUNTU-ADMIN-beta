import React, { useState } from 'react';
import { Star, TrendingUp, Award, ChevronDown, ChevronUp, Eye, EyeOff, X, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const initialDeportistas = [
  { id: 1, name: 'Diego Martínez', sport: 'Fútbol', category: 'Sub-15', score: 98, highlight: 'Máximo goleador del torneo regional con 15 tantos.', image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 2, name: 'Ana Silva', sport: 'Tenis', category: 'Juvenil', score: 95, highlight: 'Invicta en la temporada de verano, ganadora de 3 torneos.', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 3, name: 'Luis Pérez', sport: 'Natación', category: 'Infantil', score: 92, highlight: 'Récord nacional en 50m libres para su categoría.', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 4, name: 'Carlos Ruiz Jr.', sport: 'Fútbol', category: 'Sub-15', score: 90, highlight: 'Líder en asistencias de la liga.', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 5, name: 'María Gómez', sport: 'Baloncesto', category: 'Juvenil', score: 94, highlight: 'MVP del torneo intercolegial.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=150&h=150' },
];

const sportsList = ['Todos', 'Fútbol', 'Tenis', 'Natación', 'Baloncesto', 'Béisbol', 'Karate', 'Gimnasia'];

export function Deportistas() {
  const [deportistas, setDeportistas] = useState(initialDeportistas);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeSport, setActiveSport] = useState('Todos');
  const [isAlgoModalOpen, setIsAlgoModalOpen] = useState(false);
  const [selectedDeportista, setSelectedDeportista] = useState<typeof initialDeportistas[0] | null>(null);

  const handleRemoveHighlight = (id: number) => {
    setDeportistas(deportistas.filter(t => t.id !== id));
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredDeportistas = activeSport === 'Todos' 
    ? deportistas 
    : deportistas.filter(t => t.sport === activeSport);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Deportistas Destacados</h2>
          <p className="text-gray-500 text-sm mt-1">Atletas destacados automáticamente por el algoritmo de rendimiento.</p>
        </div>
        <button 
          onClick={() => setIsAlgoModalOpen(true)}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Ajustar Algoritmo
        </button>
      </div>

      {/* Sport Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {sportsList.map((sport) => (
          <button
            key={sport}
            onClick={() => setActiveSport(sport)}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeSport === sport
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {sport}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="pl-6 pr-4 py-4 font-medium w-20"></th>
                <th className="px-6 py-4 font-medium">Atleta</th>
                <th className="px-6 py-4 font-medium">Deporte</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeportistas.map((deportista) => (
                <React.Fragment key={deportista.id}>
                  <tr 
                    className="hover:bg-gray-50 cursor-pointer transition-colors" 
                    onClick={() => toggleExpand(deportista.id)}
                  >
                    <td className="pl-6 pr-4 py-4 w-20">
                      <img src={deportista.image} alt={deportista.name} className="w-10 h-10 min-w-[40px] rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{deportista.name}</td>
                    <td className="px-6 py-4 text-gray-500">{deportista.sport}</td>
                    <td className="px-6 py-4 text-gray-500">{deportista.category}</td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {deportista.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedDeportista(deportista); }}
                          className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Ver Perfil</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRemoveHighlight(deportista.id); }}
                          className="bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-2"
                        >
                          <EyeOff className="w-4 h-4" /> <span className="hidden sm:inline">Ocultar</span>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 ml-2">
                          {expandedId === deportista.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === deportista.id && (
                    <tr className="bg-indigo-50/50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center pl-16">
                          <div className="flex items-start gap-3 text-sm text-gray-700">
                            <Award className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900 mb-1">Mérito Destacado</p>
                              <p>{deportista.highlight}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredDeportistas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay deportistas destacados para {activeSport.toLowerCase()}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAlgoModalOpen && (
        <AlgorithmModal onClose={() => setIsAlgoModalOpen(false)} />
      )}

      {selectedDeportista && (
        <PerfilDeportistaModal 
          deportista={selectedDeportista} 
          onClose={() => setSelectedDeportista(null)} 
        />
      )}
    </div>
  );
}

function AlgorithmModal({ onClose }: { onClose: () => void }) {
  const [weights, setWeights] = useState({
    stats: 40,
    attendance: 20,
    coachRating: 30,
    peerRating: 10
  });

  const handleSave = () => {
    // In a real app, save these weights to the backend
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Ajustar Algoritmo LUNTU
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500">
            Ajusta los pesos de las variables que el algoritmo utiliza para calcular el "Score" de cada atleta y destacarlos automáticamente. El total debe sumar 100%.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-gray-700">Estadísticas de Juego</label>
                <span className="text-indigo-600 font-bold">{weights.stats}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={weights.stats}
                onChange={(e) => setWeights({...weights, stats: parseInt(e.target.value)})}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-gray-700">Asistencia a Entrenamientos</label>
                <span className="text-indigo-600 font-bold">{weights.attendance}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={weights.attendance}
                onChange={(e) => setWeights({...weights, attendance: parseInt(e.target.value)})}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-gray-700">Evaluación del Entrenador</label>
                <span className="text-indigo-600 font-bold">{weights.coachRating}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={weights.coachRating}
                onChange={(e) => setWeights({...weights, coachRating: parseInt(e.target.value)})}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-gray-700">Votación de Compañeros</label>
                <span className="text-indigo-600 font-bold">{weights.peerRating}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={weights.peerRating}
                onChange={(e) => setWeights({...weights, peerRating: parseInt(e.target.value)})}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
          
          <div className="bg-indigo-50 p-3 rounded-lg flex justify-between items-center border border-indigo-100">
            <span className="text-sm font-medium text-indigo-900">Total Ponderado:</span>
            <span className={clsx(
              "font-bold",
              (weights.stats + weights.attendance + weights.coachRating + weights.peerRating) === 100 ? "text-emerald-600" : "text-red-600"
            )}>
              {weights.stats + weights.attendance + weights.coachRating + weights.peerRating}%
            </span>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={(weights.stats + weights.attendance + weights.coachRating + weights.peerRating) !== 100}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aplicar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

function PerfilDeportistaModal({ deportista, onClose }: { deportista: typeof initialDeportistas[0], onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="relative h-32 bg-indigo-600">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white hover:text-indigo-100 bg-black/20 hover:bg-black/30 p-1.5 rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <img 
              src={deportista.image} 
              alt={deportista.name} 
              className="w-24 h-24 flex-shrink-0 rounded-full object-cover border-4 border-white shadow-md bg-white"
              referrerPolicy="no-referrer"
            />
            <div className="flex gap-3">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                {deportista.sport}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                {deportista.category}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{deportista.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-sm font-bold flex items-center gap-1 w-fit">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                Score LUNTU: {deportista.score}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" />
                Mérito Destacado
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {deportista.highlight}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Estadísticas de Juego</h4>
                <p className="text-lg font-bold text-gray-900">Sobresaliente</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Asistencia</h4>
                <p className="text-lg font-bold text-gray-900">98%</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Evaluación Entrenador</h4>
                <p className="text-lg font-bold text-gray-900">Excelente</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Votación Compañeros</h4>
                <p className="text-lg font-bold text-gray-900">Positiva</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
