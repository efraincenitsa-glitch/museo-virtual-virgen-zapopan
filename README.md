# Museo Virtual Virgen de Zapopan

App web estática lista para publicar en GitHub Pages.

## Estructura principal

- `index.html`: entrada principal del museo.
- `assets/css/styles.css`: diseño elegante, responsivo y animaciones.
- `assets/js/app.js`: navegación, salas, galería, lightbox y movimiento.
- `data/gallery.js`: configuración de salas y nombres de imágenes.
- `assets/img/`: carpeta donde se colocan todas las pinturas.

## Dónde colocar las imágenes

Coloca las imágenes con estos nombres exactos:

```text
assets/img/principal/portada.jpg
assets/img/sala-1/portada.jpg
assets/img/sala-1/imagen-05.jpg ... imagen-12.jpg
assets/img/sala-2/portada.jpg
assets/img/sala-2/imagen-13.jpg ... imagen-26.jpg
assets/img/sala-3/portada.jpg
assets/img/sala-3/imagen-27.jpg ... imagen-67.jpg
assets/img/sala-4/portada.jpg
assets/img/sala-4/imagen-68.jpg ... imagen-94.jpg
```

> Si una imagen no existe, la app muestra una imagen de respaldo para que no se rompa el diseño.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos y carpetas de este proyecto.
3. En GitHub entra a `Settings` > `Pages`.
4. En `Source`, selecciona la rama `main` y la carpeta `/root`.
5. Guarda los cambios.
6. Abre el enlace de GitHub Pages que se genere.

## Para cambiar títulos o agregar textos

Edita `data/gallery.js`.

Ejemplo:

```js
{ numero: 5, titulo: "La geografía del occidente mexicano", archivo: "assets/img/sala-1/imagen-05.jpg" }
```

## Recomendaciones de imagen

- Usa formato JPG o WEBP para fotografías.
- Mantén nombres en minúsculas y sin acentos.
- Recomendado: 1200 px de ancho como mínimo.
- Comprime imágenes antes de subir para que cargue rápido en celular.
