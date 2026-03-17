'use client';
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Datos de muestra realistas para testear el flujo completo
const SAMPLE_DATA = {
  nombre: 'María Eugenia',
  email: 'test@vivevivante.com',
  destino: 'Japón (Tokio, Kioto, Osaka)',
  origen: 'Santiago, Chile',
  presupuesto: 4000,
  dias: 10,
  tipoViaje: 'pareja',
  numViajeros: 2,
  intereses: ['cultura', 'gastronomia', 'naturaleza'],
  ritmo: 3,
  alojamiento: 'hotel',
  tieneDestino: true,
};

function TestPagoContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get('plan') || 'pro';
    const destino = searchParams.get('destino');

    const formData = {
      ...SAMPLE_DATA,
      ...(destino ? { destino: decodeURIComponent(destino) } : {}),
    };

    // Simular exactamente lo que hace el formulario real antes de redirigir a MP
    localStorage.setItem('vivante_formData', JSON.stringify(formData));
    localStorage.setItem('vivante_planId', plan);

    // Redirigir a pago-exitoso como si viniera de MercadoPago
    window.location.href = '/pago-exitoso?status=approved&payment_id=TEST123456';
  }, [searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FCF8F4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: 24,
    }}>
      <div style={{
        background: '#FF6332',
        width: 80,
        height: 80,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
        marginBottom: 24,
        animation: 'spin 1.5s linear infinite',
      }}>✈️</div>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, color: '#212529', marginBottom: 8 }}>
        Simulando pago aprobado...
      </h1>
      <p style={{ color: '#888', fontSize: 15 }}>
        Redirigiendo al itinerario
      </p>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function TestPago() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#FCF8F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#FF6332', fontSize: 18 }}>Cargando... ✈️</p>
      </div>
    }>
      <TestPagoContent />
    </Suspense>
  );
}
