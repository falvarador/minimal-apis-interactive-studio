# Design

## Context

Ver `proposal.md` para la motivación. La carpeta no tiene Git. La aplicación ejecutable es todavía el starter de Vite, con Preact `^11.0.2`, TypeScript `~7.0.2`, Vite `^8.3.5` y `@preact/preset-vite`. `src/main.tsx` monta `App` sobre `#app`. El build existente ejecuta `tsc -b && vite build`; no hay runner ni pruebas de aplicación.

La referencia raíz `asp_net_core_10_minimal_apis_interactive_studio.tsx` coincide byte a byte con el adjunto. SHA-256: `9f805c97bacc09abcb56bc0b1dede2727d1f86ae8999a58264773f199ddf1d8d`. Contiene los siete módulos, `CodeWindow` y `App`, importa React y `lucide-react`, usa clases con sintaxis Tailwind y solo tiene un estilo inline para el ancho del progreso. No contiene un backend ni una hoja CSS propia para esas utilidades. El `include` actual de TypeScript se limita a `src`, por lo que la referencia no entra al build.

La inspección de la referencia con TypeScript muestra dependencias React/Lucide ausentes y tipos implícitos/incompatibles para props y eventos. Son entradas a resolver durante la migración, no motivo para añadir React o relajar el tipado. Los estilos globales del starter imponen centrado, ancho fijo y cambios según el tema del sistema que no pertenecen al estudio.

No hay especificaciones existentes. Las nuevas capacidades separan la paridad educativa, la vida útil del estado y la presentación responsive.

## Goals / Non-Goals

**Goals:**
- Convertir el archivo exacto en la aplicación ejecutable con cambios estructurales trazables, sin resumir el contenido.
- Usar Signals sin hooks, conservando aislamiento y vida útil por montaje.
- Dar a cada superficie estilos semánticos aislados sin recrear un framework de utilidades.
- Comprobar ramas de comportamiento reales, no solamente que la portada se renderiza.

**Non-Goals:**
- Rediseñar, cambiar textos educativos o adoptar el estilo del starter.
- Introducir enrutador, gestión global externa, persistencia, SSR, lazy loading o abstracciones generales de estado.
- Ejecutar C#, SQLite, JWT o Scalar reales; cambiar reglas del simulador para alinearlas con el código educativo.
- Garantizar soporte para navegadores antiguos. Se asumen versiones evergreen actuales con soporte para CSS nesting, custom properties, Grid y unidades modernas.

## Decisions

### 1. Migración nativa sobre el scaffold existente

Conservar Vite, TypeScript, el preset de Preact y el punto de montaje. Usar imports de `preact`, `@preact/signals` y `lucide-preact`, sin código de aplicación que importe React, `react-dom`, `preact/compat`, `preact/hooks` ni hooks de Signals.

La consulta de metadatos de npm durante la propuesta confirma que `@preact/signals` 2.11.4 y `lucide-preact` 1.62.0 declaran compatibilidad con Preact 11. Seleccionar versiones compatibles al aplicar, actualizar el lockfile y no usar instalaciones forzadas. Los alias de compatibilidad que existen en `tsconfig.app.json` pueden retirarse si quedan innecesarios; no se necesita modificar las opciones del preset únicamente por limpieza.

Alternativa descartada: ejecutar la referencia con `preact/compat` y `lucide-react`. Ocultaría la migración y conservaría hooks/dependencias que el usuario pidió sustituir.

### 2. Signals como campos de instancia, sin hooks de conveniencia

Los componentes con estado extienden `Component` de Preact únicamente para disponer de una instancia estable y limpieza por desmontaje. Sus campos se inicializan con `signal` y los valores reutilizados derivados con `computed`. No usan `this.state`, `setState`, `useSignal`, `useComputed`, `useSignals` ni otros hooks.

Las funciones sin estado siguen siendo componentes funcionales. Leer `.value` dentro del render para suscribirse a Signals; las actualizaciones de varios campos de una acción usan `batch` cuando deban ser coherentes. No crear Signals dentro del cuerpo de una función de render ni usar singletons mutables de módulo. Pasar explícitamente el estado compartido o las acciones del curso al laboratorio CRUD; no introducir Context ni un bus de eventos.

| Propietario | Estado de la referencia que debe conservar |
|---|---|
| App | Módulo activo, IDs explorados iniciados con `intro`, platos clonados desde la semilla |
| CodeWindow, por instancia | Feedback de copia y temporizador de 1800 ms |
| Módulo 1 | Arquitectura, controllers, OpenAPI, autenticación, paso y ejecución del pipeline, URL |
| Módulo 2 | Parámetro de prueba, restricción GUID, modo DTO |
| Módulo 3 | Tipo de retorno, entorno, status-code pages, escenario 404/500 |
| Módulo 4 | Tipo de petición, filtro, nombre POST, nombre PUT, GUID objetivo, última respuesta |
| Módulo 5 | Etapa de estructura y modo de logging |
| Módulo 6 | Token presente, audiencia, rol, país y endpoint |
| Módulo 7 | Metadata, transformer y endpoint Scalar |

Conservar los valores iniciales del archivo. Renderizar únicamente el módulo activo, desmontándolo al cambiar de módulo: por eso las opciones locales se reinician al volver, pero los platos y el progreso no. Inicializar una nueva copia profunda de la semilla por aplicación y por reset evita modificar accidentalmente sus ingredientes.

Alternativas descartadas: Signals globales para todos los laboratorios cambiarían el reinicio por navegación y mezclarían cursos simultáneos; Signals creadas en cada render perderían estado; `useSignal` simplificaría funciones pero sigue siendo un hook.

### 3. Temporizadores dirigidos por acciones y limpieza explícita

El pipeline puede gestionarse desde la acción de envío sin `effect`: poner paso uno y ejecución activa, crear un único intervalo de 850 ms y cancelarlo al completar o desmontar. Replicar la referencia: paso cinco aparece después de cuatro ticks y el estado de ejecución se desactiva en el quinto tick. Cambiar la URL pone el paso a cero sin cancelar la ejecución existente. No cambiar esa secuencia por una interpretación distinta del simulador.

`CodeWindow` conserva un único timeout, reemplazado tras cada copia exitosa. Preferir `navigator.clipboard.writeText` cuando esté disponible; si se mantiene el fallback `execCommand`, comprobar su resultado y limpiar siempre el textarea temporal. Mostrar un error accesible y permitir selección manual ante fallo, sin marcar éxito. Usar una marca de montaje o generación de operación para ignorar promesas resueltas después del desmontaje y evitar carreras entre copias.

No se requieren efectos reactivos para cálculos puros ni para estos temporizadores. Cualquier suscripción imperativa que resulte necesaria durante la implementación debe tener un disposer propiedad de la instancia.

Alternativa descartada: trasladar `useEffect` a un `effect` global sin dueño, porque puede seguir funcionando tras abandonar un módulo.

### 4. División por límites que ya existen en el archivo

Estructura propuesta, sin capas adicionales:

```text
src/
  app.tsx
  app.module.css
  index.css
  data/course.ts
  types.ts
  components/CodeWindow.tsx
  components/CodeWindow.module.css
  modules/Module1Intro.tsx ... Module7OpenApi.tsx
  modules/labs.module.css
```

`course.ts` contiene la semilla y metadata estáticas; las instancias mantienen las colecciones mutables. `types.ts` define `Dish`, `Ingredient`, IDs/modos como uniones y el contrato de respuesta con cuerpos JSON tipados. Evitar `any` y casts de eventos; usar `event.currentTarget` y tipos de eventos de Preact, con `onInput` para texto cuando se necesite actualización inmediata y `onChange` para selección/checkbox.

Un archivo `labs.module.css` compartido inicialmente permite reutilizar paneles, pestañas, rejillas y estados entre los siete módulos sin crear un sistema genérico de componentes. Separarlo por módulo solamente si aparece una necesidad clara de aislamiento o legibilidad. Mantener todos los ejemplos y sus variantes en el módulo correspondiente.

Alternativa descartada: migrar el monolito de más de dos mil líneas sin separar límites, o fragmentarlo en decenas de microcomponentes sin responsabilidad propia.

### 5. CSS Modules semánticos y Vanilla CSS moderno

Sustituir `src/app.css` por `app.module.css`; importar todos los estilos de aplicación como objetos de CSS Modules. `index.css` se limita al reset/base, familias tipográficas y tokens de color, espacio, radio y sombra. Eliminar las reglas visuales del starter que afectan `#app`, encabezados y código.

Mapear las clases existentes a clases semánticas y modificadores explícitos o atributos `data-*`: panel, tab, active, selected, status, verb y module accent. Cambiar los valores de color actualmente almacenados como cadenas Tailwind en la metadata por claves de acento finitas. No convertir cadenas arbitrarias de utilidad a CSS en tiempo de ejecución.

Usar:
- Custom properties para la paleta slate, acentos, tamaños y el valor dinámico de progreso; la declaración real del ancho vive en el módulo CSS.
- Nesting nativo para pseudoestados y variantes, propiedades lógicas y Grid/Flex para la composición.
- `minmax(0, 1fr)`, `min-inline-size: 0`, `min-block-size: 100svh` y límites fluidos para evitar overflow sin cambiar jerarquía.
- Media queries equivalentes a 640, 768 y 1024 px; máximo de contenido 1280 px, layout de doce columnas y reparto 3/9 desde 1024 px.
- `:focus-visible` y `prefers-reduced-motion` para interacción accesible sin alterar resultados del simulador.
- `overflow-x: auto` solo en código, payloads y tablas; wrapping de controles/URLs/GUIDs para que no desborde la página.

Conservar el aspecto oscuro incluso con preferencia de sistema clara. No añadir Sass, Tailwind, PostCSS de utilidades, CSS-in-JS ni librerías de componentes. El CSS nesting es nativo, no sintaxis Sass.

Alternativas descartadas: una hoja global con cientos de clases utilitarias duplicaría el problema sin aislamiento; un rediseño con nuevos colores/estructura contradiría la referencia exacta.

### 6. Paridad de simulaciones antes que correcciones de dominio

Copiar las ramas actuales y sus formas de respuesta antes de extraer helpers. Los laboratorios muestran resultados locales, nunca llaman a las URLs incluidas en snippets. Conservar generación de ID y prefijo Location de la referencia sin añadir requisitos de backend.

Discrepancias observadas que se preservan:
- POST rechaza `trim().length < 2`, pero no limita a 200 aunque su mensaje y el ejemplo C# lo mencionan.
- PUT permite nombre vacío y no recorta el valor.
- Seleccionar autenticación en el wizard cambia el control, no el código generado.
- Cambiar URL durante tracing reinicia el paso pero no detiene el intervalo.
- `completedModules` representa módulos visitados, no ejercicios aprobados.

La limpieza de temporizadores, la comprobación de fallo de copia y el foco accesible son ajustes acotados de fiabilidad, no modificaciones de las lecciones.

### 7. Validación centrada en los contratos

Añadir Vitest, un entorno DOM y Testing Library para Preact como soporte mínimo a pruebas de interacciones y temporizadores falsos. Complementar con pruebas de navegador Playwright para responsive, navegación y capturas. Reutilizar configuración Vite sin cambiar el comando de build existente; incorporar scripts explícitos de pruebas.

Cobertura planificada:
- Render del curso y siete módulos, títulos/rangos y presencia de todas las secciones y variantes de código; comparación de los textos de snippets con la referencia.
- Navegación superior/inferior, límites, unicidad de progreso, reinicio local al volver y persistencia de platos durante navegación.
- Todos los modos de cada módulo, productos cartesianos relevantes de errores y política JWT.
- CRUD completo con status/headers/body exactos, filtro vacío y por mayúsculas, entradas POST inválidas y largas, PUT vacío, IDs ausentes, colección vacía y reset.
- Dos cursos simultáneos, no recreación del estado al renderizar, independencia de ventanas de código, timers de 850/1800 ms, desmontaje y resolución tardía de copia.
- Chromium a 375, 768 y 1440 px, y comprobaciones alrededor de 640/768/1024 px para transiciones. Aserción de `scrollWidth <= clientWidth` del documento y scroll local de código/tablas.
- Nombres de controles, foco visible, estados deshabilitados y reducción de movimiento. Sin errores de consola ni peticiones a endpoints simulados.
- Build de producción y comprobación estática de imports/uso prohibido de hooks, dependencias React y clases Tailwind en el código migrado; el archivo de referencia queda explícitamente excluido de estas comprobaciones.

No hay capturas originales ni una referencia ejecutable con sus utilidades CSS configuradas. No se debe afirmar igualdad pixel-perfect contra una captura inexistente. Comparar estructura, paleta, tamaños, breakpoints y estados con el TSX original; guardar capturas del resultado como evidencia revisable y como baseline futuro. No añadir Tailwind para crear un baseline.

## Risks / Trade-offs

- [Pérdida de contenido al dividir el monolito] -> Mantener un inventario por sección y variante, copiar snippets sin reescribirlos y probar los siete módulos.
- [Ciclos de vida distintos al sustituir hooks] -> Propiedad de instancia, render condicional, pruebas de remontaje y dos cursos independientes.
- [Trabajo tardío sobre componentes desmontados] -> Cancelación de timers y guardas para promesas de clipboard; pruebas con timers falsos.
- [Deriva visual al traducir utilidades] -> Tokens equivalentes, mapeo completo de estados y revisión acotada desktop/móvil; no usar el tema del starter como referencia.
- [API de iconos o typings incompatibles] -> Imports nativos equivalentes y versiones con peer dependency compatible; resolver mediante tipado, sin `--force` ni React de respaldo.
- [Confundir las discrepancias del simulador con errores de migración] -> Tests de caracterización para las excepciones documentadas, sin correcciones educativas encubiertas.
- [Carpeta sin historial Git] -> Conservar el TSX original y guardar copias de los archivos afectados fuera de `src` antes de aplicar; no depender de rollback por commits.

## Migration Plan

Aplicar en el scaffold actual: respaldar los archivos afectados en el área de artefactos de la sesión, añadir dependencias y tipos, migrar la carcasa/estado compartido, trasladar los siete laboratorios y sus estilos, y sustituir el starter. Actualizar el título del documento y su icono si se retira el asset del starter, manteniendo `lang="en"` por el idioma del curso.

Antes de dar la aplicación por terminada, ejecutar las pruebas enfocadas, build de producción y revisión responsive. Documentar comandos y restricciones del simulador en un README directamente relacionado. No borrar assets del starter salvo que se haya comprobado que están sin referencias.

Si hay que revertir, restaurar solamente los archivos afectados desde las copias previas y retirar solamente los archivos nuevos de esta migración; mantener intactos el TSX de referencia y cualquier cambio ajeno. Esta propuesta no realiza todavía ninguno de esos cambios.
