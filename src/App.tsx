import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Splash from './components/Splash';
import { LoginContainer } from './modules/auth';
import HomePage from './pages/HomePage';
import WaterAnalysisPage from './pages/WaterAnalysisPage';
import WaterHistoryPage from './pages/WaterHistoryPage';
import MixPage from './pages/MixPage';
import { EComPage } from './pages/EComPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import InstallPWA from './components/InstallPWA';
import { BottomNav } from './components/ui';
import { BottomNavProvider } from './contexts/BottomNavContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos (antes cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BottomNavProvider>
        <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <LoginContainer onLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <HomePage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/water-analysis"
            element={
              isAuthenticated ? (
                <WaterAnalysisPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/water-analysis/:id"
            element={
              isAuthenticated ? (
                <WaterAnalysisPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/water-history"
            element={
              isAuthenticated ? (
                <WaterHistoryPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/mix"
            element={
              isAuthenticated ? (
                <MixPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/ecom"
            element={
              isAuthenticated ? (
                <EComPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/ecom/product/:id"
            element={
              isAuthenticated ? (
                <ProductDetailPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/ecom/cart"
            element={
              isAuthenticated ? (
                <CartPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/perfil"
            element={
              isAuthenticated ? (
                <div className="flex items-center justify-center h-screen bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-loom mb-2">Perfil</h1>
                    <p className="text-gray-600">Próximamente</p>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/mapa"
            element={
              isAuthenticated ? (
                <div className="flex items-center justify-center h-screen bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-loom mb-2">Mapa</h1>
                    <p className="text-gray-600">Próximamente</p>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/contacto"
            element={
              isAuthenticated ? (
                <div className="flex items-center justify-center h-screen bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-loom mb-2">Contacto</h1>
                    <p className="text-gray-600">Próximamente</p>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
            }
          />
        </Routes>
        {isAuthenticated && <BottomNav />}
        <InstallPWA />
      </BrowserRouter>
      </BottomNavProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
