import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CreditCard, CheckCircle2, XCircle, X, Search, Filter, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

const initialSuscripciones = [
  { id: 1, entity: 'Club Deportivo LUNTU', type: 'Club', plan: 'Premium Anual', status: 'Activa', nextBilling: '2027-01-15', amount: '$1,200' },
  { id: 2, entity: 'Carlos Ruiz', type: 'Entrenador', plan: 'Pro Mensual', status: 'Activa', nextBilling: '2026-04-01', amount: '$49' },
  { id: 3, entity: 'Colegio San Agustín', type: 'Colegio', plan: 'Institucional', status: 'Vencida', nextBilling: '-', amount: '$2,500' },
  { id: 4, entity: 'Academia FC', type: 'Club', plan: 'Básico', status: 'Cancelada', nextBilling: '-', amount: '$299' },
];

export function Suscripciones({ activeTab: initialActiveTab = 'Entrenador' }: { activeTab?: string }) {
  const [suscripciones, setSuscripciones] = useState(initialSuscripciones);
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  // Update activeTab if prop changes
  React.useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);

  const showToast = (title: string, type: 'success' | 'error') => {
    setToastMessage({ title, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: number) => {
    setSuscripciones(suscripciones.filter(s => s.id !== id));
    showToast('Suscripción eliminada correctamente', 'success');
  };

  const filteredSubs = suscripciones.filter(s => 
    s.type === activeTab &&
    (s.entity.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.plan.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activa':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3.5 h-3.5" /> Activa</span>;
      case 'Vencida':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3.5 h-3.5" /> Vencida</span>;
      case 'Cancelada':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3.5 h-3.5" /> Cancelada</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'} animate-in slide-in-from-top-2 fade-in duration-300`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{toastMessage.title}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Suscripciones</h2>
          <p className="text-sm text-gray-500 mt-1">Administra los planes y pagos de los usuarios de la plataforma.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Suscripción
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-lg overflow-x-auto w-full sm:w-auto">
          {['Entrenador', 'Club', 'Colegio'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {tab === 'Entrenador' ? 'Entrenadores' : tab === 'Club' ? 'Clubes' : 'Colegios'}
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {suscripciones.filter(s => s.type === tab).length}
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
            placeholder="Buscar por nombre o plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Entidad / Usuario</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Monto</th>
                <th className="px-6 py-4 font-semibold">Próximo Cobro</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">{sub.entity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{sub.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sub.nextBilling}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(sub.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Filter className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="text-base font-medium text-gray-900">No se encontraron suscripciones</p>
                      <p className="text-sm mt-1">No hay registros que coincidan con los filtros actuales.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <NewSubscriptionModal 
          defaultType={activeTab}
          onClose={() => setIsModalOpen(false)} 
          onSave={(newSub) => {
            setSuscripciones([{ ...newSub, id: Date.now() }, ...suscripciones]);
            setIsModalOpen(false);
            showToast('Suscripción creada exitosamente', 'success');
          }} 
        />
      )}
    </div>
  );
}

function NewSubscriptionModal({ defaultType, onClose, onSave }: { defaultType: string, onClose: () => void, onSave: (sub: any) => void }) {
  const [entity, setEntity] = useState('');
  const [type, setType] = useState(defaultType);
  const [plan, setPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [nextBilling, setNextBilling] = useState('');
  const [status, setStatus] = useState('Activa');

  const handleSave = () => {
    if (!entity || !plan || !amount) return;
    onSave({ entity, type, plan, amount: `$${amount}`, nextBilling: nextBilling || '-', status });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Nueva Suscripción</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nombre de Entidad / Usuario</label>
              <input 
                type="text" 
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                placeholder="Ej: Colegio San Agustín"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow"
              >
                <option value="Entrenador">Entrenador</option>
                <option value="Club">Club</option>
                <option value="Colegio">Colegio</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <input 
                type="text" 
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Ej: Premium Anual"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Monto ($)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Próximo Cobro</label>
              <input 
                type="date" 
                value={nextBilling}
                onChange={(e) => setNextBilling(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow"
              >
                <option value="Activa">Activa</option>
                <option value="Vencida">Vencida</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm rounded-lg transition-all">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!entity || !plan || !amount}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Suscripción
          </button>
        </div>
      </div>
    </div>
  );
}
