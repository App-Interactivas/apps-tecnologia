/* Navegación de la revisión local. No escribe datos en servicios externos. */
(()=>{'use strict';
const cfg=JSON.parse(document.getElementById('portal-config').textContent);
const root=document.getElementById('pageRoot');
const control=window.PortalControl;
let states=control.snapshot().config.themes[cfg.course]||{};
let edit=false;
function toast(message){const el=document.getElementById('toast');el.setAttribute('role','status');el.textContent=message;el.classList.add('show');clearTimeout(window._toastTimer);window._toastTimer=setTimeout(()=>el.classList.remove('show'),2500)}
function expanded(card,value){card.classList.toggle('open',value);const b=card.querySelector('[data-toggle-card]');if(b)b.setAttribute('aria-expanded',String(value))}
function available(card){return !card.dataset.state||card.dataset.state==='active'||edit}
document.querySelectorAll('[data-theme]').forEach(card=>{
 const id=card.dataset.theme;if(['active','upcoming','hidden'].includes(states[id]))card.dataset.state=states[id];
 const sel=card.querySelector('[data-state-select]');sel.value=card.dataset.state;
 sel.id='state-'+id;card.querySelector('.statebox label').setAttribute('for',sel.id);
 sel.addEventListener('change',async()=>{if(!edit)return;const desired=sel.value;sel.value=card.dataset.state;try{await control.patch({op:'theme',course:cfg.course,theme:id,state:desired});toast('Estado guardado para todos los dispositivos.')}catch(error){toast(error.message);sel.value=card.dataset.state;if(error.code==='AUTH_REQUIRED')leaveEdit()}});
});
document.querySelectorAll('[data-toggle-card]').forEach(b=>b.addEventListener('click',()=>{const card=b.closest('.card');if(!available(card))return;if(card.id==='comic-card'&&document.querySelector('.annual-row')){openAnnual('comic');return}expanded(card,!card.classList.contains('open'))}));
const escapeHtml=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const localUrl=u=>/^(blob:|data:)/.test(u)?u:cfg.prefix+u;
function resourceLink(item,primary=false,tag=''){
 const url=item.url.startsWith('http')?item.url:localUrl(item.url),pdf=item.format==='PDF'||/\.pdf(?:$|[?#])/.test(item.url),name=item.url.split('/').pop().split(/[?#]/)[0];
 return `<div class="resource-unit"><a class="resource-link ${primary?'primary':''}" href="${escapeHtml(url)}" target="_blank" rel="noopener">${tag?'<span class="resource-tag">'+escapeHtml(tag)+'</span>':''}${escapeHtml(item.label)}<small>${pdf?'Abrir PDF ↗':'Abrir actividad ↗'}</small></a>${pdf?'<a class="resource-download" href="'+escapeHtml(url)+'" download="'+escapeHtml(name)+'" aria-label="Descargar '+escapeHtml(item.label)+' en PDF">↓ Descargar PDF</a>':''}</div>`;
}
function itemsFor(key,kind){return ({apps:cfg.activities,presentaciones:cfg.presentations,temario:cfg.temario,fichas:cfg.fichas}[kind]||{})[key]||[]}
function renderPanel(card,kind){
 const key=cfg.course+'-t'+card.dataset.theme;
 if(kind==='apps'){const list=cfg.activities[key]||[];return '<h4>Actividades interactivas</h4>'+(list.length?'<div class="resource-list">'+list.map(x=>resourceLink(x)).join('')+'</div>':'<p class="resource-pending">Todavía no hay actividades vinculadas a este tema.</p>')}
 if(kind==='presentaciones'){
  const list=cfg.presentations[key]||[];
  return '<h4>Presentaciones</h4>'+(list.length?resourceLink(list[0],true):'<p class="resource-pending">Presentación general · pendiente de vincular.</p>')+'<div class="resource-subtitle">Presentaciones parciales</div>'+(list.length>1?'<div class="resource-list">'+list.slice(1).map(x=>resourceLink(x)).join('')+'</div>':'<p class="resource-pending">Todavía no hay presentaciones parciales vinculadas.</p>')
 }
 return `<h4>${kind==='fichas'?'Fichas y documentos':'Juego'}</h4><p class="resource-pending">Este recurso está pendiente de vincular.</p>`;
}
const resourceDialog=document.getElementById('resourceDialog'),resourceBody=document.getElementById('resourceBody');
let resourceItems=[],resourcePage=0,resourceOpener=null,resourceKind='';
function resourcePageSize(){const cols=window.innerWidth<=760?2:3;const rows=Math.min(3,Math.max(1,Math.floor((window.innerHeight*.90-195)/165)));return cols*rows}
function renderResources(){
 const size=resourcePageSize(),pages=Math.max(1,Math.ceil(resourceItems.length/size));resourcePage=Math.min(resourcePage,pages-1);
 const hasGeneral=resourceItems.some(x=>x.primary||x.label==='Presentación general');
 const note=resourceKind==='presentaciones'&&resourceItems.length&&!hasGeneral?'<p class="resource-note">Presentaciones parciales disponibles. La presentación general se incorporará cuando esté revisada.</p>':'';
 resourceBody.innerHTML=note+(resourceItems.length?'<div class="resource-list">'+resourceItems.slice(resourcePage*size,(resourcePage+1)*size).map(x=>resourceLink(x,x.primary||x.label==='Presentación general',resourceKind==='presentaciones'?(x.primary||x.label==='Presentación general'?'General':'Parcial'):'')).join('')+'</div>':'<p class="resource-pending">Este recurso está pendiente de vincular.</p>');
 document.getElementById('resourceNav').hidden=pages===1;document.getElementById('resourceCount').textContent=`${resourcePage+1} / ${pages}`;document.getElementById('resourcePrev').disabled=resourcePage===0;document.getElementById('resourceNext').disabled=resourcePage===pages-1;
}
function openResource(b){
 const card=b.closest('.card');if(!available(card))return;
 const key=card.dataset.resourceKey||cfg.course+'-t'+card.dataset.theme,kind=b.dataset.kind;
 resourceItems=itemsFor(key,kind);
 resourcePage=0;resourceOpener=b;resourceKind=kind;
 document.querySelectorAll('[data-kind]').forEach(x=>x.setAttribute('aria-expanded',String(x===b)));
 document.getElementById('resourceTitle').textContent={apps:'Actividades interactivas',presentaciones:'Presentaciones',temario:'Temario',fichas:'Fichas y documentos'}[kind];
 document.getElementById('resourceContext').textContent=`${card.dataset.theme?'Tema '+card.dataset.theme:'Proyecto de taller'} · ${card.querySelector('h3').textContent}`;
 renderResources();if(!resourceDialog.open)resourceDialog.showModal();document.body.style.overflow='hidden';
}
document.querySelectorAll('[data-kind]').forEach(b=>{b.setAttribute('aria-expanded','false');b.addEventListener('click',()=>openResource(b))});
function closeOnBackdrop(dialog){
 let startedOutside=false;
 const outside=e=>{const r=dialog.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom};
 dialog.addEventListener('pointerdown',e=>{startedOutside=e.target===dialog&&outside(e)});
 dialog.addEventListener('click',e=>{const dismiss=startedOutside&&e.target===dialog&&outside(e);startedOutside=false;if(dismiss)dialog.close()});
 dialog.addEventListener('close',()=>{startedOutside=false});
}
// v15: panel ancho situado hacia la tarjeta que no se está utilizando.
const annualRow=document.querySelector('.annual-row');
let annualDialog=null,annualKind='',annualOpener=null,annualPage=0;
function syncDialogScroll(){document.body.style.overflow=document.querySelector('dialog[open]')?'hidden':''}
if(annualRow){
 annualDialog=document.createElement('dialog');annualDialog.id='annualDialog';annualDialog.className='annual-dialog';annualDialog.setAttribute('aria-labelledby','annualTitle');
 annualDialog.innerHTML='<header class="annual-top"><div><span class="num" id="annualContext"></span><h2 id="annualTitle"></h2></div><button type="button" id="annualClose" aria-label="Cerrar ventana de Nexo">Cerrar ×</button></header><div class="annual-body"><section id="annualComic" class="comic-card annual-comic"></section><section id="annualGame" class="annual-game" hidden></section></div><nav class="annual-nav" aria-label="Más capítulos" hidden><button type="button" id="annualPrev">← Anterior</button><span id="annualCount" role="status"></span><button type="button" id="annualNext">Siguiente →</button></nav>';
 document.body.append(annualDialog);annualDialog.querySelector('#annualComic').append(document.getElementById('comic-details'));
 const gameImage=document.querySelector('#game-card img').cloneNode();gameImage.loading='eager';
 const gameBody=annualDialog.querySelector('#annualGame');gameBody.append(gameImage);
 const gameText=document.createElement('div');gameText.innerHTML='<span class="annual-development">En desarrollo</span><h3>Una aventura para 1.º y 2.º ESO</h3><p>Explora, investiga y resuelve retos en equipo. Estamos uniendo los dos juegos en una misma aventura.</p><p>Orígenes y clases para crear tu personaje y descubrir los secretos de Expedición Nexo.</p><p class="annual-game-note">El acceso al juego estará disponible cuando terminemos esta nueva versión.</p>';gameBody.append(gameText);
 document.querySelector('.game-opener').addEventListener('click',()=>openAnnual('juego'));
 annualDialog.querySelector('#annualClose').addEventListener('click',()=>annualDialog.close());closeOnBackdrop(annualDialog);
 annualDialog.addEventListener('close',()=>{syncDialogScroll();annualRow.querySelectorAll('[aria-expanded]').forEach(b=>b.setAttribute('aria-expanded','false'));annualOpener?.focus({preventScroll:true})});
 annualDialog.querySelector('#annualPrev').addEventListener('click',()=>{annualPage--;layoutAnnual()});annualDialog.querySelector('#annualNext').addEventListener('click',()=>{annualPage++;layoutAnnual()});
 window.addEventListener('resize',()=>{if(annualDialog.open)layoutAnnual()});
}
function layoutAnnual(){
 if(!annualDialog)return;
 const r=annualRow.getBoundingClientRect(),vw=document.documentElement.clientWidth,vh=window.innerHeight;
 const width=Math.min(880,vw-24),x=annualKind==='comic'?Math.min(vw-width-12,r.right-width):Math.max(12,r.left);
 annualDialog.style.width=width+'px';annualDialog.style.left=Math.max(12,x)+'px';
 const chapters=[...annualDialog.querySelectorAll('.chapter')],compact=vw<600||vh<650;
 const pages=compact?[chapters.filter(c=>!c.classList.contains('chapter-pending')),chapters.filter(c=>c.classList.contains('chapter-pending'))].filter(a=>a.length):[chapters];
 annualPage=Math.max(0,Math.min(annualPage,pages.length-1));chapters.forEach(c=>c.hidden=annualKind==='comic'&&!pages[annualPage].includes(c));
 const nav=annualDialog.querySelector('.annual-nav');nav.hidden=annualKind!=='comic'||pages.length<2;
 annualDialog.querySelector('#annualPrev').disabled=annualPage===0;annualDialog.querySelector('#annualNext').disabled=annualPage===pages.length-1;annualDialog.querySelector('#annualCount').textContent=`${annualPage+1} / ${pages.length}`;
 const h=annualDialog.getBoundingClientRect().height;annualDialog.style.top=Math.max(12,Math.min(r.top,vh-h-12))+'px';
}
function openAnnual(kind){
 if(!annualDialog)return;annualKind=kind;annualPage=0;annualOpener=kind==='comic'?document.querySelector('.comic-opener'):document.querySelector('.game-opener');
 annualDialog.querySelector('#annualTitle').textContent=kind==='comic'?'Capítulos del cómic':'Expedición Nexo';annualDialog.querySelector('#annualContext').textContent=kind==='comic'?'Tu biblioteca de aventuras':'Juego de investigación · 1.º y 2.º ESO';
 annualDialog.querySelector('#annualComic').hidden=kind!=='comic';annualDialog.querySelector('#annualGame').hidden=kind==='comic';
 annualOpener.setAttribute('aria-expanded','true');if(!annualDialog.open)annualDialog.showModal();syncDialogScroll();layoutAnnual();
}

closeOnBackdrop(resourceDialog);
document.getElementById('resourceClose').addEventListener('click',()=>resourceDialog.close());
resourceDialog.addEventListener('close',()=>{syncDialogScroll();document.querySelectorAll('[data-kind]').forEach(x=>x.setAttribute('aria-expanded','false'));resourceOpener?.focus()});
document.getElementById('resourcePrev').addEventListener('click',()=>{resourcePage=Math.max(0,resourcePage-1);renderResources()});document.getElementById('resourceNext').addEventListener('click',()=>{resourcePage++;renderResources()});
window.addEventListener('resize',()=>{if(resourceDialog.open)renderResources()});

const editBtn=document.getElementById('editBtn'),modal=document.getElementById('modal'),form=document.getElementById('passForm'),pw=document.getElementById('pw');
modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');pw.setAttribute('aria-label','Contraseña docente');
function closeAuth(){modal.classList.remove('show');pw.value='';editBtn.focus()}
function enterEdit(){edit=true;document.getElementById('sharedStatus').hidden=false;root.classList.add('teacher-mode');editBtn.classList.add('on');editBtn.textContent='Salir de edición';toast('Modo docente activo')}
function leaveEdit(){edit=false;document.getElementById('sharedStatus').hidden=true;if(resourceDialog.open&&resourceOpener&&!available(resourceOpener.closest('.card')))resourceDialog.close();root.classList.remove('teacher-mode');editBtn.classList.remove('on');editBtn.textContent='✎ Editar';document.querySelectorAll('[data-theme]').forEach(c=>{if(c.dataset.state!=='active')expanded(c,false)});}
editBtn.addEventListener('click',async()=>{if(edit){leaveEdit();return}try{await control.ensureReady();if(control.authenticated())enterEdit();else{modal.classList.add('show');pw.value='';pw.focus()}}catch(error){toast(error.message)}});
form.addEventListener('submit',async e=>{e.preventDefault();const submit=form.querySelector('[type="submit"]');submit.disabled=true;try{await control.login(pw.value);closeAuth();enterEdit()}catch(error){toast(error.message)}finally{pw.value='';submit.disabled=false}});document.getElementById('cancel').addEventListener('click',closeAuth);
modal.addEventListener('click',e=>{if(e.target===modal)closeAuth()});
modal.addEventListener('keydown',e=>{if(e.key==='Escape')closeAuth();if(e.key==='Tab'){const els=[...modal.querySelectorAll('input,button')];const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
const reader=document.getElementById('reader'),body=document.getElementById('readerBody'),stage=document.getElementById('bookStage');
let current=0,unitIndex=0,readingMode='book',questionView=false,units=[],qpages=[],qscales=[],previousFocus=null,turning=false;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function bookSize(){const css=getComputedStyle(body);return {w:body.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight),h:body.clientHeight-parseFloat(css.paddingTop)-parseFloat(css.paddingBottom)}}
function buildUnits(){
 const c=cfg.comics[current],out=[[{i:-1,url:c.cover,start:0,end:c.coverMeta.height}]];
 if(readingMode==='detail'){
  c.pages.forEach((url,i)=>{const m=c.pageMeta[i];if(i===0)out.push([{i,url,start:0,end:m.height}]);else{out.push([{i,url,start:0,end:Math.min(m.height,m.split+8)}]);out.push([{i,url,start:Math.max(0,m.split-8),end:m.height}])}});
 }else{
  const spread=window.innerWidth>860;
  for(let i=0;i<c.pages.length;i+=spread?2:1){const pair=[];for(let j=i;j<Math.min(c.pages.length,i+(spread?2:1));j++)pair.push({i:j,url:c.pages[j],start:0,end:c.pageMeta[j].height});out.push(pair)}
 }
 units=out;unitIndex=Math.min(unitIndex,units.length-1);
}
function questionParagraph(text){const e=document.createElement(/^Lectura\s+\d/i.test(text)?'h3':'p');e.textContent=text;e.className=/^_+$/.test(text)?'write-line':/^[a-dA-D][). ]/.test(text)?'option':/^\d+[.\s]/.test(text)?'question':'';return e}
function paginateQuestions(){
 const size=bookSize(),paper=document.createElement('article');paper.className='questions-paper';paper.style.justifyContent='flex-start';
 stage.className='book-stage question-stage';stage.style.width=Math.min(1120,size.w)+'px';stage.style.height=size.h+'px';stage.replaceChildren(paper);
 qpages=[];qscales=[];let group=[],hasQuestion=false;
 for(const text of cfg.comics[current].questions){const question=/^\d{1,2}[.\s]/.test(text),reading=/^Lectura\s+\d/i.test(text);if(group.length&&(question||(reading&&hasQuestion))){qpages.push(group);group=[];hasQuestion=false}group.push(text);if(question)hasQuestion=true}
 if(group.length)qpages.push(group);
 qpages.forEach(lines=>{paper.replaceChildren(...lines.map(questionParagraph));qscales.push(Math.min(1,(paper.clientHeight-55)/Math.max(1,paper.scrollHeight-55)))});
 unitIndex=Math.min(unitIndex,qpages.length-1);
}
function updateTurnButtons(){const total=questionView?qpages.length:units.length;document.getElementById('prevPage').disabled=unitIndex===0||turning;document.getElementById('nextPage').disabled=unitIndex>=total-1||turning}
function renderBook(){
 const size=bookSize();stage.replaceChildren();
 if(questionView){stage.className='book-stage question-stage';stage.style.width=Math.min(1120,size.w)+'px';stage.style.height=size.h+'px';const paper=document.createElement('article');paper.className='questions-paper';(qpages[unitIndex]||[]).forEach(t=>paper.append(questionParagraph(t)));stage.append(paper);const scale=qscales[unitIndex]||1;if(scale<1){for(const p of paper.children){if(p.classList.contains('write-line'))continue;p.style.fontSize=(parseFloat(getComputedStyle(p).fontSize)*scale)+'px';p.style.marginTop='3px';p.style.marginBottom='3px';p.style.lineHeight='1.3'}}}
 else{
  const c=cfg.comics[current],parts=units[unitIndex]||[];const ratios=parts.map(p=>(p.i<0?c.coverMeta:c.pageMeta[p.i]).width/(p.end-p.start));const total=ratios.reduce((a,b)=>a+b,0);const height=Math.max(1,Math.min(size.h,size.w/total));
  stage.className='book-stage'+(parts.length===2?' spread':'');stage.style.height=height+'px';stage.style.width=height*total+'px';
  parts.forEach((p,j)=>{const m=p.i<0?c.coverMeta:c.pageMeta[p.i],width=height*ratios[j];const leaf=document.createElement('div');leaf.className='book-leaf';leaf.style.width=width+'px';const img=document.createElement('img');img.src=localUrl(p.url);img.alt=p.i<0?`Portada de ${c.title}`:`${c.title} · página ${p.i+1}${readingMode==='detail'?' · detalle de viñetas':''}`;img.style.top=(-p.start/m.width*width)+'px';img.draggable=false;leaf.append(img);if(p.i>=0){const n=document.createElement('span');n.className='leaf-page-number';n.textContent=String(p.i+1);leaf.append(n)}stage.append(leaf)});
 }
 const total=questionView?qpages.length:units.length;
 if(questionView)document.getElementById('pageCount').textContent=`Preguntas · ${unitIndex+1} / ${total}`;
 else{const parts=units[unitIndex],first=parts[0].i+1,last=parts.at(-1).i+1;document.getElementById('pageCount').textContent=first===0?'Portada del capítulo':`${readingMode==='detail'?'Viñetas':'Páginas'} ${first===last?first:first+'–'+last} / ${cfg.comics[current].pages.length}`}
 document.getElementById('bookProgressFill').style.width=((unitIndex+1)/total*100)+'%';
 document.getElementById('readingHint').textContent=questionView?'Consulta cada bloque con las flechas':'Desliza o usa las flechas para pasar hoja';updateTurnButtons();
}
function turn(direction){
 const total=questionView?qpages.length:units.length;if(turning||unitIndex+direction<0||unitIndex+direction>=total)return;
 let sheet=null;
 if(!reduced()){
  sheet=stage.cloneNode(true);sheet.removeAttribute('id');sheet.classList.add('book-turn-sheet');if(direction<0)sheet.classList.add('reverse');sheet.style.left=stage.offsetLeft+'px';sheet.style.top=stage.offsetTop+'px';sheet.setAttribute('aria-hidden','true');body.append(sheet);turning=true;
 }
 unitIndex+=direction;renderBook();
 if(sheet)setTimeout(()=>{sheet.remove();turning=false;updateTurnButtons()},640);
}
function showReader(index,questions){
 current=Number(index);if(!cfg.comics[current])return;unitIndex=0;readingMode='book';questionView=questions;turning=false;previousFocus=document.activeElement;
 const c=cfg.comics[current];document.getElementById('readerTitle').textContent=c.title;document.getElementById('readerKicker').textContent=`Capítulo ${current+1} · ${questions?'Preguntas':'Expedición Nexo'}`;reader.classList.toggle('questions-view',questions);
 document.querySelectorAll('[data-reading-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.readingMode==='book')));
 reader.showModal();document.body.style.overflow='hidden';
 requestAnimationFrame(()=>{if(questions)paginateQuestions();else buildUnits();renderBook()});
}
document.querySelectorAll('[data-read]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showReader(a.dataset.read,false)}));
document.querySelectorAll('[data-questions]').forEach(b=>b.addEventListener('click',()=>showReader(b.dataset.questions,true)));
closeOnBackdrop(reader);
document.getElementById('readerClose').addEventListener('click',()=>reader.close());reader.addEventListener('close',()=>{syncDialogScroll();body.querySelectorAll('.book-turn-sheet').forEach(e=>e.remove());turning=false;previousFocus?.focus()});
document.getElementById('prevPage').addEventListener('click',()=>turn(-1));document.getElementById('nextPage').addEventListener('click',()=>turn(1));
document.querySelectorAll('[data-reading-mode]').forEach(b=>b.addEventListener('click',()=>{if(questionView||turning||b.dataset.readingMode===readingMode)return;const oldPage=units[unitIndex]?.[0]?.i||0;readingMode=b.dataset.readingMode;unitIndex=0;buildUnits();const found=units.findIndex(u=>u.some(p=>p.i===oldPage));if(found>=0)unitIndex=found;document.querySelectorAll('[data-reading-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderBook()}));
reader.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();turn(1)}else if(e.key==='ArrowLeft'){e.preventDefault();turn(-1)}});
let pointerStart=null;body.addEventListener('pointerdown',e=>{if(!e.target.closest('button'))pointerStart={x:e.clientX,y:e.clientY}});body.addEventListener('pointerup',e=>{if(!pointerStart)return;const dx=e.clientX-pointerStart.x,dy=e.clientY-pointerStart.y;pointerStart=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)turn(dx<0?1:-1)});
window.addEventListener('resize',()=>{if(reader.open){if(questionView)paginateQuestions();else buildUnits();renderBook()}});

control.subscribe(state=>{
 states=state.config.themes[cfg.course]||{};
 document.querySelectorAll('[data-theme]').forEach(card=>{const value=states[card.dataset.theme];if(value)card.dataset.state=value;const sel=card.querySelector('[data-state-select]');sel.value=card.dataset.state;sel.disabled=state.pending||!state.connected;if(!edit&&card.dataset.state!=='active')expanded(card,false)});
 if(edit&&!state.authenticated)leaveEdit();
 if(resourceDialog.open&&resourceOpener&&!available(resourceOpener.closest('.card')))resourceDialog.close();
 const status=document.getElementById('sharedStatus');status.hidden=!edit;status.textContent=state.pending?'Guardando…':state.connected?'Configuración compartida · revisión '+state.revision:'Sin conexión · cambios bloqueados';
});
const raw=new URLSearchParams(location.search).get('resource');const res=({'APP interactivas':'apps','Actividades interactivas':'apps','Presentaciones':'presentaciones','Temario':'temario','Cómic':'comic','Juego GIP':'juego','Fichas':'fichas'})[raw]||raw;
if(res==='comic'){if(annualDialog)openAnnual('comic');else expanded(document.getElementById('comic-card'),true);}
else if(res==='juego'){const game=document.getElementById('game-card');if(game){game.scrollIntoView({block:'center'});openAnnual('juego')}else toast('El juego unificado de Nexo está en desarrollo para 1.º y 2.º ESO.');}
else if(['apps','presentaciones','temario','fichas'].includes(res)){const all=[...document.querySelectorAll(`[data-kind="${res}"]`)].filter(b=>available(b.closest('.card')));const b=all.find(b=>{const c=b.closest('.card');return itemsFor(c.dataset.resourceKey||cfg.course+'-t'+c.dataset.theme,res).length})||all[0];if(b)openResource(b,true);}
})();
