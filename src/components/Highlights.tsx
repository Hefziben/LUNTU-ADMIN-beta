import React, { useState } from 'react';
import { PlaySquare, Trash2, Eye, ThumbsUp, Edit2, X, Image as ImageIcon } from 'lucide-react';

const initialHighlights = [
  { id: 1, title: 'Golazo de tiro libre', athlete: 'Diego Martínez', sport: 'Fútbol', views: 1200, likes: 340, thumbnail: 'https://picsum.photos/seed/goal/400/225' },
  { id: 2, title: 'Saque asombroso', athlete: 'Ana Silva', sport: 'Tenis', views: 850, likes: 210, thumbnail: 'https://picsum.photos/seed/serve/400/225' },
  { id: 3, title: 'Llegada de infarto', athlete: 'Luis Pérez', sport: 'Natación', views: 2300, likes: 890, thumbnail: 'https://picsum.photos/seed/swim/400/225' },
];

export function Highlights() {
  const [highlights, setHighlights] = useState(initialHighlights);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    setHighlights(highlights.filter(h => h.id !== id));
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium w-32">Miniatura</th>
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
                      <img src={highlight.thumbnail} alt={highlight.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlaySquare className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{highlight.title}</td>
                  <td className="px-6 py-4 text-gray-500">{highlight.athlete}</td>
                  <td className="px-6 py-4 text-gray-500">{highlight.sport}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {highlight.views}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {highlight.likes}</span>
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
        </div>
      </div>

      {isModalOpen && (
        <NewHighlightModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(newHighlight) => {
            setHighlights([{ ...newHighlight, id: Date.now(), views: 0, likes: 0 }, ...highlights]);
            setIsModalOpen(false);
          }} 
        />
      )}
    </div>
  );
}

function NewHighlightModal({ onClose, onSave }: { onClose: () => void, onSave: (highlight: any) => void }) {
  const [title, setTitle] = useState('');
  const [athlete, setAthlete] = useState('');
  const [sport, setSport] = useState('Fútbol');
  const [thumbnail, setThumbnail] = useState<string | null>(null);

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
    if (!title || !athlete || !thumbnail) return;
    onSave({ title, athlete, sport, thumbnail });
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
            <label className="block text-sm font-medium text-gray-700">Atleta</label>
            <input 
              type="text" 
              value={athlete}
              onChange={(e) => setAthlete(e.target.value)}
              placeholder="Ej: Diego Martínez"
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
            <label className="block text-sm font-medium text-gray-700">Miniatura del Video (Thumbnail)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {thumbnail ? (
                <img src={thumbnail} alt="Preview" className="max-h-32 mx-auto rounded-lg object-contain" />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm">Haz clic o arrastra una imagen aquí</p>
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
            disabled={!title || !athlete || !thumbnail}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Video
          </button>
        </div>
      </div>
    </div>
  );
}
