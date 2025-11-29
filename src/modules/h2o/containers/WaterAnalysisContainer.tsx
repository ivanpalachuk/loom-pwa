import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, LoadingSpinner, ActionList, ActionListItem } from '../../../components/ui';
import { ParameterScale, LocationModal, CorrectionStatus } from '../components';
import type { WaterQualityData } from '../types';
import { 
    analyzeWaterStrip, 
    PARAMETER_RANGES, 
    saveAnalysis, 
    getAnalysisById,
    needsCorrection 
} from '../services';

interface WaterAnalysisContainerProps {
    imageData?: string;
}

export function WaterAnalysisContainer({ imageData }: WaterAnalysisContainerProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [analysis, setAnalysis] = useState<WaterQualityData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFromHistory, setIsFromHistory] = useState(false);

    // Estado de ubicación
    const [savedLocation, setSavedLocation] = useState<string | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationPurpose, setLocationPurpose] = useState<'save' | 'pdf'>('save');

    useEffect(() => {
        const loadAnalysis = async () => {
            // Si viene con ID, cargar desde storage
            if (id) {
                setIsFromHistory(true);
                const result = await getAnalysisById(id);
                if (result) {
                    setAnalysis(result);
                } else {
                    navigate('/water-history', { replace: true });
                }
                setIsLoading(false);
                return;
            }

            // Si no hay imageData ni id, redirigir
            if (!imageData) {
                navigate('/home', { replace: true });
                return;
            }

            // Simular análisis
            setTimeout(() => {
                const result = analyzeWaterStrip(imageData);
                setAnalysis(result);
                setIsLoading(false);
            }, 1500);
        };

        loadAnalysis();
    }, [id, imageData, navigate]);

    const handleAddLocation = () => {
        setLocationPurpose('save');
        setShowLocationModal(true);
    };

    const handleSaveLocation = (location: string) => {
        setSavedLocation(location);
        setShowLocationModal(false);
    };

    const handleSaveAnalysis = () => {
        if (!analysis) return;
        saveAnalysis(analysis, savedLocation || undefined);
        alert('Análisis guardado en el historial');
    };

    const handleDownloadPDF = () => {
        if (savedLocation) {
            generatePDF(savedLocation);
        } else {
            setLocationPurpose('pdf');
            setShowLocationModal(true);
        }
    };

    const handleLocationForPDF = (location: string) => {
        setSavedLocation(location);
        setShowLocationModal(false);
        generatePDF(location);
    };

    const generatePDF = (location: string) => {
        if (!analysis) return;

        const requiresCorrection = needsCorrection(analysis.ph, analysis.alkalinity, analysis.hardness);
        const correctionText = requiresCorrection ? '⚠️ REQUIERE CORRECCIÓN' : '✅ NO REQUIERE CORRECCIÓN';
        const correctionColor = requiresCorrection ? '#ef4444' : '#22c55e';

        const now = new Date();
        const dateStr = now.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const logoUrl = window.location.origin + '/logotest_02.png';

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Análisis de Agua - Loom</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #004EA8; padding-bottom: 20px; }
                    .logo-img { max-width: 200px; margin-bottom: 10px; }
                    .date { color: #888; font-size: 12px; margin-top: 10px; }
                    .section-title { color: #004EA8; font-size: 18px; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
                    .location-box { background: #004EA8; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .location-label { font-size: 12px; opacity: 0.8; }
                    .location-value { font-size: 16px; font-weight: bold; margin-top: 5px; }
                    .parameter { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #004EA8; }
                    .param-name { font-weight: bold; color: #333; }
                    .param-value { font-size: 24px; color: #004EA8; margin: 5px 0; }
                    .param-optimal { font-size: 12px; color: #666; }
                    .correction-box { background: ${correctionColor}; color: white; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; font-size: 18px; font-weight: bold; }
                    .footer { margin-top: 40px; text-align: center; color: #888; font-size: 11px; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logoUrl}" alt="Loom" class="logo-img" />
                    <div class="date">${dateStr}</div>
                </div>
                <div class="section-title">📍 Ubicación</div>
                <div class="location-box">
                    <div class="location-label">Punto de muestreo</div>
                    <div class="location-value">${location}</div>
                </div>
                <div class="section-title">🔬 Resultados del Análisis</div>
                <div class="parameter">
                    <div class="param-name">pH</div>
                    <div class="param-value">${analysis.ph}</div>
                    <div class="param-optimal">Rango óptimo: 6 - 7</div>
                </div>
                <div class="parameter">
                    <div class="param-name">Alcalinidad</div>
                    <div class="param-value">${analysis.alkalinity} ppm</div>
                    <div class="param-optimal">Rango óptimo: 50 - 150 ppm</div>
                </div>
                <div class="parameter">
                    <div class="param-name">Dureza</div>
                    <div class="param-value">${analysis.hardness} ppm</div>
                    <div class="param-optimal">Rango óptimo: 0 - 150 ppm</div>
                </div>
                <div class="correction-box">${correctionText}</div>
                <div class="footer">
                    Generado por Loom - Agricultura Inteligente<br>
                    www.loom.com.ar
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    // Si no hay datos necesarios, no renderizar
    if (!imageData && !id) {
        return null;
    }

    return (
        <div className="bg-gray-50 flex flex-col" style={{ height: '100dvh' }}>
            <LocationModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onConfirm={locationPurpose === 'save' ? handleSaveLocation : handleLocationForPDF}
                title={locationPurpose === 'save' ? 'Agregar ubicación' : 'Ubicación del muestreo'}
                confirmButtonText={locationPurpose === 'save' ? 'Guardar' : 'Generar PDF'}
            />

            <PageHeader 
                title="Análisis de Agua" 
                backTo="/home" 
            />

            <main className="flex-1 overflow-auto">
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
                    {isLoading ? (
                        <LoadingSpinner
                            title={isFromHistory ? 'Cargando análisis' : 'Analizando muestra'}
                            subtitle={isFromHistory ? 'Obteniendo datos guardados' : 'Detectando parámetros de agua'}
                        />
                    ) : analysis && (
                        <>
                            {/* Parámetros */}
                            <ParameterScale
                                {...PARAMETER_RANGES.ph}
                                label="pH"
                                value={analysis.ph}
                            />
                            <ParameterScale
                                {...PARAMETER_RANGES.alkalinity}
                                label="Alcalinidad"
                                value={analysis.alkalinity}
                            />
                            <ParameterScale
                                {...PARAMETER_RANGES.hardness}
                                label="Dureza"
                                value={analysis.hardness}
                            />

                            {/* Estado de corrección */}
                            <CorrectionStatus analysis={analysis} />

                            {/* Acciones */}
                            <ActionList>
                                <ActionListItem
                                    icon={
                                        <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    }
                                    title={savedLocation ? 'Cambiar ubicación' : 'Agregar ubicación'}
                                    subtitle={savedLocation || 'GPS automático o manual'}
                                    onClick={handleAddLocation}
                                    rightIcon={savedLocation ? (
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : undefined}
                                />

                                {!id && (
                                    <ActionListItem
                                        icon={
                                            <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                            </svg>
                                        }
                                        title="Guardar análisis en historial"
                                        subtitle="Almacenar para consultar después"
                                        onClick={handleSaveAnalysis}
                                    />
                                )}

                                <ActionListItem
                                    icon={
                                        <svg className="w-5 h-5 text-loom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    }
                                    title="Descargar como PDF"
                                    subtitle="Exportar análisis con ubicación"
                                    onClick={handleDownloadPDF}
                                />

                                <ActionListItem
                                    icon={
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    }
                                    title="Corregir mi agua"
                                    subtitle="Próximamente"
                                    disabled
                                    iconBgClass="bg-gray-100"
                                />
                            </ActionList>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default WaterAnalysisContainer;
