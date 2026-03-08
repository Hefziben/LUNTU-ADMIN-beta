import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Instagram, Video, Calendar, User, X, Image as ImageIcon, ExternalLink } from 'lucide-react';

const initialEntrevistas = [
  { id: 1, title: 'El camino al éxito', interviewee: 'Diego Martínez', date: '2026-03-05', status: 'Publicado', thumbnail: 'https://picsum.photos/seed/entrevista1/400/225', videoUrl: 'https://youtube.com', content: 'En esta entrevista exclusiva, Diego Martínez nos cuenta sus secretos para alcanzar el éxito en el deporte de alto rendimiento...' },
  { id: 2, title: 'Preparación mental en el Tenis', interviewee: 'Ana Silva', date: '2026-03-01', status: 'Borrador', thumbnail: 'https://picsum.photos/seed/entrevista2/400/225', videoUrl: 'https://vimeo.com', content: 'Ana Silva, psicóloga deportiva, explica la importancia de la preparación mental antes de un Grand Slam.' },
];

export function Entrevistas() {
  const [entrevistas, setEntrevistas] = useState(initialEntrevistas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIgConnected, setIsIgConnected] = useState(false);
  const [editingEntrevista, setEditingEntrevista] = useState<any>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta entrevista?')) {
      setEntrevistas(entrevistas.filter(e => e.id !== id));
    }
  };

  const handleEdit = (entrevista: any) => {
    setEditingEntrevista(entrevista);
    setIsModalOpen(true);
  };

  const handleConnectIg = () => {
    // Simulate Instagram connection
    setIsIgConnected(!isIgConnected);
  };

  const handleSave = (savedEntrevista: any) => {
    if (editingEntrevista) {
      setEntrevistas(entrevistas.map(e => e.id === savedEntrevista.id ? savedEntrevista : e));
    } else {
      setEntrevistas([{ ...savedEntrevista, id: Date.now() }, ...entrevistas]);
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
                      <img src={entrevista.thumbnail} alt={entrevista.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{entrevista.title}</td>
                  <td className="px-6 py-4 text-gray-500 flex items-center gap-2 mt-2">
                    <User className="w-4 h-4" /> {entrevista.interviewee}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {entrevista.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      entrevista.status === 'Publicado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {entrevista.status}
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
  const [title, setTitle] = useState(initialData?.title || '');
  const [interviewee, setInterviewee] = useState(initialData?.interviewee || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [status, setStatus] = useState(initialData?.status || 'Borrador');
  const [thumbnail, setThumbnail] = useState<string | null>(initialData?.thumbnail || null);
  const [content, setContent] = useState(initialData?.content || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title || !interviewee || !date || !thumbnail) return;
    onSave({ 
      id: initialData?.id,
      title, 
      interviewee, 
      date, 
      videoUrl, 
      status, 
      thumbnail,
      content
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: El camino al éxito con Diego Martínez"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Entrevistado (Atleta/Entrenador)</label>
              <input 
                type="text" 
                value={interviewee}
                onChange={(e) => setInterviewee(e.target.value)}
                placeholder="Ej: Diego Martínez"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Contenido / Redacción</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe el contenido o resumen de la entrevista aquí..."
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                {thumbnail ? (
                  <img src={thumbnail} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
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
            disabled={!title || !interviewee || !date || !thumbnail}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? 'Guardar Cambios' : 'Guardar Entrevista'}
          </button>
        </div>
      </div>
    </div>
  );
}
