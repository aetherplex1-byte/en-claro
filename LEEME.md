# En Claro - Guia para publicarlo en Vercel (usa Gemini gratis)

Misma estructura que ya conoces. Pasos rapidos:

## 1. Llave de Gemini (gratis)
- Entra a https://aistudio.google.com/apikey
- "Create API key" y copiala.
- (Puedes reutilizar la MISMA llave que ya usas en tu otra app.)

## 2. Subir a GitHub
- Crea un repositorio nuevo (ej. "enclaro").
- Sube el CONTENIDO de esta carpeta: index.html, la carpeta api (con
  analizar.js dentro) y package.json.
- En Android: crea el archivo a mano con "Add file > Create new file" y
  nombre  api/analizar.js , pegando el contenido.

## 3. Vercel
- vercel.com -> Add New -> Project -> importa el repositorio -> Deploy.
- Settings -> Environments (Production) -> anade variable:
    Key:   GEMINI_API_KEY
    Value: tu llave
- Deployments -> ... -> Redeploy.

## 4. Probar
- Abre el enlace que da Vercel y pega un documento de ejemplo.

## Notas
- Los 3 usos gratis viven en el navegador (recargar los repone). Bien para
  lanzar; para cobrar de verdad hace falta cuentas + servidor + Stripe.
- El boton de pago esta simulado por ahora.
- La capa gratis de Gemini tiene limites por minuto/dia. Suficiente para empezar.
