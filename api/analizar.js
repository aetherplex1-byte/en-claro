// api/analizar.js  -  En Claro (Google Gemini, capa gratuita)
// Vive OCULTO en el servidor de Vercel: el usuario nunca ve tu llave.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo no permitido" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Falta configurar la llave de IA" });
  }

  try {
    const { doc, kind } = req.body || {};

    if (!doc || typeof doc !== "string" || doc.trim().length < 15) {
      return res.status(400).json({ error: "Documento vacio o demasiado corto" });
    }
    if (doc.length > 12000) {
      return res.status(400).json({ error: "Documento demasiado largo" });
    }

    const prompt = `Eres "En Claro", un asistente experto que traduce documentos oficiales, legales, medicos, bancarios y administrativos a lenguaje sencillo, en espanol. Eres claro, tranquilizador y practico. Nunca inventas datos que no esten en el texto. Si algo no aparece en el documento, no lo afirmes.

Tipo de documento (orientativo, puede ser "general"): ${kind || "general"}

Documento del usuario:
"""${doc}"""

Explicalo en lenguaje normal, como se lo explicarias a un amigo que no sabe de leyes ni tramites. Responde SOLO con JSON valido, sin markdown ni texto extra, con esta forma exacta:
{
  "oneLine": "<en UNA frase clara, que es este documento y por que le llego a la persona>",
  "urgency": "alta | media | baja",
  "summary": "<2-4 frases explicando que dice de verdad, sin jerga. Concreto al documento>",
  "deadline": {
    "has": <true si hay alguna fecha limite o plazo en el texto, si no false>,
    "short": "<dia del mes en numero, ej '15', o '!' si no hay dia concreto>",
    "text": "<descripcion del plazo, ej 'Tienes hasta el 15 de marzo para pagar o alegar'>"
  },
  "actions": ["<paso concreto que debe hacer, en imperativo>","<otro>","<otro>"],
  "terms": [
    {"word":"<termino dificil que aparece en el texto>","meaning":"<que significa en simple>"},
    {"word":"<otro>","meaning":"<...>"}
  ],
  "warnings": ["<algo a lo que prestar atencion: cargo, clausula, consecuencia de no actuar>","<otro si aplica>"]
}
Adapta el numero de elementos al documento real. Si no hay terminos dificiles o advertencias, devuelve listas vacias. Se util y especifico, nunca generico.`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8000,
          responseMimeType: "application/json"
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Error de Gemini:", detail);
      return res.status(502).json({ error: "La IA no respondio. Intentalo de nuevo." });
    }

    const data = await r.json();
    let txt = (((data.candidates || [])[0] || {}).content || {}).parts;
    txt = (txt && txt[0] && txt[0].text) ? txt[0].text : "";
    txt = txt.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(txt);
    return res.status(200).json(parsed);

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "No se pudo analizar el documento." });
  }
}
