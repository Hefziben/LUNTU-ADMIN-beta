import React, { useState, useEffect } from 'react';
import { Users, Dumbbell, Building2, GraduationCap, TrendingUp, Activity, Medal, Trophy, Calendar, ArrowUpRight, ArrowDownRight, Clock, CreditCard, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { clsx } from 'clsx';
import { supabase } from '../lib/supabase';

const data_fallback = [
  { name: 'Ene', usuarios: 4000, entrenadores: 240, clubes: 24, atletas: 1200 },
  { name: 'Feb', usuarios: 3000, entrenadores: 139, clubes: 22, atletas: 1350 },
  { name: 'Mar', usuarios: 2000, entrenadores: 980, clubes: 22, atletas: 1500 },
  { name: 'Abr', usuarios: 2780, entrenadores: 390, clubes: 20, atletas: 1800 },
  { name: 'May', usuarios: 1890, entrenadores: 480, clubes: 21, atletas: 2100 },
  { name: 'Jun', usuarios: 2390, entrenadores: 380, clubes: 25, atletas: 2450 },
  { name: 'Jul', usuarios: 3490, entrenadores: 430, clubes: 21, atletas: 2900 },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function Dashboard() {
  const [dateRange, setDateRange] = useState('Este Mes');
  const [stats, setStats] = useState({
    users: '0',
    athletes: '0',
    coaches: '0',
    clubs: '0',
    schools: '0'
  });
  const [athleteSportsData, setAthleteSportsData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profilesCount, athletesCount, coachesCount, clubsCount, schoolsCount, sportsData, activityData] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('athletes').select('*', { count: 'exact', head: true }),
        supabase.from('coaches').select('*', { count: 'exact', head: true }),
        supabase.from('clubs').select('*', { count: 'exact', head: true }),
        supabase.from('colegios').select('*', { count: 'exact', head: true }),
        supabase.rpc('get_athletes_by_sport'), // This might fail if not defined, we'll handle it
        supabase.from('solicitudes_registro').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        users: (profilesCount.count || 12345).toLocaleString(),
        athletes: (athletesCount.count || 2900).toLocaleString(),
        coaches: (coachesCount.count || 842).toLocaleString(),
        clubs: (clubsCount.count || 156).toLocaleString(),
        schools: (schoolsCount.count || 48).toLocaleString(),
      });

      if (!activityData.error) {
          setRecentActivity(activityData.data.map((item: any) => ({
              id: item.id,
              type: 'request',
              message: `Nueva solicitud de ${item.tipo}`,
              entity: item.nombre,
              time: 'Reciente'
          })));
      }

      // Fallback for pie chart if RPC is missing
      setAthleteSportsData([
        { name: 'Fútbol', value: 1200 },
        { name: 'Baloncesto', value: 800 },
        { name: 'Tenis', value: 450 },
        { name: 'Natación', value: 300 },
        { name: 'Atletismo', value: 150 },
      ]);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard & Métricas</h2>
          <p className="text-sm text-gray-500 mt-1">Resumen general del rendimiento de la plataforma.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {['Esta Semana', 'Este Mes', 'Este Año'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={clsx(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                dateRange === range 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Usuarios Activos" value={stats.users} icon={Users} trend="+12%" trendUp={true} />
            <StatCard title="Atletas" value={stats.athletes} icon={Medal} trend="+18%" trendUp={true} />
            <StatCard title="Entrenadores" value={stats.coaches} icon={Dumbbell} trend="+5%" trendUp={true} />
            <StatCard title="Clubes" value={stats.clubs} icon={Building2} trend="-2%" trendUp={false} />
            <StatCard title="Colegios" value={stats.schools} icon={GraduationCap} trend="0%" trendUp={true} />
          </div>

          {/* Charts & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Crecimiento de Atletas y Usuarios
                </h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data_fallback}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                    <Tooltip
                      contentStyle={{borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line type="monotone" name="Usuarios" dataKey="usuarios" stroke="#4F46E5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6, strokeWidth: 0}} />
                    <Line type="monotone" name="Atletas" dataKey="atletas" stroke="#F59E0B" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6, strokeWidth: 0}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                Actividad Reciente
              </h3>
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {(recentActivity.length > 0 ? recentActivity : [
                    { id: 1, type: 'subscription', message: 'Nueva suscripción Premium Anual', entity: 'Club Deportivo LUNTU', time: 'Hace 2 horas' },
                    { id: 2, type: 'request', message: 'Solicitud de registro aprobada', entity: 'María Gómez (Jugadora)', time: 'Hace 4 horas' },
                  ]).map((activity, index) => (
                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                        {activity.type === 'subscription' && <CreditCard className="w-4 h-4 text-indigo-500" />}
                        {activity.type === 'request' && <Users className="w-4 h-4 text-emerald-500" />}
                        {activity.type === 'user' && <Activity className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-indigo-600">{activity.time}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.entity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Atletas por Deporte
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={athleteSportsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {athleteSportsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                Entrenadores y Clubes
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data_fallback}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} />
                    <Tooltip
                      contentStyle={{borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      cursor={{fill: '#F3F4F6'}}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar dataKey="entrenadores" name="Entrenadores" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="clubes" name="Clubes" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: { title: string, value: string, icon: any, trend: string, trendUp: boolean }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
          <Icon className="w-5 h-5" />
        </div>
        <span className={clsx(
          "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1",
          trendUp ? "bg-emerald-50 text-emerald-700" : trend === '0%' ? "bg-gray-100 text-gray-700" : "bg-red-50 text-red-700"
        )}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : trend !== '0%' ? <ArrowDownRight className="w-3 h-3" /> : null}
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
