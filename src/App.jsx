import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Camera, Check, ChevronLeft, ChevronRight, Globe, Maximize2, Minus, Play, RotateCcw, Undo2, X } from "lucide-react";
import fachada from "./assets/landing-fachada.webp";
import image1 from "./assets/image1.png";
import image2 from "./assets/image2.png";
import image3 from "./assets/image3.png";
import image4 from "./assets/image4.png";
import { servicios, pruebas } from "./data.js";
import Erd from "./Erd.jsx";

const Head = ({ t, s }) => (
  <header className="hd">
    <h1>{t}</h1>
    <div className="cota"><span>{s}</span></div>
  </header>
);

const fotos = {
  "actions-fallo": image1,
  "actions-exitoso": image2,
  "grafana-dashboard": image3,
  "prometheus-targets": image4,
};

function Visor({ src, caption, cerrar }) {
  useEffect(() => {
    const k = (e) => {
      e.stopPropagation();
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", k, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k, true);
      document.body.style.overflow = prev;
    };
  }, [cerrar]);
  return createPortal(
    <div className="visor" role="dialog" aria-modal="true" aria-label={caption} onClick={cerrar}>
      <button className="visor-x" onClick={cerrar} aria-label="Cerrar imagen"><X size={20} /></button>
      <img src={src} alt={caption} onClick={(e) => e.stopPropagation()} />
      <p onClick={(e) => e.stopPropagation()}>{caption}. Esc o clic fuera para cerrar.</p>
    </div>,
    document.body
  );
}

function Evidencia({ name, caption }) {
  const [abierta, setAbierta] = useState(false);
  const cerrar = useCallback(() => setAbierta(false), []);
  const src = fotos[name];
  if (!src)
    return (
      <div className="evi">
        <Camera size={22} />
        <div>Falta la captura <span className="mono">{name}</span></div>
        <small>{caption}</small>
      </div>
    );
  return (
    <>
      <figure className="evi-img">
        <button className="evi-btn" onClick={() => setAbierta(true)} aria-label={`Ampliar: ${caption}`}>
          <img src={src} alt={caption} />
          <span className="evi-zoom"><Maximize2 size={14} /> Ampliar</span>
        </button>
        <figcaption>{caption}</figcaption>
      </figure>
      {abierta && <Visor src={src} caption={caption} cerrar={cerrar} />}
    </>
  );
}

/* 1 */
const Portada = () => (
  <div className="cover">
    <div className="cover-l">
      <h1>RealtyHub</h1>
      <p className="lead">Una plataforma para gestionar el ciclo comercial de una inmobiliaria con varias oficinas: publicar, captar, visitar, contratar y comisionar.</p>
      <ul className="crew">
        {[["Yerson", "Backend y despliegue"], ["Pedro", "Frontend"], ["Karime", "Pruebas y pentesting"], ["Valeria", "Pruebas funcionales"]].map(([n, r]) => (
          <li key={n}><b>{n}</b><span>{r}</span></li>
        ))}
      </ul>
      <a className="cta" href="https://www.realty-hub.site" target="_blank" rel="noreferrer"><Globe size={16} /> www.realty-hub.site</a>
    </div>
    <figure className="arch">
      <img src={fachada} alt="Fachada de una casa moderna" />
      <figcaption>10 microservicios · Java 21 · k3s</figcaption>
    </figure>
  </div>
);

/* 2 */
const roles = [
  ["Administrador central", "Configura oficinas, reglas de asignación y comisiones de toda la franquicia."],
  ["Gerente de oficina", "Administra los agentes y las propiedades de su oficina."],
  ["Agente", "Recibe leads, atiende visitas y lleva el pipeline hasta el cierre."],
  ["Cliente", "Explora el catálogo, pide una visita y sigue su proceso."],
];
const Problema = () => (
  <>
    <Head t="El problema que resuelve" s="Contexto y necesidades" />
    <div className="two">
      <div>
        <h2 className="h2">Lo que pasa hoy</h2>
        <div className="rows">
          {[
            ["Clientes que esperan", "El contacto llega a un agente lejano u ocupado y la respuesta se demora."],
            ["Agendas que se cruzan", "Dos visitas a la misma propiedad a la misma hora, o un agente en dos lugares."],
            ["Contratos manuales", "Borradores sueltos, firmas sin trazabilidad y propiedades que no cambian de estado."],
            ["Comisiones a mano", "El reparto entre agente, oficina y central se arma en hojas de cálculo."],
          ].map(([t, d]) => <div className="row" key={t}><b>{t}</b><span>{d}</span></div>)}
        </div>
      </div>
      <div>
        <h2 className="h2">Quién usa RealtyHub</h2>
        <div className="stair">
          {roles.map(([t, d], i) => (
            <div key={t} className="stp" style={{ width: `${100 - i * 11}%`, background: ["var(--g-900)", "var(--g-700)", "var(--g-300)", "var(--o-300)"][i], color: i < 2 ? "var(--floral)" : "var(--evergreen)" }}>
              <b>{t}</b><span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

/* 3 */
const modulos = ["Propiedades", "Leads", "Visitas", "Contratos", "Comisiones"];
const Objetivo = () => (
  <div className="obj">
    <div>
      <h1 className="big">Cada etapa del negocio inmobiliario es un servicio que funciona solo y coopera con los demás.</h1>
      <p className="lede">RealtyHub reúne publicar, captar, visitar, contratar y comisionar en una plataforma pensada para franquicias con varias oficinas.</p>
    </div>
    <div className="scope">
      <div>
        <span className="scope-t">Incluye</span>
        <ul>{["Catálogo y mapa", "Asignación de agentes", "Agenda de visitas", "Contratos y firma", "Comisiones", "Notificaciones y analítica"].map((x) => <li key={x}><Check size={16} />{x}</li>)}</ul>
      </div>
      <div>
        <span className="scope-t">No incluye</span>
        <ul className="out">{["Pasarela de pagos", "Portales externos de anuncios", "Locales y lotes"].map((x) => <li key={x}><Minus size={16} />{x}</li>)}</ul>
      </div>
    </div>
  </div>
);

const Monolito = () => {
  const [cae, setCae] = useState(false);
  return (
    <>
      <Head t="¿Por qué microservicios y no un monolito?" s="Prueba el fallo de un módulo" />
      <div className="cmp-head">
        <p className="lede" style={{ margin: 0 }}>Un fallo en Comisiones no debería detener la venta de una propiedad.</p>
        <button className="btn danger" aria-pressed={cae} onClick={() => setCae((c) => !c)}>{cae ? "Restaurar Comisiones" : "Simular fallo en Comisiones"}</button>
      </div>
      <div className="cmp">
        <div className="cmp-col">
          <div className="cmp-title">Monolito <span>un proceso, una base de datos</span></div>
          <div className={`mono-box ${cae ? "down" : ""}`}>
            <div className="tiles">{modulos.map((m) => <div className="tile2" key={m}>{m}</div>)}</div>
            <div className="dbbar">Base de datos única</div>
          </div>
          <p className="cmp-note">{cae ? "Todo el sistema se detiene: nadie puede ver propiedades ni agendar visitas." : "Todos los módulos viven juntos y se publican juntos."}</p>
        </div>
        <div className="cmp-col">
          <div className="cmp-title">Microservicios <span>procesos y bases separados</span></div>
          <div className="micro">
            {modulos.map((m) => {
              const roto = cae && m === "Comisiones";
              return (
                <div className={`mini ${roto ? "down" : ""}`} key={m}>
                  <b>{m}</b>
                  <span>{roto ? "Caído" : "Activo"}</span>
                  <i />
                </div>
              );
            })}
          </div>
          <p className="cmp-note">{cae ? "Solo Comisiones espera su reinicio. El catálogo, los leads y las visitas siguen atendiendo." : "Cada servicio tiene su propio código, su base de datos y su pipeline."}</p>
        </div>
      </div>
    </>
  );
};

/* 4 */
const nodos = {
  Auth: { p: 8081, db: ["PostgreSQL"], http: ["User"], pub: [], con: [], n: "Emite el JWT y publica el JWKS con el que el Gateway valida." },
  User: { p: 8082, db: ["PostgreSQL"], http: [], pub: [], con: [], n: "Dueño de usuarios, oficinas y agentes; varios servicios le consultan." },
  Propiedades: { p: 8083, db: ["PostgreSQL", "Redis", "R2"], http: ["User"], pub: ["propiedad.estado_cambiado", "propiedad.vista"], con: ["contract.cancelled"], n: "Guarda las imágenes en R2 y usa Redis para no contar vistas repetidas." },
  Leads: { p: 8084, db: ["PostgreSQL"], http: ["Propiedades", "User", "Visitas"], pub: ["lead.creado", "lead.descartado", "lead.oferta_aceptada", "lead.cerrado"], con: [], n: "Orquesta la SAGA: valida, elige agente, reserva la visita y guarda." },
  Visitas: { p: 8085, db: ["PostgreSQL"], http: [], pub: ["visita.agendada", "visita.cancelada", "visita.realizada"], con: ["lead.descartado", "propiedad.estado_cambiado"], n: "Rechaza choques de agente, propiedad y lead." },
  Contratos: { p: 8086, db: ["PostgreSQL", "R2"], http: [], pub: ["contract.signed", "contract.cancelled"], con: ["lead.oferta_aceptada"], n: "Genera el borrador y guarda el PDF firmado en un bucket privado." },
  Comisiones: { p: 8087, db: ["PostgreSQL"], http: [], pub: ["comision.*"], con: ["contract.signed", "contract.cancelled"], n: "Reparte la comisión al firmar y la anula si el contrato se cancela." },
  Notification: { p: 8088, db: ["PostgreSQL", "Gmail SMTP"], http: ["User"], pub: [], con: ["lead.*", "visita.*", "contract.*", "comision.*"], n: "Bandeja interna, correos y recordatorios de visita a 24 h y 1 h." },
  Analytics: { p: 8089, db: ["MongoDB"], http: ["User"], pub: [], con: ["lead.*", "propiedad.vista"], n: "Agrega vistas y conversión para el home y el tablero." },
};
const casa = (e, pat) => (pat.endsWith(".*") ? e.startsWith(pat.slice(0, -1)) : e === pat);
const almacenes = ["PostgreSQL", "MongoDB", "Redis", "R2", "Gmail SMTP"];
const colsArq = [
  ["Acceso", ["Auth", "User"], "var(--g-300)"],
  ["Captación y visitas", ["Propiedades", "Leads", "Visitas"], "var(--o-300)"],
  ["Cierre del negocio", ["Contratos", "Comisiones"], "var(--g-400)"],
  ["Soporte", ["Notification", "Analytics"], "var(--o-300)"],
];
const rolCorto = { Auth: "JWT y login", User: "Oficinas y agentes", Propiedades: "Catálogo", Leads: "Asignación", Visitas: "Agenda", Contratos: "Borrador y firma", Comisiones: "Reparto", Notification: "Avisos y correos", Analytics: "Métricas" };
const Arquitectura = () => {
  const [sel, setSel] = useState("Leads");
  const a = nodos[sel];
  const caja = useRef(null);
  const nref = useRef({});
  const [flechas, setFlechas] = useState([]);
  const socios = Object.keys(nodos).filter((k) => k !== sel && (nodos[k].con.some((c) => a.pub.some((e) => casa(e, c) || casa(c, e))) || nodos[k].pub.some((e) => a.con.some((c) => casa(e, c) || casa(c, e)))));
  const hay = a.pub.length + a.con.length > 0;
  useLayoutEffect(() => {
    const calc = () => {
      if (!caja.current) return;
      const o = caja.current.getBoundingClientRect();
      const ra = nref.current[sel]?.getBoundingClientRect();
      if (!ra) return;
      const ci = (k) => colsArq.findIndex((c) => c[1].includes(k));
      const colR = (i) => nref.current[colsArq[i][1][0]].getBoundingClientRect();
      const gutter = (i) => (colR(i).right + colR(i + 1).left) / 2 - o.left;
      const abajo = Math.max(...Object.values(nref.current).filter(Boolean).map((el) => el.getBoundingClientRect().bottom)) - o.top + 12;
      const s0 = ci(sel);
      const out = [];
      for (const t of a.http) {
        const rb = nref.current[t]?.getBoundingClientRect();
        if (!rb) continue;
        const t0 = ci(t);
        const y1 = ra.top - o.top + ra.height / 2;
        const y2 = rb.top - o.top + rb.height / 2;
        let pts = null;
        if (s0 === t0) {
          const der = s0 < colsArq.length - 1;
          const gx = der ? gutter(s0) : gutter(s0 - 1);
          pts = [[(der ? ra.right : ra.left) - o.left, y1], [gx, y1], [gx, y2], [(der ? rb.right + 2 : rb.left - 2) - o.left, y2]];
        } else if (Math.abs(s0 - t0) === 1) {
          const der = t0 > s0;
          const gx = gutter(Math.min(s0, t0));
          pts = [[(der ? ra.right : ra.left) - o.left, y1], [gx, y1], [gx, y2], [(der ? rb.left - 2 : rb.right + 2) - o.left, y2]];
        } else if (colsArq[t0][1].slice(-1)[0] === t) {
          const der = t0 > s0;
          const gx = gutter(der ? s0 : s0 - 1);
          const xc = rb.left + rb.width / 2 - o.left;
          pts = [[(der ? ra.right : ra.left) - o.left, y1], [gx, y1], [gx, abajo], [xc, abajo], [xc, rb.bottom - o.top + 2]];
        }
        if (pts) out.push({ k: t, d: pts.map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`).join(" ") });
      }
      setFlechas(out);
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(caja.current);
    return () => ro.disconnect();
  }, [sel, a]);
  return (
    <>
      <Head t="Arquitectura general" s="Haz clic en un servicio para ver sus conexiones" />
      <div className="arq">
        <div className="arq-main" ref={caja}>
          <div className="entrada">
            <div className="ent-l"><span>Cliente web</span><ArrowRight size={14} /><span>Cloudflare Tunnel</span><ArrowRight size={14} /></div>
            <span className="gwchip">API Gateway</span>
            <small>valida el JWT y enruta</small>
          </div>
          <div className="stem" />
          <div className="rail4"><i /><i /><i /><i /></div>
          <div className="cols4">
            {colsArq.map(([g, ns, c]) => (
              <div className="col4" key={g}>
                <h4 style={{ background: c }}>{g}</h4>
                {ns.map((k) => (
                  <button key={k} ref={(el) => (nref.current[k] = el)} className={`sv ${sel === k ? "sel" : ""} ${a.http.includes(k) ? "http" : ""} ${socios.includes(k) ? "ev" : ""}`} onClick={() => setSel(k)} aria-pressed={sel === k}>
                    <b>{k}</b><span>{rolCorto[k]}</span><em>:{nodos[k].p}</em>
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className={`bus ${hay ? "on" : ""}`}><span>RabbitMQ</span><i />eventos de negocio</div>
          <div className="stores">
            {almacenes.map((s) => <div key={s} className={a.db.includes(s) ? "on" : ""}>{s}</div>)}
          </div>
          <div className="leyenda">
            <span><i className="k sel" />Seleccionado</span><span><i className="k http" />Lo llama por HTTP (flecha)</span><span><i className="k ev" />Comparte eventos</span>
          </div>
          <svg className="arq-svg" aria-hidden="true">
            <defs><marker id="pta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--warning)" /></marker></defs>
            {flechas.map((f) => <path key={f.k} d={f.d} markerEnd="url(#pta)" />)}
          </svg>
        </div>
        <div className="dpanel">
          <div className="dtop"><h3>{sel}</h3><span className="port">:{a.p}</span></div>
          <p className="dnote">{a.n}</p>
          <div className="drow"><b>Guarda en</b><div className="chips">{a.db.map((x) => <span className="chip dark" key={x}>{x}</span>)}</div></div>
          <div className="drow"><b>Llama por HTTP a</b>{a.http.length ? <div className="chips">{a.http.map((x) => <span className="chip" key={x}>{x}</span>)}</div> : <em>Nadie: no depende de otros servicios.</em>}</div>
          <div className="drow"><b>Publica</b>{a.pub.length ? <div className="evs">{a.pub.map((x) => <span className="mono" key={x}>{x}</span>)}</div> : <em>No publica eventos.</em>}</div>
          <div className="drow"><b>Consume</b>{a.con.length ? <div className="evs">{a.con.map((x) => <span className="mono" key={x}>{x}</span>)}</div> : <em>No consume eventos.</em>}</div>
        </div>
      </div>
    </>
  );
};

/* 5 */
const grupos = [
  ["Acceso", ["API Gateway", "Auth", "User"], "var(--g-300)"],
  ["Captación y visitas", ["Propiedades", "Leads", "Visitas"], "var(--o-300)"],
  ["Cierre del negocio", ["Contratos", "Comisiones"], "var(--g-400)"],
  ["Soporte", ["Notification", "Analytics"], "var(--o-200)"],
];
const Directorio = () => (
  <>
    <Head t="Función de cada microservicio" s="Directorio del sistema" />
    <div className="dir">
      {grupos.map(([g, ns, c]) => (
        <section key={g}>
          <h3 style={{ background: c }}>{g}</h3>
          {ns.map((n) => {
            const s = servicios.find((x) => x.n === n);
            return (
              <div className="dr" key={n}>
                <span className="pt">:{s.p}</span>
                <div><b>{s.n}</b><p>{s.d}</p></div>
                <em>{s.db}</em>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  </>
);

/* 6 */
const pasos = [
  ["Me interesa", "El cliente elige fecha y hora de visita en el detalle de la propiedad.", "Frontend → Gateway → Leads"],
  ["Validar propiedad", "Leads confirma que la propiedad existe y está DISPONIBLE.", "Leads → Propiedades (HTTP)"],
  ["Elegir agente", "Entre las 5 oficinas más cercanas, solo agentes libres a esa hora; gana el mejor puntaje de zona, carga y conversión.", "Leads → User (HTTP)"],
  ["Reservar visita", "Visitas crea la reserva con el leadId generado de antemano. Este paso se puede deshacer.", "Leads → Visitas (HTTP)"],
  ["Guardar lead", "Leads guarda el lead con el agente ganador.", "Leads → PostgreSQL"],
  ["Publicar evento", "Se publica lead.creado: Notification avisa al agente y Analytics lo cuenta.", "Leads → RabbitMQ"],
];
const Saga = () => {
  const [paso, setPaso] = useState(0);
  const [falla, setFalla] = useState(false);
  const fin = falla ? 6 : pasos.length;
  return (
    <>
      <Head t="Comunicación y patrón SAGA" s="Orquestación en Leads · coreografía por eventos" />
      <div className="two saga">
        <div>
          <div className="controls">
            <button className="btn primary" disabled={paso >= fin} onClick={() => setPaso((p) => p + 1)}><Play size={14} /> Siguiente paso</button>
            <button className="btn" onClick={() => setPaso(0)}><RotateCcw size={14} /> Reiniciar</button>
            <button className="btn danger" aria-pressed={falla} onClick={() => { setFalla((f) => !f); setPaso(0); }}>Simular fallo al guardar</button>
          </div>
          <ol className="tl">
            {pasos.map(([t, d, w], i) => {
              const hecho = i < paso && (!falla || i < 5);
              const roto = falla && i === 4 && paso > 4;
              return (
                <li key={t} className={`${hecho || roto ? "on" : ""} ${i === paso - 1 && !roto ? "cur" : ""} ${roto ? "bad" : ""}`}>
                  <i>{i + 1}</i>
                  <div><b>{t}</b><span>{d}</span><code>{w}</code></div>
                </li>
              );
            })}
            {falla && (
              <li className={`comp ${paso > 5 ? "on cur" : ""}`}>
                <i><Undo2 size={13} /></i>
                <div><b>Compensación</b><span>Leads cancela la visita en Visitas y responde con error: no quedan ni visita ni lead huérfanos.</span></div>
              </li>
            )}
          </ol>
          <p className="foot">Si ningún agente está libre, la respuesta es 409 y no se crea nada.</p>
        </div>
        <div>
          <h2 className="h2">Eventos en RabbitMQ</h2>
          <div className="ev-list">
            {[
              ["lead.oferta_aceptada", "Contratos crea el borrador del contrato."],
              ["contract.signed", "Comisiones calcula y reparte la comisión."],
              ["contract.cancelled", "Propiedades revierte el estado, Comisiones anula y Notification avisa."],
              ["lead.descartado", "Visitas cancela las visitas pendientes del lead."],
              ["propiedad.estado_cambiado", "Visitas cancela las visitas de una propiedad vendida o alquilada."],
              ["visita.agendada · cancelada · realizada", "Notification crea avisos y recordatorios; Analytics registra."],
            ].map(([e, t]) => <div key={e}><code>{e}</code><span>{t}</span></div>)}
          </div>
        </div>
      </div>
    </>
  );
};

/* 7 */
const estaciones = [
  { t: "Login", s: "Cliente → Auth", h: "Dos formas de entrar", pts: ["Google con el flujo id_token, o correo y contraseña con verificación por email.", "Un correo solo puede tener un proveedor de acceso.", "La recuperación de contraseña usa un enlace que expira."] },
  { t: "Auth firma", s: "Llave privada", h: "Auth emite el token", pts: ["Firma un JWT de vida corta con su llave privada; nadie más la tiene.", "Publica la llave pública en /.well-known/jwks.json.", "El refresh token va en cookie HttpOnly con SameSite=Strict."] },
  { t: "Gateway valida", s: "Llave pública", h: "El Gateway decide quién entra", pts: ["Valida la firma contra el JWKS de Auth, sin llamar a Auth en cada petición.", "Borra los X-User-Id y X-User-Role que traiga el cliente antes de validar.", "Rutas públicas: solo GET de catálogo, oficinas y agentes."] },
  { t: "Identidad", s: "Headers internos", h: "La identidad viaja en headers", pts: ["El Gateway propaga X-User-Id y X-User-Role a los servicios.", "Los servicios nunca decodifican el token: solo leen esos headers.", "Se leen con un resolver de argumentos (@UsuarioActual), no repetido en cada controller."] },
  { t: "Autorización", s: "Reglas por rol", h: "Cada servicio aplica su regla", pts: ["Roles: ADMINISTRADOR_CENTRAL, GERENTE_OFICINA, AGENTE y CLIENTE.", "Un gerente solo gestiona su oficina; un agente solo su propiedad o su lead.", "El refresh rota en cada uso y reusar uno revocado cierra todas las sesiones."] },
];
const Seguridad = () => {
  const [s, setS] = useState(1);
  const c = estaciones[s];
  return (
    <>
      <Head t="Autenticación, autorización y seguridad" s="Recorrido de una petición" />
      <div className="route">
        {estaciones.map((e, k) => (
          <button key={e.t} className={`st ${k === s ? "sel" : ""} ${k < s ? "past" : ""}`} onClick={() => setS(k)} aria-pressed={k === s}>
            <i />
            <b>{e.t}</b>
            <span>{e.s}</span>
          </button>
        ))}
      </div>
      <div className="sec-detail">
        <h2>{c.h}</h2>
        <ul>{c.pts.map((p) => <li key={p}><Check size={16} />{p}</li>)}</ul>
      </div>
    </>
  );
};

/* 8 */
const Bases = () => (
  <>
    <Head t="Manejo de bases de datos" s="Una base por servicio · 23 tablas y 2 colecciones" />
    <Erd />
  </>
);

/* 9 */
const stack = [
  ["Lenguaje", ["Java 21"], "Tipado fuerte, versión de soporte largo y el ecosistema más maduro para servicios empresariales."],
  ["Frameworks", ["Spring Boot 4", "Spring Cloud Gateway", "Spring Data JPA", "Spring AMQP"], "Un mismo modelo en los diez servicios, con seguridad, datos y mensajería integrados."],
  ["Datos", ["PostgreSQL 17", "MongoDB Atlas", "Redis", "Flyway"], "Relacional para reglas transaccionales, MongoDB para agregados de analítica y Flyway para versionar el esquema."],
  ["Mensajería", ["RabbitMQ"], "Ruteo por tema, justo lo que piden los eventos de negocio, con menos peso que Kafka."],
  ["DevOps", ["Docker", "GitHub Actions", "GHCR", "k3s", "Cloudflare Tunnel"], "Un clúster ligero en un solo servidor, con despliegue automático desde un runner propio."],
  ["Calidad", ["JUnit 5", "Mockito", "Testcontainers", "JaCoCo", "Prometheus", "Grafana", "k6"], "Pruebas aisladas con mocks y de integración contra bases reales; métricas del sistema en vivo."],
  ["Frontend y nube", ["React", "Vite", "Tailwind", "MapLibre", "Cloudflare R2", "Google Sign-In", "Gmail SMTP"], "Interfaz rápida, mapa sin costo de API, imágenes y PDF en R2, acceso con Google y correos transaccionales."],
];
const Stack = () => (
  <>
    <Head t="Stack tecnológico" s="Qué usamos y por qué" />
    <div className="layers">
      {stack.map(([t, ch, j], i) => (
        <div className="ly" key={t} style={{ "--c": i % 2 ? "var(--o-200)" : "var(--g-200)" }}>
          <b>{t}</b>
          <div className="techs">{ch.map((c) => <span key={c}>{c}</span>)}</div>
          <p>{j}</p>
        </div>
      ))}
    </div>
  </>
);

/* 10 */
const Pruebas = () => {
  const total = (18311 / 19505) * 100;
  return (
    <>
      <Head t="Pruebas y cobertura" s="Unitarias con mocks · integración con Testcontainers" />
      <div className="nums">
        <div><strong>{total.toFixed(1).replace(".", ",")} %</strong><span>cobertura de instrucciones en los 10 servicios (JaCoCo)</span></div>
        <div><strong>20</strong><span>pruebas unitarias con mocks, dos por servicio</span></div>
        <div><strong>10</strong><span>pruebas de integración, una por servicio</span></div>
        <div><strong>10/10</strong><span>pipelines que publican el reporte de cobertura</span></div>
      </div>
      <table className="tbl">
        <thead><tr><th>Servicio</th><th>Prueba unitaria 1</th><th>Prueba unitaria 2</th><th>Prueba de integración</th><th>Cobertura</th></tr></thead>
        <tbody>
          {pruebas.map(([n, a, b, c, p]) => (
            <tr key={n}><td className="sn">{n}</td><td>{a}</td><td>{b}</td><td>{c}</td><td className="cov"><span className="bar"><i className={p < 80 ? "low" : ""} style={{ width: `${p}%` }} /></span>{p} %</td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

/* 11 */
const Cicd = () => (
  <>
    <Head t="Pipeline CI/CD con GitHub Actions" s="Pruebas, imagen y despliegue en cada cambio" />
    <div className="track">
      {[
        ["Pruebas", "ubuntu-latest · Java 21", "./mvnw test y reporte JaCoCo como artefacto. Corre en cada push y pull request."],
        ["Construir y publicar", "ubuntu-latest", "Imagen Docker a ghcr.io con el SHA del commit. Solo en push a main y solo si las pruebas pasan."],
        ["Desplegar", "runner propio en el servidor", "kubectl set image y rollout status en el clúster k3s."],
      ].map(([t, w, d], i, a) => (
        <div className="stn" key={t} style={{ "--c": `var(--g-${[200, 300, 400][i]})` }}>
          <small>{w}</small><b>{t}</b><p>{d}</p>
          {i < a.length - 1 && <ArrowRight className="arr" size={20} />}
        </div>
      ))}
    </div>
    <div className="two">
      <div>
        <h2 className="h2">Estrategia de ramas</h2>
        <svg className="git" viewBox="0 0 560 150" role="img" aria-label="Rama feature que se integra a main por pull request">
          <line x1="10" y1="110" x2="550" y2="110" />
          <path d="M120 110 C150 110,150 40,190 40 L330 40 C370 40,370 110,400 110" />
          {[40, 120, 400, 480].map((x) => <circle key={x} cx={x} cy="110" r="6" />)}
          {[190, 260, 330].map((x) => <circle key={x} cx={x} cy="40" r="6" className="f" />)}
          <text x="10" y="138">main</text>
          <text x="215" y="24">feature/*</text>
          <text x="260" y="138">pull request: pruebas</text>
          <text x="550" y="86" textAnchor="end" className="d">push a main: build y deploy</text>
        </svg>
        <p className="foot">Cada cambio nace en una rama feature y entra a main por pull request. Los secretos viven en GitHub Secrets y en Secrets de Kubernetes.</p>
      </div>
      <div className="evi2">
        <Evidencia name="actions-exitoso" caption="Actions con las tres etapas aprobadas" />
        <Evidencia name="actions-fallo" caption="Una prueba fallida detiene el pipeline" />
      </div>
    </div>
  </>
);

/* 12 */
const Monitoreo = () => (
  <>
    <Head t="Monitoreo con Prometheus y Grafana" s="Métricas de los 10 servicios en vivo" />
    <div className="two mon">
      <div className="stack">
        <div><h2 className="h2">Prometheus</h2><p>Cada servicio expone <code>/actuator/prometheus</code> con Micrometer. Un solo job, <code>realtyhub</code>, recolecta los 10 objetivos.</p></div>
        <div>
          <h2 className="h2">Grafana: vista general</h2>
          <div className="tags">{["Disponibilidad", "Peticiones por segundo", "Latencia p95", "Tasa de errores", "CPU", "Memoria JVM"].map((m) => <span key={m}>{m}</span>)}</div>
        </div>
        <div><h2 className="h2">Pruebas de carga</h2><p>Escenarios smoke, load, stress y spike con k6 y un plan de JMeter, contra la VM y a través del túnel.</p></div>
        <p className="foot">prometheus.yml y el dashboard JSON están en la carpeta monitoring de cada repositorio.</p>
      </div>
      <div className="evi2 col">
        <Evidencia name="grafana-dashboard" caption="Dashboard con tráfico real" />
        <Evidencia name="prometheus-targets" caption="Targets de Prometheus en estado UP" />
      </div>
    </div>
  </>
);

/* 13 */
const Cierre = () => (
  <div className="close">
    <h1>Gracias</h1>
    <p className="lead">RealtyHub es un sistema inmobiliario construido como servicios que cooperan, se prueban solos y se despliegan con cada cambio.</p>
    <div className="bigs">
      {[["10", "microservicios, cada uno con su repositorio y su pipeline"], ["9", "bases de datos: 8 PostgreSQL y 1 MongoDB"], ["93,9 %", "cobertura de pruebas en el conjunto"], ["3", "capas de seguridad: Gateway, JWT asimétrico y roles"]].map(([n, t]) => (
        <div key={t}><strong>{n}</strong><span>{t}</span></div>
      ))}
    </div>
    <a className="cta" href="https://www.realty-hub.site" target="_blank" rel="noreferrer"><Globe size={16} /> Abrir RealtyHub</a>
  </div>
);

const slides = [
  { t: "Portada", dark: true, C: Portada },
  { t: "Problema", C: Problema },
  { t: "Objetivo y alcance", C: Objetivo },
  { t: "Por qué microservicios", C: Monolito },
  { t: "Arquitectura general", dark: true, C: Arquitectura },
  { t: "Microservicios", C: Directorio },
  { t: "Comunicación y SAGA", C: Saga },
  { t: "Seguridad", C: Seguridad },
  { t: "Bases de datos", C: Bases },
  { t: "Stack tecnológico", C: Stack },
  { t: "Pruebas y cobertura", C: Pruebas },
  { t: "Pipeline CI/CD", C: Cicd },
  { t: "Monitoreo", C: Monitoreo },
  { t: "Cierre", dark: true, C: Cierre },
];
const pisos = [
  ["Portada", [0]],
  ["Problema y alcance", [1, 2, 3]],
  ["Arquitectura", [4, 5, 6, 7, 8]],
  ["Stack", [9]],
  ["Pruebas y despliegue", [10, 11, 12]],
  ["Cierre", [13]],
];

export default function App() {
  const lee = () => Math.min(Math.max((parseInt(location.hash.slice(1)) || 1) - 1, 0), slides.length - 1);
  const [i, setI] = useState(lee);
  const go = useCallback((n) => setI((p) => { const v = Math.min(Math.max(typeof n === "function" ? n(p) : n, 0), slides.length - 1); history.replaceState(null, "", `#${v + 1}`); return v; }), []);
  useEffect(() => {
    const k = (e) => {
      if (["ArrowRight", "PageDown"].includes(e.key) || (e.key === " " && !(e.target instanceof HTMLButtonElement))) { e.preventDefault(); go((p) => p + 1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go((p) => p - 1); }
      if (e.key === "Home") go(0);
      if (e.key === "End") go(slides.length - 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go]);
  const { C, dark } = slides[i];
  return (
    <div className="app" data-dark={dark ? "1" : "0"}>
      <aside className="rail" aria-label="Estructura de la presentación">
        <svg className="roof" viewBox="0 0 100 26" aria-hidden="true"><path d="M2 25 L50 3 L98 25" /></svg>
        {pisos.map(([n, ids]) => {
          const activo = ids.includes(i);
          return (
            <button key={n} className={`floor ${activo ? "on" : ""}`} onClick={() => go(ids[0])} aria-current={activo}>
              <span>{n}</span>
              <div className="win">{ids.map((id) => <i key={id} className={id === i ? "cur" : ""} onClick={(e) => { e.stopPropagation(); go(id); }} title={slides[id].t} />)}</div>
            </button>
          );
        })}
      </aside>
      <main className="stage"><section className="slide" key={i}><C /></section></main>
      <nav className="pager" aria-label="Diapositivas">
        <button onClick={() => go(i - 1)} disabled={i === 0} aria-label="Anterior"><ChevronLeft size={18} /></button>
        <span>{i + 1} / {slides.length}</span>
        <button onClick={() => go(i + 1)} disabled={i === slides.length - 1} aria-label="Siguiente"><ChevronRight size={18} /></button>
      </nav>
    </div>
  );
}
