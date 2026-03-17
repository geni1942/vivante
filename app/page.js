'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Plane, Hotel, MapPin, Calendar, Star, Globe, Sparkles, ChevronDown, Heart, CheckCircle, Mountain, Users } from 'lucide-react';
import TravelForm from '../components/TravelForm';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [currentDestino, setCurrentDestino] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [initialDestino, setInitialDestino] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const destinosHero = [
    { nombre: 'Torres del Paine', pais: 'Chile', imagen: '/images/Torres%20del%20paine%2C%20Chile.jpg' },
    { nombre: 'Santorini', pais: 'Grecia', imagen: '/images/Santorini%2C%20Grecia.jpg' },
    { nombre: 'Bali', pais: 'Indonesia', imagen: '/images/Bali%2C%20Indonesia.jpg' },
    { nombre: 'Tokio', pais: 'Japón', imagen: '/images/Tokio%2C%20Jap%C3%B3n.jpg' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDestino((prev) => (prev + 1) % destinosHero.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const destinos = [
    { nombre: 'Torres del Paine', pais: 'Chile', imagen: '/images/Torres%20del%20paine%2C%20Chile.jpg', precio: 'Desde $400.000 CLP', tag: '🇨🇱 Local' },
    { nombre: 'Santorini', pais: 'Grecia', imagen: '/images/Santorini%2C%20Grecia.jpg', precio: 'Desde $1.200 USD', tag: '🔥 Popular' },
    { nombre: 'Bali', pais: 'Indonesia', imagen: '/images/Bali%2C%20Indonesia.jpg', precio: 'Desde $1.500 USD', tag: '✨ Trending' },
    { nombre: 'Machu Picchu', pais: 'Perú', imagen: '/images/Machu%20Picchu%2C%20Peru.jpg', precio: 'Desde $600 USD', tag: '🎒 Aventura' },
    { nombre: 'Cartagena', pais: 'Colombia', imagen: '/images/cartagena.jpg', precio: 'Desde $500 USD', tag: '🏖️ Playa' },
    { nombre: 'Barcelona', pais: 'España', imagen: '/images/Barcelona%2C%20Espa%C3%B1a.jpg', precio: 'Desde $1.100 USD', tag: '🎨 Cultura' },
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {destinosHero.map((destino, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              currentDestino === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url("${destino.imagen}")` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        {/* Nav */}
        <nav className="relative z-20 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="flex items-center">
            <Image
              src="/images/vivante_logo.svg"
              alt="VIVANTE"
              width={130}
              height={95}
              priority
              style={{ height: '46px', width: 'auto' }}
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 sm:px-6 py-2.5 rounded-full font-medium hover:bg-white hover:text-gray-900 transition-all text-sm sm:text-base"
          >
            Planificar mi viaje
          </button>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center h-[calc(100vh-100px)]">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Viaja más.<br />
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Planifica menos.
              </span>
            </h1>
            
            {/* ✅ CAMBIO 1: Nuevo texto del hero */}
            <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-xl">
              ¿40 horas planificando? ¡No gastes más tu tiempo! Cuéntanos tus preferencias de viaje y nosotros te diseñamos el itinerario para que tu experiencia sea inolvidable - todo listo para reservar
            </p>
            
            <button
              onClick={() => setShowForm(true)}
              className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 flex items-center gap-3"
            >
              Planificar mi viaje
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Destino indicator */}
            <div className="mt-12 flex items-center gap-4">
              <span className="text-white/50 text-sm">Ahora viendo:</span>
              <span className="text-white font-medium">{destinosHero[currentDestino].nombre}, {destinosHero[currentDestino].pais}</span>
              <div className="flex gap-1.5">
                {destinosHero.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentDestino(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentDestino === i ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce z-10">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-3xl sm:text-4xl font-bold">156+</div>
              <div className="text-white/80 text-sm sm:text-base">Destinos disponibles</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold">50+</div>
              <div className="text-white/80 text-sm sm:text-base">Países cubiertos</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-bold">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="text-white/80 text-sm sm:text-base">Itinerarios personalizados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Súper fácil
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              De cero a itinerario completo en menos de lo que tardas en hacer café
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200"></div>
            
            {[
              { num: '1', icon: '💬', title: 'Cuéntanos tu viaje ideal', desc: 'Presupuesto, días, intereses. Solo lo esencial.' },
              { num: '2', icon: '🤖', title: 'Creamos tu itinerario', desc: 'Analizamos las mejores opciones para ti.' },
              { num: '3', icon: '✈️', title: 'Recibe y reserva', desc: 'Itinerario completo listo para reservar.' },
            ].map((paso, i) => (
              <div key={i} className="relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow text-center group">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{paso.icon}</span>
                  </div>
                  <div className="text-xs text-orange-500 font-medium mb-2">PASO {paso.num}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{paso.title}</h3>
                  <p className="text-gray-500">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all inline-flex items-center gap-3"
            >
              Empezar ahora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Destinos Populares */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <span className="inline-block bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Inspiración
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Destinos que enamoran
              </h2>
              <p className="text-gray-500 text-lg">Los favoritos de nuestra comunidad</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="hidden sm:flex items-center gap-2 text-orange-500 font-medium hover:gap-4 transition-all mt-4 sm:mt-0"
            >
              Ver todos
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinos.map((destino, i) => (
              <div
                key={i}
                className="group relative rounded-3xl overflow-hidden cursor-pointer aspect-[4/5] sm:aspect-[3/4]"
                onClick={() => { setInitialDestino(destino.nombre + ', ' + destino.pais); setShowForm(true); }}
              >
                <img
                  src={destino.imagen}
                  alt={destino.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {destino.tag}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/70 text-sm">{destino.pais}</p>
                  <h3 className="text-white text-2xl font-bold mb-2">{destino.nombre}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-orange-400 font-semibold">{destino.precio}</p>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sm:hidden text-center mt-8">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 text-orange-500 font-medium"
            >
              Ver todos los destinos
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Qué incluye */}

      {/* Vista Previa del Itinerario */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Ejemplo real
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              As&iacute; se ve tu itinerario
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Un ejemplo real generado para Tokio, Jap&oacute;n. El tuyo ser&aacute; igual de detallado y personalizado.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden">

              {/* Cabecera oscura con resumen del viaje */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl flex-shrink-0">&#127471;&#127477;</span>
                  <div>
                    <h3 className="text-xl font-bold">Tokio, Kioto &amp; Osaka &middot; 10 d&iacute;as</h3>
                    <p className="text-gray-400 text-sm">Santiago &rarr; Tokio &middot; 2 viajeros &middot; Cultura &amp; Gastronom&iacute;a</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs">&#9992;&#65039; Vuelo desde $950 USD</span>
                  <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs">&#127968; Hotel Shinjuku Granbell</span>
                  <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs">&#128176; Presupuesto: $3.200 USD</span>
                </div>
              </div>

              {/* Dia 1 completo */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-orange-600 text-sm">D1</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">D&iacute;a 1 &middot; Lunes</p>
                    <h4 className="font-bold text-gray-900">Llegada a Tokio &middot; Barrio Shinjuku</h4>
                  </div>
                </div>
                <div className="space-y-4 pl-14">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 text-xs w-10 flex-shrink-0 mt-1 font-medium">14:00</span>
                    <span className="text-base flex-shrink-0">&#127968;</span>
                    <p className="text-gray-600 text-sm leading-relaxed">Check-in Hotel Shinjuku Granbell. Habitaci&oacute;n superior con vista panor&aacute;mica. A 3 min caminando de la estaci&oacute;n.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 text-xs w-10 flex-shrink-0 mt-1 font-medium">17:00</span>
                    <span className="text-base flex-shrink-0">&#127758;</span>
                    <p className="text-gray-600 text-sm leading-relaxed">Exploraci&oacute;n de Shinjuku: callejones Golden Gai, Kabukicho y el mirador gratuito del Gobierno Metropolitano (piso 45).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 text-xs w-10 flex-shrink-0 mt-1 font-medium">20:00</span>
                    <span className="text-base flex-shrink-0">&#127836;</span>
                    <p className="text-gray-600 text-sm leading-relaxed">Cena en Fuunji &mdash; ramen tsukemen, uno de los m&aacute;s valorados de Tokio. Reservar con anticipaci&oacute;n.</p>
                  </div>
                </div>
              </div>

              {/* Dias 2+ bloqueados con blur */}
              <div className="relative overflow-hidden">
                <div className="p-6 select-none" style={{filter:'blur(3px)',opacity:0.25,pointerEvents:'none'}}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-blue-600 text-sm">D2</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">D&iacute;a 2 &middot; Martes</p>
                      <h4 className="font-bold text-gray-900">Asakusa, Senso-ji &amp; Akihabara</h4>
                    </div>
                  </div>
                  <div className="space-y-3 pl-14">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent flex flex-col items-center justify-end pb-8 px-6 text-center">
                  <p className="text-gray-700 font-semibold mb-1">+ 9 d&iacute;as m&aacute;s con todo el detalle</p>
                  <p className="text-gray-500 text-sm mb-6">Restaurantes locales, tours, tips de transporte y presupuesto d&iacute;a a d&iacute;a</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-orange-200/50"
                  >
                    Crear mi itinerario &rarr;
                  </button>
                </div>
              </div>

            </div>
            <p className="text-center text-gray-400 text-sm mt-6">
              &#10003; Listo en minutos &middot; &#10003; 100% personalizado &middot; &#10003; Todo listo para reservar
            </p>
          </div>

        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Todo incluido
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              ¿Qué recibes en tu itinerario?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para que solo te preocupes de disfrutar
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Plane, title: 'Vuelos recomendados', desc: 'Las mejores opciones según tu origen y presupuesto', color: 'from-blue-500 to-cyan-500' },
              { icon: Hotel, title: 'Alojamiento ideal', desc: 'Hoteles, Airbnb o hostales según tu estilo', color: 'from-purple-500 to-pink-500' },
              { icon: Calendar, title: 'Itinerario día a día', desc: 'Cada día planificado con horarios y actividades', color: 'from-orange-500 to-red-500' },
              { icon: MapPin, title: 'Lugares secretos', desc: 'Tips de locales que no están en las guías', color: 'from-green-500 to-emerald-500' },
              { icon: Sparkles, title: 'Restaurantes top', desc: 'Dónde comer según tus gustos y presupuesto', color: 'from-yellow-500 to-orange-500' },
              { icon: CheckCircle, title: 'Links directos', desc: 'Todo listo para reservar con un clic', color: 'from-pink-500 to-rose-500' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Testimonios
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros viajeros
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                nombre: 'María García',
                ciudad: 'Santiago, Chile',
                imagen: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
                texto: 'Increíble. Me ahorré HORAS de planificación. Mi viaje a Tailandia fue perfecto gracias a las recomendaciones.',
                destino: 'Tailandia 🇹🇭',
              },
              {
                nombre: 'Carlos Mendoza',
                ciudad: 'Buenos Aires, Argentina',
                imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
                texto: 'El itinerario estaba tan bien organizado que no perdimos ni un minuto. Ya reservé mi próximo viaje con ellos.',
                destino: 'Japón 🇯🇵',
              },
              {
                nombre: 'Ana Rodríguez',
                ciudad: 'Lima, Perú',
                imagen: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
                texto: 'Viajamos en familia y el itinerario consideró actividades para todos. Los links directos nos ahorraron mucho.',
                destino: 'España 🇪🇸',
              },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 relative">
                <div className="absolute -top-4 right-8 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium">
                  {t.destino}
                </div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">&ldquo;{t.texto}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <img src={t.imagen} alt={t.nombre} className="w-14 h-14 rounded-full object-cover ring-4 ring-white" />
                  <div>
                    <div className="font-bold text-gray-900">{t.nombre}</div>
                    <div className="text-gray-500 text-sm">{t.ciudad}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes y Precios */}
      <section id="precios" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-purple-100 text-purple-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Planes y Precios
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Elige tu experiencia
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Un solo pago. Todo el itinerario listo para reservar. Sin suscripciones.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Vivante Básico */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all relative flex flex-col">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Vivante Básico</h3>
                <p className="text-gray-500 text-sm mb-6">Itinerario personalizado día a día</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$17</span>
                  <span className="text-gray-500 ml-2">USD</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Itinerario completo en PDF',
                    'Links de vuelos y alojamientos',
                    'Puntos de interés',
                    'Tips culturales, de conectividad y dinero',
                    'Tips locales básicos para viajeros',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-gray-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 rounded-2xl border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all mt-auto"
              >
                Comenzar con Básico
              </button>
            </div>

            {/* Vivante Pro */}
            <div className="bg-gray-900 rounded-3xl p-8 border-2 border-gray-900 transition-all relative flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-5 py-2 rounded-full whitespace-nowrap">
                ⭐ RECOMENDADO
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Vivante Pro</h3>
                <p className="text-gray-400 text-sm mb-6">Experiencia premium con todos los detalles</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$28</span>
                  <span className="text-gray-400 ml-2">USD</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Todo lo del Vivante Básico',
                    'Restaurantes recomendados por zona y RRSS',
                    'Opciones de tours y actividades',
                    'Tips de seguridad y transporte',
                    'Tips culturales, de conectividad y dinero',
                    'Presupuesto detallado por día',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-orange-400 mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all mt-auto"
              >
                Comenzar con Pro →
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">

          <div className="text-center mb-10">
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Preguntas frecuentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              &iquest;Ten&eacute;s alguna duda?
            </h2>
            <p className="text-gray-500">Las respuestas que m&aacute;s nos preguntan antes de comprar</p>
          </div>

          <div className="space-y-2">
            {[
              {
                q: '\u00bfC\u00f3mo funciona VIVANTE?',
                a: 'Complet\u00e1s el formulario en 2 minutos: destino, fechas, presupuesto, intereses y estilo de viaje. Eleg\u00eds tu plan (B\u00e1sico o Pro), pag\u00e1s con tarjeta v\u00eda MercadoPago, y en minutos recib\u00eds tu itinerario completo en tu email. Sin esperas, sin llamadas, sin agencias.'
              },
              {
                q: '\u00bfEl itinerario es realmente personalizado para m\u00ed?',
                a: 'S\u00ed, 100%. No es una plantilla gen\u00e9rica. En base a tus preferencias (destino, presupuesto, d\u00edas, intereses, tipo de alojamiento y ritmo de viaje) creamos un itinerario \u00fanico para ti.'
              },
              {
                q: '\u00bfLos vuelos y hoteles est\u00e1n reservados, o son recomendaciones?',
                a: 'Son recomendaciones con links directos para que t\u00fa reserves cuando quieras y al precio que encuentres. VIVANTE no intermedia ni cobra comisi\u00f3n por las reservas \u2014 todo queda entre t\u00fa y la aerol\u00ednea/hotel.'
              },
              {
                q: '\u00bfFunciona para cualquier destino del mundo?',
                a: 'S\u00ed. El formulario acepta cualquier destino. Si ya ten\u00e9s uno en mente, escrib\u00edlo. Si todav\u00eda no decidiste, te ayudamos a encontrar el m\u00e1s adecuado seg\u00fan tus intereses y presupuesto.'
              },
              {
                q: '\u00bfCu\u00e1l es la diferencia entre el plan B\u00e1sico y el Pro?',
                a: 'El B\u00e1sico incluye el itinerario completo d\u00eda a d\u00eda con vuelos, alojamientos, restaurantes, actividades y puntos de inter\u00e9s. El Pro agrega vida nocturna (bares recomendados por redes sociales), tips de seguridad, transporte local detallado, conectividad, frases del idioma local y gu\u00eda de qu\u00e9 empacar seg\u00fan el clima y las actividades.'
              },
              {
                q: '\u00bfCu\u00e1nto tarda en llegar mi itinerario?',
                a: 'En menos de 5 minutos despu\u00e9s de confirmar el pago. Si hay alguna demora, escrib\u00ednos a vive.vivante.ch@gmail.com y lo resolvemos de inmediato.'
              },
              {
                q: '\u00bfPuedo pedir cambios si algo no me convence?',
                a: 'S\u00ed. Si algo no te convence, escrib\u00ednos y lo revisamos. Queremos que tu itinerario sea perfecto antes de que hagas cualquier reserva.'
              },
              {
                q: '\u00bfEs seguro el pago?',
                a: 'S\u00ed. Los pagos se procesan a trav\u00e9s de MercadoPago, con cifrado de nivel bancario. VIVANTE no almacena datos de tu tarjeta.'
              }
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>
      {/* CTA Final */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-pink-600/90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Cuéntanos cómo quieres viajar y nosotros nos encargamos del resto.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="group bg-white text-gray-900 px-10 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
          >
            Planificar mi viaje
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ✅ CAMBIO 3, 4: Footer con íconos de redes sociales y cajita de contacto */}
      <footer className="bg-gray-900 text-gray-400 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center">
              <Image
                src="/images/vivante_logo.svg"
                alt="VIVANTE"
                width={110}
                height={80}
                style={{ height: '40px', width: 'auto' }}
              />
            </div>

            {/* Links + Contacto con cajita */}
            <div className="flex gap-8 text-sm items-center">
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <div className="relative">
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="hover:text-white transition-colors"
                >
                  Contacto
                </button>
                {showContact && (
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white text-gray-800 rounded-xl p-4 shadow-xl min-w-[300px] text-sm z-50">
                    <button
                      onClick={() => setShowContact(false)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ✕
                    </button>
                    <p className="font-semibold mb-1">¿Dudas o consultas?</p>
                    <p className="text-gray-600">
                      Escríbenos a{' '}
                      <a
                        href="mailto:vive.vivante.ch@gmail.com"
                        className="text-orange-500 hover:underline font-medium"
                      >
                        vive.vivante.ch@gmail.com
                      </a>
                    </p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white shadow-sm"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ✅ CAMBIO 3: Íconos de Instagram y TikTok */}
          <div className="flex justify-center gap-5 mt-8">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/vive.vivante"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@vive.vivante"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/>
              </svg>
            </a>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © {new Date().getFullYear()} VIVANTE. Hecho con ❤️ para viajeros como tú.
          </div>
        </div>
      </footer>

      {/* Modal del formulario */}
      {showForm && <TravelForm onClose={() => setShowForm(false)} initialDestino={initialDestino} />}
    </main>
  );
}
