import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, ChevronDown, ChevronUp, Eye, EyeOff, X, Settings, Loader2, User, Plus, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../lib/supabase';

export function Deportistas() {
  const [deportistas, setDeportistas] = useState<any[]>([]);
  const [sportsList, setSportsList] = useState<string[]>(['Todos']);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeSport, setActiveSport] = useState('Todos');
  const [isAlgoModalOpen, setIsAlgoModalOpen] = useState(false);
  const [selectedDeportista, setSelectedDeportista] = useState<any>(null);
  const [isNewAthleteOpen, setIsNewAthleteOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [athletesRes, disciplinesRes] = await Promise.all([
        supabase
          .from('athletes')
          .select('*, disciplines(label)')
          .order('created_at', { ascending: false }),
        supabase
          .from('disciplines')
          .select('label')
    ]);

    if (!athletesRes.error) {
      setDeportistas(athletesRes.data || []);
    }
    if (!disciplinesRes.error && disciplinesRes.data) {
        setSportsList(['Todos', ...disciplinesRes.data.map(d => d.label)]);
    }
    setLoading(false);
  };

  const handleRemoveHighlight = async (id: string) => {
    if (window.confirm('¿Eliminar atleta?')) {
        const { error } = await supabase.from('athletes').delete().eq('id', id);
        if (!error) {
            setDeportistas(deportistas.filter(t => t.id !== id));
        }
    }
  };

  const handleEdit = (atleta: any) => {
    setEditingAthlete(atleta);
    setIsNewAthleteOpen(true);
  };

  const handleSave = async (atleta: any) => {
    if (editingAthlete) {
      const { data, error } = await supabase
        .from('athletes')
        .update(atleta)
        .eq('id', editingAthlete.id)
        .select('*, disciplines(label)');
      if (!error && data) {
        setDeportistas(deportistas.map(d => d.id === editingAthlete.id ? data[0] : d));
        setIsNewAthleteOpen(false);
        setEditingAthlete(null);
      }
    } else {
      const { data, error } = await supabase
        .from('athletes')
        .insert([atleta])
        .select('*, disciplines(label)');
      if (!error && data) {
        setDeportistas([data[0], ...deportistas]);
        setIsNewAthleteOpen(false);
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredDeportistas = activeSport === 'Todos' 
    ? deportistas 
    : deportistas.filter(t => t.disciplines?.label === activeSport);

  return (
    <div className="space-y-6 deportistas-page">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Deportistas Destacados</h2>
          <p className="text-gray-500 text-sm mt-1">Atletas destacados automáticamente por el algoritmo de rendimiento.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAlgoModalOpen(true)}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Ajustar Algoritmo
          </button>
          <button
            onClick={() => {
              setEditingAthlete(null);
              setIsNewAthleteOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Atleta
          </button>
        </div>
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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
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
                        <div className="w-10 h-10 min-w-[40px] rounded-full bg-gray-200 flex items-center justify-center border border-gray-200 overflow-hidden">
                           <User className="w-6 h-6 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{deportista.name}</td>
                      <td className="px-6 py-4 text-gray-500">{deportista.disciplines?.label}</td>
                      <td className="px-6 py-4 text-gray-500">{deportista.position}</td>
                      <td className="px-6 py-4">
                        <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {deportista.overall_score}
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
                            onClick={(e) => { e.stopPropagation(); handleEdit(deportista); }}
                            className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" /> <span className="hidden sm:inline">Editar</span>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveHighlight(deportista.id); }}
                            className="bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Eliminar</span>
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
                                <p className="font-semibold text-gray-900 mb-1">Biografía / Info</p>
                                <p>{deportista.bio}</p>
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
          )}
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

      {isNewAthleteOpen && (
        <NewAthleteModal
          onClose={() => {
            setIsNewAthleteOpen(false);
            setEditingAthlete(null);
          }}
          onSave={handleSave}
          initialData={editingAthlete}
        />
      )}
    </div>
  );
}

function NewAthleteModal({ onClose, onSave, initialData }: { onClose: () => void, onSave: (atleta: any) => void, initialData?: any }) {
  const [name, setName] = useState(initialData?.name || '');
  const [age, setAge] = useState(initialData?.age?.toString() || '');
  const [school, setSchool] = useState(initialData?.school || '');
  const [sport_id, setSportId] = useState(initialData?.sport_id || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [overall_score, setOverallScore] = useState(initialData?.overall_score?.toString() || '85');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [height, setHeight] = useState(initialData?.height || '');
  const [weight, setWeight] = useState(initialData?.weight || '');
  const [disciplines, setDisciplines] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('disciplines').select('id, label').then(({ data }) => {
        if (data) {
            setDisciplines(data);
            if (!initialData && data.length > 0) setSportId(data[0].id);
        }
    });
  }, [initialData]);

  const handleSave = () => {
    if (!name || !sport_id) return;
    onSave({
      name,
      age: parseInt(age) || null,
      school,
      sport_id,
      position,
      overall_score: parseInt(overall_score) || 0,
      bio,
      height,
      weight
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">{initialData ? 'Editar Atleta' : 'Nuevo Atleta'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Lucas Rivera"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Edad</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ej: 15"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Escuela/Institución</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Ej: San Judas Tadeo"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Deporte</label>
              <select
                value={sport_id}
                onChange={(e) => setSportId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {disciplines.map(d => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Categoría/Posición</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Ej: Delantero"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ej: 175"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ej: 70"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Métricas LUNTU (Score Inicial)</label>
              <input
                type="range"
                min="0" max="100"
                value={overall_score}
                onChange={(e) => setOverallScore(e.target.value)}
                className="w-full accent-indigo-600"
              />
              <div className="text-right font-bold text-indigo-600">{overall_score} pts</div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Biografía</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !sport_id}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? 'Guardar Cambios' : 'Crear Atleta'}
          </button>
        </div>
      </div>
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

function PerfilDeportistaModal({ deportista, onClose }: { deportista: any, onClose: () => void }) {
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
            <div className="w-24 h-24 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
                <User className="w-12 h-12 text-gray-400" />
            </div>
            <div className="flex gap-3">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                {deportista.disciplines?.label}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                {deportista.position}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{deportista.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-sm font-bold flex items-center gap-1 w-fit">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                Score LUNTU: {deportista.overall_score}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" />
                Biografía
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {deportista.bio}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Edad</h4>
                <p className="text-lg font-bold text-gray-900">{deportista.age} años</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Escuela</h4>
                <p className="text-lg font-bold text-gray-900">{deportista.school}</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Altura</h4>
                <p className="text-lg font-bold text-gray-900">{deportista.height} cm</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Peso</h4>
                <p className="text-lg font-bold text-gray-900">{deportista.weight} kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
