# RealtyHub: presentación de sustentación

Diapositivas web en React + Vite. Se navega con las flechas del teclado, los botones o los puntos laterales; el hash de la URL (`#6`) abre una diapositiva concreta.

## Ejecutar
```
npm install
npm run dev
```

## Publicar en Vercel
Importa el repositorio en Vercel (framework Vite, `npm run build`, salida `dist`). Para el subdominio, agrega el dominio en Vercel y crea el registro CNAME que indique en Cloudflare.

## Capturas de evidencia
Guarda las imágenes en `public/evidencia/` con estos nombres exactos y aparecen solas en su diapositiva:
- `actions-exitoso.png`: pestaña Actions con las etapas aprobadas
- `actions-fallo.png`: pipeline detenido por una prueba fallida
- `reporte-jacoco.png`: resumen de cobertura del pipeline
- `grafana-dashboard.png`: dashboard con tráfico real
- `prometheus-targets.png`: targets en estado UP

Mientras falte una imagen se ve un recuadro punteado que indica el nombre del archivo.

## Contenido
Los textos están en `src/App.jsx` y los datos de servicios, bases y pruebas en `src/data.js`.
