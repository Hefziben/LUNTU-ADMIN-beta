import React, { useState } from 'react';
import { Save, Bell, Shield, User, Globe, Mail, Smartphone, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export function Configuracion() {
  const [activeTab, setActiveTab] = useState('general');
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  const showToast = (title: string, type: 'success' | 'error') => {
    setToastMessage({ title, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    showToast('Configuración guardada exitosamente', 'success');
  };

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
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Configuración</h2>
          <p className="text-sm text-gray-500 mt-1">Administra las preferencias y ajustes de la plataforma.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {[
              { id: 'general', label: 'General', icon: Globe },
              { id: 'perfil', label: 'Perfil de Admin', icon: User },
              { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
              { id: 'seguridad', label: 'Seguridad', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className={clsx("w-5 h-5", activeTab === tab.id ? "text-indigo-600" : "text-gray-400")} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === 'general' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Ajustes Generales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre de la Plataforma</label>
                  <input type="text" defaultValue="LUNTU Admin" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email de Soporte</label>
                  <input type="email" defaultValue="soporte@luntu.com" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Moneda Principal</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>MXN ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Zona Horaria</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow">
                    <option>America/Panama (GMT-5)</option>
                    <option>America/Mexico_City (GMT-6)</option>
                    <option>America/Bogota (GMT-5)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Preferencias de Notificación</h3>
              
              <div className="space-y-4">
                <ToggleOption 
                  icon={Mail} 
                  title="Notificaciones por Email" 
                  description="Recibe resúmenes diarios y alertas importantes en tu correo."
                  defaultChecked={true}
                />
                <ToggleOption 
                  icon={Smartphone} 
                  title="Notificaciones Push" 
                  description="Recibe alertas en tiempo real en tu navegador o dispositivo móvil."
                  defaultChecked={false}
                />
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Eventos a notificar</h4>
                  <div className="space-y-3">
                    <CheckboxOption label="Nuevas solicitudes de registro" defaultChecked={true} />
                    <CheckboxOption label="Suscripciones canceladas o vencidas" defaultChecked={true} />
                    <CheckboxOption label="Nuevos pagos recibidos" defaultChecked={false} />
                    <CheckboxOption label="Reportes de usuarios" defaultChecked={true} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Seguridad y Acceso</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Cambiar Contraseña</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="password" placeholder="Contraseña actual" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                    <input type="password" placeholder="Nueva contraseña" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                  </div>
                  <button className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-700">Actualizar contraseña</button>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <ToggleOption 
                    icon={Shield} 
                    title="Autenticación de dos factores (2FA)" 
                    description="Añade una capa extra de seguridad a tu cuenta de administrador."
                    defaultChecked={false}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Perfil de Administrador</h3>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                  AD
                </div>
                <div>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Cambiar Avatar
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF o PNG. Max 1MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                  <input type="text" defaultValue="Admin LUNTU" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" defaultValue="admin@luntu.com" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleOption({ icon: Icon, title, description, defaultChecked }: { icon: any, title: string, description: string, defaultChecked: boolean }) {
  const [enabled, setEnabled] = useState(defaultChecked);
  
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
      <div className="flex gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={clsx(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          enabled ? "bg-indigo-600" : "bg-gray-200"
        )}
      >
        <span className={clsx(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          enabled ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
    </div>
  );
}

function CheckboxOption({ label, defaultChecked }: { label: string, defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative flex items-center">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <div className="w-5 h-5 border-2 border-gray-300 rounded bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
        <CheckCircle2 className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
      </div>
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
    </label>
  );
}
