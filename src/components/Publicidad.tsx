import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Sparkles, Loader2, X, Eye, CheckCircle, XCircle, Calendar, DollarSign, Maximize, TrendingUp, Activity } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { clsx } from 'clsx';
import { supabase } from '../lib/supabase';

export function Publicidad() {
  const [banners, setBanners] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isNewBannerOpen, setIsNewBannerOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [bannersRes, requestsRes, clientsRes] = await Promise.all([
      supabase.from('publicidad_campanas').select('*, publicidad_clientes(nombre)').order('created_at', { ascending: false }),
      supabase.from('publicidad_solicitudes').select('*').order('created_at', { ascending: false }),
      supabase.from('publicidad_clientes').select('*').order('created_at', { ascending: false })
    ]);

    if (!bannersRes.error) setBanners(bannersRes.data || []);
    if (!requestsRes.error) setRequests(requestsRes.data || []);
    if (!clientsRes.error) setClients(clientsRes.data || []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta campaña?')) {
      const { error } = await supabase.from('publicidad_campanas').delete().eq('id', id);
      if (!error) setBanners(banners.filter(b => b.id !== id));
    }
  };

  const handleApproveRequest = async (id: number) => {
    const { error } = await supabase.from('publicidad_solicitudes').update({ estado: 'Aprobado' }).eq('id', id);
    if (!error) setRequests(requests.map(r => r.id === id ? { ...r, estado: 'Aprobado' } : r));
  };

  const handleRejectRequest = async (id: number) => {
    const { error } = await supabase.from('publicidad_solicitudes').update({ estado: 'Rechazado' }).eq('id', id);
    if (!error) setRequests(requests.map(r => r.id === id ? { ...r, estado: 'Rechazado' } : r));
  };

  const pendingRequestsCount = requests.filter(r => r.estado === 'Pendiente').length;

  const totalRevenue = banners.reduce((sum, banner) => sum + (Number(banner.ingresos) || 0), 0);
  const totalSpent = banners.reduce((sum, banner) => sum + Number(banner.gastado), 0);
  const totalBudget = banners.reduce((sum, banner) => sum + Number(banner.presupuesto), 0);
  const activeCampaigns = banners.filter(b => b.estado === 'Activo').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Publicidad</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAIOpen(true)}
            className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Image Editor
          </button>
          <button 
            onClick={() => setIsNewBannerOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Campaña
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Ingresos Totales" value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} />
            <StatCard title="Gasto Total" value={`$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={TrendingUp} />
            <StatCard title="Presupuesto Asignado" value={`$${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={Activity} />
            <StatCard title="Campañas Activas" value={activeCampaigns.toString()} icon={Eye} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Campañas Activas y Programadas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                    <th className="px-6 py-4 font-medium">Banner</th>
                    <th className="px-6 py-4 font-medium">Campaña</th>
                    <th className="px-6 py-4 font-medium">Tamaño</th>
                    <th className="px-6 py-4 font-medium">Fechas</th>
                    <th className="px-6 py-4 font-medium">Presupuesto</th>
                    <th className="px-6 py-4 font-medium">Ingresos</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img src={banner.imagen_url} alt={banner.titulo} className="w-24 h-12 object-cover rounded-md border border-gray-200" referrerPolicy="no-referrer" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{banner.titulo}</div>
                        {banner.publicidad_clientes?.nombre && <div className="text-sm text-gray-500">{banner.publicidad_clientes.nombre}</div>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <Maximize className="w-3 h-3" /> {banner.dimensiones}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {banner.fecha_inicio}</span>
                          <span className="flex items-center gap-1 text-gray-400">al {banner.fecha_fin}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">${Number(banner.gastado).toFixed(2)} gastado</span>
                          <span className="text-gray-500">de ${Number(banner.presupuesto).toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${(banner.gastado / banner.presupuesto) * 100}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-medium text-emerald-600">${(Number(banner.ingresos) || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          banner.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {banner.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50" title="Editar Campaña">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Eliminar Campaña"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {banners.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No hay campañas publicitarias.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Solicitud de Confección de Banner</h3>
              <p className="text-gray-500 text-sm">Gestiona las solicitudes de diseño de banners publicitarios de los clientes.</p>
            </div>
            <button
              onClick={() => setIsRequestsOpen(true)}
              className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg"
            >
              <Eye className="w-4 h-4" />
              Ver solicitudes pendientes ({pendingRequestsCount})
            </button>
          </div>

          {/* Lista de Clientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Lista de Clientes</h3>
              <button
                onClick={() => setIsNewClientOpen(true)}
                className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Nuevo Cliente
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                    <th className="px-6 py-4 font-medium">Cliente</th>
                    <th className="px-6 py-4 font-medium">Contacto</th>
                    <th className="px-6 py-4 font-medium">Campañas</th>
                    <th className="px-6 py-4 font-medium">Inversión Total</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{client.nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>{client.email}</span>
                          <span>{client.telefono}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{client.campanas_totales}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${Number(client.inversion_total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          client.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {client.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50" title="Editar Cliente">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm('¿Eliminar cliente?')) {
                                const { error } = await supabase.from('publicidad_clientes').delete().eq('id', client.id);
                                if (!error) setClients(clients.filter(c => c.id !== client.id));
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Eliminar Cliente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No hay clientes registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isAIOpen && (
        <AIImageEditorModal onClose={() => setIsAIOpen(false)} />
      )}

      {isNewBannerOpen && (
        <NewBannerModal 
          clients={clients}
          onClose={() => setIsNewBannerOpen(false)} 
          onSave={async (newBanner) => {
            const { data, error } = await supabase
              .from('publicidad_campanas')
              .insert([{ ...newBanner, gastado: 0, estado: 'Programado' }])
              .select('*, publicidad_clientes(nombre)');
            if (!error && data) {
              setBanners([data[0], ...banners]);
              setIsNewBannerOpen(false);
            }
          }} 
        />
      )}

      {isRequestsOpen && (
        <RequestsModal 
          requests={requests} 
          onClose={() => setIsRequestsOpen(false)} 
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}

      {isNewClientOpen && (
        <NewClientModal 
          onClose={() => setIsNewClientOpen(false)} 
          onSave={async (newClient) => {
            const { data, error } = await supabase
              .from('publicidad_clientes')
              .insert([newClient])
              .select();
            if (!error && data) {
              setClients([data[0], ...clients]);
              setIsNewClientOpen(false);
            }
          }} 
        />
      )}
    </div>
  );
}

function NewClientModal({ onClose, onSave }: { onClose: () => void, onSave: (client: any) => void }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSave = () => {
    if (!nombre || !email) return;
    onSave({
      nombre,
      email,
      telefono,
      campanas_totales: 0,
      inversion_total: 0,
      estado: 'Activo'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Nuevo Cliente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Empresa S.A."
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@empresa.com"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input 
              type="tel" 
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+507 6000-0000"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!nombre || !email}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

function NewBannerModal({ onClose, onSave, clients }: { onClose: () => void, onSave: (banner: any) => void, clients: any[] }) {
  const [titulo, setTitulo] = useState('');
  const [cliente_id, setClienteId] = useState('');
  const [fecha_inicio, setFechaInicio] = useState('');
  const [fecha_fin, setFechaFin] = useState('');
  const [dimensiones, setDimensiones] = useState('1080x1080');
  const [presupuesto, setPresupuesto] = useState('');
  const [ingresos, setIngresos] = useState('');
  const [imagen_url, setImagenUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!titulo || !fecha_inicio || !fecha_fin || !presupuesto || !imagen_url || !cliente_id) return;
    onSave({
      titulo,
      cliente_id: parseInt(cliente_id),
      fecha_inicio,
      fecha_fin,
      dimensiones,
      presupuesto: parseFloat(presupuesto),
      ingresos: ingresos ? parseFloat(ingresos) : 0,
      imagen_url
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Crear Nueva Campaña</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <div className="flex gap-2">
                <select 
                  value={cliente_id}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="">Seleccionar Cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nombre de la Campaña</label>
              <input 
                type="text" 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Campaña Verano 2026"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input 
                type="date" 
                value={fecha_inicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
              <input 
                type="date" 
                value={fecha_fin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tamaño del Banner</label>
              <select 
                value={dimensiones}
                onChange={(e) => setDimensiones(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="1080x1080">Feed Cuadrado (1080x1080)</option>
                <option value="1080x1920">Stories / Reels (1080x1920)</option>
                <option value="1200x628">Horizontal (1200x628)</option>
                <option value="728x90">Leaderboard (728x90)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Presupuesto Total ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="number" 
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg py-2.5 pl-9 pr-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ingresos Esperados / Generados ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="number" 
                  value={ingresos}
                  onChange={(e) => setIngresos(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg py-2.5 pl-9 pr-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Creatividad (Imagen)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagen_url ? (
                  <img src={imagen_url} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm">Haz clic o arrastra el banner aquí</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!titulo || !fecha_inicio || !fecha_fin || !presupuesto || !imagen_url || !cliente_id}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear Campaña
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestsModal({ requests, onClose, onApprove, onReject }: { requests: any[], onClose: () => void, onApprove: (id: number) => void, onReject: (id: number) => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Solicitudes de Confección de Banners</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-0 overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200 sticky top-0">
                <th className="px-6 py-4 font-medium">Cliente / Solicitante</th>
                <th className="px-6 py-4 font-medium">Descripción y Detalles</th>
                <th className="px-6 py-4 font-medium">Tamaño</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{req.cliente_nombre}</div>
                    <div className="text-sm text-gray-500">{req.email}</div>
                    <div className="text-xs text-gray-400 mt-1">{req.fecha}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 max-w-xs">{req.descripcion}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {req.dimensiones}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      req.estado === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                      req.estado === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {req.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.estado === 'Pendiente' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onApprove(req.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200"
                          title="Aprobar Solicitud"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onReject(req.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                          title="Rechazar Solicitud"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay solicitudes pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AIImageEditorModal({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const mimeTypeMatch = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
      const base64Data = image.split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let newImageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          newImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (newImageUrl) {
        setImage(newImageUrl);
      } else {
        setError("No image was returned by the model.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to edit image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">AI Image Editor</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">1. Sube una imagen base</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {image ? (
                <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <ImageIcon className="w-10 h-10 mb-2 text-gray-400" />
                  <p>Haz clic o arrastra una imagen aquí</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">2. Describe los cambios (Ej: "Add a retro filter")</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Remove the person in the background..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-24"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg"
          >
            Cancelar
          </button>
          <button 
            onClick={handleEdit}
            disabled={!image || !prompt || isLoading}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generar Cambios</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string, value: string, icon: any }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
      <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
