import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Newspaper, Calendar, Tag, ExternalLink, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setNews(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar noticia?')) {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (!error) {
        setNews(news.filter(n => n.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Noticias y Actualidad</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona las noticias que aparecen en el feed de la aplicación.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Noticia
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
                  <th className="px-6 py-4 font-medium w-32">Imagen</th>
                  <th className="px-6 py-4 font-medium">Título</th>
                  <th className="px-6 py-4 font-medium">Etiqueta</th>
                  <th className="px-6 py-4 font-medium">Fuente</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-24 h-14 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium border border-indigo-100">
                        {item.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      <div className="flex flex-col">
                        <span>{item.source}</span>
                        <span className="text-xs text-gray-400">{item.time_ago}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {news.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No hay noticias publicadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <NewNewsModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={async (newItem) => {
            const { data, error } = await supabase.from('news').insert([newItem]).select();
            if (!error && data) {
              setNews([data[0], ...news]);
              setIsModalOpen(false);
            }
          }} 
        />
      )}
    </div>
  );
}

function NewNewsModal({ onClose, onSave }: { onClose: () => void, onSave: (news: any) => void }) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Nacional');
  const [source, setSource] = useState('Lutu News');
  const [content, setContent] = useState('');
  const [image_url, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title || !tag || !source || !image_url) return;
    onSave({ title, tag, source, content, image_url, time_ago: 'Ahora' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Nueva Noticia</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Título de la Noticia</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Dominicana brilla en los Juegos..."
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Etiqueta / Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="Nacional">Nacional</option>
                <option value="Internacional">Internacional</option>
                <option value="Oportunidad">Oportunidad</option>
                <option value="Tech">Tech</option>
                <option value="Eventos">Eventos</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fuente</label>
              <input 
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Ej: Lutu News"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Contenido</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el cuerpo de la noticia aquí..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Imagen de Portada</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {image_url ? (
                <img src={image_url} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm">Sube una imagen para la noticia</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!title || !image_url}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publicar Noticia
          </button>
        </div>
      </div>
    </div>
  );
}
