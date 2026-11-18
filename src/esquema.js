const pk = (c = "id") => ({ c, k: "pk" });
const fk = (c, to) => ({ c, k: "fk", to });
const ext = (c, to) => ({ c, k: "ext", to });
const f = (c) => ({ c });

export const esquemas = [
  { n: "Auth", motor: "PostgreSQL", cols: 3, tablas: [
    { n: "auth_provider", f: [pk(), ext("user_id", "User"), f("proveedor"), f("email"), f("google_id"), f("email_verificado")], mas: 2 },
    { n: "refresh_token", f: [pk(), ext("user_id", "User"), f("token_hash"), f("expire_at"), f("revoked")], mas: 1 },
    { n: "verification_token", f: [pk(), ext("user_id", "User"), f("token_hash"), f("tipo"), f("expires_at"), f("used")], mas: 1 },
  ] },
  { n: "User", motor: "PostgreSQL", cols: 3, tablas: [
    { n: "usuario", p: [0, 0], f: [pk(), f("email"), f("nombre"), f("telefono"), f("rol"), f("activo")], mas: 3 },
    { n: "oficina", p: [2, 0], f: [pk(), f("nombre"), f("region"), f("latitud"), f("longitud"), f("tipo"), fk("oficina_central_id", "oficina"), fk("gerente_id", "usuario")], mas: 2 },
    { n: "agente", p: [1, 0], f: [pk(), fk("usuario_id", "usuario"), fk("oficina_id", "oficina"), f("zona_especialidad")], mas: 2 },
  ] },
  { n: "Propiedades", motor: "PostgreSQL", cols: 2, tablas: [
    { n: "propiedad", p: [0, 0], f: [pk(), ext("agente_id", "User"), f("titulo"), f("precio"), f("ciudad"), f("tipo_propiedad"), f("modalidad"), f("estado_comercial"), f("caracteristicas JSONB")], mas: 4 },
    { n: "propiedad_imagen", p: [1, 0], f: [pk(), fk("propiedad_id", "propiedad"), f("key_r2"), f("es_portada"), f("orden")], mas: 1 },
  ] },
  { n: "Leads", motor: "PostgreSQL", cols: 2, tablas: [
    { n: "lead", f: [pk(), ext("propiedad_id", "Propiedades"), ext("cliente_id", "User"), ext("agente_id", "User"), f("canal_origen"), f("estado")], mas: 2 },
    { n: "distribution_rules", f: [pk(), f("peso_zona"), f("peso_carga"), f("peso_conversion")], mas: 2 },
  ] },
  { n: "Visitas", motor: "PostgreSQL", cols: 1, tablas: [
    { n: "visita", f: [pk(), ext("propiedad_id", "Propiedades"), ext("cliente_id", "User"), ext("agente_id", "User"), ext("lead_id", "Leads"), f("fecha_hora"), f("fecha_hora_fin"), f("estado_visita")], mas: 2 },
  ] },
  { n: "Contratos", motor: "PostgreSQL", cols: 3, tablas: [
    { n: "plantilla_contrato", p: [0, 0], f: [pk(), f("tipo"), f("pais"), f("version"), f("cuerpo"), f("activa")], mas: 1 },
    { n: "contrato", p: [1, 0], f: [pk(), ext("lead_id", "Leads"), ext("propiedad_id", "Propiedades"), ext("agente_id", "User"), fk("plantilla_id", "plantilla_contrato"), f("tipo"), f("estado"), f("precio_acordado"), f("firmado_en")], mas: 5 },
    { n: "documento", p: [2, 0], f: [pk(), fk("contrato_id", "contrato"), f("version"), f("clave_archivo"), f("tamano_bytes")], mas: 1 },
  ] },
  { n: "Comisiones", motor: "PostgreSQL", cols: 3, tablas: [
    { n: "regla_comision", p: [0, 1], f: [pk(), fk("acuerdo_id", "acuerdo_comercial"), f("tipo_contrato"), f("base_calculo"), f("valor"), f("porcentaje_agente")], mas: 2 },
    { n: "acuerdo_comercial", p: [0, 0], f: [pk(), f("nombre"), f("vigente_desde"), f("vigente_hasta"), ext("creado_por", "User")], mas: 1 },
    { n: "comision", p: [1, 0], f: [pk(), ext("contrato_id", "Contratos"), fk("acuerdo_id", "acuerdo_comercial"), fk("regla_id", "regla_comision"), ext("agente_id", "User"), f("estado"), f("monto_total")], mas: 19 },
    { n: "outbox_evento", p: [1, 1], f: [pk(), f("routing_key"), f("payload"), f("publicado_en"), f("intentos")], mas: 1 },
    { n: "comision_reparto", p: [2, 0], f: [pk(), fk("comision_id", "comision"), f("beneficiario_tipo"), f("porcentaje"), f("monto")], mas: 2 },
    { n: "comision_historial", p: [2, 1], f: [pk(), fk("comision_id", "comision"), f("estado_anterior"), f("estado_nuevo"), f("motivo")], mas: 2 },
  ] },
  { n: "Notification", motor: "PostgreSQL", cols: 3, tablas: [
    { n: "notificacion", p: [0, 0], f: [pk(), ext("usuario_id", "User"), f("tipo"), f("titulo"), f("mensaje"), f("clave_dedupe"), f("leida")], mas: 3 },
    { n: "envio_correo", p: [1, 0], f: [pk(), fk("notificacion_id", "notificacion"), ext("usuario_id", "User"), f("asunto"), f("estado"), f("intentos"), f("proximo_intento_en")], mas: 4 },
    { n: "visita_recordatorio", p: [2, 0], f: [pk("visita_id"), ext("lead_id", "Leads"), ext("agente_id", "User"), f("fecha_hora"), f("estado")], mas: 4 },
  ] },
  { n: "Analytics", motor: "MongoDB Atlas", cols: 2, tablas: [
    { n: "lead_analitica", f: [pk(), f("agenteId"), f("propiedadId"), f("canalOrigen"), f("creadoEn"), f("ofertaAceptadaEn"), f("cerradoEn"), f("descartadoEn")], mas: 1 },
    { n: "propiedad_vistas_diarias", f: [pk(), f("propiedadId"), f("fecha"), f("vistas")], mas: 0 },
  ] },
];
