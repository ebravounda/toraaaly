# TORAL — Paisajismo & Construcción

Sitio web de [www.toralpyc.cl](https://www.toralpyc.cl). Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación): se sube tal cual a cualquier hosting.

## Estructura

```
index.html            Página principal (todas las secciones)
assets/css/styles.css Estilos
assets/js/main.js     Menú, pestañas, filtro de proyectos, lightbox y formulario
assets/img/           Fotografías (versiones 800 px y 1600 px)
assets/video/         Video de renders 3D (fondo del inicio y sección 3D)
robots.txt, sitemap.xml
```

## Antes de publicar

1. **Número de WhatsApp**: en `assets/js/main.js`, cambia `WHATSAPP_NUMBER` (formato `569XXXXXXXX`, sin `+` ni espacios). Lo usan el botón flotante, los botones "Contactar por WhatsApp" y el formulario de cotización.
2. Sube todo el contenido de la carpeta a la raíz del dominio `toralpyc.cl`.

## Agregar proyectos a la galería

1. Optimiza la foto (por ejemplo con ImageMagick):
   ```bash
   convert foto.jpg -resize "800x>" -strip -interlace JPEG -quality 78 assets/img/nombre-800.jpg
   convert foto.jpg -resize "1600x>" -strip -interlace JPEG -quality 78 assets/img/nombre-1600.jpg
   ```
2. En `index.html`, dentro de `<div class="gallery">`, copia un bloque `<figure class="project">` y cambia las imágenes, el título y `data-cat` (`construccion`, `paisajismo`, `diseno`, separadas por espacio).
