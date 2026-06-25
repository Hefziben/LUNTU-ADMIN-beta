import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Filter, X, Loader2, Zap, Target, Dribbble, Waves, Activity, CircleDot, Shield, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { clsx } from 'clsx';

const AVAILABLE_ICONS = [
  { name: 'Zap', Icon: Zap },
  { name: 'Target', Icon: Target },
  { name: 'Dribbble', Icon: Dribbble },
  { name: 'Waves', Icon: Waves },
  { name: 'Activity', Icon: Activity },
  { name: 'CircleDot', Icon: CircleDot },
  { name: 'Shield', Icon: Shield },
  { name: 'Trophy', Icon: Trophy },
];

const AVAILABLE_COLORS = [
  { name: 'Esmeralda', bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600' },
  { name: 'Rojo', bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-600' },
  { name: 'Naranja', bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' },
  { name: 'Azul', bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
  { name: 'Lima', bg: 'bg-lime-500', light: 'bg-lime-50', text: 'text-lime-600' },
  { name: 'Ámbar', bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600' },
  { name: 'Pizarra', bg: 'bg-slate-800', light: 'bg-slate-100', text: 'text-slate-800' },
  { name: 'Indigo', bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600' },
];

export function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<any>(null);

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const fetchDisciplinas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('disciplines')
      .select('*')
      .order('label', { ascending: true });

    if (!error) {
      setDisciplinas(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar disciplina? Esto podría afectar a atletas y clubes asociados.')) {
      const { error } = await supabase.from('disciplines').delete().eq('id', id);
      if (!error) {
        setDisciplinas(disciplinas.filter(d => d.id !== id));
      } else {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };

  const handleEdit = (disciplina: any) => {
    setEditingDisciplina(disciplina);
    setIsModalOpen(true);
  };

  const handleSave = async (newDisc: any) => {
    if (editingDisciplina) {
      const { data, error } = await supabase
        .from('disciplines')
        .update(newDisc)
        .eq('id', editingDisciplina.id)
        .select();
      if (!error && data) {
        setDisciplinas(disciplinas.map(d => d.id === editingDisciplina.id ? data[0] : d));
        setIsModalOpen(false);
        setEditingDisciplina(null);
      } else if (error) {
        alert('Error al actualizar: ' + error.message);
      }
    } else {
      const { data, error } = await supabase.from('disciplines').insert([newDisc]).select();
      if (!error && data) {
        setDisciplinas([...disciplinas, data[0]].sort((a, b) => a.label.localeCompare(b.label)));
        setIsModalOpen(false);
      } else if (error) {
        alert('Error al crear: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Disciplinas Deportivas</h2>
        <button
          onClick={() => {
            setEditingDisciplina(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Disciplina
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
                  <th className="px-6 py-4 font-medium">Icono</th>
                  <th className="px-6 py-4 font-medium">Nombre (Label)</th>
                  <th className="px-6 py-4 font-medium">ID (Slug)</th>
                  <th className="px-6 py-4 font-medium">Colores</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {disciplinas.map((disciplina) => {
                  const Icon = getIcon(disciplina.icon_name);
                  return (
                    <tr key={disciplina.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", disciplina.light_color, disciplina.text_color)}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {disciplina.label}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{disciplina.id}</code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <div className={clsx("w-6 h-6 rounded border border-gray-200", disciplina.color)} title="Color Principal"></div>
                          <div className={clsx("w-6 h-6 rounded border border-gray-200", disciplina.light_color)} title="Color Claro"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(disciplina)}
                            className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(disciplina.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {disciplinas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No hay disciplinas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <DisciplinaModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingDisciplina(null);
          }}
          onSave={handleSave}
          initialData={editingDisciplina}
        />
      )}
    </div>
  );
}

function DisciplinaModal({ onClose, onSave, initialData }: { onClose: () => void, onSave: (disc: any) => void, initialData?: any }) {
  const [id, setId] = useState(initialData?.id || '');
  const [label, setLabel] = useState(initialData?.label || '');
  const [iconName, setIconName] = useState(initialData?.icon_name || AVAILABLE_ICONS[0].name);
  const [colorScheme, setColorScheme] = useState(
    AVAILABLE_COLORS.find(c => c.bg === initialData?.color) || AVAILABLE_COLORS[0]
  );

  const handleSave = () => {
    if (!id || !label) return;
    onSave({
      id,
      label,
      icon_name: iconName,
      color: colorScheme.bg,
      light_color: colorScheme.light,
      text_color: colorScheme.text
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">{initialData ? 'Editar Disciplina' : 'Nueva Disciplina'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ID de la Disciplina (Slug)</label>
            <input
              type="text"
              value={id}
              disabled={!!initialData}
              onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="Ej: futbol, artes-marciales"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
            {!initialData && <p className="text-xs text-gray-500 italic">El ID no podrá ser cambiado después.</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre Visible (Label)</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej: Fútbol, Artes Marciales"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Icono</label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map(({ name, Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setIconName(name)}
                  className={clsx(
                    "p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all",
                    iconName === name
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-gray-200 hover:bg-gray-50 text-gray-500"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-[10px]">{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Esquema de Colores</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_COLORS.map((scheme) => (
                <button
                  key={scheme.name}
                  type="button"
                  onClick={() => setColorScheme(scheme)}
                  className={clsx(
                    "p-2 rounded-lg border flex items-center gap-3 transition-all",
                    colorScheme.bg === scheme.bg
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className={clsx("w-6 h-6 rounded-full", scheme.bg)}></div>
                  <span className="text-xs font-medium text-gray-700">{scheme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Vista Previa</label>
            <div className="flex items-center gap-4">
              <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", colorScheme.light, colorScheme.text)}>
                {React.createElement(getIcon(iconName), { className: "w-7 h-7" })}
              </div>
              <div>
                <p className="font-bold text-gray-900">{label || 'Nombre de Disciplina'}</p>
                <p className="text-xs text-gray-500">ID: {id || 'slug'}</p>
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
            disabled={!id || !label}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? 'Guardar Cambios' : 'Guardar Disciplina'}
          </button>
        </div>
      </div>
    </div>
  );
}

function getIcon(iconName: string | undefined) {
  const iconObj = AVAILABLE_ICONS.find(i => i.name === iconName);
  return iconObj ? iconObj.Icon : Trophy;
}
