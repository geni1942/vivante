'use client';

export default function PagoPendiente() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-sm">
        <div className="text-5xl mb-5">⏳</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Pago en proceso</h1>
        <p className="text-gray-500 mb-4">
          Tu pago está siendo procesado. En cuanto se confirme recibirás tu itinerario en{' '}
          <strong>tu email</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Esto suele tardar menos de unos minutos. Revisa también tu carpeta de spam.
        </p>
        <div className="space-y-3">
          <a
            href="/"
            className="block w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Volver al inicio
          </a>
          <a
            href="mailto:vive.vivante.ch@gmail.com"
            className="block w-full py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            ¿Dudas? Escríbenos
          </a>
        </div>
      </div>
    </div>
  );
}
