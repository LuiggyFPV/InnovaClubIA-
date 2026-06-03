import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to safely get Gemini Client
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("La clave GEMINI_API_KEY no está configurada. Por favor configúrala en Settings > Secrets en AI Studio.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. API: Business Analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { estado, sector, modelo, presupuesto, publico, diferenciacion, desc, inst } = req.body;
    
    if (!desc) {
      return res.status(400).json({ error: "La descripción del negocio es obligatoria." });
    }

    const ai = getAiClient();
    const prompt = `Actúa como un Consultor Estratégico de Negocios e Inteligencia Artificial de primer nivel.
Analiza con absoluto rigor y realismo este negocio.

DATOS DE LA EMPRESA:
- Estado del negocio: ${estado || "No especificado"}
- Sector / Industria: ${sector || "No especificado"}
- Modelo de negocio: ${modelo || "No especificado"}
- Presupuesto / Inversión disponible: ${presupuesto || "No especificado"}
- Público objetivo principal: ${publico || "No especificado"}
- Diferenciación vs competencia: ${diferenciacion || "No especificado"}
- Descripción del proyecto: ${desc}
- Instrucciones adicionales específicas: ${inst || "Ninguna"}

Genera un informe estratégico ultra detallado en formato JSON estructurado con las siguientes propiedades. No agregues texto antes ni después del JSON.

Estructura de respuesta requerida:
{
  "resumen": "Resumen ejecutivo profundo del negocio hincando el punto de dolor y la ventaja potencial (aprox. 3-4 frases).",
  "score": "Calificación numérica del 1 al 100 de viabilidad actual de acuerdo con el análisis de los 6 parámetros anteriores.",
  "madurez": {
    "nivel": "Idea, MVP, Proyecto, o Empresa",
    "desc": "Análisis específico del nivel de madurez y los desafíos de esta etapa."
  },
  "dafo": {
    "F": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3", "Fortaleza 4"],
    "D": ["Debilidad 1", "Debilidad 2", "Debilidad 3", "Debilidad 4"],
    "O": ["Oportunidad 1", "Oportunidad 2", "Oportunidad 3", "Oportunidad 4"],
    "A": ["Amenaza 1", "Amenaza 2", "Amenaza 3", "Amenaza 4"]
  },
  "publico": {
    "perfil": "Análisis del segmento demográfico e intereses del cliente ideal.",
    "edades": "Rango de edades clave",
    "comportamiento": "Patrón de consumo o comportamiento digital del cliente.",
    "canales": ["Canal de adquisición 1", "Canal de adquisición 2", "Canal de adquisición 3"]
  },
  "posicion": {
    "valor": "Propuesta de valor única redactada de forma magnética.",
    "ventaja": "Ventaja competitiva sostenible a desarrollar.",
    "nicho": "Nicho de mercado específico para monopolizar al inicio."
  },
  "metricas": [
    {"n": "Potencial de Mercado", "v": "Alto/Medio/Bajo con sustento corto", "p": 85},
    {"n": "Diferenciación", "v": "Clara/Media/Bajo con sustento corto", "p": 60},
    {"n": "Viabilidad Financiera", "v": "Alta/Media/Bajo con sustento corto", "p": 70},
    {"n": "Facilidad de Escalado", "v": "Alta/Media/Bajo con sustento corto", "p": 65}
  ],
  "competidores": [
    {"nombre": "Competidor Directo/Indirecto 1 o referencia del sector", "tipo": "Directo/Indirecto", "F": "Su mayor fortaleza", "D": "Su talón de Aquiles", "op": "Tu oportunidad de oro"},
    {"nombre": "Competidor Directo/Indirecto 2 o referencia del sector", "tipo": "Directo/Indirecto", "F": "Su mayor fortaleza", "D": "Su talón de Aquiles", "op": "Tu oportunidad de oro"},
    {"nombre": "Competidor Directo/Indirecto 3 o referencia del sector", "tipo": "Directo/Indirecto", "F": "Su mayor fortaleza", "D": "Su talón de Aquiles", "op": "Tu oportunidad de oro"}
  ],
  "videos": [
    {
      "titulo": "Título Gancho del Vídeoclip 1",
      "tipo": "Promocional / Educativo / Storytelling / Viral",
      "duracion": "30 segundos",
      "audio": "Música recomendada y estilo de voz narradora",
      "guion": [
        {"segundos": "0-10", "visual": "Describe la escena inicial recomendada para grabar", "narracion": "Voz en off: Gancho inicial fuerte"},
        {"segundos": "10-20", "visual": "Desarrollo del problema y propuesta", "narracion": "Voz en off: Desarrollo de la solución"},
        {"segundos": "20-30", "visual": "Llamada a la acción con redes de la empresa", "narracion": "Voz en off: Acción de cierre"}
      ],
      "consejo": "Consejo de iluminación, hashtags recomendados o técnica de edición para este vídeo."
    },
    {
      "titulo": "Título Gancho del Vídeoclip 2",
      "tipo": "Storytelling / Viral",
      "duracion": "30 segundos",
      "audio": "Música de tendencia",
      "guion": [
        {"segundos": "0-10", "visual": "Descripción visual de escena de intriga", "narracion": "Voz en off llamativa"},
        {"segundos": "10-20", "visual": "Descripción visual intermedia", "narracion": "Voz en off intermedia"},
        {"segundos": "20-30", "visual": "Cierre", "narracion": "Llamado a la acción"}
      ],
      "consejo": "Consejos específicos."
    },
    {
      "titulo": "Título Gancho del Vídeoclip 3",
      "tipo": "Educativo / Demostración",
      "duracion": "30 segundos",
      "audio": "Música inspiradora",
      "guion": [
        {"segundos": "0-10", "visual": "Mostrar dolor de cabeza del cliente", "narracion": "Voz en off sobre el dolor"},
        {"segundos": "10-20", "visual": "Mostrar cómo tu marca lo soluciona", "narracion": "Voz en off de la solución"},
        {"segundos": "20-30", "visual": "Cierre con logo", "narracion": "Sigue a InnovaClub"}
      ],
      "consejo": "Consejo técnico."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(502).json({ error: "La IA no devolvió contenido en la respuesta." });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing AI response in /api/analyze:", parseError, "Raw text:", text.slice(0, 500));
      return res.status(502).json({ error: "La respuesta de la IA no es JSON válido. Intenta de nuevo." });
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/analyze:", error);
    if (error.message?.includes("GEMINI_API_KEY")) {
      return res.status(503).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || "Error interno al procesar el análisis." });
  }
});

// 2. API: Geographical Radar Scan
app.post("/api/scan", async (req, res) => {
  try {
    const { sector, ubi, range } = req.body;
    
    const ai = getAiClient();
    const prompt = `Actúa como un experto en Inteligencia de Mercado, Geomarketing y Análisis Competitivo Local.
Escanea la ubicación geográfica: "${ubi || "Cualquiera"}" en un rango de "${range || "500m"}" para el sector: "${sector || "General"}".

Identifica negocios competidores o socios clave del área (reales o perfiles de competidores arquetípicos muy precisos de ese territorio) que operan en la zona.
Genera un análisis de este radio de acción en formato JSON con la siguiente estructura exacta. No agregues texto antes ni después del JSON.

{
  "negocios": [
    {
      "nombre": "Nombre del negocio local (ej. Café Central, Software Lab, etc.)",
      "tipo": "Tipo de establecimiento o rol (ej. Competidor directo, Cafetería local, etc.)",
      "score": 88,
      "tendencia": "Alta Tracción / Moderada / Estable / En riesgo",
      "fortaleza": "Excelente posicionamiento local",
      "op": "Alianza para canal cruzado"
    },
    {
      "nombre": "Nombre del segundo competidor/establecimiento",
      "tipo": "Tipo o rol",
      "score": 65,
      "tendencia": "Estable",
      "fortaleza": "Precios bajos",
      "op": "Ganarles en calidad y experiencia"
    },
    {
      "nombre": "Nombre del tercer competidor/establecimiento",
      "tipo": "Tipo o rol",
      "score": 45,
      "tendencia": "En declive",
      "fortaleza": "Operación tradicional",
      "op": "Captar sus clientes insatisfechos digitalmente"
    }
  ],
  "resumen": "Análisis geopolítico y demográfico del mercado de esta zona específica frente a la densidad de competidores.",
  "recomendacion": "Estrategia de localización definitiva para penetrar esta zona de forma exitosa frente al radar obtenido."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(502).json({ error: "La IA no devolvió contenido para el escaneo geográfico." });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing AI response in /api/scan:", parseError, "Raw text:", text.slice(0, 500));
      return res.status(502).json({ error: "La respuesta de la IA no es JSON válido. Intenta de nuevo." });
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/scan:", error);
    if (error.message?.includes("GEMINI_API_KEY")) {
      return res.status(503).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || "Error al escanear radar geográfico." });
  }
});

// 3. API: Innovatorio Project Postulation & Admission Evaluation
app.post("/api/evaluate-project", async (req, res) => {
  try {
    const { 
      pInovacion, pTecnologia, pEscalabilidad, pEquipo, pPrototipo, 
      pMercado, pIngresos, pPropiedad, pESG, pTraccion, pAdquisicion, 
      pFinanciamiento, pNombre, pNombreProyecto, pDescripcion 
    } = req.body;

    if (!pDescripcion) {
      return res.status(400).json({ error: "La descripción del proyecto es obligatoria para la postulación." });
    }

    const ai = getAiClient();
    const prompt = `Eres el Comité Evaluador Científico y de Inversión del programa "Innovatorio", organizado por Innovaclub.
Tu misión es evaluar el proyecto postulante basándote estrictamente en los 12 parámetros de evaluación proporcionados, calcular un porcentaje real de avance y aceptación, estructurar la estrategia exacta con el acompañamiento de Innovaclub y diseñar el "Paquete de Soluciones Estratégicas INNOVACLUB AI" con las herramientas tecnológicas recomendadas para su plataforma.

DATOS DEL POSTULANTE:
- Nombre del Fundador: ${pNombre || "No especificado"}
- Nombre del Proyecto: ${pNombreProyecto || "No especificado"}
- Descripción del Proyecto: ${pDescripcion}

PARÁMETROS SELECCIONADOS (12):
1. Nivel de Innovación: ${pInovacion || "No especificado"}
2. Tecnología Utilizada: ${pTecnologia || "No especificado"}
3. Escalabilidad del Proyecto: ${pEscalabilidad || "No especificado"}
4. Equipo Fundador: ${pEquipo || "No especificado"}
5. Maturity / Avance del Prototipo: ${pPrototipo || "No especificado"}
6. Mercado Objetivo / Tamaño: ${pMercado || "No especificado"}
7. Modelo de Ingresos: ${pIngresos || "No especificado"}
8. Propiedad Intelectual / Barreras: ${pPropiedad || "No especificado"}
9. Sostenibilidad / ESG: ${pESG || "No especificado"}
10. Tracción o Ventas Iniciales: ${pTraccion || "No especificado"}
11. Estrategia de Adquisición: ${pAdquisicion || "No especificado"}
12. Monto de Financiamiento Requerido: ${pFinanciamiento || "No especificado"}

Por favor realiza un análisis riguroso y genera una respuesta exclusivamente en JSON sin añadir código de formato extra.

Estructura de respuesta requerida:
{
  "porcentajeAvance": 78, 
  "aprobado": true, 
  "analisisPorParametro": [
    {"parametro": "Nivel de Innovación", "calificacion": "8/10", "comentario": "Comentario específico sobre sus fortalezas o debilidades en este punto."},
    {"parametro": "Tecnología Utilizada", "calificacion": "7/10", "comentario": "Comentario..."},
    {"parametro": "Escalabilidad del Proyecto", "calificacion": "8/10", "comentario": "Comentario..."},
    {"parametro": "Equipo Fundador", "calificacion": "9/10", "comentario": "Comentario..."},
    {"parametro": "Maturity / Prototipo", "calificacion": "6/10", "comentario": "Comentario..."},
    {"parametro": "Mercado Objetivo", "calificacion": "8/10", "comentario": "Comentario..."},
    {"parametro": "Modelo de Ingresos", "calificacion": "7/10", "comentario": "Comentario..."},
    {"parametro": "Propiedad Intelectual", "calificacion": "5/10", "comentario": "Comentario..."},
    {"parametro": "Sostenibilidad / ESG", "calificacion": "8/10", "comentario": "Comentario..."},
    {"parametro": "Tracción / Ventas", "calificacion": "4/10", "comentario": "Comentario..."},
    {"parametro": "Estrategia de Adquisición", "calificacion": "6/10", "comentario": "Comentario..."},
    {"parametro": "Plan de Financiamiento", "calificacion": "7/10", "comentario": "Comentario..."}
  ],
  "diagnosticoComite": "Opinión oficial detallada y profesional del comité evaluador de Innovatorio para el proyecto.",
  "estrategiaAcompaniamiento": {
    "objetivoParaMinimo": "Describir qué se necesita exactamente para llegar o superar el 85% de avance real para ser plenamente acelerado.",
    "fases": [
      {"fase": "Fase 1: Validación y Ajuste Tecnológico", "desc": "Descripción detallada del plan de acción que desarrollará con apoyo de mentores de Innovaclub."},
      {"fase": "Fase 2: Estructuración y Tracción", "desc": "Siguientes pasos metodológicos específicos..."},
      {"fase": "Fase 3: Alistamiento Financiero", "desc": "Pasos para estar listo ante rondas de inversión o préstamos..."}
    ]
  },
  "paqueteSolucionesAI": {
    "titulo": "Paquete de Soluciones Estratégicas INNOVACLUB AI",
    "descripcion": "Análisis de las necesidades de automatización y herramientas de inteligencia artificial y tecnología que este proyecto DEBERÍA incorporar inmediatamente en su plataforma para asegurar eficiencia, escalado rápido y madurez.",
    "herramientasRecomendadas": [
      {"nombre": "Nombre de herramienta 1 (ej. OpenAI API, Claude API, etc.)", "tipo": "IA / Infraestructura / Operaciones", "paraQueSirve": "Explicación exacta de cómo aplicarla directamente en el modelo de negocio del postulante para automatizar u optimizar.", "beneficioEstimado": "Ahorro del 40% en tiempos u optimización de costos."},
      {"nombre": "Nombre de la herramienta 2", "tipo": "Automatización o CRM", "paraQueSirve": "Su aplicación específica...", "beneficioEstimado": "Multiplicación de la conversión comercial."},
      {"nombre": "Nombre de la herramienta 3", "tipo": "Análisis de Datos / No-Code", "paraQueSirve": "Su aplicación específica...", "beneficioEstimado": "Lanzamiento un 70% más rápido."}
    ]
  }
}

Nota de calificación: Calcula el 'porcentajeAvance' de manera ponderada con base en los parámetros para que sea un reflejo real de la madurez del proyecto. Si es >= 80, pon aprobado en true, de lo contrario false, pero igual entrégales el plan de acompañamiento de Innovaclub para ayudarlos a llegar al 100%.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(502).json({ error: "La IA no devolvió contenido para la evaluación del proyecto." });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing AI response in /api/evaluate-project:", parseError, "Raw text:", text.slice(0, 500));
      return res.status(502).json({ error: "La respuesta de la IA no es JSON válido. Intenta de nuevo." });
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/evaluate-project:", error);
    if (error.message?.includes("GEMINI_API_KEY")) {
      return res.status(503).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || "Error al evaluar la postulación del proyecto." });
  }
});

// 4. API: Standalone Single-File HTML Downloader
app.get("/api/download-html", (req, res) => {
  try {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InnovaClubAI - Herramienta Completa</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --p: #9D00FF; --k: #FF2EFB; --b: #2E8BFF;
            --bg: #000; --bg2: #0d0d1a; --bg3: #111122;
            --w: #fff; --g: #e0e0e0;
        }
        body {
            font-family: 'Nunito', sans-serif;
            background-color: var(--bg);
            color: var(--w);
        }
        .glass {
            background: rgba(13, 13, 30, 0.75);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
        }
        .gradient-border {
            position: relative;
            border-radius: 16px;
        }
        .gradient-border::before {
            content: ""; position: absolute; inset: 0; border-radius: 16px; padding: 2px;
            background: linear-gradient(90deg, var(--p), var(--k), var(--b), var(--p));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; z-index: 0;
        }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .spin { animation: spin 4s linear infinite; }
    </style>
</head>
<body class="p-6">
    <div class="max-w-4xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center space-y-3">
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">InnovaClub<span class="text-[#FF2EFB]">AI</span></h1>
            <p class="text-[#2E8BFF] font-semibold text-lg">Análisis de Inteligencia Artificial & Postulación Directa al Innovatorio</p>
            <div class="w-24 h-1 bg-gradient-to-r from-[#9D00FF] via-[#FF2EFB] to-[#2E8BFF] mx-auto rounded-full"></div>
        </div>

        <!-- Descargo de versión Off-line -->
        <div class="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-sm">
            <strong>&#9888; Versión Autónoma Descargable:</strong> Este archivo es una versión interactiva autónoma de InnovaClubAI. Utiliza cálculos y simulaciones automatizadas para funcionar de forma 100% independiente de servidores u offline en cualquier lugar.
        </div>

        <!-- Dos Columnas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Columna Izquierda: Datos del Negocio y Radar -->
            <div class="space-y-6">
                
                <!-- Datos de la Empresa -->
                <div class="gradient-border glass p-6 space-y-4">
                    <h2 class="text-xl font-black text-[#9D00FF]">&#128203; 1. DATOS DE LA EMPRESA (Análisis Exacto)</h2>
                    
                    <div class="space-y-3">
                        <div>
                            <label class="block text-xs font-bold text-[#2E8BFF] uppercase mb-1">Estado de Madurez</label>
                            <select id="est" class="w-full bg-black/60 border border-[#9D00FF]/40 rounded-lg p-2 text-sm text-white outline-none">
                                <option value="idea">Idea / ProyectoConceptual</option>
                                <option value="prototipo">MVP / Prototipo Inicial</option>
                                <option value="proyecto">Proyecto en Desarrollo Activo</option>
                                <option value="empresa">Empresa en Operación Comercial</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#2E8BFF] uppercase mb-1">Sector o Industria</label>
                            <select id="sec" class="w-full bg-black/60 border border-[#9D00FF]/40 rounded-lg p-2 text-sm text-white outline-none">
                                <option value="tecnologia">Tecnología / SaaS / Software</option>
                                <option value="comercio">Comercio / Retail / E-commerce</option>
                                <option value="alimentacion">Alimentación / Restaurantes</option>
                                <option value="salud">Salud / Bienestar / Estética</option>
                                <option value="educacion">Educación / E-learning</option>
                                <option value="otro">Otro Sector Alternativo</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#2E8BFF] uppercase mb-1">Modelo de Negocio</label>
                            <select id="mod" class="w-full bg-black/60 border border-[#9D00FF]/40 rounded-lg p-2 text-sm text-white outline-none">
                                <option value="b2b">B2B (Empresas)</option>
                                <option value="b2c">B2C (Consumidor Final)</option>
                                <option value="mixto">B2B2C / Híbrido</option>
                                <option value="suscripcion">Suscripción Mensual / Recurrente</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#2E8BFF] uppercase mb-1">Inversión / Presupuesto</label>
                            <select id="inv" class="w-full bg-black/60 border border-[#9D00FF]/40 rounded-lg p-2 text-sm text-white outline-none">
                                <option value="bajo">Menos de $1,000 USD (Bootstrapping)</option>
                                <option value="medio">$1,000 - $10,000 USD</option>
                                <option value="alto">Más de $10,000 USD</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#2E8BFF] uppercase mb-1">Público Objetivo</label>
                            <select id="pub" class="w-full bg-black/60 border border-[#9D00FF]/40 rounded-lg p-2 text-sm text-white outline-none">
                                <option value="genz">Jóvenes (Generación Z y Millennials)</option>
                                <option value="adultos">Profesionales / Adultos de edad media</option>
                                <option value="corporativo">Corporaciones y Grandes Clientes</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#2E8BFF] uppercase mb-1">Ventaja Diferencial</label>
                            <select id="dif" class="w-full bg-black/60 border border-[#9D00FF]/40 rounded-lg p-2 text-sm text-white outline-none">
                                <option value="tecnologica">Tecnología de última generación / IA</option>
                                <option value="precio">Optimización radical de costos y precio</option>
                                <option value="experiencia">Mejor servicio y experiencia de usuario</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#2E8BFF] uppercase mb-1">Breve Descripción</label>
                            <textarea id="desc" class="w-full h-20 bg-black/60 border border-[#9D00FF]/40 rounded-lg p-2 text-sm text-white outline-none resize-none" placeholder="Describe tu proyecto o idea principal..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Radar y Ubicación Compartida en un Solo Cuadro -->
                <div class="gradient-border glass p-6 space-y-4">
                    <h2 class="text-xl font-black text-[#2E8BFF]">&#128225; 2. RADAR GEOGRÁFICO & UBICACIÓN</h2>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-[#FF2EFB] uppercase mb-1">Ubicación del Escaneo</label>
                            <input id="ubi" type="text" class="w-full bg-black/60 border border-[#9D00FF]/40 rounded-lg p-2 text-sm text-white outline-none" value="Bogotá, Colombia">
                        </div>
                        
                        <div class="flex gap-2">
                            <button onclick="setRadius('500m')" class="flex-1 py-1 px-2 text-xs font-bold bg-[#2E8BFF]/20 border border-[#2E8BFF]/40 rounded-full text-center hover:bg-[#2E8BFF]/40 transition text-white">500 m</button>
                            <button onclick="setRadius('1km')" class="flex-1 py-1 px-2 text-xs font-bold bg-[#2E8BFF]/20 border border-[#2E8BFF]/40 rounded-full text-center hover:bg-[#2E8BFF]/40 transition text-white">1 km</button>
                            <button onclick="setRadius('5km')" class="flex-1 py-1 px-2 text-xs font-bold bg-[#2E8BFF]/20 border border-[#2E8BFF]/40 rounded-full text-center hover:bg-[#2E8BFF]/40 transition text-white">5 km</button>
                        </div>

                        <!-- Radar Visual -->
                        <div class="flex justify-center py-4 bg-black/40 rounded-xl relative overflow-hidden">
                            <svg class="w-40 h-40" viewBox="0 0 200 200">
                                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(157,0,255,.2)" stroke-width="1"/>
                                <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(157,0,255,.15)" stroke-width="1"/>
                                <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(157,0,255,.15)" stroke-width="1"/>
                                <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(157,0,255,.15)"/>
                                <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(157,0,255,.15)"/>
                                <g class="spin" style="transform-origin: 100px 100px;">
                                    <line x1="100" y1="100" x2="100" y2="10" stroke="#FF2EFB" stroke-width="2"/>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Columna Derecha: Innovatorio (12 parámetros) y Resultados -->
            <div class="space-y-6">
                
                <!-- Innovatorio Panel -->
                <div class="gradient-border glass p-6 space-y-4">
                    <h2 class="text-xl font-black text-[#FF2EFB]">&#128640; 3. POSTULA TU PROYECTO GRATIS EN NUESTRO INNOVATORIO</h2>
                    <p class="text-xs text-slate-400">Completa los 12 parámetros de alta relevancia para que el comité de evaluación en vivo te entregue una respuesta inmediata y tu paquete de herramientas.</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="evalParams">
                        <!-- Parámetro 1 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">1. Grado de Innovación</label>
                            <select id="p1" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Disruptiva / Radical</option>
                                <option value="7">Incremental Sustancial</option>
                                <option value="4">Mejora Mínima</option>
                            </select>
                        </div>
                        <!-- Parámetro 2 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">2. Tecnología de IA</label>
                            <select id="p2" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Core IA / Automatizado</option>
                                <option value="8">IA como Integración</option>
                                <option value="4">Tecnología Tradicional</option>
                            </select>
                        </div>
                        <!-- Parámetro 3 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">3. Escalabilidad</label>
                            <select id="p3" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Nivel Global / Exponencial</option>
                                <option value="7">Multiregional Escalable</option>
                                <option value="4">Crecimiento Local Lineal</option>
                            </select>
                        </div>
                        <!-- Parámetro 4 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">4. Equipo de Trabajo</label>
                            <select id="p4" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Técnico + Comercial Sólido</option>
                                <option value="7">Multidisciplinario Parcial</option>
                                <option value="3">Solo un Fundador único</option>
                            </select>
                        </div>
                        <!-- Parámetro 5 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">5. Estado de Desarrollo</label>
                            <select id="p5" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">MVP con Clientes Reales</option>
                                <option value="7">Prototipo funcional cerrado</option>
                                <option value="3">Solo Presentación / Ideas</option>
                            </select>
                        </div>
                        <!-- Parámetro 6 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">6. Tamaño del Mercado</label>
                            <select id="p6" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">TAM de Billones de USD</option>
                                <option value="7">Mercado de Millones nicho</option>
                                <option value="3">Nicho local limitado</option>
                            </select>
                        </div>
                        <!-- Parámetro 7 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">7. Modelo de Ingresos</label>
                            <select id="p7" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Suscripción SaaS / Recurrente</option>
                                <option value="7">Transaccional por venta</option>
                                <option value="4">Basado en publicidad o incierto</option>
                            </select>
                        </div>
                        <!-- Parámetro 8 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">8. Barreras de Entrada</label>
                            <select id="p8" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Patente o Algoritmo Propio</option>
                                <option value="7">Marca o Red de Clientes</option>
                                <option value="3">Fácilmente replicable</option>
                            </select>
                        </div>
                        <!-- Parámetro 9 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">9. Criterios ESG / Soste.</label>
                            <select id="p9" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Ecológico / Social de Origen</option>
                                <option value="7">Compromiso Parcial</option>
                                <option value="4">Sin impacto o Neutro</option>
                            </select>
                        </div>
                        <!-- Parámetro 10 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">10. Tracción de Usuarios</label>
                            <select id="p10" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Crecimiento mensual activo >15%</option>
                                <option value="7">Algunos usuarios de prueba</option>
                                <option value="3">Ningún usuario activo</option>
                            </select>
                        </div>
                        <!-- Parámetro 11 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">11. Costo Adquisición (CAC)</label>
                            <select id="p11" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Orgánico extremadamente bajo</option>
                                <option value="7">Costo medio por publicidad</option>
                                <option value="4">Costo insostenible actualmente</option>
                            </select>
                        </div>
                        <!-- Parámetro 12 -->
                        <div>
                            <label class="block text-[10px] font-bold text-[#9D00FF] uppercase mb-0.5">12. Financiamiento Necesario</label>
                            <select id="p12" class="w-full bg-black/60 border border-[#9D00FF]/30 rounded-lg p-1.5 text-xs text-white outline-none">
                                <option value="10">Suficiente con recursos propios</option>
                                <option value="7">Requiere Inversión Semilla</option>
                                <option value="4">En riesgo crítico financiero</option>
                            </select>
                        </div>
                    </div>

                    <button onclick="calificarProyecto()" class="w-full text-center py-3 rounded-xl font-bold bg-gradient-to-r from-[#9D00FF] to-[#FF2EFB] text-white shadow-lg shadow-[#FF2EFB]/20 hover:scale-[1.01] active:scale-[0.99] transition">
                        EFECTUAR EVALUACIÓN AL INNOVATORIO
                    </button>
                </div>

                <!-- Resultados del Análisis (Offline compatible) -->
                <div id="resultadoBox" class="gradient-border glass p-6 space-y-4 hidden md:block">
                    <h2 class="text-xl font-black text-[#2E8BFF]">&#127881; RESULTADOS DE EVALUACIÓN DIGITAL</h2>
                    
                    <div class="space-y-4">
                        <div class="flex justify-between items-center bg-black/40 p-4 rounded-xl">
                            <span class="text-sm font-bold text-slate-300">AVANCE DEL PROYECTO:</span>
                            <span id="avancePct" class="text-3xl font-black text-[#FF2EFB]">0%</span>
                        </div>

                        <div id="statusAlert" class="p-4 rounded-xl border font-bold text-center text-sm">
                            Realiza el análisis arriba.
                        </div>

                        <!-- Estrategia y acompañamiento de Innovaclub -->
                        <div class="space-y-2">
                            <h3 class="text-sm font-black text-[#9D00FF]">&#11088; ACOMPAÑAMIENTO PERMANENTE INNOVACLUB:</h3>
                            <div id="estrateResult" class="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-slate-800">
                                Evalúa tu proyecto para recibir un plan de mentoría y empuje digital completo.
                            </div>
                        </div>

                        <!-- Recomendaciones de Herramientas de IA -->
                        <div class="space-y-2">
                            <h3 class="text-sm font-black text-[#2E8BFF]">&#129302; HERRAMIENTAS RECOMENDADAS PARA MI PLATAFORMA:</h3>
                            <div id="toolResult" class="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-slate-800">
                                Conoce las mejores herramientas SaaS e IA que deberías integrar inmediatamente de manera estratégica.
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <div id="resultadoBoxMobile" class="gradient-border glass p-6 space-y-4 md:hidden">
            <h2 class="text-xl font-black text-[#2E8BFF]">&#127881; RESULTADOS DE EVALUACIÓN DIGITAL</h2>
            
            <div class="space-y-4">
                <div class="flex justify-between items-center bg-black/40 p-4 rounded-xl">
                    <span class="text-sm font-bold text-slate-300">AVANCE DEL PROYECTO:</span>
                    <span id="avancePctMob" class="text-3xl font-black text-[#FF2EFB]">0%</span>
                </div>

                <div id="statusAlertMob" class="p-4 rounded-xl border font-bold text-center text-sm bg-black/20 border-slate-850 text-slate-400">
                    Realiza el análisis arriba.
                </div>

                <div class="space-y-2">
                    <h3 class="text-sm font-black text-[#9D00FF]">&#11088; ACOMPAÑAMIENTO PERMANENTE INNOVACLUB:</h3>
                    <div id="estrateResultMob" class="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-slate-800">
                        Evalúa tu proyecto para recibir un plan de mentoría y empuje digital completo.
                    </div>
                </div>

                <div class="space-y-2">
                    <h3 class="text-sm font-black text-[#2E8BFF]">&#129302; HERRAMIENTAS RECOMENDADAS PARA MI PLATAFORMA:</h3>
                    <div id="toolResultMob" class="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-slate-800">
                        Conoce las mejores herramientas SaaS e IA que deberías integrar inmediatamente de manera estratégica.
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center py-6 text-xs text-slate-500 border-t border-slate-900">
            InnovaClubAI &copy; 2026. Todos los derechos reservados.
        </div>
    </div>

    <script>
        var radius = '500m';
        function setRadius(r) {
            radius = r;
            alert('Frecuencia del radar geográfico ajustada a: ' + r + '. Iniciando escaneo local...');
        }

        function calificarProyecto() {
            var sum = 0;
            for(var i=1; i<=12; i++) {
                sum += parseInt(document.getElementById('p' + i).value || 0);
            }
            var maxPossible = 120;
            var pct = Math.round((sum / maxPossible) * 100);
            
            // Render results
            document.getElementById('avancePct').textContent = pct + '%';
            document.getElementById('avancePctMob').textContent = pct + '%';
            
            var approved = pct >= 80;
            var alertText = '';
            var alertClass = '';
            
            if(approved) {
                alertText = '&#9989; ¡FELICIDADES! Proyecto APROBADO para el programa "Innovatorio". Recibes el Paquete Estratégico INNOVACLUB AI.';
                alertClass = 'border-green-500/30 bg-green-500/10 text-green-300';
            } else {
                alertText = '&#9888; Estado: No admitido de inmediato. Necesitas mínimo el 80% de avance para ingresar al Innovatorio.';
                alertClass = 'border-[#FF2EFB]/30 bg-[#FF2EFB]/10 text-[#FF2EFB]';
            }
            
            var statusBox = document.getElementById('statusAlert');
            statusBox.innerHTML = alertText;
            statusBox.className = 'p-4 rounded-xl border font-bold text-center text-sm ' + alertClass;

            var statusBoxMob = document.getElementById('statusAlertMob');
            statusBoxMob.innerHTML = alertText;
            statusBoxMob.className = 'p-4 rounded-xl border font-bold text-center text-sm ' + alertClass;

            // Estrategias
            var estrateHtml = '<strong>Objetivo para el ' + pct + '% obtenido:</strong><br>';
            if(approved) {
                estrateHtml += 'Acompañamiento permanente semanal con Innovaclub para el escalado inmediato de tu startup, con coaching 1-a-1 y revisiones técnicas.';
            } else {
                estrateHtml += 'Te guiaremos mediante el acompañamiento permanente de Innovaclub en las siguientes tareas clave: <br>1. Reforzar el MVP con validación de mercado real.<br>2. Definir un modelo de cobros recurrentes de alta rentabilidad.<br>3. Constituir bases robustas de propiedad intelectual.<br>Con esto garantizaremos tu ingreso prioritario de inmediato.';
            }
            document.getElementById('estrateResult').innerHTML = estrateHtml;
            document.getElementById('estrateResultMob').innerHTML = estrateHtml;

            // Herramientas
            var toolHtml = '<strong>Herramientas recomendadas para integrar de inmediato a tu plataforma:</strong><br>';
            toolHtml += '1. <strong>OpenAI / Claude API:</strong> Motor de respuesta automática de lenguaje.<br>';
            toolHtml += '2. <strong>Zapier / Make:</strong> Para integraciones No-Code rápidas de flujos internos.<br>';
            toolHtml += '3. <strong>Vercel & Next.js:</strong> Estructura web moderna, rápida y optimizada para SEO.';
            document.getElementById('toolResult').innerHTML = toolHtml;
            document.getElementById('toolResultMob').innerHTML = toolHtml;

            alert('¡Evaluación completada! Score final del proyecto: ' + pct + '%. Tu plan estratégico ha sido desbloqueado.');
        }
    </script>
</body>
</html>`;
    res.setHeader("Content-Disposition", "attachment; filename=InnovaClubAI-Herramienta.html");
    res.setHeader("Content-Type", "text/html");
    res.send(htmlContent);
  } catch (error: any) {
    console.error("Error in /api/download-html:", error);
    res.status(500).send("Error al descargar la herramienta.");
  }
});

// Global error-handling middleware (must be registered after all routes)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Error interno del servidor. Intenta de nuevo más tarde." });
});

// Vite Middleware Integration
async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
