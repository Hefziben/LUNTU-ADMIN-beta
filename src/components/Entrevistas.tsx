import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Instagram, Video, Calendar, User, X, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Entrevistas() {
  const [entrevistas, setEntrevistas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIgConnected, setIsIgConnected] = useState(false);
  const [editingEntrevista, setEditingEntrevista] = useState<any>(null);

  useEffect(() => {
    fetchEntrevistas();
  }, []);

  const fetchEntrevistas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entrevistas')
      .select('*')
      .order('fecha', { ascending: false });

    if (!error) {
      setEntrevistas(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta entrevista?')) {
      const { error } = await supabase.from('entrevistas').delete().eq('id', id);
      if (!error) {
        setEntrevistas(entrevistas.filter(e => e.id !== id));
      }
    }
  };

  const handleEdit = (entrevista: any) => {
    setEditingEntrevista(entrevista);
    setIsModalOpen(true);
  };

  const handleConnectIg = () => {
    setIsIgConnected(!isIgConnected);
  };

  const handleSave = async (savedEntrevista: any) => {
    if (editingEntrevista) {
      const { data, error } = await supabase
        .from('entrevistas')
        .update(savedEntrevista)
        .eq('id', editingEntrevista.id)
        .select();

      if (!error && data) {
        setEntrevistas(entrevistas.map(e => e.id === editingEntrevista.id ? data[0] : e));
      }
    } else {
      const { data, error } = await supabase
        .from('entrevistas')
        .insert([savedEntrevista])
        .select();

      if (!error && data) {
        setEntrevistas([data[0], ...entrevistas]);
      }
    }
    setIsModalOpen(false);
    setEditingEntrevista(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Entrevistas Exclusivas</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona y publica entrevistas con atletas y entrenadores.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleConnectIg}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              isIgConnected 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Instagram className="w-4 h-4" />
            {isIgConnected ? 'Instagram Conectado' : 'Conectar Instagram'}
          </button>
          <button 
            onClick={() => {
              setEditingEntrevista(null);
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear Entrevista
          </button>
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
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                  <th className="px-6 py-4 font-medium w-32">Portada</th>
                  <th className="px-6 py-4 font-medium">Título</th>
                  <th className="px-6 py-4 font-medium">Entrevistado</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entrevistas.map((entrevista) => (
                  <tr key={entrevista.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-24 h-14 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <img src={entrevista.portada_url} alt={entrevista.titulo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{entrevista.titulo}</td>
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2 mt-2">
                      <User className="w-4 h-4" /> {entrevista.entrevistado}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {entrevista.fecha}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        entrevista.estado === 'Publicado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {entrevista.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          title="Compartir en Instagram"
                          disabled={!isIgConnected}
                          className={`p-2 rounded-lg ${
                            isIgConnected ? 'text-pink-600 hover:bg-pink-50' : 'text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          <Instagram className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(entrevista)}
                          className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entrevista.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {entrevistas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No hay entrevistas creadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <NewEntrevistaModal 
          onClose={() => {
            setIsModalOpen(false);
            setEditingEntrevista(null);
          }} 
          onSave={handleSave} 
          initialData={editingEntrevista}
        />
      )}
    </div>
  );
}

function NewEntrevistaModal({ onClose, onSave, initialData }: { onClose: () => void, onSave: (entrevista: any) => void, initialData?: any }) {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [entrevistado, setEntrevistado] = useState(initialData?.entrevistado || '');
  const [fecha, setFecha] = useState(initialData?.fecha || '');
  const [video_url, setVideoUrl] = useState(initialData?.video_url || '');
  const [estado, setEstado] = useState(initialData?.estado || 'Borrador');
  const [portada_url, setPortadaUrl] = useState<string | null>(initialData?.portada_url || null);
  const [contenido, setContenido] = useState(initialData?.contenido || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortadaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!titulo || !entrevistado || !fecha || !portada_url) return;
    onSave({ 
      titulo,
      entrevistado,
      fecha,
      video_url,
      estado,
      portada_url,
      contenido
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {initialData ? 'Editar Entrevista' : 'Crear Nueva Entrevista'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Título de la Entrevista</label>
              <input 
                type="text" 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: El camino al éxito con Diego Martínez"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Entrevistado (Atleta/Entrenador)</label>
              <input 
                type="text" 
                value={entrevistado}
                onChange={(e) => setEntrevistado(e.target.value)}
                placeholder="Ej: Diego Martínez"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
              <input 
                type="date" 
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Enlace del Video (YouTube, Vimeo, etc.)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="url" 
                  value={video_url}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Contenido / Redacción</label>
              <textarea 
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribe el contenido o resumen de la entrevista aquí..."
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select 
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="Borrador">Borrador</option>
                <option value="Publicado">Publicado</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Portada de la Entrevista</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {portada_url ? (
                  <img src={portada_url} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-gray-500 py-4">
                    <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900 mb-1">Haz clic para subir una imagen</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!titulo || !entrevistado || !fecha || !portada_url}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? 'Guardar Cambios' : 'Guardar Entrevista'}
          </button>
        </div>
      </div>
    </div>
  );
}
