import { useLayoutEffect, useRef, useState } from "react";
import { esquemas } from "./esquema.js";

const pos = (t, k, cols) => t.p || [k % cols, Math.floor(k / cols)];

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
      const colDe = {};
      e.tablas.forEach((t, k) => { colDe[t.n] = pos(t, k, e.cols)[0]; });
      const hr = (n) => refs.current[`h:${n}`]?.getBoundingClientRect();
      if (e.tablas.some((t) => !hr(t.n))) return;
      const limites = {};
      e.tablas.forEach((t) => {
        const r = hr(t.n);
        const c = colDe[t.n];
        const b = limites[c] || { l: 1e9, r: -1e9 };
        b.l = Math.min(b.l, r.left - o.left);
        b.r = Math.max(b.r, r.right - o.left);
        limites[c] = b;
      });
      const arriba = Math.min(...e.tablas.map((t) => hr(t.n).top)) - o.top;
      const gapX = (g) => (limites[g + 1] ? (limites[g].r + limites[g + 1].l) / 2 : limites[g].r + 22);
      const items = [];
      for (const t of e.tablas) {
        for (const c of t.f) {
          if (c.k !== "fk" || c.to === t.n) continue;
          const dest = e.tablas.find((x) => x.n === c.to);
          const pk = dest?.f.find((x) => x.k === "pk");
          const ra = refs.current[`${t.n}.${c.c}`]?.getBoundingClientRect();
          const rb = refs.current[`${c.to}.${pk?.c}`]?.getBoundingClientRect();
          if (!ra || !rb) continue;
          items.push({ k: `${t.n}.${c.c}`, ra, rb, sc: colDe[t.n], tc: colDe[c.to] });
        }
      }
      const gapsDe = (it) => {
        if (it.sc === it.tc) return [it.sc];
        if (Math.abs(it.sc - it.tc) === 1) return [Math.min(it.sc, it.tc)];
        return it.tc > it.sc ? [it.sc, it.tc - 1] : [it.sc - 1, it.tc];
      };
      const carriles = {};
      items.forEach((it) => gapsDe(it).forEach((g) => { (carriles[g] = carriles[g] || []).push(it); }));
      const lane = (g, it) => gapX(g) + (carriles[g].indexOf(it) - (carriles[g].length - 1) / 2) * 9;
      const largas = items.filter((it) => Math.abs(it.sc - it.tc) > 1);
      const out = items.map((it) => {
        const { ra, rb, sc, tc } = it;
        const y1 = ra.top + ra.height / 2 - o.top;
        const y2 = rb.top + rb.height / 2 - o.top;
        let pts;
        if (sc === tc) {
          const lx = lane(sc, it);
          pts = [[ra.right - o.left, y1], [lx, y1], [lx, y2], [rb.right - o.left + 2, y2]];
        } else {
          const der = tc > sc;
          const x1 = (der ? ra.right : ra.left) - o.left;
          const x2 = (der ? rb.left - 2 : rb.right + 2) - o.left;
          if (Math.abs(sc - tc) === 1) {
            const lx = lane(Math.min(sc, tc), it);
            pts = Math.abs(y1 - y2) < 2 ? [[x1, y1], [x2, y2]] : [[x1, y1], [lx, y1], [lx, y2], [x2, y2]];
          } else {
            const [gs, gt] = gapsDe(it);
            const yt = arriba - 14 - largas.indexOf(it) * 9;
            pts = [[x1, y1], [lane(gs, it), y1], [lane(gs, it), yt], [lane(gt, it), yt], [lane(gt, it), y2], [x2, y2]];
          }
        }
        return { k: it.k, d: pts.map((q, j) => `${j ? "L" : "M"}${q[0]} ${q[1]}`).join(" "), x: pts[0][0], y: pts[0][1] };
      });
      setLineas(out);
    };
    calcular();
    const ro = new ResizeObserver(calcular);
    ro.observe(box.current);
    return () => ro.disconnect();
  }, [i, e]);

  const total = e.tablas.length;
  const mongo = e.motor === "MongoDB Atlas";
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
          {e.tablas.map((t, k) => {
            const [c, r] = pos(t, k, e.cols);
            return (
              <div className="tb" key={t.n} style={{ gridColumn: c + 1, gridRow: r + 1 }}>
                <div className="tb-h" ref={(el) => (refs.current[`h:${t.n}`] = el)}>{t.n}</div>
                {t.f.map((x) => (
                  <div className={`tb-r ${x.k || ""}`} key={x.c} ref={(el) => (refs.current[`${t.n}.${x.c}`] = el)}>
                    <span className="m">{x.k === "pk" ? "PK" : x.k === "fk" ? "FK" : x.k === "ext" ? "↗" : ""}</span>
                    <span className="cn">{x.c}</span>
                    {x.k === "ext" && <em>{x.to}</em>}
                    {x.k === "fk" && x.to === t.n && <em>{x.to}</em>}
                  </div>
                ))}
                {t.mas > 0 && <div className="tb-m">+ {t.mas} {t.mas === 1 ? "columna" : "columnas"} más</div>}
              </div>
            );
          })}
          <svg className="erd-svg" aria-hidden="true">
            <defs><marker id="erd-fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--warning)" /></marker></defs>
            {lineas.map((l) => (
              <g key={l.k}>
                <path d={l.d} markerEnd="url(#erd-fl)" />
                <circle cx={l.x} cy={l.y} r="3" />
              </g>
            ))}
          </svg>
        </div>
        <p className="erd-note">{total} {mongo ? (total === 1 ? "colección propia" : "colecciones propias") : total === 1 ? "tabla propia" : "tablas propias"}. Lo que apunta a otro servicio no es una clave foránea: se resuelve por API o por eventos.</p>
      </div>
    </div>
  );
}
