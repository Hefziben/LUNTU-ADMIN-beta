import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Mail, Phone, FileText, X, Search, Filter, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Entrenadores() {
  const [entrenadores, setEntrenadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .order('name', { ascending: true });

    if (!error) {
      setEntrenadores(data || []);
    }
    setLoading(false);
  };

  const showToast = (title: string, type: 'success' | 'error') => {
    setToastMessage({ title, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar entrenador?')) {
      const { error } = await supabase.from('coaches').delete().eq('id', id);
      if (!error) {
        setEntrenadores(entrenadores.filter(e => e.id !== id));
        showToast('Entrenador eliminado correctamente', 'success');
      }
    }
  };

  const filteredEntrenadores = entrenadores.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (e.email && e.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (e.role && e.role.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Entrenadores</h2>
          <p className="text-sm text-gray-500 mt-1">Administra los entrenadores registrados en la plataforma.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Entrenador
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, email o especialidad..."
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
                  <th className="px-6 py-4 font-semibold">Perfil</th>
                  <th className="px-6 py-4 font-semibold">Contacto</th>
                  <th className="px-6 py-4 font-semibold">Especialidad</th>
                  <th className="px-6 py-4 font-semibold">Afiliación</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEntrenadores.map((entrenador) => (
                  <tr key={entrenador.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 overflow-hidden">
                        {entrenador.image_url ? (
                          <img src={entrenador.image_url} alt={entrenador.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      {entrenador.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gray-400" /> {entrenador.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" /> {entrenador.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {entrenador.specialty || entrenador.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{entrenador.affiliation}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Ver Contenido" className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entrenador.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEntrenadores.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Filter className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-base font-medium text-gray-900">No se encontraron entrenadores</p>
                        <p className="text-sm mt-1">No hay entrenadores que coincidan con la búsqueda.</p>
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
        <NewEntrenadorModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={async (newEntrenador) => {
            const { data, error } = await supabase.from('coaches').insert([newEntrenador]).select();
            if (!error && data) {
              setEntrenadores([...entrenadores, data[0]]);
              setIsModalOpen(false);
              showToast('Entrenador creado exitosamente', 'success');
            }
          }} 
        />
      )}
    </div>
  );
}

function NewEntrenadorModal({ onClose, onSave }: { onClose: () => void, onSave: (entrenador: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Fútbol');
  const [affiliation, setAffiliation] = useState('');

  const handleSave = () => {
    if (!name || !email) return;
    onSave({ name, email, phone, specialty, affiliation });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Nuevo Entrenador</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors">
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
                placeholder="Ej: Carlos Ruiz"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej: carlos@luntu.com"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: +507 6123-4567"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Especialidad</label>
              <select 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow"
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
              <label className="block text-sm font-medium text-gray-700">Afiliación (Club/Colegio)</label>
              <input 
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="Ej: Club Deportivo LUNTU"
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
            disabled={!name || !email}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Entrenador
          </button>
        </div>
      </div>
    </div>
  );
}
