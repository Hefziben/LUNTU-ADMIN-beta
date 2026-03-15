import React from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  CalendarDays, 
  Building2, 
  Dumbbell, 
  Trophy, 
  Star, 
  PlaySquare, 
  Newspaper, 
  BookOpen,
  CreditCard,
  Mic,
  X,
  ClipboardList,
  Users,
  Settings,
  GraduationCap
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'publicidad', label: 'Publicidad', icon: Megaphone },
  { id: 'agendas', label: 'Agendas', icon: CalendarDays },
  { id: 'clubes', label: 'Clubes', icon: Building2 },
  { id: 'colegios', label: 'Colegios', icon: GraduationCap },
  { id: 'entrenadores', label: 'Entrenadores', icon: Dumbbell },
  { id: 'categorias', label: 'Categorías', icon: Trophy },
  { id: 'deportistas', label: 'Deportistas', icon: Star },
  { id: 'highlights', label: 'Highlights', icon: PlaySquare },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'guiapadres', label: 'Guía para Padres', icon: BookOpen },
  { id: 'entrevistas', label: 'Entrevistas', icon: Mic },
  { id: 'suscripciones', label: 'Suscripciones', icon: CreditCard },
  { id: 'solicitudes', label: 'Solicitudes', icon: ClipboardList },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
          <span className="text-2xl font-bold text-indigo-600 tracking-tight">LUNTU</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={clsx("w-5 h-5", isActive ? "text-indigo-600" : "text-gray-400")} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
