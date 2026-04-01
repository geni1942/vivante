import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // ── Intereses con prioridad ───────────────────────────────────────────────
    const interesesMap = {
      'playa': 'Playa y mar', 'cultura': 'Cultura e historia',
      'aventura': 'Aventura y deportes extremos', 'gastronomia': 'Gastronom\u00eda',
      'relax': 'Relax y bienestar', 'naturaleza': 'Naturaleza y paisajes',
      'nocturna': 'Vida nocturna', 'deporte': 'Deportes', 'shopping': 'Compras y shopping',
    };
    const interesesArray = Array.isArray(data.intereses) ? data.intereses : [];
    const interesesTexto = interesesArray.length > 0
      ? interesesArray.map((i, idx) => {
          const pesos = ['PRINCIPAL', 'secundario', 'complementario', 'ocasional'];
          return `${interesesMap[i] || i} (${pesos[idx] || 'ocasional'})`;
        }).join(', ')
      : 'cultura, gastronom\u00eda';

    const ritmoTexto = data.ritmo <= 2 ? 'relajado' : data.ritmo <= 3 ? 'moderado' : 'intenso';

    const alojamientoMap = {
      'hotel':  'Hotel (mid-range a premium)',
      'airbnb': 'Airbnb / apartamento privado',
      'hostal': 'Hostal (econ\u00f3mico, social)',
      'bnb':    'Bed & Breakfast (peque\u00f1o, familiar)',
    };
    const alojTexto = alojamientoMap[data.alojamiento] || 'Hotel';

    // ── Contexto de ocasi\u00f3n especial ─────────────────────────────────────────
    const ocasionSuggestMap = {
      'luna-de-miel': 'LUNA DE MIEL \u2014 destinos ultra-rom\u00e1nticos e \u00edntimos, opciones de hoteles boutique especiales',
      'aniversario':  'ANIVERSARIO \u2014 destinos rom\u00e1nticos con experiencias memorables de pareja',
      'despedida':    'DESPEDIDA DE SOLTERO/A \u2014 destinos con buena vida nocturna y actividades de adrenalina grupal',
      'cumpleanos':   'CUMPLEA\u00d1OS \u2014 destinos festivos con buena variedad de actividades grupales',
      'graduacion':   'GRADUACI\u00d3N \u2014 destinos con experiencias premium accesibles para celebrar',
    };
    const ocasionCtxSuggest = data.ocasionEspecial && ocasionSuggestMap[data.ocasionEspecial]
      ? `\n- Ocasi\u00f3n especial: ${ocasionSuggestMap[data.ocasionEspecial]}`
      : '';

    // ── Contexto de mes de viaje ──────────────────────────────────────────────
    const mesCtx = data.mesViaje
      ? `\n- Mes de viaje preferido: ${data.mesViaje.replace('-', ' ')} \u2014 considera temporada, clima y precios de esa \u00e9poca`
      : '';

    // ── Prioridad de gasto ────────────────────────────────────────────────────
    const prioridadSuggestMap = {
      'vuelo-directo': 'prefiere destinos con vuelo directo disponible desde su ciudad de origen',
      'mejor-hotel':   'prioriza destinos con buena oferta hotelera de calidad',
      'actividades':   'prioriza destinos con abundante oferta de actividades y experiencias',
      'gastronomia':   'prioriza destinos reconocidos por su gastronom\u00eda',
    };
    const prioridadCtxSuggest = data.prioridadGasto && data.prioridadGasto !== 'equilibrado' && prioridadSuggestMap[data.prioridadGasto]
      ? `\n- Preferencia de gasto: ${prioridadSuggestMap[data.prioridadGasto]}`
      : '';

    // ── Restricci\u00f3n dietaria ──────────────────────────────────────────────────
    const restriccionSuggestMap = {
      'vegetariano': 'VEGETARIANO \u2014 prioriza destinos con amplia oferta vegetariana real (no solo ensaladas). Ciudades universitarias y cosmopolitas son ideales. EVITA destinos donde la cocina local sea principalmente carne (ej: Buenos Aires asado-c\u00e9ntrico es factible en ciudad; zonas rurales de Argentina, no).',
      'vegano':      'VEGANO \u2014 prioriza destinos con cultura plant-based establecida: Berl\u00edn, Amsterdam, Barcelona, Ciudad de M\u00e9xico, Bangkok, Bali, Lisboa. PENALIZA destinos donde el veganismo es muy dif\u00edcil: zonas rurales de Europa del Este, ciudades medianas de LATAM sin oferta diversa.',
      'sin-gluten':  'SIN GLUTEN \u2014 prioriza destinos donde el sin-gluten es conocido y accesible. EVITA destinos con cocina basada en pasta/pan masivo sin alternativas (sur de Italia rural, por ejemplo). Incluye en el "por_que" c\u00f3mo manejar la restricci\u00f3n en ese destino.',
      'halal':       'HALAL \u2014 prioriza destinos con comunidad musulmana establecida y oferta halal clara: Estambul, Dubai, Kuala Lumpur, M\u00e9xico DF, Madrid (barrio de Lavapi\u00e9s), etc. Penaliza destinos donde sea muy dif\u00edcil encontrar opciones halal.',
    };
    const restriccionCtxSuggest = data.restriccionDietaria && data.restriccionDietaria !== 'sin-restriccion' && restriccionSuggestMap[data.restriccionDietaria]
      ? `\n- Alimentaci\u00f3n: ${restriccionSuggestMap[data.restriccionDietaria]}`
      : '';

    // ── Experiencia como viajero ──────────────────────────────────────────────
    const experienciaCtxSuggest = data.experienciaViajero === 'frecuente'
      ? '\n- Perfil: viajero frecuente \u2014 evita los destinos m\u00e1s obvios y tur\u00edsticos, propone opciones con m\u00e1s car\u00e1cter y menos masificadas'
      : data.experienciaViajero === 'primera-vez'
      ? '\n- Perfil: primera experiencia viajando \u2014 prioriza destinos amigables para viajeros novatos, bien conectados y seguros'
      : '';

    // ── Familia con ni\u00f1os ─────────────────────────────────────────────────────
    const numNinos = data.numNinos || 0;
    const familiaCtx = data.tipoViaje === 'familia' && numNinos > 0
      ? `\n- Viaje familiar con ${numNinos} ni\u00f1o${numNinos > 1 ? 's' : ''}: prioriza destinos seguros con actividades para todas las edades. EVITA destinos de fiesta, aventura extrema o sin infraestructura familiar.`
      : data.tipoViaje === 'familia'
        ? `\n- Viaje familiar: prioriza destinos seguros con atracciones para todas las edades.`
        : '';

    const tipoViajeMap = {
      'solo': 'viajero solo', 'pareja': 'pareja', 'familia': 'familia', 'amigos': 'grupo de amigos',
    };
    const tipoViajero = tipoViajeMap[data.tipoViaje] || data.tipoViaje;

    // ── Regla de presupuesto ─────────────────────────────────────────────────
    const _presupuestoNum = parseInt(data.presupuesto) || 0;
    const _presupuestoDiaSuggest = _presupuestoNum > 0 ? Math.round(_presupuestoNum / (parseInt(data.dias) || 7)) : 0;
    const presupuestoReglaSuggest = _presupuestoNum > 0
      ? `\n- PRESUPUESTO M\u00c1XIMO: $${_presupuestoNum} USD por persona TOTAL \u2014 el precio_estimado de CADA opci\u00f3n DEBE ser \u2264 $${_presupuestoNum}. ${
          _presupuestoDiaSuggest < 100
            ? `Con $${_presupuestoDiaSuggest}/d\u00eda, OBLIGATORIO priorizar destinos econ\u00f3micos: LATAM (Colombia, Per\u00fa, M\u00e9xico, Bolivia, Guatemala, Nicaragua), Europa del Este (Budapest, Praga, Varsovia, Belgrado, Bucarest). PROHIBIDOS destinos de alto costo: Hawaii, Maldivas, Seychelles, Islandia, Dub\u00e1i, Tokio, Nueva York, Londres, Zurich \u2014 el vuelo+hotel b\u00e1sico ya consume o supera el presupuesto total sin dejar margen para actividades.`
            : _presupuestoDiaSuggest < 180
            ? `Con $${_presupuestoDiaSuggest}/d\u00eda prioriza LATAM y Europa mid-range. Hawaii, Maldivas, Dub\u00e1i, Islandia y Seychelles requieren m\u00ednimo $200/d\u00eda para una experiencia completa \u2014 solo sug\u00edrelos si el presupuesto claramente lo permite.`
            : `Presupuesto premium ($${_presupuestoDiaSuggest}/d\u00eda). Hawaii, Europa Occidental, Dub\u00e1i, Jap\u00f3n y destinos de lujo son viables \u2014 prop\u00f3n opciones que aprovechen bien ese nivel.`
        }`
      : '';

    // ── Regla distancia/eficiencia por d\u00edas ──────────────────────────────────
    const _origenNormS = (data.origen || '').toLowerCase();
    // Detecci\u00f3n ampliada: pa\u00edses Y ciudades principales de LATAM
    const _esSudAmericaS = [
      // Pa\u00edses
      'chile','argentina','per\u00fa','peru','colombia','brasil','brazil',
      'bolivia','ecuador','uruguay','venezuela','paraguay',
      // Ciudades principales
      'santiago','buenos aires','lima','bogot\u00e1','bogota','s\u00e3o paulo','sao paulo',
      'rio de janeiro','m\u00e9xico','mexico','ciudad de m\u00e9xico','ciudad de mexico',
      'montevideo','asunci\u00f3n','asuncion','quito','la paz','caracas',
      'medell\u00edn','medellin','c\u00e1li','cali','barranquilla',
      'porto alegre','belo horizonte','salvador','brasilia',
      'guayaquil','cochabamba','santa cruz',
    ].some(p => _origenNormS.includes(p));
    const _diasNum = parseInt(data.dias) || 7;

    // 3.1 — Regla de distancia con 5 rangos ───────────────────────────────────
    const distanciaReglaSuggest = _diasNum <= 3
      ? `\n- DISTANCIA CR\u00cdTICA \u2014 SOLO ${_diasNum} D\u00cdA${_diasNum === 1 ? '' : 'S'}: OBLIGATORIO proponer \u00daNICAMENTE destinos con m\u00e1ximo 4h de vuelo desde ${data.origen || 'el origen'}.${_esSudAmericaS ? ' (LATAM cercano, Caribe inmediato)' : ''} PROHIBIDOS destinos con vuelo >4h \u2014 el tiempo de traslado hace inviable el viaje. Esto NO es opcional.`
      : _diasNum === 4
      ? `\n- DISTANCIA CR\u00cdTICA \u2014 SOLO 4 D\u00cdAS: OBLIGATORIO proponer \u00daNICAMENTE destinos con m\u00e1ximo 6h de vuelo desde ${data.origen || 'el origen'}.${_esSudAmericaS ? ' (Sudam\u00e9rica, Caribe cercano, M\u00e9xico)' : ''} PROHIBIDOS destinos con vuelo >6h. Esto NO es opcional.`
      : _diasNum <= 7
      ? `\n- DISTANCIA CR\u00cdTICA \u2014 ${_diasNum} D\u00cdAS: OBLIGATORIO respetar estas reglas de forma estricta: (1) AL MENOS 2 DE LAS 3 OPCIONES deben tener vuelo \u22648h desde ${data.origen || 'el origen'}. (2) ABSOLUTAMENTE PROHIBIDO sugerir Jap\u00f3n, Sudeste Asi\u00e1tico (Tailandia, Vietnam, Indonesia, etc.), Ocean\u00eda (Australia, Nueva Zelanda) o cualquier destino con vuelo >12h \u2014 con ${_diasNum} d\u00edas solo quedan 2-3 d\u00edas reales en destino despu\u00e9s del tr\u00e1nsito, lo que hace el viaje inviable. (3) Hawaii puede considerarse solo si el presupuesto lo justifica claramente (vuelo desde ${data.origen || 'el origen'} + alojamiento en Hawaii es de alto costo) e IMPRESCINDIBLE indicar en "por_que" los d\u00edas reales disponibles. (4) Europa del Oeste es el l\u00edmite m\u00e1ximo SOLO si encaja claramente con los intereses, e IMPRESCINDIBLE indicar en "por_que" cu\u00e1ntos d\u00edas reales quedan en destino. (5) Si el usuario tiene inter\u00e9s expl\u00edcito en Asia u Ocean\u00eda, recomendar igual un destino cercano que satisfaga ese inter\u00e9s (ej: inter\u00e9s en culturas asi\u00e1ticas \u2192 M\u00e9xico con influencia oriental, o Canarias, no Tokio).`
      : _diasNum <= 11
      ? `\n- DISTANCIA \u2014 ${_diasNum} D\u00cdAS: PROHIBIDOS Ocean\u00eda y Asia muy lejana (>16h de vuelo). Para destinos de 12-14h (Jap\u00f3n, Sudeste Asi\u00e1tico): solo incluirlos si los intereses del viajero los justifican claramente, e incluir en "por_que" los d\u00edas reales disponibles en destino.`
      : `\n- DISTANCIA \u2014 ${_diasNum} D\u00cdAS: Presupuesto de tiempo amplio. Cualquier destino es viable si encaja con el perfil y el presupuesto. Para vuelos >12h: incluir en "por_que" los d\u00edas reales disponibles en destino.`;

    // 3.2 — Regla cruzada presupuesto \u00d7 origen ──────────────────────────────────
    const presupuestoOrigenRegla = _esSudAmericaS && _presupuestoNum > 0
      ? _presupuestoNum < 800
        ? `\n- REGLA ORIGEN+PRESUPUESTO: Origen sudamericano con presupuesto bajo ($${_presupuestoNum} total). OBLIGATORIO priorizar destinos DENTRO de Sudam\u00e9rica o Caribe (Colombia, Per\u00fa, Bolivia, Brasil, Argentina, Uruguay, Centroam\u00e9rica, Cuba, Rep. Dominicana). Un vuelo intercontinental a Europa o Asia ya consume la mayor parte del presupuesto \u2014 son INVIABLES.`
        : _presupuestoNum < 1500
        ? `\n- REGLA ORIGEN+PRESUPUESTO: Origen sudamericano con presupuesto medio ($${_presupuestoNum} total). Priorizar LATAM y Caribe. Europa es factible solo en destinos accesibles (Lisboa, Madrid, Roma con low cost); EVITA m\u00faltiples ciudades europeas o destinos de alto costo como Jap\u00f3n, Dubai o Escandinavia.`
        : ''
      : '';

    // 3.3 — Contexto clim\u00e1tico por mes + preferencia ────────────────────────────
    const _mesNum = data.mesViaje ? (parseInt((data.mesViaje.match(/\d+$/) || [])[0]) || null) : null;
    const _mesesVeranoNorte = [6, 7, 8];
    const _mesesInviernoNorte = [12, 1, 2];
    const _estacionNorte = _mesNum
      ? (_mesesVeranoNorte.includes(_mesNum) ? 'verano' : _mesesInviernoNorte.includes(_mesNum) ? 'invierno' : [3,4,5].includes(_mesNum) ? 'primavera' : 'oto\u00f1o')
      : null;
    const _estacionSur = _mesNum
      ? (_mesesVeranoNorte.includes(_mesNum) ? 'invierno' : _mesesInviernoNorte.includes(_mesNum) ? 'verano' : [3,4,5].includes(_mesNum) ? 'oto\u00f1o' : 'primavera')
      : null;

    const climaPreferidoMap = {
      'calido':   'CLIMA C\u00c1LIDO \u2014 prioriza destinos con temperaturas >22\u00b0C en la fecha elegida. EVITA destinos fr\u00edos, lluviosos o con invierno en esa \u00e9poca.',
      'templado': 'CLIMA TEMPLADO \u2014 prioriza destinos con temperaturas entre 15-25\u00b0C, sin extremos de calor ni fr\u00edo.',
      'frio':     'CLIMA FR\u00cdO O NIEVE \u2014 prioriza destinos de monta\u00f1a, nieve o temperaturas bajas. Ideal para esqu\u00ed, paisajes invernales o escape del calor.',
    };
    const climaCtx = (data.climaPreferido && data.climaPreferido !== 'cualquiera' && climaPreferidoMap[data.climaPreferido])
      ? `\n- Preferencia clim\u00e1tica: ${climaPreferidoMap[data.climaPreferido]}${_estacionNorte ? ` (Referencia: en el mes elegido es ${_esSudAmericaS ? _estacionSur : _estacionNorte} en origen \u2014 ajusta la estaci\u00f3n seg\u00fan el hemisferio del destino.)` : ''}`
      : _estacionNorte
      ? `\n- Estaci\u00f3n en el mes elegido: ${_esSudAmericaS ? _estacionSur : _estacionNorte} en origen. Para cada destino propuesto, indica si es buena \u00e9poca o si hay temporada de lluvias/calor extremo/alta temporada tur\u00edstica que afecte la experiencia.`
      : '';

    // 3.4 — Reglas cruzadas tipo de viaje \u00d7 restricciones \u00d7 preferencias ─────────
    const cruzadoCtxParts = [];

    if (data.toleranciaVuelo === 'corto') {
      cruzadoCtxParts.push('TOLERANCIA AL VUELO BAJA: el viajero prefiere vuelos cortos (m\u00e1x 5-6h). Prioriza destinos regionales aunque el presupuesto permita m\u00e1s. EVITA vuelos >8h.');
    } else if (data.toleranciaVuelo === 'largo') {
      cruzadoCtxParts.push('TOLERANCIA AL VUELO ALTA: acepta vuelos largos. Puede considerar destinos lejanos si el presupuesto y los d\u00edas lo permiten.');
    }

    if (Array.isArray(data.idiomasHablados) && data.idiomasHablados.length > 0) {
      const idiomaMap = {
        'espa\u00f1ol': 'espa\u00f1ol', 'ingles': 'ingl\u00e9s', 'frances': 'franc\u00e9s',
        'portugues': 'portugu\u00e9s', 'italiano': 'italiano', 'aleman': 'alem\u00e1n',
      };
      const idiomasTexto = data.idiomasHablados.map(i => idiomaMap[i] || i).join(', ');
      const soloEspanol = data.idiomasHablados.length === 1 && data.idiomasHablados[0] === 'espa\u00f1ol';
      const hablaIngles = data.idiomasHablados.includes('ingles');
      cruzadoCtxParts.push(
        `Idiomas hablados: ${idiomasTexto}. ${soloEspanol ? 'PRIORIZA LATAM y Espa\u00f1a donde el espa\u00f1ol es suficiente. En destinos no hispanohablantes, menciona en "por_que" c\u00f3mo gestionar el idioma.' : hablaIngles ? 'Habla ingl\u00e9s: el mundo angloparlante y el turismo global est\u00e1n plenamente disponibles.' : 'Considera destinos donde los idiomas del viajero sean \u00fatiles o valorados.'}`
      );
    }

    if (data.tipoViaje === 'solo' && data.restriccionDietaria && data.restriccionDietaria !== 'sin-restriccion') {
      cruzadoCtxParts.push(`Viajero solo con restricci\u00f3n dietaria (${data.restriccionDietaria}): prioriza destinos con comunidad de viajeros activa y buena oferta gastron\u00f3mica alternativa, donde sea f\u00e1cil comer solo con esa restricci\u00f3n.`);
    }

    if (data.tipoViaje === 'familia' && data.toleranciaVuelo === 'corto') {
      cruzadoCtxParts.push('Familia con baja tolerancia al vuelo: prioriza especialmente destinos regionales cortos, evitando escalas largas o vuelos de >5h que sean agotadores con ni\u00f1os.');
    }

    const cruzadoCtx = cruzadoCtxParts.length > 0
      ? '\n- ' + cruzadoCtxParts.join('\n- ')
      : '';

    // Prompt para generar 3 opciones de destino
    const prompt = `Eres un experto en viajes. Genera exactamente 3 opciones de destino para este viajero. Las 3 opciones deben ser las MEJORES para su perfil espec\u00edfico \u2014 no sigas un formato r\u00edgido de tipos, elige lo que realmente encaje mejor.

PERFIL DEL VIAJERO:
- Origen: ${data.origen}
- Presupuesto: $${data.presupuesto} USD por persona (incluye vuelos, hotel y actividades)
- Duraci\u00f3n: ${data.dias} d\u00edas
- Tipo de viajero: ${tipoViajero} (${data.numViajeros} personas)
- Intereses EN PRIORIDAD: ${interesesTexto}
- Ritmo preferido: ${ritmoTexto}
- Alojamiento preferido: ${alojTexto}${familiaCtx}${ocasionCtxSuggest}${mesCtx}${prioridadCtxSuggest}${restriccionCtxSuggest}${experienciaCtxSuggest}${presupuestoReglaSuggest}${presupuestoOrigenRegla}${distanciaReglaSuggest}${climaCtx}${cruzadoCtx}

REGLAS:
- Variedad: las 3 opciones deben ser destinos diferentes entre s\u00ed (diferentes regiones o pa\u00edses)
- Al menos una opci\u00f3n debe ser multidestino si los d\u00edas lo permiten (${data.dias >= 7 ? 'los d\u00edas lo permiten' : 'con cuidado si los d\u00edas son pocos'})
- El precio estimado debe ser REALISTA considerando vuelos desde ${data.origen}
- Los destinos deben coincidir directamente con los intereses priorizados
- Si hay restricci\u00f3n dietaria, los destinos deben tenerla cubierta
- Si hay ocasi\u00f3n especial, los destinos deben potenciarla
- Si el alojamiento es "Hostal": prioriza la ruta mochilera (Bangkok, Lisboa, Medell\u00edn, Berl\u00edn, etc.)
- Si es "B&B": ciudades medianas con encanto (Toscana, Provence, Alentejo) sobre megal\u00f3polis
- El presupuesto es por persona
- Considera que un vuelo largo consume d\u00edas reales del viaje (vuelo >8h = 1 d\u00eda perdido por tramo; vuelo >12h = 2 d\u00edas perdidos)
- Calcula y completa el campo "dias_reales_en_destino" = d\u00edas totales - d\u00edas perdidos en tr\u00e1nsito (ida + vuelta). Ejemplo: 7 d\u00edas con vuelo 13h = 7 - 2 = 5 d\u00edas reales
${_diasNum <= 3 ? `- REGLA DE DISTANCIA OBLIGATORIA (${_diasNum} d\u00edas): SOLO destinos con vuelo \u22644h. RECHAZA cualquier destino con vuelo >4h. Esta regla es ABSOLUTA.` : _diasNum === 4 ? `- REGLA DE DISTANCIA OBLIGATORIA (4 d\u00edas): SOLO destinos con vuelo \u22646h. RECHAZA cualquier destino con vuelo >6h. Esta regla es ABSOLUTA.` : _diasNum <= 7 ? `- REGLA DE DISTANCIA OBLIGATORIA (${_diasNum} d\u00edas): RECHAZA Jap\u00f3n, Australia, Nueva Zelanda, Sudeste Asi\u00e1tico o cualquier destino con vuelo >12h. Hawaii solo si el presupuesto lo justifica (destino de alto costo). M\u00cdNIMO 2 de tus 3 opciones deben tener vuelo \u22648h. Esta regla es ABSOLUTA.` : ''}
- PRESUPUESTO ESTRICTO: el precio_estimado de CADA opci\u00f3n debe ser \u2264 $${data.presupuesto} USD. Calcula real\u00edsticamente vuelo (ida+vuelta desde ${data.origen}) + hotel (${data.dias} noches) + actividades antes de proponer.

Responde \u00daNICAMENTE en este formato JSON exacto, sin texto adicional:
{
  "opciones": [
    {
      "id": 1,
      "tipo": "multidestino",
      "destino": "Roma + Par\u00eds",
      "paises": "Italia y Francia",
      "dias_distribucion": "4 d\u00edas Roma + 3 d\u00edas Par\u00eds",
      "precio_estimado": 1850,
      "dias_reales_en_destino": 5,
      "porque": "Combinaci\u00f3n perfecta de historia, arte y gastronom\u00eda mediterr\u00e1nea y francesa",
      "highlights": ["Coliseo y Vaticano", "Torre Eiffel y Louvre", "Pasta romana y croissants parisinos"]
    },
    {
      "id": 2,
      "tipo": "monopais",
      "destino": "Barcelona + Madrid",
      "paises": "Espa\u00f1a",
      "dias_distribucion": "4 d\u00edas Barcelona + 3 d\u00edas Madrid",
      "precio_estimado": 1200,
      "dias_reales_en_destino": 5,
      "porque": "Lo mejor de Espa\u00f1a: playa mediterr\u00e1nea y cultura urbana",
      "highlights": ["Sagrada Familia y playas", "Museo del Prado y tapas", "Tren AVE entre ciudades"]
    },
    {
      "id": 3,
      "tipo": "destino_unico",
      "destino": "Lisboa",
      "paises": "Portugal",
      "dias_distribucion": "7 d\u00edas completos",
      "precio_estimado": 950,
      "dias_reales_en_destino": 7,
      "porque": "Ciudad costera con encanto, asequible y llena de historia",
      "highlights": ["Barrio de Alfama", "Past\u00e9is de Bel\u00e9m", "Excursi\u00f3n a Sintra"]
    }
  ]
}`;

    // Llamar a Groq
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en viajes que genera recomendaciones de destinos. Siempre respondes en formato JSON v\u00e1lido, sin texto adicional ni markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      console.error('Error de Groq:', errorData);
      // Fallback a modelo alternativo
      if (groqResponse.status === 429 || groqResponse.status === 413 || groqResponse.status === 503) {
        console.log('Intentando fallback con llama-3.3-70b-versatile...');
        const groqFallback = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'Eres un experto en viajes que genera recomendaciones de destinos. Siempre respondes en formato JSON v\u00e1lido, sin texto adicional ni markdown.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 1500,
          }),
        });
        if (groqFallback.ok) {
          const groqData2 = await groqFallback.json();
          const responseText2 = groqData2.choices[0]?.message?.content || '';
          const jsonMatch2 = responseText2.match(/\{[\s\S]*\}/);
          if (jsonMatch2) {
            const opciones2 = JSON.parse(jsonMatch2[0]);
            return NextResponse.json({ success: true, opciones: opciones2.opciones, _model: 'fallback' });
          }
        }
      }
      throw new Error('Error al generar sugerencias');
    }

    const groqData = await groqResponse.json();
    const responseText = groqData.choices[0]?.message?.content || '';

    // Parsear JSON de la respuesta
    let opciones;
    try {
      // Intentar extraer JSON si viene con texto adicional
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        opciones = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontr\u00f3 JSON v\u00e1lido');
      }
    } catch (parseError) {
      console.error('Error parseando respuesta:', responseText);
      throw new Error('Error al procesar sugerencias');
    }

    return NextResponse.json({
      success: true,
      opciones: opciones.opciones
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al generar sugerencias' },
      { status: 500 }
    );
  }
}
