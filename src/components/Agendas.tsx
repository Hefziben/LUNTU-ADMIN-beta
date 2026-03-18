import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, X, Search, Filter, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Agendas() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Entrenador');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('coach_events')
      .select('*, coaches(name)')
      .order('date_label', { ascending: true });

    if (!error) {
      setAgendas(data || []);
    }
    setLoading(false);
  };

  const showToast = (title: string, type: 'success' | 'error') => {
    setToastMessage({ title, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar evento?')) {
      const { error } = await supabase.from('coach_events').delete().eq('id', id);
      if (!error) {
        setAgendas(agendas.filter(a => a.id !== id));
        showToast('Agenda eliminada correctamente', 'success');
      }
    }
  };

  // Note: We'll filter based on the type if available, otherwise fallback.
  // For this exercise, we assume the remote data has some 'type' and 'title'.
  const filteredAgendas = agendas.filter(a => 
    (a.type === activeTab || (activeTab === 'Entrenador' && !a.type)) &&
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (a.coaches?.name && a.coaches.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
     (a.location && a.location.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'} animate-in slide-in-from-top-2 fade-in duration-300`}>
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium text-sm">{toastMessage.title}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Agendas</h2>
          <p className="text-sm text-gray-500 mt-1">Administra los eventos y actividades programadas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Agenda
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-lg overflow-x-auto w-full sm:w-auto">
          {['Entrenador', 'Club', 'Colegio'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {tab === 'Entrenador' ? 'Entrenadores' : tab === 'Club' ? 'Clubes' : 'Colegios'}
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {agendas.filter(a => a.type === tab || (tab === 'Entrenador' && !a.type)).length}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar evento, creador o lugar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>
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
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold">Título del Evento</th>
                  <th className="px-6 py-4 font-semibold">Creador</th>
                  <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                  <th className="px-6 py-4 font-semibold">Ubicación</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAgendas.map((agenda) => (
                  <tr key={agenda.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">{agenda.title}</td>
                    <td className="px-6 py-4 text-gray-500">{agenda.coaches?.name || 'Administrador'}</td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-500" /> {agenda.date_label}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> {agenda.time_label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="flex items-center gap-1 text-sm bg-gray-100 px-2.5 py-1 rounded-md w-fit">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {agenda.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(agenda.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAgendas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Filter className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-base font-medium text-gray-900">No se encontraron agendas</p>
                        <p className="text-sm mt-1">No hay eventos que coincidan con los filtros actuales.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <NewAgendaModal 
          defaultRole={activeTab}
          onClose={() => setIsModalOpen(false)} 
          onSave={async (newAgenda) => {
            const { data, error } = await supabase.from('coach_events').insert([newAgenda]).select('*, coaches(name)');
            if (!error && data) {
              setAgendas([...agendas, data[0]]);
              setIsModalOpen(false);
              showToast('Agenda creada exitosamente', 'success');
            }
          }} 
        />
      )}
    </div>
  );
}

function NewAgendaModal({ defaultRole, onClose, onSave }: { defaultRole: string, onClose: () => void, onSave: (agenda: any) => void }) {
  const [title, setTitle] = useState('');
  const [date_label, setDateLabel] = useState('');
  const [time_label, setTimeLabel] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState(defaultRole);

  const handleSave = () => {
    if (!title || !date_label || !time_label || !location) return;
    onSave({ title, date_label, time_label, location, type });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Nueva Agenda</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Título del Evento</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Entrenamiento Sub-15"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tipo / Rol</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow"
              >
                <option value="Entrenador">Entrenador</option>
                <option value="Club">Club</option>
                <option value="Colegio">Colegio</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fecha</label>
              <input 
                type="date" 
                value={date_label}
                onChange={(e) => setDateLabel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Hora</label>
              <input 
                type="time" 
                value={time_label}
                onChange={(e) => setTimeLabel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Cancha 1"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm rounded-lg transition-all">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!title || !date_label || !time_label || !location}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Agenda
          </button>
        </div>
      </div>
    </div>
  );
}
