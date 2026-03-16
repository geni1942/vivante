import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { formData, paymentId } = await req.json();

    if (!formData?.email || !formData?.nombre) {
      return NextResponse.json({ error: 'Datos del formulario incompletos' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ error: 'Configuración de IA no disponible' }, { status: 500 });
    }

    // Construir descripción del perfil del viajero
    const interesesTexto = formData.intereses?.join(', ') || 'variados';
    const ritmoTexto = formData.ritmo <= 2 ? 'Relajado' : formData.ritmo <= 3 ? 'Moderado' : 'Intenso';
    const presupuestoTexto =
      formData.presupuesto >= 15000
        ? 'más de $15.000 USD por persona'
        : `$${formData.presupuesto?.toLocaleString()} USD por persona`;

    // Generar itinerario con Groq
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Eres un experto planificador de viajes de lujo. Genera un itinerario detallado, inspirador y muy específico en español para este viaje:

Destino: ${formData.destino}
Ciudad de origen: ${formData.origen}
Duración: ${formData.dias} días
Presupuesto: ${presupuestoTexto}
Tipo de viaje: ${formData.tipoViaje} (${formData.numViajeros} personas)
Intereses: ${interesesTexto}
Ritmo preferido: ${ritmoTexto}
Alojamiento: ${formData.alojamiento}

Responde ÚNICAMENTE con JSON válido y sin texto adicional antes ni después. Usa esta estructura exacta:
{
  "titulo": "Mi viaje a [nombre del destino]",
  "resumen": "Frase inspiradora de 1-2 oraciones que describa la esencia del viaje",
  "dias": [
    {
      "titulo": "Título atractivo del día (ej: Llegada y primer contacto con la ciudad)",
      "descripcion": "Descripción detallada y evocadora de 2-3 oraciones sobre qué vivir este día",
      "actividades": [
        "Actividad 1 con nombre específico y descripción breve",
        "Actividad 2 con nombre específico y descripción breve",
        "Actividad 3 con nombre específico y descripción breve"
      ],
      "restaurante": "Nombre o tipo de restaurante específico y recomendado para comer ese día",
      "alojamiento": "Nombre o tipo de alojamiento recomendado",
      "foto_busqueda": "keyword descriptivo en inglés para buscar foto de este día (ej: santorini-caldera-sunset)"
    }
  ],
  "tips": [
    "Tip 1 sobre la cultura local y costumbres importantes",
    "Tip 2 sobre conectividad (SIM card, WiFi, aplicaciones útiles)",
    "Tip 3 sobre dinero (moneda local, ATMs, propinas, cambio)",
    "Tip 4 sobre seguridad y salud",
    "Tip 5 sobre transporte local"
  ],
  "presupuesto_desglose": {
    "Vuelos": "estimado en USD ida y vuelta",
    "Alojamiento": "estimado por noche en USD",
    "Actividades": "estimado total en USD",
    "Comida": "estimado por día en USD",
    "Transporte local": "estimado total en USD"
  }
}`,
          },
        ],
        temperature: 0.75,
        max_tokens: 4000,
      }),
    });

    const groqData = await groqRes.json();

    if (!groqData.choices?.[0]?.message?.content) {
      throw new Error('Error generando el itinerario con IA');
    }

    const rawText = groqData.choices[0].message.content;
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Formato de respuesta de IA inválido');

    const itinerario = JSON.parse(jsonMatch[0]);

    // Enviar email con Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const diasHTML = itinerario.dias
        ?.map(
          (dia, i) => `
        <div style="margin-bottom:28px; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb; background:white;">
          <div style="background:linear-gradient(135deg,#f97316,#ec4899); padding:18px 22px;">
            <div style="color:rgba(255,255,255,0.75); font-size:11px; text-transform:uppercase; letter-spacing:2px; margin-bottom:4px;">DÍA ${i + 1}</div>
            <div style="color:white; font-size:19px; font-weight:700;">${dia.titulo}</div>
          </div>
          <div style="padding:20px 22px;">
            <p style="color:#4b5563; margin:0 0 16px 0; line-height:1.65; font-size:14px;">${dia.descripcion}</p>
            ${
              dia.actividades?.length
                ? `<div style="margin-bottom:14px;">
                ${dia.actividades.map((a) => `<div style="display:flex;gap:8px;margin-bottom:6px;"><span style="color:#f97316;flex-shrink:0;">•</span><span style="color:#374151;font-size:13px;">${a}</span></div>`).join('')}
              </div>`
                : ''
            }
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
              ${dia.restaurante ? `<span style="background:#fff7ed;color:#c2410c;padding:5px 12px;border-radius:20px;font-size:12px;">🍽️ ${dia.restaurante}</span>` : ''}
              ${dia.alojamiento ? `<span style="background:#faf5ff;color:#7e22ce;padding:5px 12px;border-radius:20px;font-size:12px;">🏨 ${dia.alojamiento}</span>` : ''}
            </div>
          </div>
        </div>
      `
        )
        .join('');

      const tipsHTML = itinerario.tips
        ?.map(
          (t) => `
        <div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;">
          <span style="color:#10b981;flex-shrink:0;font-weight:700;">✓</span>
          <span style="color:#4b5563;font-size:14px;line-height:1.5;">${t}</span>
        </div>
      `
        )
        .join('');

      const presupuestoHTML = itinerario.presupuesto_desglose
        ? Object.entries(itinerario.presupuesto_desglose)
            .map(
              ([k, v]) => `
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;">
            <span style="color:#6b7280;font-size:14px;">${k}</span>
            <span style="font-weight:600;color:#111827;font-size:14px;">${v}</span>
          </div>
        `
            )
            .join('')
        : '';

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'VIVANTE <onboarding@resend.dev>',
          to: [formData.email],
          subject: `✈️ Tu itinerario VIVANTE — ${formData.destino}`,
          html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tu itinerario VIVANTE</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#f97316,#ec4899);border-radius:20px 20px 0 0;padding:36px;text-align:center;">
      <div style="color:white;font-size:32px;font-weight:900;letter-spacing:-1px;">VIVANTE</div>
      <div style="color:rgba(255,255,255,0.85);font-size:13px;margin-top:4px;">Viaja más. Planifica menos.</div>
    </div>

    <!-- Saludo -->
    <div style="background:white;padding:28px 28px 20px 28px;text-align:center;border-bottom:1px solid #f3f4f6;">
      <div style="font-size:28px;margin-bottom:8px;">🎉</div>
      <h1 style="margin:0 0 6px 0;color:#111827;font-size:20px;">¡Hola, ${formData.nombre}!</h1>
      <h2 style="margin:0 0 8px 0;color:#f97316;font-size:24px;font-weight:800;">${itinerario.titulo}</h2>
      <p style="color:#6b7280;margin:0;font-size:14px;line-height:1.6;">${itinerario.resumen}</p>

      <!-- Stats -->
      <div style="display:flex;justify-content:center;gap:16px;margin-top:20px;flex-wrap:wrap;">
        <div style="background:#fff7ed;border-radius:12px;padding:12px 20px;text-align:center;min-width:80px;">
          <div style="color:#f97316;font-size:24px;font-weight:700;">${formData.dias}</div>
          <div style="color:#9ca3af;font-size:11px;">días</div>
        </div>
        <div style="background:#fdf2f8;border-radius:12px;padding:12px 20px;text-align:center;min-width:80px;">
          <div style="color:#ec4899;font-size:24px;font-weight:700;">${formData.numViajeros}</div>
          <div style="color:#9ca3af;font-size:11px;">viajeros</div>
        </div>
        <div style="background:#f5f3ff;border-radius:12px;padding:12px 20px;text-align:center;min-width:80px;">
          <div style="color:#7c3aed;font-size:18px;font-weight:700;">${formData.presupuesto >= 15000 ? '$15K+' : `$${formData.presupuesto?.toLocaleString()}`}</div>
          <div style="color:#9ca3af;font-size:11px;">USD/persona</div>
        </div>
      </div>
    </div>

    <!-- Itinerario -->
    <div style="background:#f9fafb;padding:24px;">
      <h3 style="color:#111827;font-size:17px;font-weight:700;margin:0 0 20px 0;">📅 Tu itinerario día a día</h3>
      ${diasHTML}

      <!-- Tips -->
      <div style="background:white;border-radius:16px;padding:22px;margin-bottom:20px;border:1px solid #e5e7eb;">
        <h3 style="color:#111827;font-weight:700;margin:0 0 16px 0;font-size:16px;">💡 Tips importantes</h3>
        ${tipsHTML}
      </div>

      <!-- Presupuesto -->
      ${
        presupuestoHTML
          ? `
      <div style="background:white;border-radius:16px;padding:22px;margin-bottom:20px;border:1px solid #e5e7eb;">
        <h3 style="color:#111827;font-weight:700;margin:0 0 16px 0;font-size:16px;">💰 Estimado de presupuesto</h3>
        ${presupuestoHTML}
      </div>`
          : ''
      }
    </div>

    <!-- Footer -->
    <div style="background:#111827;border-radius:0 0 20px 20px;padding:28px;text-align:center;">
      <p style="color:#9ca3af;font-size:13px;margin:0 0 8px 0;">¿Dudas o consultas? Estamos para ayudarte.</p>
      <a href="mailto:vive.vivante.ch@gmail.com" style="color:#f97316;text-decoration:none;font-size:14px;font-weight:600;">vive.vivante.ch@gmail.com</a>
      <div style="margin-top:16px;display:flex;justify-content:center;gap:16px;">
        <a href="https://www.instagram.com/vive.vivante" style="color:#9ca3af;font-size:12px;text-decoration:none;">Instagram</a>
        <a href="https://www.tiktok.com/@vive.vivante" style="color:#9ca3af;font-size:12px;text-decoration:none;">TikTok</a>
      </div>
      <p style="color:#4b5563;font-size:11px;margin:16px 0 0 0;">© VIVANTE — Hecho con ❤️ para viajeros como tú.</p>
    </div>

  </div>
</body>
</html>
          `,
        }),
      });
    }

    return NextResponse.json({ itinerario });
  } catch (error) {
    console.error('Error en send-itinerary:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
