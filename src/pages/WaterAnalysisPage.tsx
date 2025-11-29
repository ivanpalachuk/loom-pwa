import { useLocation } from 'react-router-dom';
import { WaterAnalysisContainer } from '../modules/h2o';

export default function WaterAnalysisPage() {
    const location = useLocation();
    const imageData = location.state?.imageData as string | undefined;
    
    return <WaterAnalysisContainer imageData={imageData} />;
}
