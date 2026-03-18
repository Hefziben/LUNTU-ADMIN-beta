import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, X, Search, Filter, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Colegios() {
  const [colegios, setColegios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchColegios();
  }, []);

  const fetchColegios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('colegios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast('Error al cargar colegios', 'error');
    } else {
      setColegios(data || []);
    }
    setLoading(false);
  };

  const showToast = (title: string, type: 'success' | 'error') => {
    setToastMessage({ title, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este colegio?')) return;

    const { error } = await supabase
      .from('colegios')
      .delete()
      .eq('id', id);

    if (error) {
      showToast('Error al eliminar colegio', 'error');
    } else {
      setColegios(colegios.filter(c => c.id !== id));
      showToast('Colegio eliminado correctamente', 'success');
    }
  };

  const filteredColegios = colegios.filter(c => 
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.deporte_principal && c.deporte_principal.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Colegios</h2>
          <p className="text-sm text-gray-500 mt-1">Administra los colegios registrados en la plataforma.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Colegio
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
            placeholder="Buscar por nombre o deporte..."
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
                  <th className="px-6 py-4 font-semibold">Nombre del Colegio</th>
                  <th className="px-6 py-4 font-semibold">Deporte Principal</th>
                  <th className="px-6 py-4 font-semibold">Miembros</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredColegios.map((colegio) => (
                  <tr key={colegio.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      {colegio.nombre}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {colegio.deporte_principal}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{colegio.miembros} atletas</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        colegio.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {colegio.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(colegio.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredColegios.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Filter className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-base font-medium text-gray-900">No se encontraron colegios</p>
                        <p className="text-sm mt-1">No hay colegios que coincidan con la búsqueda.</p>
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
        <NewColegioModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={async (newColegio) => {
            const { data, error } = await supabase
              .from('colegios')
              .insert([newColegio])
              .select();

            if (error) {
              showToast('Error al crear colegio', 'error');
            } else {
              setColegios([data[0], ...colegios]);
              setIsModalOpen(false);
              showToast('Colegio creado exitosamente', 'success');
            }
          }} 
        />
      )}
    </div>
  );
}

function NewColegioModal({ onClose, onSave }: { onClose: () => void, onSave: (colegio: any) => void }) {
  const [nombre, setNombre] = useState('');
  const [deporte_principal, setDeportePrincipal] = useState('');
  const [miembros, setMiembros] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [disciplines, setDisciplines] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('disciplines').select('label').then(({ data }) => {
        if (data) {
            setDisciplines(data);
            if (data.length > 0) setDeportePrincipal(data[0].label);
        }
    });
  }, []);

  const handleSave = () => {
    if (!nombre || !miembros) return;
    onSave({ nombre, deporte_principal, miembros: parseInt(miembros), estado });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Nuevo Colegio</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre del Colegio</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Colegio San Agustín"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Deporte Principal</label>
            <select 
              value={deporte_principal}
              onChange={(e) => setDeportePrincipal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow"
            >
              {disciplines.map(d => (
                <option key={d.label} value={d.label}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Número de Miembros</label>
            <input 
              type="number" 
              value={miembros}
              onChange={(e) => setMiembros(e.target.value)}
              placeholder="Ej: 120"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select 
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm rounded-lg transition-all">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!nombre || !miembros}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Colegio
          </button>
        </div>
      </div>
    </div>
  );
}
