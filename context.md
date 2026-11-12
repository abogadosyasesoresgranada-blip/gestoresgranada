# context.md — gestoresgranada.com

Documento de contexto para futuros cambios en el sitio. Leer antes de editar.
Última actualización: 2026-11-12.

---

## 1. Qué es

Web estática de **Felisa Herrera Talavera**, asesoría y gestoría **solo para autónomos** (personas físicas) y la gestión laboral de sus trabajadores, en el **Zaidín (Granada, CP 18007)**.

- Dominio canónico: **https://www.gestoresgranada.com/** (siempre `www` + `https`).
- Sustituye (sep-2026) a una web Joomla anterior de un despacho de abogados. Las URLs antiguas se redirigen o devuelven 410 (ver `.htaccess`).
- Objetivo principal: SEO local + visibilidad en respuestas de IA (llms.txt, JSON-LD muy completo, robots abierto a IA que cita).

### Datos de negocio (fuente de verdad — deben coincidir en TODAS las páginas, JSON-LD y llms.txt)

| Dato | Valor |
|---|---|
| Titular | Felisa Herrera Talavera |
| Dirección | Calle Torre de Machuca, 4, Bajo 1, 18007 Granada (Zaidín) |
| Coordenadas | 37.15545880182846, -3.59479047738148 |
| Teléfono / WhatsApp | +34 633 166 777 (`tel:+34633166777`, `https://wa.me/34633166777`) |
| Email | felisahtalavera@gmail.com |
| Horario | L–V 9:00–15:00 |
| En ejercicio desde | 2006 |
| GA4 | `G-LKCRJRYJZS` |

**Lo que NO hace** (no añadir contenido que lo contradiga): sociedades (SL), Impuesto sobre Sociedades, cuentas anuales, servicios jurídicos, tráfico/DGT. **No es gestora administrativa colegiada.**

---

## 2. Stack y estructura

HTML + CSS + JS vanilla. **Sin build, sin npm, sin plantillas.** Se despliega subiendo los archivos tal cual a un hosting Apache (usa `.htaccess`, mod_rewrite, mod_headers, brotli/deflate, detrás de proxy con `X-Forwarded-Proto`).

```
/
├── index.html                       Home
├── asesoria-fiscal-granada.html     Servicio fiscal
├── asesoria-contable-granada.html   Servicio contable
├── asesoria-laboral-granada.html    Servicio laboral
├── contacto.html                    Contacto + mapa bajo demanda
├── aviso-legal.html                 noindex
├── politica-privacidad.html         noindex
├── politica-cookies.html            noindex
├── .htaccess                        Redirecciones, seguridad, caché
├── robots.txt                       Abierto a buscadores e IA que cita; bloquea scrapers
├── sitemap.xml                      Solo las 5 páginas indexables
├── llms.txt                         Resumen para LLMs
└── assets/
    ├── css/style.css                Único CSS (~17 KB)
    ├── js/main.js                   Menú móvil, mapa bajo demanda, banner cookies
    ├── fonts/Nunito/                Nunito 400 y 700 en woff2 (local, OFL)
    └── img/                         .webp de contenido, favicons, logo, OG
```

---

## 3. Anatomía de cada página HTML

Todas comparten el mismo esqueleto, **copiado a mano en cada archivo** (no hay includes):

1. `<head>`:
   - Script inline de **GA4 con Consent Mode v2 básico**: todo `denied` por defecto; `window.cargarGA()` solo se ejecuta si `localStorage.cookies_analitica` = `si|timestamp` (< 24 meses). Sin consentimiento no se descarga nada de Google.
   - `<title>`, `meta description`, `author`, `canonical` absoluto.
   - Preload de las dos fuentes Nunito.
   - Favicons (ico, svg, png 96, apple-touch).
   - `style.css?v=1.1` ← **versión de caché** (CSS/JS se sirven con `immutable` 6 meses).
   - `meta robots` (index en páginas de negocio, `noindex, follow` en legales).
   - Open Graph + Twitter card (imagen `og-felisa-herrera-asesoria-granada.webp`, 1200×630).
   - **Un único `<script type="application/ld+json">` con `@graph`**: `AccountingService`, `Person`, `WebSite`, `WebPage`/`ContactPage`, `BreadcrumbList`, `FAQPage` (Question/Answer), `OfferCatalog`/`Service`/`Offer`, `areaServed` (City/Place), credenciales educativas de Felisa, etc.
2. `<header class="cabecera">` con `.marca`, `nav.nav`, botón WhatsApp y `.hamburguesa` (`#hamburgerBtn`).
3. `<nav class="menu-movil" id="mobileMenu" hidden>` con `#closeMenuBtn`.
4. `<main id="contenido">` con secciones `section.seccion` (alternando `seccion--panel`), `.hero`, `.faq` (`<details>/<summary>` + `.faq__cuerpo`), `.cta-final`.
5. `<footer class="pie">` con `.pie__rejilla`, enlaces legales y botón `data-cookies-config` ("Configurar cookies").
6. `<script src="/assets/js/main.js">`.

### ⚠️ Duplicaciones que hay que mantener sincronizadas
- **Cabecera, menú móvil y pie** → repetidos en las 8 páginas. Un cambio de menú/pie = editar las 8.
- **FAQ**: cada pregunta existe **dos veces** (en JSON-LD `FAQPage` y en el HTML `<details>`). El texto debe ser idéntico.
- **Datos de negocio** (tabla de arriba) → HTML visible + JSON-LD de cada página + `llms.txt`.
- **Mensaje prefijado de WhatsApp** (`?text=Hola%20Felisa...`) repetido en varios botones.
- Al tocar `style.css` o `main.js` → **subir `?v=` en las 8 páginas** (p. ej. `v=1.1` → `v=1.2`).

---

## 4. Diseño (style.css)

- Tokens en `:root`: `--verde #175c4f`, `--verde-osc #0e4239` (también `theme-color`), `--verde-suave`, `--tinta`, `--gris`, `--papel #fcfbf8`, `--ambar #96690f`, `--wa #1da851`, `--radio 10px`, `--ancho 1080px`.
- Tipografía: Nunito local (400/700), `font-display: swap`.
- Nomenclatura **BEM en español**: `.boton`, `.boton--wa`, `.boton--borde`, `.boton--verde`, `.cabecera`, `.pie__rejilla`, `.hero__rejilla`, `.faq__cuerpo`, `.cookies__boton`, `.servicios`, `.fichas`, `.proceso`, `.plazos`, `.tramites`, `.quien`, `.migas`, `.tabla-legal`, `.mapa-caja`, `.pendiente` (resaltado amarillo para textos por completar).
- Breakpoints: 920, 860, 720, 520 px. Respeta `prefers-reduced-motion`.
- Sin dependencias externas (ni CDN, ni Google Fonts).

## 5. JS (main.js)

1. Menú móvil (toggle `hidden` + `aria-expanded`, cierre al clicar fuera o en enlace).
2. Mapa de Google **solo al pulsar** `#cargarMapa` (inserta iframe en `#mapaCaja`) → no hay cookies de Maps por defecto.
3. Banner de cookies conforme a Guía AEPD 2024: "Rechazar" y "Aceptar" al mismo nivel; elección en `localStorage` (`cookies_analitica`, 24 meses); al revocar, borra cookies `_ga*` y recarga.

---

## 6. SEO / técnico

- **`.htaccess`** (orden importa):
  0. Migración Joomla → estático: `/index.php` → `/`; `/es/`, `/es/fiscal`, `/es/laboral` → 301 a sus equivalentes; resto de `/es/*` → **410 Gone**. *Mantener de forma permanente.*
  1. `/index.html` → `/`.
  2. Host sin `www` → `www` (regla separada de la de HTTPS por el proxy).
  3. `http` → `https` (comprueba `HTTPS` y `X-Forwarded-Proto`).
  - Cabeceras de seguridad (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy), compresión, caché (HTML `no-cache`; estáticos 1 año / 6 meses `immutable`).
- **`sitemap.xml`**: 5 URLs indexables. Actualizar `<lastmod>` cuando cambie el contenido de una página. Las legales NO van en el sitemap.
- **`robots.txt`**: permite todo; bloquea Bytespider, Diffbot, Omgili(bot), ImagesiftBot, Timpibot, cohere-training-data-crawler. CCBot permitido a propósito.
- **`llms.txt`**: resumen verificado para IA. Actualizar si cambian servicios, datos o páginas.
- Imágenes de contenido en `.webp` con nombres descriptivos con keyword (`asesoria-...-granada-....webp`).
- Canonical, OG y JSON-LD siempre con URL absoluta `https://www.gestoresgranada.com/...`.
- Enlaces internos con rutas absolutas desde raíz (`/contacto.html`, `/assets/...`).

---

## 7. Estilo de contenido

- Español de España, tono cercano, **primera persona de Felisa** ("Qué llevo por ti", "Conóceme en persona") combinada con "nosotros" en algunas FAQ.
- Muy concreto: modelos de la AEAT (036/037, 303, 390, 130, 131, 111, 115, 190, 180, 347, 349, 100), RETA, Tarifa Plana, Cuota Cero Junta de Andalucía, Verifactu, Sistema RED/Siltra, Contrat@, DEHú.
- Énfasis local: Zaidín, PTS, Avenida de Dílar, Palacio de Deportes, metro (Hípica, Andrés Segovia, Palacio de Deportes), municipios del área (Armilla, La Zubia, Ogíjares, Churriana de la Vega, Huétor Vega).
- Precio: "cuota mensual cerrada", sin cifras publicadas.
- No mencionar ni enlazar al antiguo despacho de abogados (para no mezclar señales).

---

## 8. Checklist para cualquier cambio

- [ ] ¿Afecta a cabecera/pie/menú? → replicar en las 8 HTML.
- [ ] ¿Cambia una FAQ? → JSON-LD y `<details>` iguales.
- [ ] ¿Cambia un dato de negocio? → HTML + JSON-LD (8 páginas) + `llms.txt`.
- [ ] ¿Cambia CSS/JS? → subir `?v=` en las 8 páginas.
- [ ] ¿Página nueva indexable? → copiar esqueleto completo, canonical, OG, JSON-LD con breadcrumb, enlazar en nav/pie de todas, añadir a `sitemap.xml` y `llms.txt`.
- [ ] ¿Contenido modificado? → actualizar `<lastmod>` en `sitemap.xml`.
- [ ] Validar JSON-LD (Rich Results Test / validator.schema.org) tras tocarlo.
- [ ] No añadir scripts/recursos externos que carguen sin consentimiento.

---

## 9. Git y despliegue

- Repo: `origin` → `github.com/abogadosyasesoresgranada-blip/gestoresgranada` · rama única **`main`**.
- Historial: `65c4e3e primer commit` (estado inicial del sitio).
- **Flujo acordado:** Claude puede preparar commits y hacer `git push origin main`, **siempre pidiendo confirmación antes** de cada commit y de cada push.
- Mensajes de commit en español, descriptivos (qué y por qué).
- El despliegue al hosting no está automatizado desde el repo (subida manual de archivos), salvo que se indique lo contrario.

---

## 10. Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-11-12 | Creado `context.md` con el análisis inicial del proyecto. |
