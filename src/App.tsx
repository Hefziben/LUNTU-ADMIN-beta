import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Publicidad } from './components/Publicidad';
import { Agendas } from './components/Agendas';
import { Clubes } from './components/Clubes';
import { Colegios } from './components/Colegios';
import { Entrenadores } from './components/Entrenadores';
import { Categorias } from './components/Categorias';
import { Deportistas } from './components/Deportistas';
import { Highlights } from './components/Highlights';
import { News } from './components/News';
import { Suscripciones } from './components/Suscripciones';
import { Solicitudes } from './components/Solicitudes';
import { Entrevistas } from './components/Entrevistas';
import { Configuracion } from './components/Configuracion';
import { Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'publicidad': return <Publicidad />;
      case 'agendas': return <Agendas />;
      case 'clubes': return <Clubes />;
      case 'colegios': return <Colegios />;
      case 'entrenadores': return <Entrenadores />;
      case 'categorias': return <Categorias />;
      case 'deportistas': return <Deportistas />;
      case 'highlights': return <Highlights />;
      case 'news': return <News />;
      case 'entrevistas': return <Entrevistas />;
      case 'suscripciones': return <Suscripciones activeTab="Entrenador" />;
      case 'solicitudes': return <Solicitudes />;
      case 'configuracion': return <Configuracion />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-500 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              LUNTU Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
