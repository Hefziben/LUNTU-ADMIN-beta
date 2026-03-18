import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, Search, Filter, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type SolicitudStatus = 'Pendiente' | 'Aprobada' | 'Rechazada';

interface Solicitud {
  id: number;
  nombre: string;
  email: string;
  tipo: string;
  fecha: string;
  estado: SolicitudStatus;
  detalles?: string;
  documentos?: string[];
}

export function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SolicitudStatus>('Pendiente');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('solicitudes_registro')
      .select('*')
      .order('fecha', { ascending: false });

    if (!error) {
      setSolicitudes(data || []);
    }
    setLoading(false);
  };

  const filteredSolicitudes = solicitudes.filter(sol => 
    sol.estado === activeTab &&
    (sol.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
     sol.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     sol.tipo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStatusChange = async (id: number, newStatus: SolicitudStatus) => {
    const { error } = await supabase
      .from('solicitudes_registro')
      .update({ estado: newStatus })
      .eq('id', id);

    if (error) {
      showToast('Error al actualizar estado', 'error');
    } else {
      setSolicitudes(solicitudes.map(sol =>
        sol.id === id ? { ...sol, estado: newStatus } : sol
      ));
      setSelectedSolicitud(null);
      showToast(`Solicitud ${newStatus.toLowerCase()} exitosamente`, newStatus === 'Aprobada' ? 'success' : 'error');
    }
  };

  const showToast = (title: string, type: 'success' | 'error') => {
    setToastMessage({ title, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getStatusBadge = (status: SolicitudStatus) => {
    switch (status) {
      case 'Pendiente':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3.5 h-3.5" /> Pendiente</span>;
      case 'Aprobada':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3.5 h-3.5" /> Aprobada</span>;
      case 'Rechazada':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3.5 h-3.5" /> Rechazada</span>;
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'} animate-in slide-in-from-top-2 fade-in duration-300`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{toastMessage.title}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Solicitudes</h2>
          <p className="text-sm text-gray-500 mt-1">Revisa y aprueba las solicitudes de registro en la plataforma.</p>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-lg">
          {(['Pendiente', 'Aprobada', 'Rechazada'] as SolicitudStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {tab}s
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {solicitudes.filter(s => s.estado === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, email o tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>
      </div>

      {/* Table */}
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
                  <th className="px-6 py-4 font-semibold">Solicitante</th>
                  <th className="px-6 py-4 font-semibold">Tipo</th>
                  <th className="px-6 py-4 font-semibold">Fecha</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSolicitudes.map((sol) => (
                  <tr key={sol.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{sol.nombre}</span>
                        <span className="text-sm text-gray-500">{sol.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {sol.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sol.fecha}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(sol.estado)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSolicitud(sol)}
                        className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Ver Detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSolicitudes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Filter className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-base font-medium text-gray-900">No se encontraron solicitudes</p>
                        <p className="text-sm mt-1">No hay solicitudes que coincidan con los filtros actuales.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedSolicitud && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900">Detalles de la Solicitud</h3>
              <button 
                onClick={() => setSelectedSolicitud(null)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedSolicitud.nombre}</h4>
                  <p className="text-gray-500">{selectedSolicitud.email}</p>
                </div>
                {getStatusBadge(selectedSolicitud.estado)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tipo de Perfil</p>
                  <p className="font-medium text-gray-900">{selectedSolicitud.tipo}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha de Solicitud</p>
                  <p className="font-medium text-gray-900">{selectedSolicitud.fecha}</p>
                </div>
              </div>

              {selectedSolicitud.detalles && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Información Adicional</h5>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                    {selectedSolicitud.detalles}
                  </p>
                </div>
              )}

              {selectedSolicitud.documentos && selectedSolicitud.documentos.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Documentos Adjuntos</h5>
                  <ul className="space-y-2">
                    {selectedSolicitud.documentos.map((doc, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 text-sm bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md group-hover:bg-indigo-100 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-indigo-700 transition-colors">{doc}</span>
                        </div>
                        <span className="text-indigo-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Ver</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              {selectedSolicitud.estado === 'Pendiente' ? (
                <>
                  <button 
                    onClick={() => handleStatusChange(selectedSolicitud.id, 'Rechazada')}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                  >
                    Rechazar
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedSolicitud.id, 'Aprobada')}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow rounded-lg transition-all"
                  >
                    Aprobar Solicitud
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setSelectedSolicitud(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm rounded-lg transition-all"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
