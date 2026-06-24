import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Mail, Phone, FileText, X, Search, Filter, CheckCircle2, Loader2, Eye, Award, Clock, Briefcase, Star, ShieldCheck, FileType } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Entrenadores() {
  const [entrenadores, setEntrenadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEntrenador, setEditingEntrenador] = useState<any>(null);
  const [viewingEntrenador, setViewingEntrenador] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      // First try user_profiles as requested by the user
      // We try both phone and telefono to be safe
      let { data, error } = await supabase
        .from('coaches')
        .select('*, user_profiles(name, email, phone, telefono)')
        .order('name', { ascending: true });

      // Fallback to profiles if user_profiles doesn't exist
      if (error && (error.message.includes('user_profiles') || error.message.includes('relation "user_profiles" does not exist'))) {
        const { data: pData, error: pError } = await supabase
          .from('coaches')
          .select('*, profiles(name, email, phone, telefono)')
          .order('name', { ascending: true });
        data = pData;
        error = pError;
      }

      if (error) {
        console.error('Error fetching coaches:', error);
        showToast('Error al cargar entrenadores', 'error');
      } else {
        // Map data to use values from profile/user_profile if available
        const mappedData = data?.map(coach => {
          const profile = coach.user_profiles || coach.profiles;
          return {
            ...coach,
            name: profile?.name || coach.name,
            email: profile?.email || coach.email,
            phone: profile?.phone || profile?.telefono || coach.phone
          };
        });
        setEntrenadores(mappedData || []);
      }
    } catch (e) {
      console.error('Exception fetching coaches:', e);
      showToast('Error de conexión', 'error');
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
      } else {
        console.error('Delete error:', error);
        showToast('Error al eliminar entrenador', 'error');
      }
    }
  };

  const handleEdit = (entrenador: any) => {
    setEditingEntrenador(entrenador);
    setIsModalOpen(true);
  };

  const handleView = (entrenador: any) => {
    setViewingEntrenador(entrenador);
    setIsViewModalOpen(true);
  };

  const handleSave = async (newEntrenador: any) => {
    if (editingEntrenador) {
      const { data, error } = await supabase
        .from('coaches')
        .update(newEntrenador)
        .eq('id', editingEntrenador.id)
        .select('*, user_profiles(name, email, phone, telefono)');

      let resultData = data;
      let resultError = error;

      if (resultError && (resultError.message.includes('user_profiles') || resultError.message.includes('relation "user_profiles" does not exist'))) {
          const { data: pData, error: pError } = await supabase
            .from('coaches')
            .update(newEntrenador)
            .eq('id', editingEntrenador.id)
            .select('*, profiles(name, email, phone, telefono)');
          resultData = pData;
          resultError = pError;
      }

      if (!resultError && resultData) {
        const profile = resultData[0].user_profiles || resultData[0].profiles;
        const updated = {
            ...resultData[0],
            name: profile?.name || resultData[0].name,
            email: profile?.email || resultData[0].email,
            phone: profile?.phone || profile?.telefono || resultData[0].phone
        };
        setEntrenadores(entrenadores.map(e => e.id === editingEntrenador.id ? updated : e));
        setIsModalOpen(false);
        setEditingEntrenador(null);
        showToast('Entrenador actualizado exitosamente', 'success');
      } else {
        console.error('Update error:', resultError);
        showToast('Error al actualizar entrenador', 'error');
      }
    } else {
      const { data, error } = await supabase.from('coaches').insert([newEntrenador]).select('*, user_profiles(name, email, phone, telefono)');

      let resultData = data;
      let resultError = error;

      if (resultError && (resultError.message.includes('user_profiles') || resultError.message.includes('relation "user_profiles" does not exist'))) {
          const { data: pData, error: pError } = await supabase.from('coaches').insert([newEntrenador]).select('*, profiles(name, email, phone, telefono)');
          resultData = pData;
          resultError = pError;
      }

      if (!resultError && resultData) {
        const profile = resultData[0].user_profiles || resultData[0].profiles;
        const created = {
            ...resultData[0],
            name: profile?.name || resultData[0].name,
            email: profile?.email || resultData[0].email,
            phone: profile?.phone || profile?.telefono || resultData[0].phone
        };
        setEntrenadores([created, ...entrenadores]);
        setIsModalOpen(false);
        showToast('Entrenador creado exitosamente', 'success');
      } else {
        console.error('Insert error:', resultError);
        showToast('Error al crear entrenador en la base de datos', 'error');
      }
    }
  };

  const filteredEntrenadores = entrenadores.filter(e => 
    (e.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (e.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (e.specialty?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (e.affiliation?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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
          onClick={() => {
            setEditingEntrenador(null);
            setIsModalOpen(true);
          }}
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
            placeholder="Buscar por nombre, email, especialidad..."
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
                  <th className="px-6 py-4 font-semibold">Nombre</th>
                  <th className="px-6 py-4 font-semibold">Contacto</th>
                  <th className="px-6 py-4 font-semibold">Especialidad</th>
                  <th className="px-6 py-4 font-semibold">Experiencia</th>
                  <th className="px-6 py-4 font-semibold">Afiliación</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEntrenadores.map((entrenador) => (
                  <tr key={entrenador.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 overflow-hidden border border-gray-100">
                        {entrenador.image_url ? (
                          <img src={entrenador.image_url} alt={entrenador.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <span className="truncate max-w-[150px]">{entrenador.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gray-400" /> {entrenador.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" /> {entrenador.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {entrenador.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{entrenador.experience}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{entrenador.affiliation}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-sm font-medium text-gray-700">{entrenador.rating}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            entrenador.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                            entrenador.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                        }`}>
                            {entrenador.verification_status || 'pending'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleView(entrenador)}
                          title="Ver Detalles"
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(entrenador)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors edit-btn" title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entrenador.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors delete-btn"
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
                    <td colSpan={8} className="px-6 py-12 text-center">
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
          onClose={() => {
            setIsModalOpen(false);
            setEditingEntrenador(null);
          }} 
          onSave={handleSave}
          initialData={editingEntrenador}
        />
      )}

      {isViewModalOpen && viewingEntrenador && (
        <ViewEntrenadorModal
          entrenador={viewingEntrenador}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingEntrenador(null);
          }}
        />
      )}
    </div>
  );
}

function ViewEntrenadorModal({ entrenador, onClose }: { entrenador: any, onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900">Detalles del Entrenador</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div className="w-24 h-24 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 overflow-hidden border-2 border-indigo-100 shadow-sm">
                            {entrenador.image_url ? (
                                <img src={entrenador.image_url} alt={entrenador.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10" />
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">{entrenador.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    entrenador.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                                    entrenador.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-amber-100 text-amber-800'
                                }`}>
                                    {entrenador.verification_status || 'pending'}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <Award className="w-4 h-4 text-indigo-500" />
                                    {entrenador.specialty}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-indigo-500" />
                                    {entrenador.affiliation}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    {entrenador.rating} Rating
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Información de Contacto</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>{entrenador.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{entrenador.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Trayectoria</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>Experiencia: {entrenador.experience}</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Biografía</h4>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed border border-gray-100">
                                {entrenador.bio || 'Sin biografía disponible.'}
                            </p>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Documentación</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {entrenador.id_card_url ? (
                                    <a
                                        href={entrenador.id_card_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl border bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                                    >
                                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Documento Identidad</p>
                                            <p className="text-xs text-gray-500 truncate">Ver Documento</p>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50 border-gray-100 opacity-50">
                                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Documento Identidad</p>
                                            <p className="text-xs text-gray-500 truncate">No disponible</p>
                                        </div>
                                    </div>
                                )}

                                {entrenador.certificate_url ? (
                                    <a
                                        href={entrenador.certificate_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl border bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                                    >
                                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                            <FileType className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Certificado / Licencia</p>
                                            <p className="text-xs text-gray-500 truncate">Ver Documento</p>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50 border-gray-100 opacity-50">
                                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                            <FileType className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Certificado / Licencia</p>
                                            <p className="text-xs text-gray-500 truncate">No disponible</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm rounded-lg transition-all">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

function NewEntrenadorModal({ onClose, onSave, initialData }: { onClose: () => void, onSave: (entrenador: any) => void, initialData?: any }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    specialty: initialData?.specialty || '',
    affiliation: initialData?.affiliation || '',
    experience: initialData?.experience || '',
    bio: initialData?.bio || '',
    image_url: initialData?.image_url || '',
    rating: initialData?.rating || '5.0',
    id_card_url: initialData?.id_card_url || '',
    certificate_url: initialData?.certificate_url || '',
    verification_status: initialData?.verification_status || 'pending'
  });
  const [disciplines, setDisciplines] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('disciplines').select('label').then(({ data }) => {
        if (data) {
            setDisciplines(data);
            if (!initialData && data.length > 0 && !formData.specialty) {
                setFormData(prev => ({ ...prev, specialty: data[0].label }));
            }
        }
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">{initialData ? 'Editar Entrenador' : 'Nuevo Entrenador'}</h3>
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
                name="name"
                id="coach-name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Carlos Ruiz"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: carlos@luntu.com"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: +507 6123-4567"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Especialidad</label>
              <select 
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow"
              >
                <option value="">Seleccionar especialidad</option>
                {disciplines.map(d => (
                  <option key={d.label} value={d.label}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Afiliación (Club/Colegio)</label>
              <input 
                type="text"
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                placeholder="Ej: Club Deportivo LUNTU"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Experiencia</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Ej: 5 años, Senior, etc."
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Calificación (Rating)</label>
              <input
                type="text"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="Ej: 4.8"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Biografía</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Breve descripción del entrenador..."
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">URL Imagen de Perfil</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Estado de Verificación</label>
              <select
                name="verification_status"
                value={formData.verification_status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow"
              >
                <option value="pending">Pendiente</option>
                <option value="verified">Verificado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">URL Documento Identidad</label>
              <input
                type="text"
                name="id_card_url"
                value={formData.id_card_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">URL Certificado / Licencia</label>
              <input
                type="text"
                name="certificate_url"
                value={formData.certificate_url}
                onChange={handleChange}
                placeholder="https://..."
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
            disabled={!formData.name || !formData.email}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? 'Guardar Cambios' : 'Guardar Entrenador'}
          </button>
        </div>
      </div>
    </div>
  );
}
