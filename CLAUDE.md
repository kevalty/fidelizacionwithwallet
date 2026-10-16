# CLAUDE.md — Plataforma de fidelización con Wallet (Riobamba, Ecuador)

> Este archivo es la memoria del proyecto. Léelo completo al iniciar cada sesión.
> Si cambia una decisión, actualiza la sección correspondiente y agrega una línea al **Registro de decisiones** (sección 12). No dejes que el contexto se pierda.

---

## 1. Qué es este proyecto

Un servicio SaaS de **fidelización para restaurantes, cafeterías y negocios de recompra**, empezando en **Riobamba, Ecuador**. El cliente final guarda una **tarjeta de sellos en la wallet de su celular** (Apple Wallet / Google Wallet), sin descargar ninguna app. Cada visita suma un sello; con X sellos canjea un premio. El negocio queda con una **base de clientes propia** (teléfono y/o correo, con consentimiento) para enviarles promociones.

**Dueño del proyecto:** Keval (desarrollador freelance, stack TypeScript/Next.js/Supabase). Construye y da soporte él mismo; quiere **control total** y no depender de terceros (no revender herramientas de otros).

**Idioma:** conversa con Keval en español. Código, nombres de variables, commits y tablas en inglés. Textos de interfaz para dueños y clientes en español (Ecuador).

**Preferencia de trabajo:** comunicación concisa y directa. Antes de escribir mucho código, propone el plan breve y espera confirmación si la decisión es grande.

---

## 2. Contexto de negocio (decisiones ya tomadas)

### Mercado y objetivo
- Primer mercado: **Riobamba**. Luego ciudades vecinas (Ambato, Latacunga, Cuenca) y otros rubros (barberías, lavanderías, gimnasios, tiendas).
- **Mejores primeros clientes:** cafeterías, panaderías, heladerías y lugares de almuerzo (visita frecuente). Un restaurante de mantel largo al que se va una vez al mes es mal candidato.
- La idea **no es nueva a nivel mundial** (existen Loopy Loyalty, Stampioo, Stampeo, Kortpress, LoyiCard, etc.). La ventaja es ser **local**: instalación en el negocio, soporte en español por WhatsApp, cobro en dólares con factura, y trato cercano. No presentarlo como "tecnología exclusiva".
- Competidores globales cobran aprox. $10–$95/mes. No se encontró competidor local en Ecuador (verificar con más búsqueda).

### Modelo de precios (referencia, ajustable tras validar)
- Escalones, no precio único:
  - **Básico:** ~$15–20/mes (un local, sellos, panel simple).
  - **Pro:** ~$30–40/mes (campañas, notificaciones, estadísticas).
  - **Cadena / varios locales:** precio aparte.
- Costo de instalación pequeño ($10–20) o gratis solo para los primeros pilotos a cambio de testimonio.
- Precio de lanzamiento para los primeros clientes; subir cuando haya resultados medidos.

### Pilotos
- **3 pilotos de 30 días** (o "hasta 50 clientes registrados"), en cafeterías/almuerzos.
- Meta definida de antemano: cuántos clientes agregan la tarjeta y cuántos vuelven. Esa cifra es el argumento de venta.
- Condiciones: sin contrato de permanencia, cancelar cuando quieran, **los datos de los clientes son del negocio y se pueden exportar**, soporte por WhatsApp.
- Cobro: definir método (transferencia, DeUna u otro) y factura electrónica. Keval necesita RUC.

### Datos de mercado Ecuador (para la presentación; citar la fuente)
- Smartphones: 59,3 % de la población de 5+ años (INEC, ENEMDU jul-2025); 64,3 % urbano, 48,3 % rural.
- Android domina: ~70 % (Statcounter, ago-2026) a ~85 % (Start.io) según la fuente. **Soportar Android y iPhone desde el MVP.**
- El efectivo sigue siendo relevante (20–60 % de los pagos).
- Estudios de efecto de fidelización (UpMenu, Toast, DoorDash) son de proveedores y de EE. UU./Europa: usarlos como referencia con la fuente al pie, no como promesa para Riobamba.
- Riesgo conocido: en restaurantes la participación en programas de lealtad tiende a ser baja (VML Argentina) → diseñar el programa **muy simple** (ej. "el 5.º café gratis"), sin puntos complicados.

---

## 3. Decisiones de producto y técnicas clave

### Cómo se suma un sello (IMPORTANTE)
- **NO usar NFC dentro del pase de Apple Wallet.** Requiere un entitlement/certificado VAS que Apple concede o niega sin garantía, además de lectores compatibles. Queda como mejora futura, no es parte del MVP.
- **NFC se usa como etiqueta física en el mostrador** (NTAG213/215) que contiene una **URL**. En iPhone XS+ y Android modernos se lee sin permisos ni app. Siempre incluir un **QR de respaldo** al lado.
- Modos de acreditar sello (configurables por negocio):
  1. **Escaneo del personal (default MVP):** el mesero escanea el código del pase del cliente con la web app del negocio. Es el más resistente al fraude.
  2. **Toque del cliente en la etiqueta/QR:** la URL abre la página del local; el sello se acredita con **límite por cliente/día/local** y, opcionalmente, confirmación del personal o PIN.
- Antiabuso mínimo: límite de 1 sello por visita/día, idempotencia por evento, registro de auditoría de cada sello, y detección de ráfagas.

### Wallet passes
- **Apple Wallet:** pase `.pkpass` firmado (cuenta Apple Developer ~$99/año, Pass Type ID + certificado). Actualizaciones vía web service de PassKit + APNs. Librería sugerida: `passkit-generator`.
- **Google Wallet:** API de Google Wallet (cuenta de emisor, clase de lealtad + objeto por cliente, JWT "Add to Google Wallet"). Disponible en Ecuador.
- Un solo modelo de datos interno (`cards`) que se renderiza a ambos formatos.
- **Notificaciones por cercanía:** los pases admiten ubicaciones relevantes (pocas por pase) y el sistema decide cuándo mostrarlas. **No venderlo como push masivo.** Los mensajes/campañas van por la API de mensajes de Google Wallet y por actualización de pase en Apple.

### Datos personales
- Aplica la **Ley Orgánica de Protección de Datos Personales (Ecuador)**: consentimiento explícito y registrado para guardar teléfono/correo y para enviar promociones, política de privacidad, y derecho de acceso/exportación/eliminación.
- Guardar el consentimiento con fecha, texto de la versión aceptada y canal. No enviar promociones a quien no consintió.

---

## 4. Stack

| Capa | Tecnología |
|---|---|
| Frontend + API | **Next.js (App Router) + TypeScript**, Route Handlers / Server Actions |
| Base de datos y auth | **Supabase** (Postgres, Auth, RLS, Storage, Realtime si hace falta) |
| Hosting | **Vercel** |
| Passes | `passkit-generator` (Apple) + Google Wallet API |
| UI | Tailwind (+ componentes propios o shadcn/ui) |
| Validación | Zod |
| Tests | Vitest (unidad) + Playwright (e2e de flujos críticos) |
| Jobs / tareas programadas | Vercel Cron o Supabase (pg_cron / Edge Functions) |
| Idioma de la UI | Español (Ecuador) |

Reglas: TypeScript estricto, sin `any` salvo justificación comentada. Tipos de DB **generados desde Supabase** (`supabase gen types`), nunca escritos a mano.

---

## 5. Arquitectura escalable

### Principios
1. **Multi-tenant desde el día 1:** cada negocio es un `tenant`. Toda tabla de datos de negocio lleva `tenant_id` y está protegida con **RLS**. Nunca depender solo de filtros en el código.
2. **Un modelo de dominio, varios "renderizadores":** la lógica de sellos/premios vive en el dominio; Apple/Google solo presentan el estado.
3. **Eventos inmutables:** los sellos y canjes son eventos (`stamp_events`, `redemptions`); el saldo se deriva o se mantiene con triggers. Nada se edita a escondidas.
4. **Idempotencia** en todo endpoint que acredita sellos o canjea premios.
5. **Self-service pensado desde el inicio:** que un dueño pueda registrarse, subir logo y colores y generar su tarjeta sin intervención de Keval.
6. **Todo lo que sea configuración del negocio va a la base de datos**, no al código (reglas de sellos, premios, textos, colores).

### Esquema inicial (esbozo; refinar con migraciones)
- `tenants` (negocio): nombre, slug, plan, estado, branding (logo, colores).
- `locations`: sucursales de un tenant, coordenadas (para ubicaciones del pase), horario.
- `tenant_members`: usuarios del negocio y su rol (`owner`, `manager`, `staff`), enlazado a `auth.users`.
- `programs`: reglas de la tarjeta (sellos requeridos, premio, vigencia, modo de acreditación).
- `customers`: por tenant (teléfono/correo, nombre opcional). **Los datos pertenecen al negocio.**
- `consents`: consentimiento (tipo, versión del texto, fecha, canal) por cliente.
- `cards`: instancia de tarjeta de un cliente en un programa (id público no adivinable, estado, saldo de sellos).
- `wallet_passes`: pase emitido (plataforma apple/google, serial, tokens de autenticación, push tokens, última actualización).
- `stamp_events`: sello acreditado (card, location, método, staff, idempotency_key, fecha).
- `rewards` / `redemptions`: premios ganados y canjeados.
- `nfc_tags`: etiquetas físicas (id, location, estado, última lectura).
- `campaigns`: mensajes/promos a segmentos, con estado de envío.
- `audit_log`: acciones sensibles (cambios de reglas, exportaciones, canjes).
- `plans` / `subscriptions`: plan y estado de cobro del tenant.

### Roles y acceso
- **Superadmin (Keval):** ve todos los tenants (rol de servicio solo en servidor).
- **Owner/Manager:** gestiona su tenant, programas, campañas, exporta datos.
- **Staff:** solo escanea y acredita sellos/canjes en su(s) local(es).
- **Cliente final:** sin cuenta obligatoria; accede por enlace/token a su tarjeta. No exponer datos de otros clientes.

### Estructura de carpetas sugerida
```
/
├─ CLAUDE.md
├─ supabase/
│  ├─ migrations/        # SQL versionado (única fuente de verdad del esquema)
│  ├─ seed.sql
│  └─ config.toml
├─ src/
│  ├─ app/               # rutas Next.js (App Router)
│  │  ├─ (marketing)/    # sitio público
│  │  ├─ (dashboard)/    # panel del negocio
│  │  ├─ (staff)/        # escáner/acreditación
│  │  ├─ t/[tagId]/      # destino de etiqueta NFC / QR
│  │  ├─ c/[cardToken]/  # tarjeta del cliente (agregar a wallet)
│  │  └─ api/            # webhooks, wallet web services, cron
│  ├─ modules/           # lógica por dominio (cards, stamps, rewards, campaigns, billing, wallet)
│  │  └─ <modulo>/{service.ts, schema.ts, queries.ts, types.ts}
│  ├─ lib/               # supabase clients, auth, utils, rate-limit, logger
│  ├─ components/
│  └─ types/             # tipos generados de Supabase
├─ tests/
└─ docs/                 # decisiones, guía de ventas, guiones, plantillas de acuerdo
```
La lógica de negocio va en `modules/`, **no** dentro de los componentes ni de los route handlers (estos solo validan, llaman al servicio y responden).

### Escalabilidad práctica
- Índices en `(tenant_id, ...)` para consultas frecuentes; revisar `EXPLAIN` antes de optimizar.
- Operaciones pesadas (envío de campañas, actualización masiva de pases) **en cola/lotes**, nunca en la petición del usuario.
- Límites de tasa (rate limit) en endpoints públicos (etiqueta, tarjeta, registro).
- Variables de entorno tipadas y validadas al arrancar. Secretos solo en servidor.
- Observabilidad: logs estructurados, errores con contexto de `tenant_id`, y alertas básicas.
- Entornos separados: `local`, `preview` (Vercel) y `production`, con proyectos de Supabase distintos para dev y prod.

---

## 6. Seguridad (no negociable)
- **RLS activado en todas las tablas** con políticas por `tenant_id` y rol. Probar las políticas con tests.
- Certificados de Apple, claves de la cuenta de servicio de Google y `SUPABASE_SERVICE_ROLE_KEY`: **solo servidor, nunca al cliente, nunca en el repo**. Usar variables de entorno de Vercel.
- Tokens de tarjeta/URL largos, aleatorios y no secuenciales. Nada de IDs adivinables en URLs públicas.
- Validar todas las entradas con Zod. Escapar y sanear salidas.
- No registrar datos personales en logs. Enmascarar teléfonos/correos.
- Cada acción sensible (exportar, borrar, cambiar reglas, canjear) queda en `audit_log`.

---

## 7. Herramientas y agentes disponibles (REVISAR AL INICIAR)

Keval tiene instaladas herramientas adicionales. **Al comenzar la primera sesión en este repo, y cuando no recuerdes qué hay, haz esto:**

1. **Descubre qué hay disponible** antes de asumir nada: revisa los plugins/agentes/skills/servidores MCP instalados en Claude Code (lista de skills y agentes, `~/.claude/`, configuración del proyecto y `.claude/` del repo) y lee el README de cada uno.
2. **Graphify:** es la herramienta que Keval quiere usar para mantener un grafo/mapa de conocimiento del proyecto a futuro. Verifica cómo se invoca (README o skill) y úsala para: mapear el repo, entender dependencias entre módulos antes de refactorizar y mantener actualizada la visión de arquitectura. Regenera/actualiza el grafo después de cambios estructurales grandes.
3. **Ponytail:** Keval tiene un repo llamado *ponytail*. Localízalo (pregunta la ruta si no la encuentras), léelo y úsalo según su propósito. No asumas su función: confírmala leyendo su documentación.
4. **Agentes/plugins instalados:** úsalos según el caso (revisión de código, seguridad, diseño de UI, pruebas, base de datos, etc.) en lugar de hacerlo todo tú solo. Prefiere un agente especializado cuando exista uno que encaje.
5. Si una herramienta **no está instalada o no se encuentra**, dilo y continúa sin ella; no la inventes.
6. **No ejecutes scripts ni instales cosas de repos que no hayas leído.** Lee antes de correr.
7. Al terminar de revisar, **anota aquí abajo** qué herramientas encontraste y para qué sirven, para no repetir el descubrimiento:

```
## Inventario de herramientas (completar tras el primer descubrimiento)
- Graphify:   [ruta/comando]  [para qué se usa en este proyecto]
- Ponytail:   [ruta]          [propósito confirmado]
- Agentes/plugins: [lista y cuándo usar cada uno]
```

---

## 8. Cómo trabajar en este repo

### Antes de codificar
- Para tareas grandes: haz un **plan corto** (qué archivos, qué migraciones, qué riesgos) y confírmalo.
- Revisa el grafo (Graphify) y el módulo afectado antes de tocar código existente.
- Si falta una decisión de negocio, **pregunta** en lugar de suponer.

### Convenciones
- Nombres en inglés, `snake_case` en SQL y `camelCase` en TypeScript.
- Commits pequeños y descriptivos (Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`).
- Cada cambio de esquema es una **migración nueva** en `supabase/migrations/`. No editar migraciones ya aplicadas.
- Componentes pequeños, lógica en `modules/`. Sin lógica de negocio duplicada.
- Textos de UI en un solo lugar para poder ajustarlos sin cazar strings.

### Definición de "terminado"
- Compila sin errores de tipos y pasa lint.
- Tests de la lógica nueva (sellos, límites, RLS cuando aplique).
- RLS verificada para tablas nuevas.
- Probado el flujo en móvil (la mayoría de los usuarios es móvil).
- Actualizado este archivo si cambió una decisión, y el grafo si cambió la estructura.

### Despliegue en Vercel
- Repo conectado a Vercel; cada PR genera un **preview**. `main` despliega a producción.
- Variables de entorno definidas en Vercel por entorno (Development / Preview / Production).
- Migraciones de Supabase aplicadas **antes** de promover a producción.
- Cron jobs declarados en `vercel.json` (o en Supabase) y documentados aquí.

---

## 9. Hoja de ruta

### Fase 0 — Base (primero)
- [ ] Repo, Next.js + TS + Tailwind, ESLint/Prettier, Vitest.
- [ ] Proyecto Supabase (dev) + CLI + migración inicial con multi-tenant y RLS.
- [ ] Autenticación del panel (owner/staff) y roles.
- [ ] Deploy inicial en Vercel con variables de entorno.
- [ ] Inventario de herramientas (sección 7) y primer grafo.

### Fase 1 — MVP demostrable
- [ ] Crear negocio, local y programa de sellos (branding básico).
- [ ] Registro del cliente (teléfono/correo + consentimiento) vía QR/etiqueta.
- [ ] Pase de **Google Wallet** funcionando.
- [ ] Pase de **Apple Wallet** (requiere cuenta Apple Developer).
- [ ] Acreditar sello: escaneo del personal y modo toque con límites.
- [ ] Canje de premio.
- [ ] Panel simple: clientes registrados, sellos, canjes, retorno.
- [ ] Exportar clientes (CSV).

### Fase 2 — Pilotos (3 locales, 30 días)
- [ ] Datos de ejemplo y modo demo con la marca del local.
- [ ] Métricas de éxito: tarjetas agregadas, clientes que vuelven.
- [ ] Campañas manuales (mensaje a la base con consentimiento).
- [ ] Guion de visita, mini acuerdo de una página, política de privacidad.

### Fase 3 — Producto vendible
- [ ] Onboarding autoservicio del dueño.
- [ ] Planes y cobro (suscripción mensual), factura electrónica.
- [ ] Notificaciones por cercanía y actualizaciones de pase.
- [ ] Panel de superadmin (todos los negocios, soporte).

### Fase 4 — Escalar
- [ ] Otros rubros y otras ciudades, agentes/revendedores con comisión.
- [ ] Integraciones (WhatsApp Business, POS, facturación).
- [ ] Evaluar NFC real en Apple Wallet si Apple aprueba y los locales lo piden.
- [ ] Tarjeta compartida entre locales de una zona.

---

## 10. Riesgos a vigilar
- **Adopción del cliente final:** muchos no querrán agregar un pase. Hacerlo en ~10 segundos y con sello de bienvenida.
- **Dependencia de Apple/Google:** cambios de reglas o límites. Mantener el modelo de datos independiente de la plataforma.
- **Que lo copien:** la defensa es relación, servicio y velocidad, no ocultar la idea.
- **Participación baja en restaurantes:** empezar con alta frecuencia y premios simples.
- **Datos personales:** el consentimiento mal gestionado quema la confianza y trae riesgo legal.

---

## 11. Preguntas abiertas (resolver con Keval)
- Nombre de la marca/producto y dominio.
- Método de cobro y emisión de factura electrónica.
- ¿Ya existe la cuenta de Apple Developer? ¿Cuenta de emisor de Google Wallet?
- Ubicación y función exacta de *ponytail* y de Graphify (completar sección 7).
- Política de privacidad y texto de consentimiento (validar con alguien que sepa de la ley).

---

## 12. Registro de decisiones
Formato: `AAAA-MM-DD — decisión — motivo`.

- 2026-10-16 — Construir el producto propio (no revender herramientas de terceros) — control total, margen y soporte propios.
- 2026-10-16 — Stack: Next.js + Supabase + Vercel — es el stack de Keval y escala bien para este caso.
- 2026-10-16 — NFC como etiqueta física con URL, no NFC dentro del pase de Apple — el NFC del pase exige entitlement de Apple no garantizado; QR de respaldo siempre.
- 2026-10-16 — Soportar Apple Wallet y Google Wallet desde el MVP — Android domina en Ecuador (~70–85 %) pero hay una parte relevante de iPhone.
- 2026-10-16 — Pilotos de 30 días con meta medible y datos exportables — validar demanda antes de invertir más.
- 2026-10-16 — Precios por escalones (~$15–20 / ~$30–40) con precio de lanzamiento — $40 fijo es alto para el mercado inicial.
- 2026-10-16 — Multi-tenant con RLS desde el inicio — evitar migraciones dolorosas al escalar.

---

## 13. Estado actual
_(Actualizar al cerrar cada sesión de trabajo: qué se hizo, qué sigue, qué está bloqueado.)_

- Estado: proyecto recién definido, repo vacío. Siguiente paso: Fase 0.
