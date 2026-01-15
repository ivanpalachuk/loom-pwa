import { useState } from 'react';

// Datos mockeados del usuario
const MOCK_USER = {
  name: 'Juan Pérez',
  email: 'juan.perez@ejemplo.com',
  phone: '+54 223 456-7890',
  company: 'Agrícola San Martín',
  role: 'Encargado de Campo',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  memberSince: '2024',
};

const MOCK_STATS = {
  analysisCount: 47,
  lastAnalysis: '2026-01-14',
  fieldsRegistered: 12,
  alertsActive: 3,
};

const MOCK_FIELDS = [
  { id: 1, name: 'Lote Norte', hectares: 150, lastAnalysis: '2026-01-14', status: 'good' },
  { id: 2, name: 'Lote Sur', hectares: 200, lastAnalysis: '2026-01-10', status: 'warning' },
  { id: 3, name: 'Lote Este', hectares: 180, lastAnalysis: '2026-01-08', status: 'good' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'fields'>('info');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'good': return 'Óptimo';
      case 'warning': return 'Atención';
      case 'critical': return 'Crítico';
      default: return 'Sin datos';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header integrado con perfil */}
      <div className="bg-gradient-to-r from-loom to-loom-70 text-white">
        {/* Barra de navegación */}
        <div className="max-w-3xl mx-auto px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Mi Perfil</h1>
          </div>
        </div>

        {/* Info del perfil */}
        <div className="px-4 pb-6 pt-2">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-white/70">
              {MOCK_USER.avatar ? (
                <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-loom">
                  {MOCK_USER.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
            <div className="flex-1 text-white">
              <h2 className="text-xl font-bold">{MOCK_USER.name}</h2>
              <p className="text-white/80 text-sm">{MOCK_USER.role}</p>
              <p className="text-white/60 text-xs mt-1">{MOCK_USER.company}</p>
            </div>
            <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* Stats rápidos */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{MOCK_STATS.analysisCount}</div>
              <div className="text-xs text-white/80">Análisis</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{MOCK_STATS.fieldsRegistered}</div>
              <div className="text-xs text-white/80">Lotes</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{MOCK_STATS.alertsActive}</div>
              <div className="text-xs text-white/80">Alertas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex">
          {[
            { id: 'info', label: 'Información' },
            { id: 'stats', label: 'Estadísticas' },
            { id: 'fields', label: 'Mis Lotes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-loom border-b-2 border-loom'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Tab: Información */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4">
              <h3 className="font-bold text-gray-800">Datos personales</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-loom-10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Nombre completo</div>
                    <div className="font-medium text-gray-800">{MOCK_USER.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-loom-10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium text-gray-800">{MOCK_USER.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-loom-10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Teléfono</div>
                    <div className="font-medium text-gray-800">{MOCK_USER.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-loom-10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Empresa</div>
                    <div className="font-medium text-gray-800">{MOCK_USER.company}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">Cuenta</h3>
              <div className="text-sm text-gray-600">
                <p>Miembro desde: <span className="font-medium">{MOCK_USER.memberSince}</span></p>
              </div>
              <button className="mt-4 w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors">
                Cerrar sesión
              </button>
            </div>
          </div>
        )}

        {/* Tab: Estadísticas */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="font-bold text-gray-800 mb-4">Resumen de actividad</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-600">{MOCK_STATS.analysisCount}</div>
                  <div className="text-sm text-blue-600/80">Análisis totales</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-600">{MOCK_STATS.fieldsRegistered}</div>
                  <div className="text-sm text-green-600/80">Lotes registrados</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                  <div className="text-3xl font-bold text-yellow-600">{MOCK_STATS.alertsActive}</div>
                  <div className="text-sm text-yellow-600/80">Alertas activas</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="text-3xl font-bold text-purple-600">85%</div>
                  <div className="text-sm text-purple-600/80">Calidad promedio</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="font-bold text-gray-800 mb-4">Actividad reciente</h3>
              <div className="space-y-3">
                {[
                  { action: 'Análisis de agua', location: 'Lote Norte', date: '14 Ene 2026', type: 'analysis' },
                  { action: 'Nueva alerta', location: 'Lote Sur', date: '12 Ene 2026', type: 'alert' },
                  { action: 'Análisis de agua', location: 'Lote Este', date: '08 Ene 2026', type: 'analysis' },
                  { action: 'Compra realizada', location: 'Tienda', date: '05 Ene 2026', type: 'purchase' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === 'analysis' ? 'bg-blue-100' :
                      item.type === 'alert' ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      {item.type === 'analysis' && (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      )}
                      {item.type === 'alert' && (
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      {item.type === 'purchase' && (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.action}</div>
                      <div className="text-xs text-gray-500">{item.location}</div>
                    </div>
                    <div className="text-xs text-gray-400">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Mis Lotes */}
        {activeTab === 'fields' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Mis lotes</h3>
              <button className="text-sm text-loom font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar lote
              </button>
            </div>

            {MOCK_FIELDS.map((field) => (
              <div key={field.id} className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800">{field.name}</h4>
                    <p className="text-sm text-gray-500">{field.hectares} hectáreas</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(field.status)}`}>
                    {getStatusLabel(field.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Último análisis: {field.lastAnalysis}</span>
                  <button className="text-loom font-medium">Ver detalles →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
