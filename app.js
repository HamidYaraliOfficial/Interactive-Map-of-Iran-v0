/* Interactive Map of Iran — Hamid Yarali (حمید یارعلی) — MIT */
(()=>{
const G=window.GEO,I=window.INFO,NS='http://www.w3.org/2000/svg',svg=document.getElementById('map'),$=i=>document.getElementById(i);
const nf=(n,l,d=0)=>Number(Number(n).toFixed(d)).toLocaleString(l==='fa'?'fa-IR':'en-US');
const pj=(o,a)=>[(o-G.LON0)*Math.PI/180*G.S,(G.M0-Math.log(Math.tan(Math.PI/4+a*Math.PI/360)))*G.S];
const el=(p,t,a={},tx)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(tx)e.textContent=tx;p.appendChild(e);return e};
const rows=s=>s.trim().split('\n').map(r=>r.split('|'));
const L={};['sea','land','prov','lake','riv','isl','lab','sl'].forEach(k=>L[k]=el(svg,'g',{class:k}));
const P={};rows(I.prov).forEach(([n,fa,en,cf,ce,pop])=>P['IR-'+n]={id:'IR-'+n,type:'prov',fa,en,cf,ce,pop:+pop});
G.provinces.forEach(p=>Object.assign(P[p.id],p));const TOT=G.provinces.reduce((s,p)=>s+p.area,0);
const T={prov:['استان','Province'],sea:['پهنهٔ آبی','Water body'],isl:['جزیره','Island'],riv:['رود','River']};
let lang='fa',moved=0,vb={x:0,y:0,w:G.W,h:G.H};const labs=[],dots=[],tip=$('tip');
const bind=(n,e)=>{n.addEventListener('mousemove',v=>{tip.style.display='block';tip.innerHTML=e.fa+' — '+e.en;tip.style.left=v.clientX+14+'px';tip.style.top=v.clientY+14+'px'});
 n.addEventListener('mouseleave',()=>tip.style.display='none');n.addEventListener('click',()=>{if(moved<5)open(e)})};
el(L.land,'path',{d:G.countries.join(''),class:'ctry'});
const S={};rows(I.seas).forEach(([id,fa,en,lo,la,nfa,nen])=>{S[id]={id,type:'sea',fa,en,nfa,nen,lo,la};
 const d=G.seas[id]||G.lakes[id];if(d)bind(el(L[G.seas[id]?'sea':'lake'],'path',{d}),S[id]);
 if(lo){const[x,y]=pj(+lo,+la);labs.push([el(L.sl,'text',{x,y},fa),S[id],0,'sl'])}});
const hz=el(L.sea,'path',{d:'M'+I.hormuz.map(c=>pj(...c).join(',')).join('L')+'Z',class:'hz'});bind(hz,S.hormuz);
G.provinces.forEach(p=>{const e=P[p.id];bind(el(L.prov,'path',{d:p.d,fill:`hsl(${parseInt(p.id.slice(3))*47%360} 55% 80%)`}),e);
 labs.push([el(L.lab,'text',{x:p.c[0],y:p.c[1]},e.fa),e,p.area,'lab'])});
const R={};rows(I.riv).forEach(([id,fa,en,nfa,nen])=>R[id]={id,type:'riv',fa,en,nfa,nen});
const river=(id,d)=>{const g=el(L.riv,'g');el(g,'path',{d,class:'v'});bind(el(g,'path',{d,class:'h'}),R[id])};
G.rivers.forEach(r=>R[r.id]&&river(r.id,r.d));
for(const k in I.lines)river(k,'M'+I.lines[k].map(c=>pj(...c).join(',')).join('L'));
rows(I.isl).forEach(([id,fa,en,lo,la,ar,pf,pe,nfa,nen])=>{const e={id,type:'isl',fa,en,lo:+lo,la:+la,ar:+ar,pf,pe,nfa,nen};const[x,y]=pj(e.lo,e.la);
 const c=el(L.isl,'circle',{cx:x,cy:y,r:5});dots.push(c);bind(c,e)});
const fit=()=>{svg.setAttribute('viewBox',`${vb.x} ${vb.y} ${vb.w} ${vb.h}`);const k=vb.w/G.W;dots.forEach(c=>c.setAttribute('r',5.5*k));
 L.lab.setAttribute('font-size',10.5*k);L.sl.setAttribute('font-size',15*k);
 labs.forEach(([t,e,a,g])=>{t.textContent=e[lang];t.style.display=g==='sl'||a>14000*k*k?'':'none'})};
const zoom=(f,cx=.5,cy=.5)=>{const w=Math.min(G.W,Math.max(60,vb.w*f)),r=w/vb.w;vb.x+=vb.w*cx*(1-r);vb.y+=vb.h*cy*(1-r);vb.w=w;vb.h=w*G.H/G.W;
 vb.x=Math.max(0,Math.min(G.W-vb.w,vb.x));vb.y=Math.max(0,Math.min(G.H-vb.h,vb.y));fit()};
svg.addEventListener('wheel',v=>{v.preventDefault();const q=svg.createSVGPoint();q.x=v.clientX;q.y=v.clientY;const u=q.matrixTransform(svg.getScreenCTM().inverse());
 zoom(v.deltaY>0?1.2:1/1.2,(u.x-vb.x)/vb.w,(u.y-vb.y)/vb.h)},{passive:false});
let dr=null;svg.addEventListener('pointerdown',v=>{dr={x:v.clientX,y:v.clientY};moved=0});
addEventListener('pointermove',v=>{if(!dr)return;const s=1/svg.getScreenCTM().a,dx=v.clientX-dr.x,dy=v.clientY-dr.y;moved+=Math.abs(dx)+Math.abs(dy);
 vb.x=Math.max(0,Math.min(G.W-vb.w,vb.x-dx*s));vb.y=Math.max(0,Math.min(G.H-vb.h,vb.y-dy*s));dr={x:v.clientX,y:v.clientY};fit()});
addEventListener('pointerup',()=>dr=null);
$('zi').onclick=()=>zoom(1/1.5);$('zo').onclick=()=>zoom(1.5);$('zr').onclick=()=>{vb={x:0,y:0,w:G.W,h:G.H};fit()};$('lb').onclick=()=>{lang=lang==='fa'?'en':'fa';fit()};
function info(e){const f=e.type==='prov';if(f){const nb=e.nb.map(i=>P[i]);return[
 ['مرکز استان','Capital',e.cf,e.ce],['جمعیت (سرشماری ۱۳۹۵)','Population (2016 census)',nf(e.pop,'fa'),nf(e.pop,'en')],
 ['مساحت (تقریبی)','Area (approx.)',nf(e.area,'fa')+' کیلومتر مربع',nf(e.area,'en')+' km²'],
 ['سهم از مساحت کشور','Share of national area',nf(e.area/TOT*100,'fa',1)+'٪',nf(e.area/TOT*100,'en',1)+'%'],
 ['تراکم جمعیت','Population density',nf(e.pop/e.area,'fa')+' نفر در کیلومتر مربع',nf(e.pop/e.area,'en')+' per km²'],
 ['استان‌های همسایه','Neighbouring provinces',nb.map(x=>x.fa).join('، '),nb.map(x=>x.en).join(', ')],['کد ISO 3166-2','ISO 3166-2',e.id,e.id]]}
 const r=[['توضیحات','Description',e.nfa,e.nen]];
 if(e.type==='isl')r.unshift(['استان','Province',e.pf,e.pe],['مساحت (تقریبی)','Area (approx.)',nf(e.ar,'fa')+' کیلومتر مربع',nf(e.ar,'en')+' km²'],
  ['مختصات','Coordinates',nf(e.la,'fa',2)+'° شمالی، '+nf(e.lo,'fa',2)+'° شرقی',e.la+'° N, '+e.lo+'° E']);
 return r}
function open(e){const R=info(e),q=e.type==='prov'?['استان '+e.fa,e.en+' Province']:[e.fa,e.en];
 const col=(l,i,d)=>`<section lang="${l}" dir="${d}"><h2>${e[l]}</h2><span class="badge">${T[e.type][i]}</span><dl>${R.map(r=>`<dt>${r[i]}</dt><dd>${r[i+2]}</dd>`).join('')}</dl>
 <a target="_blank" rel="noopener" href="https://${l}.wikipedia.org/w/index.php?search=${encodeURIComponent(q[i])}">${i?'Read more on Wikipedia ↗':'مطالعهٔ بیشتر در ویکی‌پدیا ↗'}</a></section>`;
 $('mb').innerHTML=`<div class="cols">${col('fa',0,'rtl')}${col('en',1,'ltr')}</div>`;$('modal').hidden=false}
const close=()=>$('modal').hidden=true;$('x').onclick=close;$('modal').onclick=v=>{if(v.target.id==='modal')close()};addEventListener('keydown',v=>v.key==='Escape'&&close());
fit();
})();
