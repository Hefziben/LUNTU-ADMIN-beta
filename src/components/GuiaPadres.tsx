import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, X, Image as ImageIcon, BookOpen, Tag } from 'lucide-react';

const initialGuides = [
  { id: 1, title: 'Cómo apoyar a tu hijo después de una derrota', category: 'Psicología', date: '2026-03-02', author: 'Dra. María Gómez', status: 'Publicado', image: 'https://picsum.photos/seed/padres1/800/400', content: 'Es fundamental entender que la derrota es parte del proceso de aprendizaje...' },
  { id: 2, title: 'Nutrición pre-competencia: Qué deben comer', category: 'Nutrición', date: '2026-03-06', author: 'Lic. Juan Pérez', status: 'Borrador', image: 'https://picsum.photos/seed/padres2/800/400', content: 'Una correcta alimentación antes de competir puede marcar la diferencia en el rendimiento...' },
  { id: 3, title: 'Equilibrando los estudios y el deporte de alto rendimiento', category: 'Educación', date: '2026-03-08', author: 'Equipo LUNTU', status: 'Publicado', image: 'https://picsum.photos/seed/padres3/800/400', content: 'Consejos prácticos para ayudar a los jóvenes atletas a mantener buenas calificaciones sin descuidar sus entrenamientos...' },
];

export function GuiaPadres() {
  const [guides, setGuides] = useState(initialGuides);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    setGuides(guides.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guía para Padres</h2>
          <p className="text-gray-500 mt-1">Gestiona los artículos y recursos educativos para padres.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Artículo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Imagen</th>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img src={guide.image} alt={guide.title} className="w-16 h-16 object-cover rounded-lg border border-gray-200" referrerPolicy="no-referrer" />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" title={guide.title}>{guide.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Tag className="w-3.5 h-3.5" />
                      {guide.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {guide.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      guide.status === 'Publicado' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {guide.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(guide.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {guides.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay artículos publicados en la guía para padres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <NewGuideModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(newGuide) => {
            setGuides([{ ...newGuide, id: Date.now() }, ...guides]);
            setIsModalOpen(false);
          }} 
        />
      )}
    </div>
  );
}

function NewGuideModal({ onClose, onSave }: { onClose: () => void, onSave: (guide: any) => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Psicología');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Borrador');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title || !category || !author || !date || !image || !content) return;
    onSave({ title, category, author, date, status, content, image });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Redactar Artículo para Padres
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Título del Artículo</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cómo apoyar a tu hijo..."
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="Psicología">Psicología</option>
                <option value="Nutrición">Nutrición</option>
                <option value="Educación">Educación</option>
                <option value="Entrenamiento">Entrenamiento</option>
                <option value="Salud">Salud y Lesiones</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Autor</label>
              <input 
                type="text" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ej: Dra. María Gómez"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fecha</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
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
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Contenido del Artículo</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el contenido del artículo aquí..."
              rows={6}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y"
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
              {image ? (
                <img src={image} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
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
            disabled={!title || !category || !author || !date || !image || !content}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Artículo
          </button>
        </div>
      </div>
    </div>
  );
}
