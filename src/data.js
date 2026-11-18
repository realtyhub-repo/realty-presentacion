export const servicios = [
  { n: "API Gateway", p: 8080, d: "Entrada única: valida el JWT, aplica CORS y enruta a cada servicio.", db: "Sin base de datos", i: "network" },
  { n: "Auth", p: 8081, d: "Registro, login con Google o correo, JWT asimétrico y refresh con rotación.", db: "PostgreSQL", i: "key" },
  { n: "User", p: 8082, d: "Usuarios, oficinas, agentes y la jerarquía de la franquicia.", db: "PostgreSQL", i: "users" },
  { n: "Propiedades", p: 8083, d: "Catálogo, imágenes en Cloudflare R2 y estado comercial.", db: "PostgreSQL + Redis", i: "home" },
  { n: "Leads", p: 8084, d: "Botón Me interesa, asignación del agente por puntaje y pipeline.", db: "PostgreSQL", i: "target" },
  { n: "Visitas", p: 8085, d: "Agenda de visitas sin choques de agente, propiedad ni cliente.", db: "PostgreSQL", i: "calendar" },
  { n: "Contratos", p: 8086, d: "Borrador desde plantilla legal, PDF, firma y documento en R2.", db: "PostgreSQL", i: "sign" },
  { n: "Comisiones", p: 8087, d: "Acuerdo comercial y reparto entre agente, oficina y central.", db: "PostgreSQL", i: "coins" },
  { n: "Notification", p: 8088, d: "Bandeja interna, correo y recordatorios de visita a 24 h y 1 h.", db: "PostgreSQL", i: "bell" },
  { n: "Analytics", p: 8089, d: "Propiedades más vistas y conversión de leads por agente.", db: "MongoDB Atlas", i: "chart" },
];

export const bases = [
  { n: "Auth", e: "PostgreSQL", t: ["auth_provider", "refresh_token", "verification_token"], x: "Los refresh tokens viven en la base, no en Redis." },
  { n: "User", e: "PostgreSQL", t: ["usuario", "oficina", "agente"], x: "La oficina guarda su gerente y, si es sucursal, su oficina central." },
  { n: "Propiedades", e: "PostgreSQL", t: ["propiedad", "propiedad_imagen"], x: "Los atributos variables van en una columna JSONB; las imágenes son claves de R2." },
  { n: "Leads", e: "PostgreSQL", t: ["lead", "distribution_rules"], x: "Los pesos de zona, carga y conversión se guardan en distribution_rules." },
  { n: "Visitas", e: "PostgreSQL", t: ["visita"], x: "Guarda inicio y fin; el choque se valida por agente y por propiedad." },
  { n: "Contratos", e: "PostgreSQL", t: ["contrato", "documento", "plantilla_contrato"], x: "Plantillas por tipo de contrato; el PDF firmado queda como documento." },
  { n: "Comisiones", e: "PostgreSQL", t: ["acuerdo_comercial", "regla_comision", "comision", "comision_reparto", "comision_historial", "outbox_evento"], x: "Historial de estados y tabla outbox para publicar eventos sin perderlos." },
  { n: "Notification", e: "PostgreSQL", t: ["notificacion", "envio_correo", "visita_recordatorio"], x: "Bandeja por usuario y cola de correos pendientes." },
  { n: "Analytics", e: "MongoDB Atlas", t: ["lead_analitica", "propiedad_vistas_diarias"], x: "Documentos agregados por día; alimentan el home y el tablero." },
];

export const pruebas = [
  ["Auth", "Rechaza un refresh token inexistente o expirado", "Reusar uno revocado cierra todas las sesiones", "Registro, verificación de correo y login", 57],
  ["User", "Un gerente no crea agentes en otra oficina", "Correo duplicado falla; el rol por defecto es CLIENTE", "Jerarquía de oficinas y alcance del gerente", 87],
  ["Propiedades", "Un cliente no puede crear propiedades", "URL de subida rechazada si no es el dueño", "Solo agentes publican; catálogo filtrado y paginado", 96],
  ["Leads", "Un lead activo duplicado lanza excepción", "Sin agentes candidatos no se asigna", "Crear lead: asigna, reserva visita, guarda y publica", 98],
  ["Visitas", "Lead descartado cancela sus visitas", "Fecha nula en agentes ocupados es inválida", "Reservar y rechazar choques de agente, propiedad y lead", 98],
  ["Contratos", "Sin plantilla activa no hay borrador", "El PDF sale válido y con marca de borrador", "Oferta aceptada, edición, firma y documento", 98],
  ["Comisiones", "Vigencia anterior al inicio es inválida", "Si el servicio cae al firmar, se propaga para reintentar", "Contrato firmado: reparto, aprobación, pago y reversión", 99],
  ["Notification", "Una notificación duplicada no genera otro envío", "Con el correo deshabilitado no consulta nada", "Envía pendientes y descarta usuarios sin correo", 99],
  ["Analytics", "La conversión por agente se ordena por tasa", "Un lead creado guarda datos base, canal y fecha", "Eventos sin duplicar y conversión por agente", 99],
  ["Gateway", "Un token expirado es rechazado", "Ruta privada sin token devuelve 401", "Rutas protegidas exigen JWT e inyectan la identidad", 98],
];
