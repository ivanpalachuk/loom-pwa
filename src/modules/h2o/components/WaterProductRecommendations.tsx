import { useNavigate } from 'react-router-dom';
import type { Product } from '../../ecom/types';

interface WaterProductRecommendationsProps {
    recommendations: Array<{
        parameter: string;
        issue: string;
        severity: 'low' | 'medium' | 'high';
        recommendedProducts: Product[];
    }>;
}

export function WaterProductRecommendations({ recommendations }: WaterProductRecommendationsProps) {
    const navigate = useNavigate();

    if (recommendations.length === 0) {
        return null;
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'border-red-500 bg-red-50';
            case 'medium': return 'border-yellow-500 bg-yellow-50';
            case 'low': return 'border-blue-500 bg-blue-50';
            default: return 'border-gray-500 bg-gray-50';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'medium':
                return (
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleViewAllProducts = () => {
        navigate('/ecom');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Productos Recomendados</h3>
                <button
                    onClick={handleViewAllProducts}
                    className="text-sm text-loom hover:text-loom-70 font-semibold"
                >
                    Ver tienda →
                </button>
            </div>

            {recommendations.map((rec, index) => (
                <div key={index} className={`border-l-4 rounded-r-xl p-4 ${getSeverityColor(rec.severity)}`}>
                    <div className="flex items-start gap-3 mb-3">
                        {getSeverityIcon(rec.severity)}
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{rec.parameter}</h4>
                            <p className="text-sm text-gray-600">{rec.issue}</p>
                        </div>
                    </div>

                    {rec.recommendedProducts.length > 0 && (
                        <div className="space-y-2 mt-3">
                            {rec.recommendedProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => navigate(`/ecom/product/${product.id}`)}
                                    className="w-full bg-white rounded-lg p-3 border border-gray-200 hover:border-loom hover:shadow-md transition-all text-left"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{product.name}</p>
                                            <p className="text-xs text-gray-600 line-clamp-1">{product.shortDescription}</p>
                                        </div>
                                        <div className="ml-3 text-right">
                                            <p className="font-bold text-loom">{formatPrice(product.price)}</p>
                                            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
