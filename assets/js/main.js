/* gestoresgranada.com — JS mínimo. Analítica (GA4) solo con consentimiento previo. */
document.addEventListener("DOMContentLoaded", function () {

  /* 1) Menú móvil */
  var btn = document.getElementById("hamburgerBtn");
  var cerrar = document.getElementById("closeMenuBtn");
  var menu = document.getElementById("mobileMenu");

  function alternar(abrir) {
    if (!menu) return;
    menu.hidden = !abrir;
    if (btn) btn.setAttribute("aria-expanded", String(abrir));
  }
  if (btn) btn.addEventListener("click", function (e) { e.stopPropagation(); alternar(menu.hidden); });
  if (cerrar) cerrar.addEventListener("click", function () { alternar(false); });
  document.addEventListener("click", function (e) {
    if (menu && !menu.hidden && !menu.contains(e.target) && btn && !btn.contains(e.target)) alternar(false);
  });
  if (menu) menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { alternar(false); });
  });

  /* 2) Mapa bajo demanda: el iframe de Google Maps solo se carga si el
        visitante lo pide. Así no se cargan cookies de Google Maps por defecto. */
  var cargarMapa = document.getElementById("cargarMapa");
  if (cargarMapa) cargarMapa.addEventListener("click", function () {
    var caja = document.getElementById("mapaCaja");
    if (!caja) return;
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.google.com/maps?q=Calle+Torre+de+Machuca,+4,+Bajo+1,+18007+Granada+(Zaid%C3%ADn)&hl=es&z=16&output=embed";
    iframe.title = "Mapa de ubicación: Calle Torre de Machuca, 4, Bajo 1, 18007 Granada (Zaidín)";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    caja.innerHTML = "";
    caja.appendChild(iframe);
  });

  /* 3) Consentimiento de cookies de analítica (GA4).
        «Rechazar» y «Aceptar» al mismo nivel y con el mismo formato (Guía de
        cookies de la AEPD, criterio exigible desde el 11-01-2024). La elección
        se guarda 24 meses en localStorage (almacenamiento técnico exento) y se
        puede cambiar en cualquier momento desde «Configurar cookies» del pie. */
  var CLAVE = "cookies_analitica", VIGENCIA = 63072000000;
  function leer() {
    try {
      var c = (localStorage.getItem(CLAVE) || "").split("|");
      if ((c[0] === "si" || c[0] === "no") && Date.now() - Number(c[1]) < VIGENCIA) return c[0];
    } catch (e) {}
    return null;
  }
  function guardar(v) { try { localStorage.setItem(CLAVE, v + "|" + Date.now()); } catch (e) {} }
  function borrarCookiesGA() {
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (/^_ga/.test(n)) {
        ["", "; domain=.gestoresgranada.com", "; domain=" + location.hostname].forEach(function (d) {
          document.cookie = n + "=; Max-Age=0; path=/" + d;
        });
      }
    });
  }
  var aviso = null;
  function cerrarAviso() { if (aviso) { aviso.remove(); aviso = null; } }
  function decidir(v) {
    var antes = leer();
    guardar(v);
    cerrarAviso();
    if (v === "si") {
      if (window.cargarGA) window.cargarGA();
    } else if (antes === "si" || window.gaCargado) {
      if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
      borrarCookiesGA();
      location.reload();
    }
  }
  function mostrarAviso() {
    if (aviso) return;
    aviso = document.createElement("div");
    aviso.className = "cookies";
    aviso.setAttribute("role", "dialog");
    aviso.setAttribute("aria-label", "Aviso de cookies");
    aviso.innerHTML =
      '<p class="cookies__texto">Usamos <strong>cookies de analítica de Google Analytics</strong> para saber cuántas personas visitan la web y qué páginas consultan. Solo se activan si las aceptas. <a href="/politica-cookies.html">Más información</a></p>' +
      '<div class="cookies__botones">' +
      '<button type="button" class="cookies__boton" data-cookies="no">Rechazar</button>' +
      '<button type="button" class="cookies__boton" data-cookies="si">Aceptar</button>' +
      "</div>";
    aviso.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cookies]");
      if (b) decidir(b.getAttribute("data-cookies"));
    });
    document.body.appendChild(aviso);
  }
  if (!leer()) mostrarAviso();
  document.querySelectorAll("[data-cookies-config]").forEach(function (b) {
    b.addEventListener("click", mostrarAviso);
  });
});
