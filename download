import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
// Based on: Linear App + Vercel Dashboard + Apple HIG
// Font: Inter (legibility champion at all sizes)
// Touch targets: min 48px (Apple HIG / Material You standard)
// Thumb zone: primary actions bottom-center, secondary top
// Spacing scale: 4-8-12-16-20-24-32-48

const C = {
  // Brand
  orange:     "#f97316",
  orangeHover:"#fb923c",
  orangeDim:  "rgba(249,115,22,0.15)",
  orangeGlow: "rgba(249,115,22,0.25)",
  // Neutrals
  bg:         "#0a0a0f",
  surface0:   "#111118",
  surface1:   "#16161f",
  surface2:   "#1c1c28",
  border:     "rgba(255,255,255,0.08)",
  borderHover:"rgba(249,115,22,0.35)",
  // Text
  text1:      "#f1f5f9",   // primary
  text2:      "#94a3b8",   // secondary
  text3:      "#475569",   // disabled/hint
  // Semantic
  danger:     "#f43f5e",
  dangerDim:  "rgba(244,63,94,0.15)",
  success:    "#10b981",
  successDim: "rgba(16,185,129,0.15)",
  warn:       "#f59e0b",
  warnDim:    "rgba(245,158,11,0.15)",
};

// Typography system (Inter - used by Linear, Vercel, Figma)
const TY = {
  h1:   { fontFamily:"'Inter',sans-serif", fontSize:24, fontWeight:700, letterSpacing:-0.5, lineHeight:1.2 },
  h2:   { fontFamily:"'Inter',sans-serif", fontSize:18, fontWeight:600, letterSpacing:-0.3, lineHeight:1.3 },
  h3:   { fontFamily:"'Inter',sans-serif", fontSize:15, fontWeight:600, letterSpacing:-0.2, lineHeight:1.4 },
  body: { fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:400, lineHeight:1.5 },
  sm:   { fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:400, lineHeight:1.4 },
  xs:   { fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:500, lineHeight:1.3 },
  label:{ fontFamily:"'Inter',sans-serif", fontSize:11, fontWeight:600, letterSpacing:0.5, textTransform:"uppercase" },
};

const PRIORITIES = {
  alta:  { label:"Alta",  color:C.danger,  bg:C.dangerDim,  icon:"●" },
  media: { label:"Media", color:C.warn,    bg:C.warnDim,    icon:"●" },
  baja:  { label:"Baja",  color:C.success, bg:C.successDim, icon:"●" },
};
const STATUS_ORDER = ["pendiente","en progreso","completado"];
const STATUS = {
  pendiente:     { label:"Pendiente",   icon:"○", color:C.text3 },
  "en progreso": { label:"En Progreso", icon:"◑", color:C.warn },
  completado:    { label:"Completado",  icon:"●", color:C.success },
};
const FILE_ICONS = {
  pdf:"📄", doc:"📝", docx:"📝", xls:"📊", xlsx:"📊",
  dwg:"📐", dxf:"📐", dwf:"📐", ppt:"📊", pptx:"📊",
  txt:"📃", csv:"📊", zip:"🗜", rar:"🗜", default:"📁"
};
const AUTOCAD_EXTS = ["dwg","dxf","dwf","dws","dwt"];
const TAGS_PRESET = ["Urgente","Reunión","Presupuesto","Legal","Diseño","Técnico","Cliente","Interno","Planos","Obra"];
const EMPTY_TASK    = { text:"", dueDate:"", dueTime:"", priority:"media", images:[], files:[], tags:[], notes:"" };
const EMPTY_PROJECT = { name:"", description:"", category:"", tags:[], contacts:[], tasks:[], files:[] };
const EMPTY_CONTACT = { name:"", phone:"", email:"", role:"" };

function id()    { return Date.now().toString(36)+Math.random().toString(36).slice(2); }
function days(d) { if(!d) return null; const t=new Date(); t.setHours(0,0,0,0); return Math.round((new Date(d+"T00:00:00")-t)/86400000); }
function b64(f)  { return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(f); }); }
function fmt(b)  { return b<1048576?`${(b/1024).toFixed(0)}KB`:`${(b/1048576).toFixed(1)}MB`; }
function gcal(task,proj) {
  if(!task.dueDate) return null;
  const d=task.dueDate.replace(/-/g,"");
  let dates;
  if(task.dueTime){ const[h,m]=task.dueTime.split(":"); dates=`${d}T${h}${m}00/${d}T${String(+h+1).padStart(2,"0")}${m}00`; }
  else dates=`${d}/${d}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`[${proj}] ${task.text}`)}&dates=${dates}&details=${encodeURIComponent(task.notes||"")}`;
}

// ─── BACKGROUND ─────────────────────────────────────────────────────────────
function Background() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, background:C.bg, overflow:"hidden" }}>
      {/* Subtle gradient mesh - inspired by Linear's approach */}
      <div style={{ position:"absolute", top:-200, left:-200, width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-100, right:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)", pointerEvents:"none" }}/>
      {/* SVG Skyline - subtle, low contrast */}
      <svg style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%", opacity:0.18 }} viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        {/* Skyline silhouette */}
        <path d="M0,320 L0,200 L40,200 L40,160 L60,160 L60,140 L80,140 L80,100 L100,100 L100,80 L120,80 L120,120 L140,120 L140,90 L160,90 L160,130 L180,130 L180,70 L200,70 L200,50 L220,50 L220,70 L240,70 L240,110 L260,110 L260,60 L280,60 L280,40 L300,40 L300,60 L320,60 L320,100 L340,100 L340,50 L360,50 L360,30 L380,30 L380,50 L400,50 L400,80 L420,80 L420,40 L440,40 L440,20 L460,20 L460,40 L480,40 L480,70 L500,70 L500,30 L520,30 L520,10 L540,10 L540,30 L560,30 L560,60 L580,60 L580,20 L600,20 L600,0 L620,0 L620,20 L640,20 L640,50 L660,50 L660,30 L680,30 L680,60 L700,60 L700,40 L720,40 L720,70 L740,70 L740,50 L760,50 L760,80 L780,80 L780,40 L800,40 L800,20 L820,20 L820,40 L840,40 L840,70 L860,70 L860,50 L880,50 L880,90 L900,90 L900,60 L920,60 L920,100 L940,100 L940,70 L960,70 L960,110 L980,110 L980,80 L1000,80 L1000,120 L1020,120 L1020,90 L1040,90 L1040,130 L1060,130 L1060,100 L1080,100 L1080,140 L1100,140 L1100,110 L1120,110 L1120,150 L1140,150 L1140,120 L1160,120 L1160,160 L1180,160 L1180,130 L1200,130 L1200,170 L1220,170 L1220,140 L1240,140 L1240,180 L1260,180 L1260,150 L1280,150 L1280,190 L1300,190 L1300,160 L1320,160 L1320,200 L1340,200 L1360,200 L1440,200 L1440,320 Z" fill="url(#bldg)"/>
        {/* Windows */}
        {[120,200,280,360,440,520,600,680,760,840,920,1000,1080,1160,1240].map((x,i)=>(
          <g key={i}>
            <rect x={x+5} y={90+(i%3)*20} width={8} height={6} fill="#f97316" opacity={0.5+((i*31)%40)/100}/>
            <rect x={x+18} y={95+(i%2)*15} width={8} height={6} fill="#fbbf24" opacity={0.4+((i*17)%50)/100}/>
            <rect x={x+5} y={115+(i%3)*18} width={8} height={6} fill="#f97316" opacity={0.3+((i*43)%60)/100}/>
          </g>
        ))}
      </svg>
      {/* Noise texture overlay */}
      <div style={{ position:"absolute", inset:0, opacity:0.015, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}/>
    </div>
  );
}

// ─── ATOMS ──────────────────────────────────────────────────────────────────
function DueBadge({ dateStr }) {
  if(!dateStr) return null;
  const d=days(dateStr);
  let color=C.success, bg=C.successDim, text=`${d}d`;
  if(d<0)   { color=C.danger;  bg=C.dangerDim;  text=`${Math.abs(d)}d venc.`; }
  else if(d===0){ color=C.danger;  bg=C.dangerDim;  text="¡Hoy!"; }
  else if(d<=3) { color=C.warn;    bg=C.warnDim; }
  return (
    <span style={{ ...TY.xs, color, background:bg, borderRadius:6, padding:"2px 7px", border:`1px solid ${color}33`, display:"inline-flex", alignItems:"center" }}>
      {text}
    </span>
  );
}

function Tag({ tag, onRemove }) {
  return (
    <span style={{ ...TY.xs, color:C.orange, background:C.orangeDim, borderRadius:6, padding:"3px 8px", border:`1px solid rgba(249,115,22,0.25)`, display:"inline-flex", alignItems:"center", gap:4 }}>
      #{tag}
      {onRemove&&<span onClick={e=>{e.stopPropagation();onRemove(tag);}} style={{ cursor:"pointer", opacity:0.6, fontSize:13, lineHeight:1 }}>×</span>}
    </span>
  );
}

// ─── LIGHTBOX ───────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(()=>{ const h=e=>e.key==="Escape"&&onClose(); window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h); },[onClose]);
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img src={src} alt="" style={{ maxWidth:"92vw", maxHeight:"88vh", borderRadius:16, objectFit:"contain" }} onClick={e=>e.stopPropagation()}/>
      <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.12)", border:"none", color:"#fff", fontSize:20, cursor:"pointer", borderRadius:50, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
    </div>
  );
}

// ─── IMAGE STRIP ────────────────────────────────────────────────────────────
function ImageStrip({ images=[], onAdd, onRemove }) {
  const ref=useRef(); const[lb,setLb]=useState(null);
  const handle=async fs=>{ const out=[]; for(const f of Array.from(fs)){ if(!f.type.startsWith("image/")) continue; if(f.size>5*1024*1024){alert("Máx 5MB");continue;} out.push({id:id(),data:await b64(f),name:f.name}); } if(out.length) onAdd(out); };
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {lb&&<Lightbox src={lb} onClose={()=>setLb(null)}/>}
      {images.map(img=>(
        <div key={img.id} style={{ position:"relative", width:64, height:64, borderRadius:10, overflow:"hidden", border:`1px solid ${C.border}` }}>
          <img src={img.data} alt={img.name} onClick={()=>setLb(img.data)} style={{ width:"100%", height:"100%", objectFit:"cover", cursor:"zoom-in" }}/>
          {onRemove&&<button onClick={e=>{e.stopPropagation();onRemove(img.id);}} style={{ position:"absolute", top:3, right:3, background:"rgba(0,0,0,0.75)", border:"none", color:"#fff", borderRadius:50, width:20, height:20, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>}
        </div>
      ))}
      <button onClick={()=>ref.current?.click()} style={{ width:64, height:64, borderRadius:10, border:`1.5px dashed ${C.border}`, background:"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, color:C.text3, fontSize:10, fontFamily:"Inter,sans-serif" }}>
        <span style={{fontSize:20}}>🖼</span><span>Foto</span>
      </button>
      <input ref={ref} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{handle(e.target.files);e.target.value="";}}/>
    </div>
  );
}

// ─── FILE STRIP ─────────────────────────────────────────────────────────────
function FileStrip({ files=[], onAdd, onRemove }) {
  const ref=useRef();
  const handle=async fl=>{ const out=[]; for(const f of Array.from(fl)){ if(f.size>25*1024*1024){alert("Máx 25MB");continue;} const ext=f.name.split(".").pop().toLowerCase(); out.push({id:id(),data:await b64(f),name:f.name,ext,size:f.size}); } if(out.length) onAdd(out); };
  return (
    <div>
      {files.map(f=>{
        const isCAD=AUTOCAD_EXTS.includes(f.ext);
        return (
          <div key={f.id} style={{ display:"flex", alignItems:"center", gap:10, background:C.surface1, borderRadius:10, padding:"10px 12px", border:`1px solid ${isCAD?C.borderHover:C.border}`, marginBottom:6 }}>
            <span style={{fontSize:20, flexShrink:0}}>{FILE_ICONS[f.ext]||FILE_ICONS.default}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ ...TY.sm, color:isCAD?C.orange:C.text1, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.name}</div>
              <div style={{ ...TY.xs, color:C.text3, marginTop:1 }}>{fmt(f.size)}{isCAD&&<span style={{ color:C.orange, marginLeft:6, fontWeight:600 }}>AutoCAD</span>}</div>
            </div>
            <a href={f.data} download={f.name} style={{ color:C.orange, fontSize:16, textDecoration:"none", padding:"6px", minWidth:32, minHeight:32, display:"flex", alignItems:"center", justifyContent:"center" }}>⬇</a>
            {onRemove&&<button onClick={()=>onRemove(f.id)} style={{ background:"transparent", border:"none", color:C.text3, cursor:"pointer", fontSize:18, padding:"6px", minWidth:32, minHeight:32, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>}
          </div>
        );
      })}
      <button onClick={()=>ref.current?.click()} style={{ display:"flex", alignItems:"center", gap:8, background:"transparent", border:`1.5px dashed ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text2, fontSize:13, cursor:"pointer", width:"100%", fontFamily:"Inter,sans-serif" }}>
        <span>📁</span><span>Adjuntar archivo — PDF, Word, Excel, AutoCAD…</span>
      </button>
      <input ref={ref} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.dwg,.dxf,.dwf,.dws,.dwt,image/*" multiple style={{display:"none"}} onChange={e=>{handle(e.target.files);e.target.value="";}}/>
    </div>
  );
}

// ─── TAG INPUT ──────────────────────────────────────────────────────────────
function TagInput({ tags=[], onChange }) {
  const[input,setInput]=useState("");
  const add=t=>{ const v=t.trim().replace(/^#/,""); if(v&&!tags.includes(v)) onChange([...tags,v]); setInput(""); };
  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
        {tags.map(t=><Tag key={t} tag={t} onRemove={v=>onChange(tags.filter(x=>x!==v))}/>)}
      </div>
      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"||e.key===","){ e.preventDefault(); add(input); }}} placeholder="Escribe + Enter"
        style={{ width:"100%", background:C.surface1, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", fontSize:13, color:C.text1, outline:"none", fontFamily:"Inter,sans-serif" }}/>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
        {TAGS_PRESET.filter(t=>!tags.includes(t)).map(t=>(
          <button key={t} onClick={()=>add(t)} style={{ background:C.surface1, border:`1px solid ${C.border}`, borderRadius:6, padding:"4px 10px", fontSize:11, color:C.text2, cursor:"pointer", fontFamily:"Inter,sans-serif" }}>+{t}</button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const[projects,setProjects]       =useState([]);
  const[loaded,setLoaded]           =useState(false);
  const[activeProj,setActiveProj]   =useState(null);
  const[showAdd,setShowAdd]         =useState(false);
  const[newProj,setNewProj]         =useState(EMPTY_PROJECT);
  const[newTask,setNewTask]         =useState(EMPTY_TASK);
  const[addingTask,setAddingTask]   =useState(null);
  const[fStatus,setFStatus]         =useState("todos");
  const[fTag,setFTag]               =useState("");
  const[editTask,setEditTask]       =useState(null);
  const[notif,setNotif]             =useState(null);
  const[search,setSearch]           =useState("");
  const[tab,setTab]                 =useState("tareas");
  const[newContact,setNewContact]   =useState(EMPTY_CONTACT);
  const[addingContact,setAddingContact]=useState(false);
  const[taskSort,setTaskSort]       =useState("prioridad");
  const importRef=useRef();

  // ── Storage: migrate v1/v2 → v3 ──
  useEffect(()=>{
    (async()=>{
      try{
        let r=await window.storage.get("projects-v3").catch(()=>null);
        if(r?.value){ setProjects(JSON.parse(r.value)); setLoaded(true); return; }
        r=await window.storage.get("projects-v2").catch(()=>null);
        if(r?.value){ const d=JSON.parse(r.value); setProjects(d); await window.storage.set("projects-v3",JSON.stringify(d)).catch(()=>{}); setLoaded(true); return; }
        r=await window.storage.get("projects-v1").catch(()=>null);
        if(r?.value){ const d=JSON.parse(r.value); setProjects(d); await window.storage.set("projects-v3",JSON.stringify(d)).catch(()=>{}); setLoaded(true); return; }
      }catch{}
      setLoaded(true);
    })();
  },[]);
  useEffect(()=>{ if(!loaded) return; window.storage.set("projects-v3",JSON.stringify(projects)).catch(()=>{}); },[projects,loaded]);

  const notify=msg=>{ setNotif(msg); setTimeout(()=>setNotif(null),2600); };

  // Export / Import
  const exportData=()=>{
    const blob=new Blob([JSON.stringify({version:"v3",exportedAt:new Date().toISOString(),projects},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download=`proyectos-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
    notify("Respaldo exportado ✓");
  };
  const importData=e=>{
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{ try{ const p=JSON.parse(ev.target.result); const d=p.projects||(Array.isArray(p)?p:null); if(!d){alert("Archivo inválido");return;} if(!window.confirm(`¿Importar ${d.length} proyecto(s)?`)) return; setProjects(d); notify(`${d.length} proyecto(s) importado(s) ✓`); }catch{alert("Archivo inválido");} };
    r.readAsText(f); e.target.value="";
  };

  // CRUD
  const addProj=()=>{ if(!newProj.name.trim()) return; setProjects(p=>[...p,{id:id(),...newProj,tasks:[],files:[],contacts:[],createdAt:new Date().toISOString()}]); setNewProj(EMPTY_PROJECT); setShowAdd(false); notify("Proyecto creado ✓"); };
  const delProj=i=>{ setProjects(p=>p.filter(x=>x.id!==i)); setActiveProj(null); notify("Proyecto eliminado"); };
  const addTask=pid=>{ if(!newTask.text.trim()) return; setProjects(p=>p.map(pr=>pr.id===pid?{...pr,tasks:[...pr.tasks,{id:id(),...newTask,status:"pendiente",createdAt:new Date().toISOString()}]}:pr)); setNewTask(EMPTY_TASK); setAddingTask(null); notify("Tarea añadida ✓"); };
  const delTask=(pid,tid)=>{ setProjects(p=>p.map(pr=>pr.id===pid?{...pr,tasks:pr.tasks.filter(t=>t.id!==tid)}:pr)); notify("Tarea eliminada"); };
  const cycleStatus=(pid,tid,cur)=>{ const n=STATUS_ORDER[(STATUS_ORDER.indexOf(cur)+1)%3]; setProjects(p=>p.map(pr=>pr.id===pid?{...pr,tasks:pr.tasks.map(t=>t.id===tid?{...t,status:n}:t)}:pr)); };
  const saveEdit=pid=>{ setProjects(p=>p.map(pr=>pr.id===pid?{...pr,tasks:pr.tasks.map(t=>t.id===editTask.id?editTask:t)}:pr)); setEditTask(null); notify("Tarea actualizada ✓"); };
  const addImgs=(pid,tid,imgs)=>{ setProjects(p=>p.map(pr=>pr.id===pid?{...pr,tasks:pr.tasks.map(t=>t.id===tid?{...t,images:[...(t.images||[]),...imgs]}:t)}:pr)); notify("Foto(s) añadida(s) ✓"); };
  const delImg=(pid,tid,iid)=>setProjects(p=>p.map(pr=>pr.id===pid?{...pr,tasks:pr.tasks.map(t=>t.id===tid?{...t,images:(t.images||[]).filter(i=>i.id!==iid)}:t)}:pr));
  const addFiles=(pid,tid,fs)=>{ setProjects(p=>p.map(pr=>pr.id===pid?{...pr,tasks:pr.tasks.map(t=>t.id===tid?{...t,files:[...(t.files||[]),...fs]}:t)}:pr)); notify("Archivo(s) adjuntado(s) ✓"); };
  const delFile=(pid,tid,fid)=>setProjects(p=>p.map(pr=>pr.id===pid?{...pr,tasks:pr.tasks.map(t=>t.id===tid?{...t,files:(t.files||[]).filter(f=>f.id!==fid)}:t)}:pr));
  const addProjFiles=(pid,fs)=>{ setProjects(p=>p.map(pr=>pr.id===pid?{...pr,files:[...(pr.files||[]),...fs]}:pr)); notify("Archivo(s) añadido(s) ✓"); };
  const delProjFile=(pid,fid)=>setProjects(p=>p.map(pr=>pr.id===pid?{...pr,files:(pr.files||[]).filter(f=>f.id!==fid)}:pr));
  const addContact=pid=>{ if(!newContact.name.trim()) return; setProjects(p=>p.map(pr=>pr.id===pid?{...pr,contacts:[...(pr.contacts||[]),{id:id(),...newContact}]}:pr)); setNewContact(EMPTY_CONTACT); setAddingContact(false); notify("Contacto añadido ✓"); };
  const delContact=(pid,cid)=>setProjects(p=>p.map(pr=>pr.id===pid?{...pr,contacts:(pr.contacts||[]).filter(c=>c.id!==cid)}:pr));

  const prog=tasks=>!tasks.length?0:Math.round(tasks.filter(t=>t.status==="completado").length/tasks.length*100);
  const urgentCount=()=>{ let n=0; projects.forEach(p=>p.tasks.forEach(t=>{ if(t.status!=="completado"&&t.dueDate){ const d=days(t.dueDate); if(d!==null&&d<=2) n++; }})); return n; };
  const allTags=[...new Set(projects.flatMap(p=>[...(p.tags||[]),...p.tasks.flatMap(t=>t.tags||[])]))];

  const filtered=projects.filter(p=>{
    const q=search.toLowerCase();
    return (!q||p.name.toLowerCase().includes(q)||(p.description||"").toLowerCase().includes(q)||p.tasks.some(t=>t.text.toLowerCase().includes(q)))
      &&(fStatus==="todos"||(fStatus==="completado"?prog(p.tasks)===100&&p.tasks.length>0:prog(p.tasks)<100))
      &&(!fTag||(p.tags||[]).includes(fTag)||p.tasks.some(t=>(t.tags||[]).includes(fTag)));
  });

  const sorted=tasks=>{ const a=[...tasks];
    if(taskSort==="prioridad"){ const o={alta:0,media:1,baja:2}; a.sort((x,y)=>(o[x.priority]||1)-(o[y.priority]||1)); }
    else if(taskSort==="fecha"){ a.sort((x,y)=>{ if(!x.dueDate) return 1; if(!y.dueDate) return -1; return x.dueDate.localeCompare(y.dueDate); }); }
    else if(taskSort==="estado"){ a.sort((x,y)=>STATUS_ORDER.indexOf(x.status)-STATUS_ORDER.indexOf(y.status)); }
    return a;
  };

  const current=projects.find(p=>p.id===activeProj);
  const urgent=urgentCount();

  // Input base style
  const INP={ background:C.surface1, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", fontSize:14, color:C.text1, outline:"none", width:"100%", fontFamily:"Inter,sans-serif", transition:"border-color 0.15s" };
  const SEL={ ...INP, width:"auto", paddingRight:28 };

  return (
    <div style={{ fontFamily:"Inter,sans-serif", minHeight:"100vh", color:C.text1, position:"relative", display:"flex", flexDirection:"column" }}>
      <Background/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(249,115,22,0.3);border-radius:99px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
        .card{transition:transform 0.18s cubic-bezier(.2,.8,.2,1),border-color 0.18s,box-shadow 0.18s;cursor:pointer;}
        .card:hover{transform:translateY(-2px);border-color:rgba(249,115,22,0.3)!important;box-shadow:0 8px 32px rgba(249,115,22,0.08)!important;}
        .card:active{transform:scale(0.98);}
        .tap{transition:opacity 0.1s;} .tap:active{opacity:0.7;}
        input:focus,textarea:focus,select:focus{border-color:${C.orange}!important;box-shadow:0 0 0 3px ${C.orangeDim};}
        input::placeholder,textarea::placeholder{color:${C.text3};}
        select option{background:#111;}
        .pill{cursor:pointer;border:none;font-family:Inter,sans-serif;transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
        .pill:active{transform:scale(0.96);}
        .hs{overflow-x:auto;scrollbar-width:none;} .hs::-webkit-scrollbar{display:none;}
        .task-row:hover .task-act{opacity:1!important;}
      `}</style>

      {/* ── TOAST NOTIFICATION ── */}
      {notif&&(
        <div style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", background:C.surface2, color:C.text1, padding:"10px 20px", borderRadius:99, fontSize:13, fontWeight:600, zIndex:9999, boxShadow:"0 8px 32px rgba(0,0,0,0.4)", border:`1px solid ${C.border}`, animation:"fadeIn 0.2s", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:C.orange }}>✓</span> {notif}
        </div>
      )}

      {/* ══════════════════════════════════════════
          TOP NAV — sticky, shows project pills
      ══════════════════════════════════════════ */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(10,10,15,0.92)", backdropFilter:"blur(24px)", borderBottom:`1px solid ${C.border}` }}>
        {/* App title row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px 10px" }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
            <span style={{ ...TY.h2, color:C.text1 }}>Proyectos</span>
            <span style={{ ...TY.xs, color:C.text3 }}>{projects.length} total</span>
          </div>
          {urgent>0
            ? <span style={{ ...TY.xs, color:C.danger, background:C.dangerDim, padding:"4px 10px", borderRadius:99, border:`1px solid ${C.danger}33`, fontWeight:700 }}>⚠ {urgent} urgente{urgent>1?"s":""}</span>
            : <span style={{ ...TY.xs, color:C.success, background:C.successDim, padding:"4px 10px", borderRadius:99, border:`1px solid ${C.success}33` }}>✓ Al día</span>
          }
        </div>
        {/* Project pills — horizontal scroll */}
        <div className="hs" style={{ display:"flex", gap:8, padding:"0 16px 12px" }}>
          {projects.map(p=>{
            const pct=prog(p.tasks);
            const isAct=activeProj===p.id;
            const isUrg=p.tasks.filter(t=>t.status!=="completado").some(t=>t.dueDate&&days(t.dueDate)!==null&&days(t.dueDate)<=2);
            return (
              <button key={p.id} className="pill tap"
                onClick={()=>{ setActiveProj(p.id); setTab("tareas"); }}
                style={{ flexShrink:0, minHeight:36, background:isAct?C.orange:C.surface1, color:isAct?"#000":C.text2, borderRadius:99, padding:"0 14px", fontSize:13, fontWeight:isAct?700:500, border:`1px solid ${isAct?"transparent":isUrg?"rgba(244,63,94,0.4)":C.border}`, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
                {isUrg&&!isAct&&<span style={{fontSize:10,color:C.danger}}>⚠</span>}
                {p.name}
                <span style={{ fontSize:10, opacity:0.65, background:isAct?"rgba(0,0,0,0.2)":C.surface2, borderRadius:99, padding:"1px 6px" }}>{pct}%</span>
              </button>
            );
          })}
          {projects.length===0&&<span style={{ ...TY.sm, color:C.text3, padding:"8px 0", whiteSpace:"nowrap" }}>Sin proyectos aún…</span>}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div style={{ position:"relative", zIndex:1, flex:1, maxWidth:1080, width:"100%", margin:"0 auto", padding:"20px 16px 16px" }}>

        {/* Search + filter bar */}
        <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, minWidth:160 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.text3, fontSize:16, pointerEvents:"none" }}>⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar…"
              style={{ ...INP, paddingLeft:36, borderRadius:99, height:44 }}/>
          </div>
          <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{ ...SEL, height:44, borderRadius:99 }}>
            <option value="todos">Todos</option>
            <option value="pendiente">En curso</option>
            <option value="completado">Completados</option>
          </select>
          {allTags.length>0&&(
            <select value={fTag} onChange={e=>setFTag(e.target.value)} style={{ ...SEL, height:44, borderRadius:99 }}>
              <option value="">Etiqueta…</option>
              {allTags.map(t=><option key={t} value={t}>#{t}</option>)}
            </select>
          )}
          {(search||fTag)&&(
            <button className="pill tap" onClick={()=>{setSearch("");setFTag("");}} style={{ height:44, padding:"0 16px", background:C.surface1, color:C.text2, border:`1px solid ${C.border}`, borderRadius:99, fontSize:13 }}>✕</button>
          )}
        </div>

        {/* ── ADD PROJECT MODAL ── */}
        {showAdd&&(
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(8px)" }}
            onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
            <div style={{ background:C.surface0, borderRadius:"24px 24px 0 0", padding:"8px 0 32px", width:"100%", maxWidth:640, maxHeight:"90vh", overflowY:"auto", border:`1px solid ${C.border}`, borderBottom:"none", animation:"fadeUp 0.25s cubic-bezier(.2,.8,.2,1)", boxShadow:"0 -24px 80px rgba(0,0,0,0.5)" }}>
              {/* Handle */}
              <div style={{ width:36, height:4, background:C.border, borderRadius:99, margin:"12px auto 20px" }}/>
              <div style={{ padding:"0 20px" }}>
                <div style={{ ...TY.h2, color:C.text1, marginBottom:20 }}>Nuevo Proyecto</div>
                <input placeholder="Nombre del proyecto *" value={newProj.name} onChange={e=>setNewProj(p=>({...p,name:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&addProj()} autoFocus style={{ ...INP, marginBottom:10 }}/>
                <textarea placeholder="Descripción (opcional)" value={newProj.description} onChange={e=>setNewProj(p=>({...p,description:e.target.value}))}
                  rows={2} style={{ ...INP, resize:"none", marginBottom:10 }}/>
                <input placeholder="Categoría (ej. Construcción, Legal…)" value={newProj.category} onChange={e=>setNewProj(p=>({...p,category:e.target.value}))}
                  style={{ ...INP, marginBottom:14 }}/>
                <div style={{ marginBottom:20 }}>
                  <div style={{ ...TY.label, color:C.text3, marginBottom:8 }}>Etiquetas</div>
                  <TagInput tags={newProj.tags||[]} onChange={tags=>setNewProj(p=>({...p,tags}))}/>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button className="pill tap" onClick={()=>setShowAdd(false)} style={{ flex:1, height:52, background:C.surface2, color:C.text2, borderRadius:14, fontSize:15, fontWeight:600, border:`1px solid ${C.border}` }}>Cancelar</button>
                  <button className="pill tap" onClick={addProj} style={{ flex:2, height:52, background:C.orange, color:"#000", borderRadius:14, fontSize:15, fontWeight:700, boxShadow:`0 4px 20px ${C.orangeGlow}` }}>Crear Proyecto</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECT DETAIL SHEET ── */}
        {current&&(
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(8px)" }}
            onClick={e=>e.target===e.currentTarget&&setActiveProj(null)}>
            <div style={{ background:C.surface0, borderRadius:"24px 24px 0 0", width:"100%", maxWidth:680, maxHeight:"92vh", overflowY:"auto", border:`1px solid ${C.border}`, borderBottom:"none", animation:"fadeUp 0.25s cubic-bezier(.2,.8,.2,1)", boxShadow:"0 -24px 80px rgba(0,0,0,0.6)", display:"flex", flexDirection:"column" }}>
              {/* Handle + close */}
              <div style={{ flexShrink:0, padding:"12px 20px 0", display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:36, height:4, background:C.border, borderRadius:99, marginBottom:16 }}/>
              </div>

              {/* Modal header sticky */}
              <div style={{ position:"sticky", top:0, background:C.surface0, zIndex:10, padding:"0 20px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", paddingBottom:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ ...TY.h2, color:C.text1 }}>{current.name}</div>
                    {current.description&&<div style={{ ...TY.sm, color:C.text2, marginTop:3 }}>{current.description}</div>}
                    {current.category&&<div style={{ ...TY.xs, color:C.orange, marginTop:4 }}>📁 {current.category}</div>}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>{(current.tags||[]).map(t=><Tag key={t} tag={t}/>)}</div>
                  </div>
                  <button className="tap" onClick={()=>setActiveProj(null)} style={{ background:C.surface2, border:`1px solid ${C.border}`, color:C.text2, borderRadius:99, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:18, flexShrink:0, marginLeft:12, marginTop:2 }}>✕</button>
                </div>
                {/* Progress */}
                <div style={{ paddingBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ ...TY.xs, color:C.text3 }}>{current.tasks.filter(t=>t.status==="completado").length}/{current.tasks.length} completadas</span>
                    <span style={{ ...TY.xs, color:prog(current.tasks)===100?C.success:C.orange, fontWeight:700 }}>{prog(current.tasks)}%</span>
                  </div>
                  <div style={{ background:C.surface2, borderRadius:99, height:5 }}>
                    <div style={{ background:prog(current.tasks)===100?C.success:C.orange, borderRadius:99, height:5, width:`${prog(current.tasks)}%`, transition:"width 0.5s cubic-bezier(.2,.8,.2,1)", boxShadow:prog(current.tasks)>0?`0 0 8px ${C.orangeGlow}`:undefined }}/>
                  </div>
                </div>
                {/* Tabs */}
                <div style={{ display:"flex", gap:4, paddingBottom:14 }}>
                  {[["tareas","📋 Tareas"],["archivos","📁 Archivos"],["contactos","👤 Contactos"]].map(([k,v])=>(
                    <button key={k} className="pill tap" onClick={()=>setTab(k)}
                      style={{ height:36, padding:"0 14px", background:tab===k?C.orange:C.surface1, color:tab===k?"#000":C.text2, borderRadius:99, fontSize:13, fontWeight:tab===k?700:500, border:`1px solid ${tab===k?"transparent":C.border}` }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── TAB: TAREAS ── */}
              {tab==="tareas"&&(
                <div style={{ padding:"16px 20px", flex:1 }}>
                  {/* Sort chips */}
                  <div style={{ display:"flex", gap:6, marginBottom:16, alignItems:"center" }}>
                    <span style={{ ...TY.xs, color:C.text3 }}>Ordenar:</span>
                    {[["prioridad","Prioridad"],["fecha","Fecha"],["estado","Estado"]].map(([k,v])=>(
                      <button key={k} className="pill tap" onClick={()=>setTaskSort(k)}
                        style={{ height:30, padding:"0 12px", background:taskSort===k?C.orangeDim:C.surface1, color:taskSort===k?C.orange:C.text3, borderRadius:99, fontSize:12, fontWeight:taskSort===k?600:400, border:`1px solid ${taskSort===k?C.orange+"55":C.border}` }}>
                        {v}
                      </button>
                    ))}
                  </div>

                  {current.tasks.length===0&&<div style={{ textAlign:"center", color:C.text3, ...TY.body, padding:"40px 0" }}>Sin tareas. ¡Agrega la primera!</div>}

                  {sorted(current.tasks).map(task=>(
                    <div key={task.id} className="task-row" style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:14, marginBottom:14 }}>
                      {editTask?.id===task.id?(
                        // ── EDIT FORM ──
                        <div style={{ background:C.surface1, borderRadius:14, padding:16, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:10 }}>
                          <input value={editTask.text} onChange={e=>setEditTask(t=>({...t,text:e.target.value}))} style={INP}/>
                          <textarea value={editTask.notes||""} onChange={e=>setEditTask(t=>({...t,notes:e.target.value}))} placeholder="Notas…" rows={2} style={{ ...INP, resize:"none" }}/>
                          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                            <div style={{ flex:1, minWidth:120 }}><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Fecha</div><input type="date" value={editTask.dueDate||""} onChange={e=>setEditTask(t=>({...t,dueDate:e.target.value}))} style={{ ...INP, height:44 }}/></div>
                            <div style={{ flex:1, minWidth:100 }}><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Hora</div><input type="time" value={editTask.dueTime||""} onChange={e=>setEditTask(t=>({...t,dueTime:e.target.value}))} style={{ ...INP, height:44 }}/></div>
                            <div style={{ flex:1, minWidth:120 }}><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Prioridad</div>
                              <select value={editTask.priority} onChange={e=>setEditTask(t=>({...t,priority:e.target.value}))} style={{ ...INP, height:44 }}>
                                {Object.entries(PRIORITIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                              </select></div>
                          </div>
                          <div><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Etiquetas</div><TagInput tags={editTask.tags||[]} onChange={tags=>setEditTask(t=>({...t,tags}))}/></div>
                          <div><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Fotos</div><ImageStrip images={editTask.images||[]} onAdd={imgs=>setEditTask(t=>({...t,images:[...(t.images||[]),...imgs]}))} onRemove={iid=>setEditTask(t=>({...t,images:(t.images||[]).filter(i=>i.id!==iid)}))} /></div>
                          <div><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Archivos</div><FileStrip files={editTask.files||[]} onAdd={fs=>setEditTask(t=>({...t,files:[...(t.files||[]),...fs]}))} onRemove={fid=>setEditTask(t=>({...t,files:(t.files||[]).filter(f=>f.id!==fid)}))} /></div>
                          <div style={{ display:"flex", gap:8 }}>
                            <button className="pill tap" onClick={()=>setEditTask(null)} style={{ flex:1, height:48, background:C.surface2, color:C.text2, borderRadius:12, fontSize:14, fontWeight:600, border:`1px solid ${C.border}` }}>Cancelar</button>
                            <button className="pill tap" onClick={()=>saveEdit(current.id)} style={{ flex:2, height:48, background:C.orange, color:"#000", borderRadius:12, fontSize:14, fontWeight:700 }}>Guardar</button>
                          </div>
                        </div>
                      ):(
                        // ── VIEW MODE ──
                        <>
                          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                            {/* Status toggle — 44px touch target */}
                            <button className="tap" onClick={()=>cycleStatus(current.id,task.id,task.status)}
                              style={{ width:44, height:44, background:"transparent", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:99, flexShrink:0, fontSize:22, color:STATUS[task.status].color, marginTop:-2 }}
                              title={STATUS[task.status].label}>
                              {STATUS[task.status].icon}
                            </button>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ ...TY.h3, color:task.status==="completado"?C.text3:C.text1, textDecoration:task.status==="completado"?"line-through":"none", lineHeight:1.4 }}>{task.text}</div>
                              {task.notes&&<div style={{ ...TY.sm, color:C.text2, marginTop:4, lineHeight:1.5 }}>{task.notes}</div>}
                              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8, alignItems:"center" }}>
                                <span style={{ ...TY.xs, color:PRIORITIES[task.priority].color, background:PRIORITIES[task.priority].bg, borderRadius:6, padding:"3px 8px", fontWeight:600 }}>
                                  {PRIORITIES[task.priority].icon} {PRIORITIES[task.priority].label}
                                </span>
                                <DueBadge dateStr={task.dueDate}/>
                                {task.dueTime&&<span style={{ ...TY.xs, color:C.text3 }}>🕐 {task.dueTime}</span>}
                                {(task.images||[]).length>0&&<span style={{ ...TY.xs, color:C.text3 }}>🖼 {task.images.length}</span>}
                                {(task.files||[]).length>0&&<span style={{ ...TY.xs, color:C.text3 }}>📁 {task.files.length}</span>}
                                {(task.files||[]).some(f=>AUTOCAD_EXTS.includes(f.ext))&&<span style={{ ...TY.xs, color:C.orange, fontWeight:700 }}>📐 CAD</span>}
                                {(task.tags||[]).map(tg=><Tag key={tg} tag={tg}/>)}
                              </div>
                            </div>
                            {/* Action buttons — always visible on mobile (no hover) */}
                            <div className="task-act" style={{ display:"flex", flexDirection:"column", gap:4, opacity:1, flexShrink:0 }}>
                              {task.dueDate&&(
                                <a href={gcal(task,current.name)} target="_blank" rel="noreferrer"
                                  style={{ width:36, height:36, background:C.surface1, border:`1px solid ${C.border}`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", fontSize:16 }} title="Google Calendar">📅</a>
                              )}
                              <button className="tap" onClick={()=>setEditTask({...task,images:task.images||[],files:task.files||[],tags:task.tags||[]})}
                                style={{ width:36, height:36, background:C.surface1, border:`1px solid ${C.border}`, borderRadius:10, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>✏️</button>
                              <button className="tap" onClick={()=>delTask(current.id,task.id)}
                                style={{ width:36, height:36, background:C.dangerDim, border:`1px solid ${C.danger}33`, borderRadius:10, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>🗑</button>
                            </div>
                          </div>
                          {/* Attachments preview */}
                          {((task.images||[]).length>0||(task.files||[]).length>0)&&(
                            <div style={{ paddingLeft:56, marginTop:10, display:"flex", flexDirection:"column", gap:8 }}>
                              {(task.images||[]).length>0&&<ImageStrip images={task.images} onAdd={imgs=>addImgs(current.id,task.id,imgs)} onRemove={iid=>delImg(current.id,task.id,iid)}/>}
                              {(task.files||[]).length>0&&<FileStrip files={task.files} onAdd={fs=>addFiles(current.id,task.id,fs)} onRemove={fid=>delFile(current.id,task.id,fid)}/>}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  {/* Add task form */}
                  {addingTask===current.id?(
                    <div style={{ background:C.surface1, borderRadius:14, padding:16, border:`1px solid ${C.orangeGlow}`, display:"flex", flexDirection:"column", gap:10 }}>
                      <input placeholder="¿Qué hay que hacer? *" value={newTask.text} onChange={e=>setNewTask(t=>({...t,text:e.target.value}))}
                        onKeyDown={e=>e.key==="Enter"&&addTask(current.id)} autoFocus style={INP}/>
                      <textarea placeholder="Notas (opcional)" value={newTask.notes||""} onChange={e=>setNewTask(t=>({...t,notes:e.target.value}))} rows={2} style={{ ...INP, resize:"none" }}/>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <div style={{ flex:1, minWidth:120 }}><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Fecha límite</div><input type="date" value={newTask.dueDate} onChange={e=>setNewTask(t=>({...t,dueDate:e.target.value}))} style={{ ...INP, height:44 }}/></div>
                        <div style={{ flex:1, minWidth:100 }}><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Hora</div><input type="time" value={newTask.dueTime||""} onChange={e=>setNewTask(t=>({...t,dueTime:e.target.value}))} style={{ ...INP, height:44 }}/></div>
                        <div style={{ flex:1, minWidth:120 }}><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Prioridad</div>
                          <select value={newTask.priority} onChange={e=>setNewTask(t=>({...t,priority:e.target.value}))} style={{ ...INP, height:44 }}>
                            {Object.entries(PRIORITIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                          </select></div>
                      </div>
                      <div><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Etiquetas</div><TagInput tags={newTask.tags||[]} onChange={tags=>setNewTask(t=>({...t,tags}))}/></div>
                      <div><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Fotos</div><ImageStrip images={newTask.images||[]} onAdd={imgs=>setNewTask(t=>({...t,images:[...(t.images||[]),...imgs]}))} onRemove={iid=>setNewTask(t=>({...t,images:(t.images||[]).filter(i=>i.id!==iid)}))} /></div>
                      <div><div style={{ ...TY.label, color:C.text3, marginBottom:6 }}>Archivos — PDF, Word, Excel, AutoCAD</div><FileStrip files={newTask.files||[]} onAdd={fs=>setNewTask(t=>({...t,files:[...(t.files||[]),...fs]}))} onRemove={fid=>setNewTask(t=>({...t,files:(t.files||[]).filter(f=>f.id!==fid)}))} /></div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="pill tap" onClick={()=>{setAddingTask(null);setNewTask(EMPTY_TASK);}} style={{ flex:1, height:48, background:C.surface2, color:C.text2, borderRadius:12, fontSize:14, fontWeight:600, border:`1px solid ${C.border}` }}>Cancelar</button>
                        <button className="pill tap" onClick={()=>addTask(current.id)} style={{ flex:2, height:48, background:C.orange, color:"#000", borderRadius:12, fontSize:14, fontWeight:700, boxShadow:`0 4px 16px ${C.orangeGlow}` }}>Añadir Tarea</button>
                      </div>
                    </div>
                  ):(
                    <button className="pill tap" onClick={()=>setAddingTask(current.id)}
                      style={{ width:"100%", height:48, background:"transparent", color:C.text2, borderRadius:12, fontSize:14, fontWeight:500, border:`1.5px dashed ${C.border}`, marginTop:4 }}>
                      + Añadir tarea
                    </button>
                  )}
                </div>
              )}

              {/* ── TAB: ARCHIVOS ── */}
              {tab==="archivos"&&(
                <div style={{ padding:"16px 20px" }}>
                  <div style={{ ...TY.sm, color:C.text3, marginBottom:12 }}>Archivos del proyecto — PDF, Word, Excel, AutoCAD (.dwg, .dxf)…</div>
                  <FileStrip files={current.files||[]} onAdd={fs=>addProjFiles(current.id,fs)} onRemove={fid=>delProjFile(current.id,fid)}/>
                </div>
              )}

              {/* ── TAB: CONTACTOS ── */}
              {tab==="contactos"&&(
                <div style={{ padding:"16px 20px" }}>
                  {(current.contacts||[]).length===0&&!addingContact&&(
                    <div style={{ textAlign:"center", color:C.text3, ...TY.body, padding:"32px 0" }}>Sin contactos. Agrega personas clave.</div>
                  )}
                  {(current.contacts||[]).map(c=>(
                    <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12, background:C.surface1, borderRadius:12, padding:"12px 14px", border:`1px solid ${C.border}`, marginBottom:8 }}>
                      <div style={{ width:40, height:40, borderRadius:99, background:C.orangeDim, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:C.orange, fontSize:16, flexShrink:0, border:`1px solid rgba(249,115,22,0.25)` }}>
                        {c.name[0].toUpperCase()}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ ...TY.body, color:C.text1, fontWeight:600 }}>{c.name}</div>
                        {c.role&&<div style={{ ...TY.xs, color:C.orange, marginTop:1 }}>{c.role}</div>}
                        <div style={{ display:"flex", gap:12, marginTop:4, flexWrap:"wrap" }}>
                          {c.phone&&<a href={`tel:${c.phone}`} style={{ ...TY.xs, color:C.text2, textDecoration:"none" }}>📞 {c.phone}</a>}
                          {c.email&&<a href={`mailto:${c.email}`} style={{ ...TY.xs, color:C.text2, textDecoration:"none" }}>✉ {c.email}</a>}
                        </div>
                      </div>
                      <button className="tap" onClick={()=>delContact(current.id,c.id)} style={{ background:"transparent", border:"none", color:C.text3, cursor:"pointer", fontSize:20, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:99 }}>×</button>
                    </div>
                  ))}
                  {addingContact?(
                    <div style={{ background:C.surface1, borderRadius:14, padding:16, border:`1px solid ${C.border}`, marginTop:8 }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                        <input placeholder="Nombre *" value={newContact.name} onChange={e=>setNewContact(c=>({...c,name:e.target.value}))} style={{ ...INP, height:44 }}/>
                        <input placeholder="Rol / Cargo" value={newContact.role} onChange={e=>setNewContact(c=>({...c,role:e.target.value}))} style={{ ...INP, height:44 }}/>
                        <input placeholder="Teléfono" value={newContact.phone} onChange={e=>setNewContact(c=>({...c,phone:e.target.value}))} style={{ ...INP, height:44 }}/>
                        <input placeholder="Email" value={newContact.email} onChange={e=>setNewContact(c=>({...c,email:e.target.value}))} style={{ ...INP, height:44 }}/>
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="pill tap" onClick={()=>{setAddingContact(false);setNewContact(EMPTY_CONTACT);}} style={{ flex:1, height:48, background:C.surface2, color:C.text2, borderRadius:12, fontSize:14, fontWeight:600, border:`1px solid ${C.border}` }}>Cancelar</button>
                        <button className="pill tap" onClick={()=>addContact(current.id)} style={{ flex:2, height:48, background:C.orange, color:"#000", borderRadius:12, fontSize:14, fontWeight:700 }}>Guardar</button>
                      </div>
                    </div>
                  ):(
                    <button className="pill tap" onClick={()=>setAddingContact(true)} style={{ width:"100%", height:48, background:"transparent", color:C.text2, borderRadius:12, fontSize:14, fontWeight:500, border:`1.5px dashed ${C.border}`, marginTop:4 }}>
                      + Agregar contacto
                    </button>
                  )}
                </div>
              )}

              {/* Sheet footer */}
              <div style={{ padding:"12px 20px 24px", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"flex-end" }}>
                <button className="pill tap" onClick={()=>delProj(current.id)} style={{ height:44, padding:"0 20px", background:C.dangerDim, color:C.danger, borderRadius:12, fontSize:13, fontWeight:600, border:`1px solid ${C.danger}33` }}>
                  Eliminar proyecto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECT CARDS GRID ── */}
        {!loaded?(
          <div style={{ textAlign:"center", color:C.text3, padding:80 }}>Cargando…</div>
        ):filtered.length===0?(
          <div style={{ textAlign:"center", color:C.text3, padding:80 }}>
            {projects.length===0?"Aún no tienes proyectos. ¡Crea el primero! 🚀":"Sin resultados."}
          </div>
        ):(
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:12 }}>
            {filtered.map(p=>{
              const pct=prog(p.tasks);
              const pending=p.tasks.filter(t=>t.status!=="completado");
              const isUrg=pending.some(t=>t.dueDate&&days(t.dueDate)!==null&&days(t.dueDate)<=2);
              const tFiles=(p.files||[]).length+p.tasks.reduce((a,t)=>a+(t.files||[]).length,0);
              const tPhotos=p.tasks.reduce((a,t)=>a+(t.images||[]).length,0);
              const hasCAD=p.tasks.some(t=>(t.files||[]).some(f=>AUTOCAD_EXTS.includes(f.ext)))||(p.files||[]).some(f=>AUTOCAD_EXTS.includes(f.ext));
              return (
                <div key={p.id} className="card"
                  onClick={()=>{setActiveProj(p.id);setTab("tareas");}}
                  style={{ background:C.surface1, borderRadius:16, padding:18, border:`1px solid ${isUrg?"rgba(244,63,94,0.3)":C.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
                  {/* Card header */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ ...TY.h3, color:C.text1, marginBottom:2 }}>{p.name}</div>
                      {p.category&&<div style={{ ...TY.xs, color:C.orange }}>📁 {p.category}</div>}
                    </div>
                    <div style={{ display:"flex", gap:4, flexShrink:0, marginLeft:8, marginTop:2 }}>
                      {isUrg&&<span style={{fontSize:16}}>⚠️</span>}
                      {hasCAD&&<span style={{fontSize:16}} title="AutoCAD">📐</span>}
                    </div>
                  </div>
                  {p.description&&<div style={{ ...TY.sm, color:C.text2, marginBottom:10, lineHeight:1.5 }}>{p.description}</div>}
                  {/* Tags */}
                  {(p.tags||[]).length>0&&(
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                      {(p.tags||[]).map(t=><Tag key={t} tag={t}/>)}
                    </div>
                  )}
                  {/* Progress bar */}
                  <div style={{ background:C.surface2, borderRadius:99, height:4, marginBottom:10 }}>
                    <div style={{ background:pct===100?C.success:C.orange, borderRadius:99, height:4, width:`${pct}%`, transition:"width 0.5s", boxShadow:pct>0?`0 0 6px ${C.orangeGlow}`:undefined }}/>
                  </div>
                  {/* Stats row */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div style={{ ...TY.xs, color:C.text3, display:"flex", gap:8 }}>
                      <span>{p.tasks.length===0?"Sin tareas":`${p.tasks.filter(t=>t.status==="completado").length}/${p.tasks.length}`}</span>
                      {tPhotos>0&&<span>🖼 {tPhotos}</span>}
                      {tFiles>0&&<span>📁 {tFiles}</span>}
                      {(p.contacts||[]).length>0&&<span>👤 {p.contacts.length}</span>}
                    </div>
                    <span style={{ ...TY.xs, fontWeight:700, color:pct===100?C.success:C.text3 }}>{pct===100?"✓ Listo":`${pct}%`}</span>
                  </div>
                  {/* Pending task preview */}
                  {pending.slice(0,2).map(t=>(
                    <div key={t.id} style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
                      <span style={{ color:STATUS[t.status].color, fontSize:14, flexShrink:0 }}>{STATUS[t.status].icon}</span>
                      <span style={{ ...TY.sm, color:C.text2, flex:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.text}</span>
                      <span style={{ fontSize:10, color:PRIORITIES[t.priority].color, flexShrink:0 }}>{PRIORITIES[t.priority].icon}</span>
                      {t.dueDate&&<DueBadge dateStr={t.dueDate}/>}
                    </div>
                  ))}
                  {pending.length>2&&<div style={{ ...TY.xs, color:C.text3, marginTop:6 }}>+{pending.length-2} más…</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM BAR — thumb zone, always visible
          Primary: + Nuevo (center-dominant)
          Secondary: Import / Export (flanking)
      ══════════════════════════════════════════ */}
      <div style={{ background:"rgba(10,10,15,0.97)", borderTop:`1px solid ${C.border}`, backdropFilter:"blur(24px)", padding:"12px 16px 20px", display:"flex", gap:8, alignItems:"center", zIndex:50 }}>
        <input ref={importRef} type="file" accept=".json" style={{display:"none"}} onChange={importData}/>

        {/* Import */}
        <button className="pill tap" onClick={()=>importRef.current?.click()}
          style={{ flex:1, height:52, background:C.surface1, color:C.text2, borderRadius:14, fontSize:13, fontWeight:600, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <span style={{fontSize:16}}>⬆</span> Importar
        </button>

        {/* Primary CTA — larger, orange, center */}
        <button className="pill tap" onClick={()=>setShowAdd(true)}
          style={{ flex:2, height:52, background:C.orange, color:"#000", borderRadius:14, fontSize:15, fontWeight:700, border:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:6, boxShadow:`0 4px 24px ${C.orangeGlow}, 0 0 0 1px rgba(249,115,22,0.3)` }}>
          <span style={{fontSize:20, lineHeight:1}}>+</span> Nuevo Proyecto
        </button>

        {/* Export */}
        <button className="pill tap" onClick={exportData}
          style={{ flex:1, height:52, background:C.surface1, color:C.text2, borderRadius:14, fontSize:13, fontWeight:600, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <span style={{fontSize:16}}>⬇</span> Exportar
        </button>
      </div>
    </div>
  );
}
