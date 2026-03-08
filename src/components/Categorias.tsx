import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Trophy, Filter, ChevronDown, ChevronUp, User, X } from 'lucide-react';

const initialCategorias = [
  { 
    id: 1, name: 'Sub-15 Masculino', sport: 'Fútbol', athletes: 450,
    athletesList: [
      { id: 101, name: 'Diego Martínez', age: 14, position: 'Delantero' },
      { id: 102, name: 'Carlos Ruiz Jr.', age: 15, position: 'Mediocampista' },
      { id: 103, name: 'Juan Pérez', age: 14, position: 'Defensa' }
    ]
  },
  { 
    id: 2, name: 'Sub-17 Femenino', sport: 'Fútbol', athletes: 320,
    athletesList: [
      { id: 201, name: 'María Gómez', age: 16, position: 'Portera' },
      { id: 202, name: 'Lucía Fernández', age: 17, position: 'Delantera' }
    ]
  },
  { id: 3, name: 'Pre-Infantil', sport: 'Béisbol', athletes: 150, athletesList: [] },
  { id: 4, name: 'Juvenil', sport: 'Baloncesto', athletes: 210, athletesList: [] },
  { id: 5, name: 'Cinturón Blanco-Naranja', sport: 'Karate', athletes: 85, athletesList: [] },
  { id: 6, name: 'Infantil', sport: 'Natación', athletes: 120, athletesList: [] },
  { id: 7, name: 'Nivel 3', sport: 'Gimnasia', athletes: 60, athletesList: [] },
];

const sportsList = ['Todos', 'Fútbol', 'Béisbol', 'Baloncesto', 'Karate', 'Natación', 'Gimnasia'];

export function Categorias() {
  const [categorias, setCategorias] = useState(initialCategorias);
  const [filter, setFilter] = useState('Todos');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    setCategorias(categorias.filter(c => c.id !== id));
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredCategorias = filter === 'Todos' ? categorias : categorias.filter(c => c.sport === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Categorías Deportivas</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtrar por deporte:</span>
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md text-sm py-1.5 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {sportsList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium w-16"></th>
                <th className="px-6 py-4 font-medium">Nombre de Categoría</th>
                <th className="px-6 py-4 font-medium">Deporte</th>
                <th className="px-6 py-4 font-medium">Atletas Registrados</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategorias.map((categoria) => (
                <React.Fragment key={categoria.id}>
                  <tr 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleExpand(categoria.id)}
                  >
                    <td className="px-6 py-4 text-gray-400">
                      {expandedId === categoria.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Trophy className="w-4 h-4" />
                      </div>
                      {categoria.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{categoria.sport}</td>
                    <td className="px-6 py-4 text-gray-500">{categoria.athletes}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); /* Edit logic */ }}
                          className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(categoria.id); }}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === categoria.id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="pl-16 pr-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-600" />
                            Atletas en esta categoría
                          </h4>
                          {categoria.athletesList && categoria.athletesList.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {categoria.athletesList.map(atleta => (
                                <div key={atleta.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                    <User className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{atleta.name}</p>
                                    <p className="text-xs text-gray-500">{atleta.age} años • {atleta.position}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No hay atletas detallados en esta categoría aún.</p>
                          )}
                          <button className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Añadir Atleta a la Categoría
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredCategorias.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay categorías registradas para este deporte.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <NewCategoriaModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(newCat) => {
            setCategorias([{ ...newCat, id: Date.now(), athletesList: [] }, ...categorias]);
            setIsModalOpen(false);
          }} 
        />
      )}
    </div>
  );
}

function NewCategoriaModal({ onClose, onSave }: { onClose: () => void, onSave: (cat: any) => void }) {
  const [name, setName] = useState('');
  const [sport, setSport] = useState('Fútbol');
  const [athletes, setAthletes] = useState('');

  const handleSave = () => {
    if (!name) return;
    onSave({ name, sport, athletes: parseInt(athletes) || 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Nueva Categoría</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Sub-15 Masculino"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Deporte</label>
            <select 
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="Fútbol">Fútbol</option>
              <option value="Béisbol">Béisbol</option>
              <option value="Baloncesto">Baloncesto</option>
              <option value="Tenis">Tenis</option>
              <option value="Natación">Natación</option>
              <option value="Karate">Karate</option>
              <option value="Gimnasia">Gimnasia</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Atletas Iniciales (Opcional)</label>
            <input 
              type="number" 
              value={athletes}
              onChange={(e) => setAthletes(e.target.value)}
              placeholder="Ej: 0"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!name}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Categoría
          </button>
        </div>
      </div>
    </div>
  );
}
