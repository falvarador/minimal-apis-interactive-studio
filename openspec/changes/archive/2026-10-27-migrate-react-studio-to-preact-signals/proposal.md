# Proposal

## Why

La aplicación de referencia está escrita en React, usa hooks y depende de clases utilitarias que el proyecto actual no procesa. El proyecto ya dispone de Preact, TypeScript y Vite, pero todavía muestra su pantalla inicial; se necesita migrar el estudio completo sin perder contenido, interacciones ni identidad visual.

## What Changes

- Sustituir la pantalla inicial por la aplicación del archivo exacto `asp_net_core_10_minimal_apis_interactive_studio.tsx`, conservando los siete módulos, ejemplos de código, textos en inglés, datos iniciales, navegación y simulaciones.
- Reemplazar `useState` y `useEffect` por estado de instancia con `@preact/signals`, valores derivados y gestión explícita de temporizadores, sin hooks de React, Preact ni Signals.
- Mantener la vida útil original del estado: progreso y platos compartidos durante la sesión de la aplicación; controles de cada laboratorio reiniciados al abandonar y volver al módulo.
- Reemplazar las clases utilitarias por CSS Modules semánticos escritos en Vanilla CSS. Usar propiedades personalizadas, nesting nativo, Grid/Flex, propiedades lógicas y dimensionamiento moderno para reproducir los estilos y breakpoints existentes.
- Conservar la iconografía mediante una integración nativa de Preact y tipar componentes, eventos, respuestas y modelos de datos.
- Incorporar comprobaciones de paridad funcional, aislamiento de estado, limpieza de temporizadores y comportamiento responsive.

## Capabilities

### New Capabilities

- `interactive-course`: Estudio educativo completo con siete módulos, navegación, progreso, ventanas de código y simuladores locales fieles a la referencia.
- `signals-state-lifecycle`: Estado reactivo sin hooks, con propiedad por instancia, valores derivados y liberación de recursos al desmontar.
- `modular-native-styles`: Presentación equivalente a la referencia mediante CSS Modules y CSS nativo moderno, sin framework de utilidades ni CSS-in-JS.

### Modified Capabilities

Ninguna. `openspec list --specs` no contiene capacidades existentes.

## Impact

- Afecta a `src/app.tsx`, `src/app.css`, `src/index.css`, componentes y módulos extraídos bajo `src/`, y a los metadatos de `index.html`. Se conserva el montaje Preact de `src/main.tsx` y el preset de Vite.
- Añade `@preact/signals` y una solución de iconos nativa de Preact, preferentemente `lucide-preact` con versiones compatibles con Preact 11; actualiza `package.json` y `package-lock.json`. Añade únicamente las dependencias de pruebas necesarias.
- La referencia raíz se conserva intacta y fuera del código compilado. Su copia local coincide byte a byte con el adjunto del usuario.
- No añade backend ASP.NET, SQLite real, peticiones HTTP, autenticación real, almacenamiento persistente, traducción ni rediseño. Los ejemplos C# y los laboratorios siguen siendo material educativo simulado en el navegador.
- La migración preserva las decisiones observadas del simulador, incluso cuando sus validaciones no implementan todas las reglas descritas por los ejemplos C#. Corregir esas diferencias queda fuera de este cambio.
