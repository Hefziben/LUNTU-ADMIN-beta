import React, { useState, useEffect } from 'react';
import { PlaySquare, Trash2, Eye, ThumbsUp, Edit2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Highlights() {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    setLoading(true);
    // athlete_videos seems to be the table for highlights
    const { data, error } = await supabase
      .from('athlete_videos')
      .select('*, athletes(name, disciplines(label))')
      .order('created_at', { ascending: false });

    if (!error) {
      setHighlights(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar highlight?')) {
      const { error } = await supabase.from('athlete_videos').delete().eq('id', id);
      if (!error) {
        setHighlights(highlights.filter(h => h.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">LUNTU Highlights</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
        >
          <PlaySquare className="w-4 h-4" />
          Subir Video
        </button>
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
                  <th className="px-6 py-4 font-medium w-32">Video</th>
                  <th className="px-6 py-4 font-medium">Título</th>
                  <th className="px-6 py-4 font-medium">Atleta</th>
                  <th className="px-6 py-4 font-medium">Deporte</th>
                  <th className="px-6 py-4 font-medium">Métricas</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {highlights.map((highlight) => (
                  <tr key={highlight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="relative w-24 h-14 bg-gray-100 rounded-md overflow-hidden group cursor-pointer border border-gray-200">
                        {/* We use url as thumbnail for mock if it's an image, or just a placeholder */}
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-xs">
                           VIDEO
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlaySquare className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{highlight.title}</td>
                    <td className="px-6 py-4 text-gray-500">{highlight.athletes?.name}</td>
                    <td className="px-6 py-4 text-gray-500">{highlight.athletes?.disciplines?.label}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {highlight.views || 0}</span>
                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {highlight.likes || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(highlight.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {highlights.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No hay highlights cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <NewHighlightModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={async (newHighlight) => {
            // Need an athlete_id, for mock we'll skip or use a default
            const { data, error } = await supabase.from('athlete_videos').insert([newHighlight]).select('*, athletes(name, disciplines(label))');
            if (!error && data) {
              setHighlights([data[0], ...highlights]);
              setIsModalOpen(false);
            }
          }} 
        />
      )}
    </div>
  );
}

function NewHighlightModal({ onClose, onSave }: { onClose: () => void, onSave: (highlight: any) => void }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !url) return;
    onSave({ title, url, description, views: '0', likes: '0', date_label: 'Hoy' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Subir Video (Highlight)</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Título del Video</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Golazo de tiro libre..."
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL del Video</label>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional..."
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!title || !url}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Video
          </button>
        </div>
      </div>
    </div>
  );
}
