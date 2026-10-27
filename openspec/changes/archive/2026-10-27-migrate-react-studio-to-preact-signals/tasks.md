# Tasks

## 1. Preparación y base nativa

- [x] 1.1 Guardar copias de los archivos que se modificarán en el área de artefactos de la sesión, sin tocar el TSX de referencia; verificar su hash contra el registrado en `design.md` y que las copias permiten restauración selectiva.
- [x] 1.2 Añadir versiones compatibles de `@preact/signals` y `lucide-preact`, actualizar el lockfile y conservar Preact/Vite; verificar instalación sin flags forzados y `npm ls preact @preact/signals lucide-preact` sin conflictos.
- [x] 1.3 Configurar Vitest con entorno DOM, Testing Library para Preact y Playwright, incluyendo scripts de ejecución y exclusión mutua de sus suites; verificar un smoke test Preact y que el proyecto sigue superando `npm run build`.
- [x] 1.4 Crear `src/types.ts` y `src/data/course.ts` con modelos tipados, semilla exacta, claves de módulos/acento y clonación independiente; verificar mediante pruebas los IDs, tres platos, ingredientes, siete entradas y aislamiento de clones.
- [x] 1.5 Crear un README acotado con comandos reales de desarrollo, build y pruebas y procedencia de la referencia; verificar que cada comando corresponde a un script existente.

## 2. Estado compartido, carcasa y navegación

- [x] 2.1 Sustituir `src/app.tsx` por la carcasa del estudio, con Signals propiedad de la instancia, progreso derivado y selección de módulo sin hooks ni `setState`; verificar tests de estado inicial y dos aplicaciones independientes.
- [x] 2.2 Trasladar header, siete entradas de navegación, títulos/rangos y ambas paginaciones, con render condicional del módulo activo; verificar selección directa, navegación superior/inferior, límites deshabilitados y conteo de visitas sin duplicados.
- [x] 2.3 Crear `app.module.css` y la base de tokens/reset en `index.css`, eliminando la dependencia de `app.css` y los estilos visuales del starter; verificar por render y estilos computados el tema oscuro, header sticky, máximo de 1280 px y layout 3/9 desde 1024 px.
- [x] 2.4 Actualizar título del documento y referencias al icono del starter cuando corresponda, manteniendo el montaje sobre `#app` y `lang="en"`; verificar el arranque real sin pantalla inicial, iconos rotos ni imports de assets retirados.
- [x] 2.5 Añadir al README la vida útil del estado y ausencia de persistencia; verificar con tests que navegación conserva progreso/platos, desmontaje de módulo reinicia controles y un montaje nuevo restaura defaults.

## 3. Ventanas de código y primitivas visuales

- [x] 3.1 Migrar `CodeWindow` con props tipadas, numeración, badges, resaltados y `CodeWindow.module.css`; verificar texto recortado y líneas resaltadas con ejemplos representativos y arrays vacíos.
- [x] 3.2 Implementar copia con resultado comprobado, feedback de 1800 ms y error accesible; verificar éxito, fallo, clipboard ausente, copia repetida, dos ventanas independientes y resolución de promesa tras desmontaje con mocks y timers falsos.
- [x] 3.3 Crear `modules/labs.module.css` para paneles, pestañas, rejillas, verbos y estados semánticos, usando Vanilla CSS con nesting, tokens y propiedades lógicas; verificar variantes activas/inactivas, warning/error/success y ausencia de dependencia de utilidades globales.

## 4. Foundations y Routing

- [x] 4.1 Migrar completo `Module1Intro`, incluidos comparador MVC/Minimal, wizard y todos sus ejemplos; verificar defaults, ambas arquitecturas, combinaciones controllers/OpenAPI y que autenticación solo cambia su control como en la referencia.
- [x] 4.2 Implementar pipeline con Signals y un intervalo de 850 ms, sin efectos/hooks, con limpieza al completar/desmontar; verificar ambos URLs, pasos uno a cinco, quinto tick de finalización, botón bloqueado, cambio de URL durante ejecución y remontaje sin timers residuales.
- [x] 4.3 Migrar completo `Module2Routing`, incluidos lifetimes DI, restricciones, ciclos/DTO y seis reglas de binding; verificar ambas entradas de prueba, restricción activada/desactivada, cada salida y ambos ejemplos de mapeo sin omitir texto.

## 5. Responses y Architecture

- [x] 5.1 Migrar completo `Module3Responses` con los tres modos de retorno y el inspector de errores; verificar snippets/resaltados y todas las combinaciones de entorno, escenario 404/500 y status-code pages, incluyendo headers y forma del JSON.
- [x] 5.2 Migrar completo `Module5Architecture`, con validación, tres etapas de estructura y dos modos de logging; verificar selección inicial, cada etapa y cada variante de código/explanación frente a la referencia.
- [x] 5.3 Añadir pruebas de desmontaje/remontaje de los módulos 2, 3 y 5 y de actualización derivada; verificar que controles locales vuelven a sus defaults sin modificar platos ni progreso.

## 6. Laboratorio CRUD

- [x] 6.1 Migrar `Module4CrudLab` completo, con selector de seis peticiones, inputs, tabla local, inspector y sección MapGroup; verificar estado inicial y todos los controles, rutas y explicaciones del original.
- [x] 6.2 Implementar lecturas y filtrado sobre la colección compartida; verificar con tests status/headers/body exactos para GET all, filtro vacío, búsqueda por substring sin distinguir mayúsculas y GET por ID existente/ausente.
- [x] 6.3 Implementar POST, PUT y DELETE con las ramas originales; verificar creación con nombre recortado, ID objetivo y Location, rechazos de POST de longitud menor que dos, aceptación de longitud mayor que 200, PUT vacío/sin recortar y 404/204 según existencia.
- [x] 6.4 Implementar re-seed y todos los estados de colección/respuesta vacíos; verificar borrado de todos los platos, GET vacío, reset con ingredientes exactos y respuesta limpia, navegación de ida/vuelta y aislamiento entre aplicaciones.
- [x] 6.5 Documentar en el README que SQLite/HTTP son simulados y las diferencias de validación POST/PUT se conservan; verificar que la documentación coincide con las pruebas de caracterización y no promete backend real.

## 7. Security y OpenAPI

- [x] 7.1 Migrar completo `Module6Security`, incluidos controles, comando CLI, payload y evaluación; verificar con pruebas parametrizadas anonymous 200, protected 401 por token/audiencia, GET autenticado 200, POST 403 por cada claim incorrecto y POST 201 con política satisfecha.
- [x] 7.2 Migrar completo `Module7OpenApi`, incluidos preview Scalar y matriz final; verificar GET/GET_ID/POST, ambos toggles y sus combinaciones para título, descripción, autenticación, tags, summaries, schemas y respuestas 201/400/200/404.
- [x] 7.3 Añadir pruebas de remontaje y documentación de alcance simulado para JWT/OpenAPI; verificar defaults restaurados y ausencia de generación/validación de credenciales o peticiones a las URLs mostradas.

## 8. Responsive, accesibilidad e integración

- [x] 8.1 Completar estilos responsive de los siete módulos con breakpoints 640/768/1024 px, wrapping de controles/URLs/GUIDs y scroll local de código/tablas; verificar en Playwright a 375, 768 y 1440 px y alrededor de cada breakpoint que `documentElement.scrollWidth <= documentElement.clientWidth`.
- [x] 8.2 Completar nombres accesibles, asociaciones de labels, selección programática, foco visible y reduced motion; verificar navegación por teclado, acciones deshabilitadas y que reducir animación no altera resultados ni tiempos del simulador.
- [x] 8.3 Ejecutar la suite integrada de navegación por los siete módulos y comparación de secciones/snippets con la referencia; verificar persistencia/reinicio correcto, todos los escenarios de las tres especificaciones y ausencia de errores de consola o tráfico hacia endpoints simulados.
- [x] 8.4 Ejecutar build de producción y comprobaciones estáticas del código migrado; verificar ausencia de imports React/compat/hooks, `setState`, `any` evitables, CSS-in-JS y clases utilitarias sin migrar, excluyendo intencionalmente el TSX de referencia.
- [x] 8.5 Realizar una revisión visual conjunta desktop/móvil y una ronda de corrección si es necesaria; guardar capturas del resultado y verificar paleta, jerarquía, estados y layout contra el TSX, sin afirmar comparación pixel-perfect con un baseline inexistente.
- [x] 8.6 Comprobar la integridad final de la migración: hash original sin cambios, lockfile coherente, comandos README ejecutables y ningún archivo temporal en el proyecto; retirar únicamente assets del starter confirmados sin uso y verificar de nuevo el build si se retiran.
