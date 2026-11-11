# TORAL — Paisajismo & Construcción

Sitio web de [www.toralpyc.cl](https://www.toralpyc.cl). Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación): se sube tal cual a cualquier hosting.

## Estructura

```
index.html            Página principal (todas las secciones + preguntas frecuentes)
paisajismo/           Página: Paisajismo y diseño de jardines
mantencion-de-jardines/  Página: Mantención de jardines y áreas verdes
construccion/         Página: Construcción de quinchos, terrazas y piscinas
diseno-y-planificacion/  Página: Diseño, master plan y renders 3D
politica-de-privacidad/  Política de Privacidad (Ley 19.628 y Ley 21.719)
terminos-y-condiciones/  Términos y Condiciones
assets/css/styles.css Estilos
assets/js/main.js     Menú, pestañas, filtro de proyectos, lightbox y formulario
assets/img/           Logo (SVG claro/oliva y PNG) y fotografías (800 px y tamaño grande)
assets/video/         Video de renders 3D (fondo del inicio y sección 3D)
robots.txt, sitemap.xml, favicon.ico
.htaccess             Compresión y caché (hosting Apache/cPanel)
```

## Antes de publicar

1. **Número de WhatsApp** (configurado: +56 9 3459 4694): para cambiarlo, edita `WHATSAPP_NUMBER` en `assets/js/main.js` (formato `569XXXXXXXX`, sin `+` ni espacios). Lo usan el botón flotante, los botones "Contactar por WhatsApp" y el formulario de cotización.
2. Sube todo el contenido de la carpeta a la raíz del dominio `toralpyc.cl`.

## Datos legales pendientes

En `politica-de-privacidad/index.html` y `terminos-y-condiciones/index.html` hay datos resaltados en amarillo
(`class="dato-pendiente"`): razón social, RUT, domicilio y correo. Reemplaza cada `<span class="dato-pendiente">[...]</span>`
por el dato real antes de publicar.

## Agregar proyectos a la galería

1. Optimiza la foto (por ejemplo con ImageMagick):
   ```bash
   convert foto.jpg -resize "800x>" -strip -interlace JPEG -quality 78 assets/img/nombre-800.jpg
   convert foto.jpg -resize "1600x>" -strip -interlace JPEG -quality 78 assets/img/nombre-1600.jpg
   ```
2. En `index.html`, dentro de `<div class="gallery">`, copia un bloque `<figure class="project">` y cambia las imágenes, el título y `data-cat` (`construccion`, `paisajismo`, `diseno`, separadas por espacio).

## SEO: pasos después de publicar

1. Activa el certificado SSL (https) en el hosting y luego habilita la redirección en `.htaccess` (instrucciones dentro del archivo).
2. Registra el sitio en [Google Search Console](https://search.google.com/search-console) y envía `https://www.toralpyc.cl/sitemap.xml`.
3. Crea o reclama el **Perfil de Empresa en Google** (Google Maps) con el enlace a la web, el teléfono y la zona de atención.
4. Enlaza la web desde el perfil de Instagram @toraljardin.
5. Al cambiar CSS o JS, sube el número `?v=` en los enlaces de `styles.css` y `main.js` para que los navegadores descarguen la versión nueva.
