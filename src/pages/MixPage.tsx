import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FieldArray } from 'formik';
import { useAccelerometer } from '../hooks/useAccelerometer';

interface Chemical {
  name: string;
  dose: number; // ml/L
}

interface MixFormValues {
  hectares: number;
  litersPerHa: number;
  chemicals: Chemical[];
}

interface ChemicalResult {
  name: string;
  dosePerLiter: number;
  totalAmount: string;
}

interface MixResult {
  totalLiters: number;
  chemicals: ChemicalResult[];
}

const availableChemicals = [
  'Glifosato',
  'Atrazina',
  'Dicamba',
  '2,4-D',
  'Paraquat',
  'Metsulfuron',
  'Coadyuvante',
  'Fertilizante foliar',
];

export default function MixPage() {
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const [mixResult, setMixResult] = useState<MixResult | null>(null);
  const [shakeCount, setShakeCount] = useState(0);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const { requestPermission, permission } = useAccelerometer({
    onShake: () => {
      if (permission === 'granted') {
        setShakeCount(prev => prev + 1);
      }
    },
    shakeThreshold: 15,
  });

  // Solicitar permisos al cargar el componente (solo en iOS)
  const handleRequestPermission = async () => {
    if (!permissionRequested) {
      const granted = await requestPermission();
      setPermissionRequested(true);
      if (!granted) {
        console.warn('Permiso de acelerómetro no concedido');
      }
    }
  };

  const initialValues: MixFormValues = {
    hectares: 10,
    litersPerHa: 200,
    chemicals: [
      { name: 'Glifosato', dose: 3 },
    ],
  };

  const handleSubmit = (values: MixFormValues) => {
    // Calcular resultados (simulado)
    const totalLiters = values.hectares * values.litersPerHa;
    
    const results = values.chemicals.map(chem => ({
      name: chem.name,
      dosePerLiter: chem.dose,
      totalAmount: (chem.dose * totalLiters).toFixed(2),
    }));

    setMixResult({
      totalLiters,
      chemicals: results,
    });
    setShowResult(true);
  };

  // Auto-submit cuando se sacude 5 veces
  if (shakeCount >= 5 && !showResult) {
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }

  return (
    <div className="bg-gray-50 flex flex-col" style={{ height: '100dvh' }}>
      {/* Header */}
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 text-gray-600 hover:text-loom transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-loom">Generar MIX</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {!showResult && (
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {({ values }) => (
                <Form className="space-y-6">
                  {/* Permission Request for iOS */}
                  {permission === 'prompt' && !permissionRequested && (
                    <div className="bg-yellow-50 border-2 border-yellow-400/50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            Activa la función de sacudir
                          </p>
                          <p className="text-xs text-gray-600 mb-3">
                            Permite el acceso al acelerómetro para poder calcular el MIX sacudiendo el dispositivo
                          </p>
                          <button
                            type="button"
                            onClick={handleRequestPermission}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold active:scale-95 transition-transform"
                          >
                            Activar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shake Counter */}
                  {shakeCount > 0 && permission === 'granted' && (
                    <div className="bg-loom-10 border-2 border-loom/20 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-600">Sacudidas: {shakeCount}/5</p>
                      <p className="text-xs text-gray-500 mt-1">Sacude el celular 5 veces para mezclar</p>
                    </div>
                  )}

                  {/* Area Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Área a tratar</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="hectares" className="block text-sm font-medium text-gray-700 mb-2">
                          Hectáreas
                        </label>
                        <Field
                          id="hectares"
                          name="hectares"
                          type="number"
                          step="0.1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-loom focus:border-loom"
                        />
                      </div>

                      <div>
                        <label htmlFor="litersPerHa" className="block text-sm font-medium text-gray-700 mb-2">
                          Litros por Hectárea
                        </label>
                        <Field
                          id="litersPerHa"
                          name="litersPerHa"
                          type="number"
                          step="10"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-loom focus:border-loom"
                        />
                      </div>

                      <div className="bg-loom-10 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-800">
                          Total de agua: <span className="text-loom font-bold">{values.hectares * values.litersPerHa} L</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chemicals Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Químicos</h2>
                    
                    <FieldArray name="chemicals">
                      {({ push, remove }) => (
                        <div className="space-y-4">
                          {values.chemicals.map((_, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Producto
                                    </label>
                                    <Field
                                      as="select"
                                      name={`chemicals.${index}.name`}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-loom focus:border-loom"
                                    >
                                      {availableChemicals.map(chem => (
                                        <option key={chem} value={chem}>{chem}</option>
                                      ))}
                                    </Field>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Dosis (ml/L)
                                    </label>
                                    <Field
                                      name={`chemicals.${index}.dose`}
                                      type="number"
                                      step="0.1"
                                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-loom focus:border-loom"
                                    />
                                  </div>
                                </div>

                                {values.chemicals.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => push({ name: availableChemicals[0], dose: 1 })}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-loom hover:text-loom transition-colors"
                          >
                            + Agregar químico
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-loom text-white py-4 px-6 rounded-xl font-semibold shadow-[0_8px_30px_rgb(0,78,168,0.3)] active:scale-95 transition-all text-lg"
                  >
                    Calcular MIX
                  </button>
                </Form>
              )}
            </Formik>
          )}
          {showResult && mixResult && (
            /* Result View */
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-loom/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-loom rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">MIX Calculado</h2>
                </div>
                
                <div className="bg-loom-10 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Volumen total de agua</p>
                  <p className="text-3xl font-bold text-loom">{mixResult.totalLiters} L</p>
                </div>
              </div>

              {/* Chemicals Results */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Cantidades por producto</h3>
                
                <div className="space-y-3">
                  {mixResult.chemicals.map((chem, index) => (
                    <div key={index} className="border-l-4 border-loom bg-loom-10/50 rounded-r-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{chem.name}</h4>
                        <span className="text-xs bg-loom text-white px-2 py-1 rounded-full">
                          {chem.dosePerLiter} ml/L
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-loom">{chem.totalAmount} ml</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {(parseFloat(chem.totalAmount) / 1000).toFixed(2)} Litros
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Instrucciones de mezcla</h3>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-loom text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <p className="text-gray-700">Llenar el tanque con {mixResult?.totalLiters} litros de agua limpia</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-loom text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <p className="text-gray-700">Agregar cada producto en el orden listado, agitando entre cada adición</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-loom text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <p className="text-gray-700">Mezclar durante 5 minutos antes de aplicar</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-loom text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <p className="text-gray-700">Aplicar inmediatamente después de preparar</p>
                  </li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pb-4">
                <button
                  onClick={() => {
                    setShowResult(false);
                    setShakeCount(0);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold active:scale-95 transition-all"
                >
                  Nueva mezcla
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="flex-1 bg-loom text-white py-4 px-6 rounded-xl font-semibold shadow-[0_8px_30px_rgb(0,78,168,0.3)] active:scale-95 transition-all"
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
