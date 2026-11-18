import { useLayoutEffect, useRef, useState } from "react";
import { esquemas } from "./esquema.js";

export default function Erd() {
  const [i, setI] = useState(0);
  const e = esquemas[i];
  const box = useRef(null);
  const refs = useRef({});
  const [lineas, setLineas] = useState([]);

  useLayoutEffect(() => {
    const calcular = () => {
      if (!box.current) return;
      const o = box.current.getBoundingClientRect();
      const out = [];
      for (const t of e.tablas) {
        for (const c of t.f) {
          if (c.k !== "fk" || c.to === t.n) continue;
          const a = refs.current[`${t.n}.${c.c}`];
          const b = refs.current[`h:${c.to}`];
          if (!a || !b) continue;
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          const izq = rb.left + rb.width / 2 < ra.left + ra.width / 2;
          const vert = Math.abs(rb.left - ra.left) < 8;
          let x1, y1, x2, y2;
          if (vert) {
            x1 = ra.left - o.left + ra.width - 6; y1 = ra.top - o.top + ra.height / 2;
            x2 = rb.left - o.left + rb.width - 6; y2 = rb.top - o.top + rb.height / 2;
            const dx = 26;
            out.push({ d: `M${x1} ${y1} C${x1 + dx} ${y1},${x2 + dx} ${y2},${x2} ${y2}`, ax: x2, ay: y2, dir: -1, k: `${t.n}.${c.c}` });
            continue;
          }
          x1 = (izq ? ra.left : ra.right) - o.left; y1 = ra.top - o.top + ra.height / 2;
          x2 = (izq ? rb.right : rb.left) - o.left; y2 = rb.top - o.top + rb.height / 2;
          const dx = (x2 - x1) / 2;
          out.push({ d: `M${x1} ${y1} C${x1 + dx} ${y1},${x2 - dx} ${y2},${x2} ${y2}`, ax: x2, ay: y2, dir: izq ? 1 : -1, k: `${t.n}.${c.c}` });
        }
      }
      setLineas(out);
    };
    calcular();
    const ro = new ResizeObserver(calcular);
    ro.observe(box.current);
    return () => ro.disconnect();
  }, [i, e]);

  const total = e.tablas.length;
  return (
    <div className="erd-wrap">
      <nav className="erd-list" aria-label="Servicios">
        {esquemas.map((x, k) => (
          <button key={x.n} aria-pressed={i === k} onClick={() => setI(k)}>
            <span>{x.n}</span><small>{x.tablas.length} {x.motor === "MongoDB Atlas" ? "colecc." : x.tablas.length === 1 ? "tabla" : "tablas"}</small>
          </button>
        ))}
      </nav>
      <div>
        <div className="erd-top">
          <b>{e.n}</b><span className="chip dark">{e.motor}</span>
          <span className="erd-key"><i className="pkm">PK</i> clave primaria</span>
          <span className="erd-key"><i className="fkm">FK</i> relación dentro del servicio</span>
          <span className="erd-key"><i className="extm">↗</i> referencia a otro servicio</span>
        </div>
        <div className="erd" ref={box} style={{ gridTemplateColumns: `repeat(${e.cols}, minmax(0, 1fr))` }}>
          {e.tablas.map((t) => (
            <div className="tb" key={t.n}>
              <div className="tb-h" ref={(el) => (refs.current[`h:${t.n}`] = el)}>{t.n}</div>
              {t.f.map((c) => (
                <div className={`tb-r ${c.k || ""}`} key={c.c} ref={(el) => (refs.current[`${t.n}.${c.c}`] = el)}>
                  <span className="m">{c.k === "pk" ? "PK" : c.k === "fk" ? "FK" : c.k === "ext" ? "↗" : ""}</span>
                  <span className="cn">{c.c}</span>
                  {c.k === "ext" && <em>{c.to}</em>}
                  {c.k === "fk" && c.to === t.n && <em>{c.to}</em>}
                </div>
              ))}
              {t.mas > 0 && <div className="tb-m">+ {t.mas} {t.mas === 1 ? "columna" : "columnas"} más</div>}
            </div>
          ))}
          <svg className="erd-svg" aria-hidden="true">
            {lineas.map((l) => (
              <g key={l.k}>
                <path d={l.d} />
                <circle cx={l.ax} cy={l.ay} r="3.2" />
              </g>
            ))}
          </svg>
        </div>
        <p className="erd-note">{total} {e.motor === "MongoDB Atlas" ? "colecciones" : "tablas"} propias. Lo que apunta a otro servicio no es una clave foránea: se resuelve por API o por eventos.</p>
      </div>
    </div>
  );
}
