import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData, planId } = body;

    if (!formData?.email || !formData?.nombre) {
      return NextResponse.json({ error: 'Faltan datos del formulario' }, { status: 400 });
    }

    const isPro = planId === 'pro';
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return NextResponse.json({ error: 'Configuración incompleta del servidor' }, { status: 500 });
    }

    // ─── PROMPT BASICO ─────────────────────────────────────────────────────────
    const promptBasico = `Eres el planificador de viajes de VIVANTE. Tu trabajo es crear itinerarios que hagan que el cliente piense: "¿Cómo viajaba antes sin esto?" Todo debe ser COMPLETO, DETALLADO y LISTO PARA RESERVAR, con el tono cálido y cercano de VIVANTE: directo, sin tecnicismos, como si un amigo experto te armara el viaje perfecto.

Voz VIVANTE:
✅ "Este café frente al mar es un secreto local que vale cada peso"
✅ "Tu única tarea el día 3: disfrutar"
✅ "Reserva esto con 2 semanas de anticipación o te quedas sin cupo"
❌ "El establecimiento ofrece servicios gastronómicos de calidad"

DATOS DEL CLIENTE:
- Nombre: ${formData.nombre}
- Destino: ${formData.destino || 'Destino flexible'}
- Origen: ${formData.origen || 'Chile'}
- Presupuesto: $${formData.presupuesto >= 15000 ? '15.000+' : formData.presupuesto} USD por persona
- Duración: ${formData.dias} días
- Tipo de viajero: ${formData.tipoViaje || 'pareja'}
- Número de viajeros: ${formData.numViajeros || 2}
- Intereses: ${Array.isArray(formData.intereses) ? formData.intereses.join(', ') : formData.intereses || 'cultura, gastronomía'}
- Ritmo: ${formData.ritmo <= 2 ? 'Relajado' : formData.ritmo <= 3 ? 'Moderado' : 'Intenso'}
- Alojamiento: ${formData.alojamiento || 'hotel'}

GENERA un JSON con EXACTAMENTE esta estructura (sin texto extra, solo el JSON):
{
  "titulo": "string con título creativo del viaje",
  "subtitulo": "string con tagline motivador",
  "resumen": {
    "destino": "string",
    "origen": "string",
    "dias": número,
    "viajeros": número,
    "tipo": "string",
    "presupuesto_total": "string en USD",
    "ritmo": "string",
    "fecha_optima": "string con mes recomendado para viajar",
    "distribucion": "string con distribución de días por zona"
  },
  "presupuesto_desglose": {
    "vuelos": "string con precio estimado",
    "alojamiento": "string con precio estimado",
    "comidas": "string con precio estimado",
    "actividades": "string con precio estimado",
    "transporte_local": "string con precio estimado",
    "extras": "string con precio estimado",
    "total": "string con total estimado"
  },
  "vuelos": [
    { "aerolinea": "string", "ruta": "string", "precio_estimado": "string", "link": "string URL real de Google Flights o Skyscanner" }
  ],
  "alojamiento": [
    { "categoria": "string (Económico/Confort/Premium)", "nombre": "string con nombre real", "precio_noche": "string en USD", "por_que": "string con razón de elección", "link": "string URL Booking o Airbnb" }
  ],
  "dias": [
    {
      "numero": número,
      "titulo": "string con título creativo",
      "manana": { "actividad": "string detallado", "horario": "string", "costo": "string", "tip": "string con consejo insider" },
      "tarde": { "almuerzo": "string con nombre restaurante y precio", "actividad": "string detallado", "costo": "string" },
      "noche": { "cena": "string con nombre restaurante y precio", "actividad": "string" },
      "gasto_dia": "string en USD"
    }
  ],
  "restaurantes": [
    { "nombre": "string", "ubicacion": "string", "tipo": "string", "precio_promedio": "string", "requiere_reserva": boolean, "link": "string URL si existe" }
  ],
  "dinero": {
    "moneda_local": "string",
    "tipo_cambio": "string",
    "tarjeta_o_efectivo": "string",
    "donde_cambiar": "string",
    "propinas": "string",
    "tip_extra": "string"
  },
  "seguro": [
    { "nombre": "Assist Card", "cobertura": "string", "precio_estimado": "string", "link": "https://www.assistcard.com" },
    { "nombre": "World Nomads", "cobertura": "string", "precio_estimado": "string", "link": "https://www.worldnomads.com/es" },
    { "nombre": "IATI Seguros", "cobertura": "string", "precio_estimado": "string", "link": "https://www.iatitravel.com" }
  ],
  "tips_culturales": [
    "string con tip cultural o de conectividad",
    "string con tip de dinero o pago",
    "string con tip de transporte o seguridad",
    "string con tip de idioma o costumbres",
    "string con tip de conectividad o apps"
  ],
  "checklist": ["string", "string", "string", "string", "string", "string", "string", "string"],
  "emergencias": {
    "embajada": "string con dirección y teléfono",
    "emergencias_local": "string con número",
    "policia_turistica": "string si existe"
  },
  "lo_imperdible": [
    { "nombre": "string", "descripcion": "string inspirador de por qué es imperdible" }
  ]
}

IMPORTANTE:
- Precios REALISTAS para el presupuesto indicado
- Adaptar TODO a los intereses del cliente
- Lenguaje cercano, cálido, como VIVANTE
- JSON puro sin markdown, sin \`\`\`json`;

    // ─── PROMPT PRO ────────────────────────────────────────────────────────────
    const promptPro = `Eres el planificador PRO de VIVANTE. Tu trabajo es crear itinerarios que dejen al cliente sin palabras — esos que guarda en favoritos y comparte con todo el mundo. Todo debe ser EXTRAORDINARIO, ULTRA-DETALLADO y LISTO PARA RESERVAR, con el tono cálido y directo de VIVANTE.

Voz VIVANTE:
✅ "Este rincón no sale en ninguna guía. Te lo guardamos solo para ti"
✅ "Tu única tarea en este viaje: hacer la maleta"
✅ "Reserva la mesa del chef con 3 semanas de anticipación — se llena siempre"

DATOS DEL CLIENTE:
- Nombre: ${formData.nombre}
- Destino: ${formData.destino || 'Destino flexible'}
- Origen: ${formData.origen || 'Chile'}
- Presupuesto: $${formData.presupuesto >= 15000 ? '15.000+' : formData.presupuesto} USD por persona
- Duración: ${formData.dias} días
- Tipo de viajero: ${formData.tipoViaje || 'pareja'}
- Número de viajeros: ${formData.numViajeros || 2}
- Intereses: ${Array.isArray(formData.intereses) ? formData.intereses.join(', ') : formData.intereses || 'cultura, gastronomía'}
- Ritmo: ${formData.ritmo <= 2 ? 'Relajado' : formData.ritmo <= 3 ? 'Moderado' : 'Intenso'}
- Alojamiento: ${formData.alojamiento || 'hotel'}

GENERA un JSON con EXACTAMENTE esta estructura (sin texto extra, solo el JSON):
{
  "titulo": "string con título creativo del viaje",
  "subtitulo": "string con tagline motivador",
  "resumen": {
    "destino": "string",
    "origen": "string",
    "dias": número,
    "viajeros": número,
    "tipo": "string",
    "presupuesto_total": "string en USD",
    "ritmo": "string",
    "fecha_optima": "string con mes recomendado",
    "distribucion": "string con distribución de días por zona"
  },
  "presupuesto_desglose": {
    "vuelos": "string",
    "alojamiento": "string",
    "comidas": "string",
    "actividades": "string",
    "transporte_local": "string",
    "extras": "string",
    "total": "string"
  },
  "vuelos": [
    { "aerolinea": "string", "ruta": "string", "precio_estimado": "string", "tip": "string", "link": "string URL" }
  ],
  "alojamiento": [
    { "categoria": "string", "nombre": "string", "precio_noche": "string USD", "por_que": "string", "link": "string URL Booking/Airbnb" }
  ],
  "dias": [
    {
      "numero": número,
      "titulo": "string creativo",
      "manana": { "horario": "8:00-12:00", "actividad": "string detallado", "costo": "string", "tip": "string insider", "plan_b": "string si llueve" },
      "tarde": { "horario": "12:00-18:00", "almuerzo": "string con restaurante y precio", "actividad": "string", "costo": "string" },
      "noche": { "horario": "18:00-22:00", "cena": "string con restaurante y precio", "actividad": "string" },
      "ruta_optimizada": "string con orden lógico del día",
      "gasto_dia": "string USD"
    }
  ],
  "restaurantes": [
    { "nombre": "string", "ubicacion": "string", "tipo": "string", "precio_promedio": "string", "requiere_reserva": boolean, "instagram": "string si existe", "link": "string URL" }
  ],
  "bares_vida_nocturna": [
    { "nombre": "string", "tipo_ambiente": "string", "precio_trago": "string", "mejor_dia": "string", "tip": "string" }
  ],
  "redes_sociales": {
    "tiktok_restaurantes": "string URL TikTok search",
    "tiktok_hidden_gems": "string URL TikTok search",
    "instagram_food": "string URL Instagram hashtag",
    "instagram_travel": "string URL Instagram hashtag"
  },
  "tours_experiencias": [
    { "nombre": "string", "por_que_vale": "string", "duracion": "string", "precio": "string", "anticipacion": "string", "link": "string URL GetYourGuide/Viator/Civitatis" }
  ],
  "transporte_local": {
    "como_moverse": "string",
    "apps_recomendadas": ["string"],
    "tarjeta_transporte": "string",
    "costo_aeropuerto_centro": "string",
    "conviene_auto": "string con sí/no y por qué"
  },
  "dinero": {
    "moneda_local": "string",
    "tipo_cambio": "string",
    "tarjeta_o_efectivo": "string",
    "donde_cambiar": "string",
    "cajeros": "string",
    "propinas": "string",
    "tip_extra": "string"
  },
  "conectividad": {
    "roaming": "string",
    "esim_recomendada": "string (Airalo o Holafly) con precio aprox",
    "sim_local": "string",
    "wifi_destino": "string",
    "apps_descargar": ["string"]
  },
  "que_empacar": {
    "clima": "string",
    "ropa": ["string"],
    "adaptador": "string",
    "botiquin": ["string"],
    "esenciales": ["string"]
  },
  "festivos_horarios": {
    "feriados_en_fechas": "string",
    "horario_comercial": "string",
    "horarios_comida": "string",
    "museos": "string"
  },
  "salud_seguridad": {
    "vacunas": "string",
    "agua_potable": "string",
    "farmacias": "string",
    "nivel_seguridad": "string",
    "zonas_evitar": "string",
    "estafas_comunes": "string"
  },
  "idioma_cultura": {
    "idioma": "string",
    "frases_utiles": [{ "frase_local": "string", "pronunciacion": "string", "significado": "string" }],
    "costumbres": "string",
    "vestimenta": "string",
    "mala_educacion": "string"
  },
  "tips_culturales": [
    "string tip cultural",
    "string tip conectividad",
    "string tip dinero",
    "string tip seguridad",
    "string tip costumbres"
  ],
  "seguro": [
    { "nombre": "Assist Card", "cobertura": "string", "precio_estimado": "string", "link": "https://www.assistcard.com" },
    { "nombre": "World Nomads", "cobertura": "string", "precio_estimado": "string", "link": "https://www.worldnomads.com/es" },
    { "nombre": "IATI Seguros", "cobertura": "string", "precio_estimado": "string", "link": "https://www.iatitravel.com" }
  ],
  "checklist": ["string", "string", "string", "string", "string", "string", "string", "string", "string", "string"],
  "emergencias": {
    "embajada": "string",
    "emergencias_local": "string",
    "policia_turistica": "string"
  },
  "lo_imperdible": [
    { "nombre": "string", "descripcion": "string inspirador" }
  ],
  "extras": [
    { "categoria": "string (Cultural/Gastronómica/Naturaleza/Compras/Días de lluvia)", "actividades": ["string"] }
  ]
}

IMPORTANTE: JSON puro sin markdown, sin \`\`\`json. Precios REALISTAS. Lenguaje VIVANTE: cálido, cercano, experto.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: isPro ? promptPro : promptBasico }
        ],
        temperature: 0.7,
        max_tokens: isPro ? 8000 : 5000,
      }),
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      console.error('Groq error:', err);
      return NextResponse.json({ error: 'Error generando itinerario' }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const rawContent = groqData.choices[0]?.message?.content || '';

    let itinerario;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      itinerario = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
    } catch (e) {
      console.error('JSON parse error:', e, rawContent.substring(0, 500));
      return NextResponse.json({ error: 'Error procesando el itinerario' }, { status: 500 });
    }

    // ─── EMAIL HTML con brandbook VIVANTE ──────────────────────────────────────
    const planLabel = isPro ? 'Vivante Pro ⭐' : 'Vivante Básico';

    const diasHtml = (itinerario.dias || []).map(dia => `
      <div style="margin-bottom:24px; border-left:4px solid #FF6332; background:#FFF8F5; border-radius:0 12px 12px 0; overflow:hidden;">
        <div style="background:#FF6332; padding:12px 20px;">
          <span style="color:#fff; font-family:Syne,sans-serif; font-weight:700; font-size:16px;">
            Día ${dia.numero}: ${dia.titulo}
          </span>
        </div>
        <div style="padding:16px 20px;">
          <p style="margin:0 0 8px; color:#212529;">
            <strong style="color:#FF6332;">🌅 Mañana</strong> — ${dia.manana?.actividad || ''}
            ${dia.manana?.tip ? `<br><em style="color:#6F42C1; font-size:13px;">💡 ${dia.manana.tip}</em>` : ''}
          </p>
          <p style="margin:0 0 8px; color:#212529;">
            <strong style="color:#FF6332;">🌞 Tarde</strong> — ${dia.tarde?.almuerzo || ''} · ${dia.tarde?.actividad || ''}
          </p>
          <p style="margin:0 0 8px; color:#212529;">
            <strong style="color:#FF6332;">🌙 Noche</strong> — ${dia.noche?.cena || ''} ${dia.noche?.actividad ? `· ${dia.noche.actividad}` : ''}
          </p>
          <p style="margin:8px 0 0; font-size:13px; color:#6F42C1; font-weight:600;">
            💰 Gasto estimado: ${dia.gasto_dia || ''}
          </p>
        </div>
      </div>
    `).join('');

    const restaurantesHtml = (itinerario.restaurantes || []).map(r => `
      <tr>
        <td style="padding:10px 12px; border-bottom:1px solid #FFE8E0; font-weight:600; color:#212529;">${r.nombre}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #FFE8E0; color:#555;">${r.tipo}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #FFE8E0; color:#555;">${r.precio_promedio}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #FFE8E0;">
          ${r.link ? `<a href="${r.link}" style="color:#6F42C1; font-weight:600;">Reservar →</a>` : (r.requiere_reserva ? '<span style="color:#E83E8C;">Reserva requerida</span>' : 'Sin reserva')}
        </td>
      </tr>
    `).join('');

    const tipsHtml = (itinerario.tips_culturales || []).map(tip => `
      <li style="margin-bottom:8px; color:#6F42C1; font-style:italic; padding-left:8px;">
        ${tip}
      </li>
    `).join('');

    const presupuestoRows = itinerario.presupuesto_desglose ? Object.entries(itinerario.presupuesto_desglose).map(([key, val]) => `
      <tr style="${key === 'total' ? 'background:#FF6332;' : ''}">
        <td style="padding:8px 12px; ${key === 'total' ? 'color:#fff; font-weight:700;' : 'color:#212529;'} text-transform:capitalize;">
          ${key.replace(/_/g, ' ')}
        </td>
        <td style="padding:8px 12px; ${key === 'total' ? 'color:#fff; font-weight:700;' : 'color:#FF6332; font-weight:600;'} text-align:right;">
          ${val}
        </td>
      </tr>
    `).join('') : '';

    // Secciones PRO adicionales
    const proExtra = isPro ? `
      <!-- BARES -->
      ${itinerario.bares_vida_nocturna?.length ? `
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:Syne,sans-serif; font-weight:700; font-size:18px;">🍸 Bares y Vida Nocturna</span>
        </div>
        <div style="background:#FFF8F5; border-radius:0 0 8px 8px; padding:16px 20px;">
          ${itinerario.bares_vida_nocturna.map(b => `<p style="margin:0 0 8px; color:#212529;"><strong>${b.nombre}</strong> — ${b.tipo_ambiente} · ${b.precio_trago} · ${b.mejor_dia}</p>`).join('')}
        </div>
      </div>` : ''}

      <!-- TRANSPORTE -->
      ${itinerario.transporte_local ? `
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:Syne,sans-serif; font-weight:700; font-size:18px;">🚇 Transporte Local</span>
        </div>
        <div style="background:#FFF8F5; border-radius:0 0 8px 8px; padding:16px 20px;">
          <p style="color:#212529; margin:0 0 8px;"><strong>¿Cómo moverse?</strong> ${itinerario.transporte_local.como_moverse}</p>
          <p style="color:#212529; margin:0 0 8px;"><strong>Apps:</strong> ${(itinerario.transporte_local.apps_recomendadas || []).join(', ')}</p>
          <p style="color:#212529; margin:0 0 8px;"><strong>Del aeropuerto al centro:</strong> ${itinerario.transporte_local.costo_aeropuerto_centro}</p>
          <p style="color:#212529; margin:0;"><strong>¿Alquilar auto?</strong> ${itinerario.transporte_local.conviene_auto}</p>
        </div>
      </div>` : ''}

      <!-- CONECTIVIDAD -->
      ${itinerario.conectividad ? `
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:Syne,sans-serif; font-weight:700; font-size:18px;">📱 Conectividad</span>
        </div>
        <div style="background:#FFF8F5; border-radius:0 0 8px 8px; padding:16px 20px;">
          <p style="color:#212529; margin:0 0 8px;"><strong>eSIM recomendada:</strong> ${itinerario.conectividad.esim_recomendada}</p>
          <p style="color:#212529; margin:0 0 8px;"><strong>SIM local:</strong> ${itinerario.conectividad.sim_local}</p>
          <p style="color:#212529; margin:0;"><strong>Apps a descargar:</strong> ${(itinerario.conectividad.apps_descargar || []).join(', ')}</p>
        </div>
      </div>` : ''}
    ` : '';

    const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu itinerario VIVANTE — ${itinerario.titulo || formData.destino}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;600&display=swap');
  </style>
</head>
<body style="margin:0; padding:0; background:#FCF8F4; font-family:'Inter',Arial,sans-serif; color:#212529;">
  <div style="max-width:680px; margin:0 auto; background:#FCF8F4;">

    <!-- HEADER -->
    <div style="background:#FF6332; padding:24px; text-align:center;">
      <p style="color:#fff; font-family:'Syne',Georgia,sans-serif; font-size:32px; font-weight:800; margin:0; letter-spacing:-1px;">VIVANTE</p>
      <p style="color:rgba(255,255,255,0.85); font-size:13px; margin:4px 0 0; letter-spacing:1px;">VIAJA MÁS. PLANIFICA MENOS.</p>
    </div>

    <!-- SALUDO -->
    <div style="padding:32px 32px 0;">
      <h1 style="font-family:'Syne',Georgia,sans-serif; font-size:26px; color:#212529; margin:0 0 8px;">
        ¡Hola, ${formData.nombre}! ✈️
      </h1>
      <p style="color:#555; font-size:16px; line-height:1.6; margin:0 0 8px;">
        Tu itinerario <strong style="color:#FF6332;">${planLabel}</strong> está listo.
        Solo tienes que hacer una cosa: <strong>hacer la maleta.</strong>
      </p>
      <div style="display:inline-block; background:#E83E8C; color:#fff; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; letter-spacing:1px; margin-bottom:24px;">
        ${itinerario.titulo || `Tu aventura a ${formData.destino}`}
      </div>
    </div>

    <div style="padding:0 32px;">

      <!-- RESUMEN EJECUTIVO -->
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">📊 Resumen Ejecutivo</span>
        </div>
        <table style="width:100%; border-collapse:collapse; background:#FFF8F5; border-radius:0 0 8px 8px; overflow:hidden;">
          <tr style="background:#FFF0EB;">
            <td style="padding:10px 16px; color:#212529; font-weight:600; width:40%;">Destino</td>
            <td style="padding:10px 16px; color:#FF6332; font-weight:700;">${itinerario.resumen?.destino || formData.destino}</td>
          </tr>
          <tr>
            <td style="padding:10px 16px; color:#212529; font-weight:600;">Duración</td>
            <td style="padding:10px 16px; color:#212529;">${formData.dias} días</td>
          </tr>
          <tr style="background:#FFF0EB;">
            <td style="padding:10px 16px; color:#212529; font-weight:600;">Viajeros</td>
            <td style="padding:10px 16px; color:#212529;">${formData.numViajeros}</td>
          </tr>
          <tr>
            <td style="padding:10px 16px; color:#212529; font-weight:600;">Fecha óptima</td>
            <td style="padding:10px 16px; color:#212529;">${itinerario.resumen?.fecha_optima || 'Ver en itinerario'}</td>
          </tr>
          <tr style="background:#FFF0EB;">
            <td style="padding:10px 16px; color:#212529; font-weight:600;">Distribución</td>
            <td style="padding:10px 16px; color:#212529;">${itinerario.resumen?.distribucion || ''}</td>
          </tr>
        </table>
      </div>

      <!-- PRESUPUESTO -->
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">💰 Presupuesto Estimado</span>
        </div>
        <table style="width:100%; border-collapse:collapse; background:#FFF8F5; border-radius:0 0 8px 8px; overflow:hidden;">
          ${presupuestoRows}
        </table>
      </div>

      <!-- VUELOS -->
      ${itinerario.vuelos?.length ? `
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">✈️ Vuelos Recomendados</span>
        </div>
        <div style="background:#FFF8F5; border-radius:0 0 8px 8px; padding:16px 20px;">
          ${itinerario.vuelos.map(v => `
            <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #FFE8E0;">
              <strong style="color:#212529;">${v.aerolinea}</strong> — ${v.ruta}<br>
              <span style="color:#FF6332; font-weight:600;">${v.precio_estimado}</span>
              ${v.link ? ` · <a href="${v.link}" style="color:#6F42C1;">Buscar vuelo →</a>` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- ALOJAMIENTO -->
      ${itinerario.alojamiento?.length ? `
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">🏨 Alojamiento</span>
        </div>
        <div style="background:#FFF8F5; border-radius:0 0 8px 8px; padding:16px 20px;">
          ${itinerario.alojamiento.map(a => `
            <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #FFE8E0;">
              <div style="display:inline-block; background:#E83E8C; color:#fff; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:700; margin-bottom:4px;">${a.categoria}</div><br>
              <strong style="color:#212529;">${a.nombre}</strong> — <span style="color:#FF6332;">${a.precio_noche}/noche</span><br>
              <span style="color:#6F42C1; font-style:italic; font-size:13px;">${a.por_que}</span>
              ${a.link ? `<br><a href="${a.link}" style="color:#6F42C1; font-size:13px;">Ver en Booking →</a>` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- ITINERARIO DÍA A DÍA -->
      <div style="margin-bottom:8px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">📅 Itinerario Día a Día</span>
        </div>
      </div>
      ${diasHtml}

      <!-- RESTAURANTES -->
      ${itinerario.restaurantes?.length ? `
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">🍽️ Restaurantes Recomendados</span>
        </div>
        <table style="width:100%; border-collapse:collapse; background:#FFF8F5; border-radius:0 0 8px 8px; overflow:hidden;">
          <tr style="background:#FF6332;">
            <th style="padding:10px 12px; color:#fff; text-align:left; font-size:13px;">Restaurante</th>
            <th style="padding:10px 12px; color:#fff; text-align:left; font-size:13px;">Tipo</th>
            <th style="padding:10px 12px; color:#fff; text-align:left; font-size:13px;">Precio</th>
            <th style="padding:10px 12px; color:#fff; text-align:left; font-size:13px;">Reserva</th>
          </tr>
          ${restaurantesHtml}
        </table>
      </div>` : ''}

      ${proExtra}

      <!-- DINERO Y PAGOS -->
      ${itinerario.dinero ? `
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">💳 Dinero y Pagos</span>
        </div>
        <div style="background:#FFF8F5; border-radius:0 0 8px 8px; padding:16px 20px;">
          <p style="color:#212529; margin:0 0 8px;"><strong>Moneda local:</strong> ${itinerario.dinero.moneda_local} — ${itinerario.dinero.tipo_cambio}</p>
          <p style="color:#212529; margin:0 0 8px;"><strong>¿Tarjeta o efectivo?</strong> ${itinerario.dinero.tarjeta_o_efectivo}</p>
          <p style="color:#212529; margin:0 0 8px;"><strong>Dónde cambiar:</strong> ${itinerario.dinero.donde_cambiar}</p>
          <p style="color:#212529; margin:0 0 8px;"><strong>Propinas:</strong> ${itinerario.dinero.propinas}</p>
          ${itinerario.dinero.tip_extra ? `<p style="color:#6F42C1; font-style:italic; margin:8px 0 0;">💡 ${itinerario.dinero.tip_extra}</p>` : ''}
        </div>
      </div>` : ''}

      <!-- TIPS CULTURALES -->
      ${itinerario.tips_culturales?.length ? `
      <div style="margin-bottom:24px;">
        <div style="background:#6F42C1; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">🌍 Tips Culturales, Conectividad y Dinero</span>
        </div>
        <div style="background:#F5F0FF; border-radius:0 0 8px 8px; padding:16px 20px;">
          <ul style="margin:0; padding:0 0 0 16px; list-style:none;">
            ${tipsHtml}
          </ul>
        </div>
      </div>` : ''}

      <!-- SEGURO DE VIAJE -->
      ${itinerario.seguro?.length ? `
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">🏥 Seguro de Viaje</span>
        </div>
        <table style="width:100%; border-collapse:collapse; background:#FFF8F5; border-radius:0 0 8px 8px; overflow:hidden;">
          <tr style="background:#FF6332;">
            <th style="padding:10px 12px; color:#fff; text-align:left; font-size:13px;">Seguro</th>
            <th style="padding:10px 12px; color:#fff; text-align:left; font-size:13px;">Cobertura</th>
            <th style="padding:10px 12px; color:#fff; text-align:left; font-size:13px;">Precio aprox.</th>
          </tr>
          ${itinerario.seguro.map((s, i) => `
          <tr style="${i % 2 === 0 ? 'background:#FFF0EB;' : ''}">
            <td style="padding:10px 12px;"><a href="${s.link}" style="color:#6F42C1; font-weight:600;">${s.nombre}</a></td>
            <td style="padding:10px 12px; color:#555; font-size:13px;">${s.cobertura}</td>
            <td style="padding:10px 12px; color:#FF6332; font-weight:600;">${s.precio_estimado}</td>
          </tr>`).join('')}
        </table>
      </div>` : ''}

      <!-- CHECKLIST -->
      ${itinerario.checklist?.length ? `
      <div style="margin-bottom:24px;">
        <div style="background:#FF6332; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">✅ Checklist Pre-Viaje</span>
        </div>
        <div style="background:#FFF8F5; border-radius:0 0 8px 8px; padding:16px 20px;">
          ${itinerario.checklist.map(item => `<p style="margin:0 0 8px; color:#212529;">☐ ${item}</p>`).join('')}
        </div>
      </div>` : ''}

      <!-- LO IMPERDIBLE -->
      ${itinerario.lo_imperdible?.length ? `
      <div style="margin-bottom:24px;">
        <div style="background:#E83E8C; padding:12px 20px; border-radius:8px 8px 0 0;">
          <span style="color:#fff; font-family:'Syne',sans-serif; font-weight:700; font-size:18px;">⭐ Lo Imperdible</span>
        </div>
        <div style="background:#FFF0F8; border-radius:0 0 8px 8px; padding:16px 20px;">
          ${itinerario.lo_imperdible.map((item, i) => `
          <div style="margin-bottom:12px; padding-left:12px; border-left:3px solid #E83E8C;">
            <strong style="color:#212529;">${i+1}. ${item.nombre}</strong><br>
            <span style="color:#555; font-size:14px;">${item.descripcion}</span>
          </div>`).join('')}
        </div>
      </div>` : ''}

    </div>

    <!-- PÁGINA FINAL / FOOTER -->
    <div style="background:#FF6332; padding:40px 32px; text-align:center; margin-top:32px;">
      <p style="color:#fff; font-family:'Syne',Georgia,sans-serif; font-size:28px; font-weight:800; margin:0 0 8px;">VIVANTE</p>
      <p style="color:rgba(255,255,255,0.9); font-size:15px; margin:0 0 16px; line-height:1.5;">
        ${itinerario.subtitulo || `Tu aventura a ${formData.destino} te espera, ${formData.nombre}.`}<br>
        <strong>Solo falta hacer la maleta.</strong> ✈️
      </p>
      <div style="border-top:1px solid rgba(255,255,255,0.3); padding-top:16px; margin-top:16px;">
        <p style="color:rgba(255,255,255,0.7); font-size:13px; margin:0;">
          <a href="https://vivante.vercel.app" style="color:rgba(255,255,255,0.9);">vivante.vercel.app</a> ·
          <a href="https://instagram.com/vive.vivante" style="color:rgba(255,255,255,0.9);">@vive.vivante</a> ·
          viaja más. planifica menos.
        </p>
      </div>
    </div>

  </div>
</body>
</html>`;

    // ─── ENVIAR EMAIL con Resend ───────────────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'VIVANTE <onboarding@resend.dev>',
          to: [formData.email],
          subject: `✈️ Tu itinerario VIVANTE está listo — ${itinerario.titulo || formData.destino}`,
          html: emailHtml,
        }),
      });
    }

    return NextResponse.json({ itinerario, planId, emailHtml });
  } catch (error) {
    console.error('send-itinerary error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
