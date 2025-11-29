import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '../../../components/Camera';
import PhotoConfirm from '../../../components/PhotoConfirm';
import { H2OModal } from '../../h2o/components';
import { ModuleGrid, HeaderMenu } from '../components';
import { MODULES } from '../types';

export function HomeContainer() {
    const navigate = useNavigate();
    
    // Estados de UI
    const [showMenu, setShowMenu] = useState(false);
    const [showH2OModal, setShowH2OModal] = useState(false);
    
    // Estados de cámara
    const [showCamera, setShowCamera] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [showPhotoConfirm, setShowPhotoConfirm] = useState(false);

    const handleModuleClick = (moduleId: string) => {
        switch (moduleId) {
            case 'h2o':
                setShowH2OModal(true);
                break;
            case 'mix':
                navigate('/mix');
                break;
            default:
                console.log(`Módulo ${moduleId} - Próximamente`);
        }
    };

    // H2O Modal handlers
    const handleNewAnalysis = () => {
        setShowH2OModal(false);
        setShowCamera(true);
    };

    const handleViewHistory = () => {
        setShowH2OModal(false);
        navigate('/water-history');
    };

    // Camera handlers
    const handlePhotoCapture = (imageData: string) => {
        setCapturedPhoto(imageData);
        setShowCamera(false);
        setShowPhotoConfirm(true);
    };

    const handleConfirmPhoto = () => {
        if (capturedPhoto) {
            setShowPhotoConfirm(false);
            navigate('/water-analysis', { state: { imageData: capturedPhoto } });
        }
    };

    const handleRetakePhoto = () => {
        setShowPhotoConfirm(false);
        setCapturedPhoto(null);
        setShowCamera(true);
    };

    const handleCancelPhoto = () => {
        setShowPhotoConfirm(false);
        setCapturedPhoto(null);
    };

    // Auth handlers
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <div className="bg-gray-50 flex flex-col overflow-hidden" style={{ height: '100dvh' }}>
            {/* Header */}
            <header className="bg-white shadow-sm relative flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <img src="/logotest.png" alt="Loom" className="h-12" />
                        <HeaderMenu
                            isOpen={showMenu}
                            onToggle={() => setShowMenu(!showMenu)}
                            onLogout={handleLogout}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-4 overflow-hidden">
                <ModuleGrid modules={MODULES} onModuleClick={handleModuleClick} />
            </main>

            {/* Modals */}
            {showCamera && (
                <Camera
                    onCapture={handlePhotoCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}

            {showPhotoConfirm && capturedPhoto && (
                <PhotoConfirm
                    imageData={capturedPhoto}
                    onConfirm={handleConfirmPhoto}
                    onRetake={handleRetakePhoto}
                    onCancel={handleCancelPhoto}
                />
            )}

            <H2OModal
                isOpen={showH2OModal}
                onClose={() => setShowH2OModal(false)}
                onNewAnalysis={handleNewAnalysis}
                onViewHistory={handleViewHistory}
            />
        </div>
    );
}

export default HomeContainer;
