# Guía para Geni: Resumen de Cambios + Próximos Pasos

## Contexto

Vivante tenía varios problemas: el formulario recogía datos que la IA ignoraba, había ~4,000 líneas de código duplicado, una vulnerabilidad de seguridad en pagos, y código muerto en producción. Todo se arregló en la branch `fix/suggest-lib-security` del repo `soyelruizo/vivante`.

---

## PARTE 1: Resumen de todos los cambios (en palabras simples)

### 1. Bug de sugerencias arreglado

**Problema**: El formulario preguntaba por "movilidad reducida" y "aerolínea preferida", pero cuando la IA generaba destinos, ignoraba esas respuestas. Alguien en silla de ruedas podía recibir Santorini (lleno de escaleras).

**Solución**: Ahora la IA recibe esos datos y los usa. Si alguien marca movilidad reducida, evita destinos con cuestas/escaleras. Si prefiere LATAM Airlines, prioriza destinos con vuelos directos de esa aerolínea.

**Archivo**: `app/api/suggest/route.js`

### 2. Código compartido en `/lib/`

**Problema**: Las mismas funciones estaban copiadas 3 veces en archivos distintos. Si arreglabas un bug en una copia, las otras 2 seguían rotas.

**Solución**: Se creó una carpeta `lib/` con 4 archivos compartidos:
- `lib/plans.js` — Precios de los planes (Básico $9,990 CLP, Pro $16,990 CLP). Una sola fuente de verdad.
- `lib/url-builders.js` — Genera links a aerolíneas y Booking/Airbnb/Hostelworld
- `lib/text-utils.js` — Limpia emojis para los PDFs (los PDFs no soportan emojis)
- `lib/email-templates.js` — El HTML del email de confirmación

Ahora las 3 rutas API importan desde `lib/` en vez de tener su propia copia.

### 3. Seguridad: precio del pago

**Problema**: Cuando alguien pagaba, el precio venía del navegador del cliente. Un usuario técnico podía abrir las DevTools, cambiar el precio a $1, y pagar $1 por un plan de $16,990.

**Solución**: Ahora el servidor ignora el precio que manda el cliente. Solo recibe el `planId` ("basico" o "pro") y busca el precio real en `lib/plans.js`. Imposible manipular.

**Archivo**: `app/api/payment/create-preference/route.js`

### 4. Código muerto eliminado

- `app/components/TravelForm.jsx` — Una copia vieja del formulario que nadie usaba (969 líneas)
- `components/Header.jsx` — Un header que nadie importaba (237 líneas)
- `app/test-pago/page.js` — Una página que permitía saltarse el pago en producción (!!)

### 5. Soporte dual de IA (Groq + Anthropic)

**Para qué**: Poder probar en local sin la API de Groq. Si hay una `ANTHROPIC_API_KEY` en `.env.local`, las rutas usan Claude en vez de Groq. En producción sigue usando Groq.

**Archivos**: `app/api/suggest/route.js`, `app/api/send-itinerary/route.js`

### 6. Bypass de pago en localhost

**Para qué**: Para probar el flujo completo sin MercadoPago. En localhost, al seleccionar un plan se salta directo a `/pago-exitoso`.

**Archivo**: `components/TravelForm.jsx` (solo funciona cuando `window.location.hostname === 'localhost'`)

### 7. `.gitignore` y GitHub

Se creó `.gitignore` para no subir `node_modules/`, `.next/`, ni archivos `.env` con claves secretas. El repo está en `github.com/soyelruizo/vivante` (privado).

---

## PARTE 2: Cómo volver a Groq (quitar Anthropic)

### Opción A: Solo quitar la key local (recomendado)

No hay que tocar código. El sistema ya detecta automáticamente qué API usar:
- Si existe `ANTHROPIC_API_KEY` en `.env.local` → usa Claude
- Si no existe → usa Groq (con `GROQ_API_KEY`)

Para volver a Groq en local, simplemente borrar o comentar la línea en `.env.local`:

```env
# ANTHROPIC_API_KEY=sk-ant-...    ← comentar con #
GROQ_API_KEY=tu-key-de-groq       ← agregar esta
```

### Opción B: Eliminar el soporte Anthropic del código

Si se quiere limpiar el código y dejar solo Groq, hay que revertir los cambios en 2 archivos:

**`app/api/suggest/route.js`**: Eliminar el bloque `if (useAnthropic)` (líneas 206-230) y dejar solo el bloque de Groq.

**`app/api/send-itinerary/route.js`**: Eliminar la función `callLLM()` y volver a usar `fetch` directo a Groq.

---

## PARTE 3: Mejoras propuestas — Lógicas inteligentes de viaje

### 3.1 Regla de duración mínima para vuelos largos

**Problema actual**: Si alguien desde Santiago pone 4 días y le sale Tokio, pierde 2 días en avión y tiene 2 días reales. Es un viaje sin sentido.

**Ya existe parcialmente**: La variable `distanciaReglaSuggest` en `suggest/route.js` (líneas 114-137) ya maneja esto con 3 rangos:
- ≤4 días: solo destinos a ≤6h de vuelo
- ≤7 días: prohibidos Asia/Oceanía, mínimo 2 de 3 opciones a ≤8h
- ≤11 días: prohibidos Oceanía y Asia muy lejana

**Mejora propuesta**: Agregar un 4to rango y hacer más estricta la lógica:

```
≤3 días  → Solo destinos en el MISMO PAÍS o países limítrofes (≤3h vuelo)
4 días   → Máximo 6h de vuelo (regional)
5-7 días → Máximo 10h (continental)
8-11 días → Máximo 14h (intercontinental cercano)
12+ días → Sin restricción
```

**Archivo a editar**: `app/api/suggest/route.js`, variable `distanciaReglaSuggest`

### 3.2 Presupuesto realista según origen

**Ya existe parcialmente**: La variable `presupuestoReglaSuggest` (líneas 101-112) calcula $/día y restringe destinos caros si el presupuesto es bajo.

**Mejora propuesta**: Cruzar presupuesto + origen + días para ser más preciso:

```
Si origen=Santiago y presupuesto<$1000 y días≤5:
  → Solo LATAM (vuelo~$200-400) deja margen para hotel+actividades

Si origen=Santiago y presupuesto<$1500 y días≤7:
  → LATAM + Caribe, prohibir Europa/USA (vuelo~$800+ consume >50% del presupuesto)

Si origen=Madrid y presupuesto<$800 y días≤5:
  → Solo Europa cercana (vuelos low-cost $50-150)
```

**Archivo a editar**: `app/api/suggest/route.js`, crear nueva variable `presupuestoOrigenRegla`

### 3.3 Clima vs. mes de viaje

**Ya existe parcialmente**: `mesCtx` (líneas 44-47) pasa el mes al prompt como texto genérico.

**Mejora propuesta**: Agregar lógica explícita de temporadas:

```
Si mesViaje = julio/agosto y destino potencial = hemisferio sur:
  → Advertir: "es invierno en destino"

Si mesViaje = diciembre/enero y destino = Caribe/SE Asia:
  → Advertir: "temporada alta, precios 30-50% más caros"

Si mesViaje = septiembre y destino = Caribe:
  → Advertir: "temporada de huracanes"
```

**Archivo a editar**: `app/api/suggest/route.js`, crear variable `climaCtx`

### 3.4 Tipo de viaje + restricciones cruzadas

**Mejora propuesta**: Agregar reglas que crucen campos entre sí:

```
familia + niños + días≤4 → Solo destinos con vuelo ≤4h (niños no toleran vuelos largos)
familia + niños + presupuesto → Multiplicar costo estimado por numViajeros para validar
solo + primera-vez → Priorizar destinos con buen transporte público y seguros
pareja + luna-de-miel + presupuesto<$2000 → Advertir que luna de miel premium requiere más presupuesto
amigos + ≥6 personas → Priorizar destinos con hostales/Airbnb grandes, evitar B&B pequeños
```

**Archivo a editar**: `app/api/suggest/route.js`, crear variable `cruzadoCtx`

### 3.5 Preguntar más especificaciones (nuevos campos en el formulario)

Campos sugeridos para agregar al formulario (`TravelForm.jsx`):

| Campo | Tipo | Para qué |
|-------|------|----------|
| `flexibilidadFechas` | boolean | "¿Tus fechas son flexibles?" → permite sugerir temporada baja = más barato |
| `idiomasHablados` | multi-select | Español, Inglés, Portugués, Francés → evitar destinos donde no se pueda comunicar |
| `viajeAnterior` | text | "¿Qué destinos ya visitaste?" → evitar repetir |
| `climaPreferido` | select | Cálido/Templado/Frío/Indiferente → filtrar destinos por clima |
| `toleranciaVuelo` | select | "≤4h" / "≤8h" / "≤12h" / "Sin límite" → reemplazar lógica automática con preferencia real |
| `estiloGastronomico` | select | Street food / Restaurantes / Fine dining → personalizar recomendaciones de comida |

**Archivos a editar**:
- `components/TravelForm.jsx` — agregar campos al formulario (paso 2 o 4)
- `app/api/suggest/route.js` — usar los nuevos campos en el prompt

---

## PARTE 4: Cómo usar la branch y hacer merge

### Ver la branch actual

```bash
cd ~/Desktop/Claude_Projects/vivante
git branch          # muestra en qué branch estás (debería ser fix/suggest-lib-security)
git log --oneline   # ver los commits recientes
```

### Cambiar entre branches

```bash
git checkout main                      # volver a main (código viejo)
git checkout fix/suggest-lib-security  # volver a la branch con los cambios
```

### Hacer merge a main (cuando estés seguro)

```bash
# 1. Ir a main
git checkout main

# 2. Traer los cambios de la branch
git merge fix/suggest-lib-security

# 3. Si todo sale bien, subir a GitHub
git push origin main

# 4. (Opcional) Borrar la branch si ya no la necesitas
git branch -d fix/suggest-lib-security
git push origin --delete fix/suggest-lib-security
```

### Hacer merge desde GitHub (más seguro)

1. Ir a `github.com/soyelruizo/vivante`
2. Click en "Pull requests" → "New pull request"
3. Base: `main` ← Compare: `fix/suggest-lib-security`
4. Revisar los cambios, click en "Create pull request"
5. Click en "Merge pull request"

### Si hay conflictos al hacer merge

```bash
git checkout main
git merge fix/suggest-lib-security
# Si dice "CONFLICT": abrir los archivos marcados, resolver manualmente, luego:
git add .
git commit -m "Merge fix/suggest-lib-security into main"
git push origin main
```

### Desplegar a producción (Vercel)

Si el repo está conectado a Vercel:
- Merge a `main` → Vercel detecta el push y hace deploy automático
- Si NO está conectado: ir a vercel.com, importar el repo `soyelruizo/vivante`, configurar las env vars (MP_ACCESS_TOKEN, GROQ_API_KEY, RESEND_API_KEY, BREVO_API_KEY, NOTIFICATION_EMAIL)

---

## PARTE 5: Prompts sugeridos para pedir estos cambios

### Prompt 1: Volver a Groq (quitar Anthropic)

```
Elimina el soporte dual Anthropic/Groq de suggest/route.js y send-itinerary/route.js.
Deja solo Groq como LLM. Elimina la función callLLM() de send-itinerary y usa fetch
directo a Groq. Quita el bloque if(useAnthropic) de suggest. Borra ANTHROPIC_API_KEY
del CLAUDE.md.
```

### Prompt 2: Agregar lógica de duración mínima mejorada

```
En app/api/suggest/route.js, mejora la variable distanciaReglaSuggest con estos rangos:
- ≤3 días: solo destinos en el mismo país o limítrofes (≤3h vuelo)
- 4 días: máximo 6h de vuelo
- 5-7 días: máximo 10h
- 8-11 días: máximo 14h
- 12+ días: sin restricción
También agrega una regla cruzada: si tipoViaje=familia y numNinos>0 y días≤5,
reducir el máximo de horas de vuelo en 2h (los niños toleran menos).
```

### Prompt 3: Agregar reglas cruzadas inteligentes

```
En app/api/suggest/route.js, crea una nueva variable cruzadoCtx que cruce los campos
del formulario con lógica inteligente:
1. familia + niños + vuelo largo → reducir tolerancia de vuelo
2. presupuesto bajo + origen lejano → restringir a destinos regionales
3. solo + primera-vez → priorizar destinos seguros con transporte público
4. pareja + luna-de-miel + presupuesto<$2000 → advertir en el prompt
5. amigos + ≥6 personas → evitar B&B, priorizar hostales/Airbnb grandes
Inyéctala en el prompt junto a los otros contextos.
```

### Prompt 4: Agregar nuevos campos al formulario

```
Agrega estos campos al formulario en components/TravelForm.jsx:
1. climaPreferido (select: Cálido/Templado/Frío/Indiferente) en el paso 2
2. toleranciaVuelo (select: ≤4h/≤8h/≤12h/Sin límite) en el paso 2
3. idiomasHablados (multi-select: Español/Inglés/Portugués/Francés/Otro) en el paso 4
Luego actualiza app/api/suggest/route.js para usar estos campos en el prompt.
No toques los campos que ya existen. Usa el mismo estilo visual del formulario.
```

### Prompt 5: Agregar lógica de clima por mes

```
En app/api/suggest/route.js, crea una variable climaCtx que use el mesViaje para
agregar contexto al prompt:
- junio-agosto → advertir que es invierno en el hemisferio sur
- diciembre-febrero → advertir temporada alta en Caribe y SE Asia (precios +30-50%)
- agosto-octubre → advertir temporada de huracanes en Caribe
- Cruzar con el campo climaPreferido si existe
Inyéctala en el prompt después de mesCtx.
```

---

## Resumen de archivos clave

| Archivo | Qué hace | Líneas aprox |
|---------|----------|-------------|
| `app/api/suggest/route.js` | IA sugiere 3 destinos | 289 |
| `app/api/send-itinerary/route.js` | Genera itinerario completo + email + PDF | ~2,300 |
| `components/TravelForm.jsx` | Formulario de 5 pasos | ~940 |
| `lib/plans.js` | Precios de planes | 30 |
| `lib/url-builders.js` | Links a aerolíneas y booking | 80 |
| `lib/email-templates.js` | HTML del email | 55 |
| `lib/text-utils.js` | Limpiador de emojis | 15 |
