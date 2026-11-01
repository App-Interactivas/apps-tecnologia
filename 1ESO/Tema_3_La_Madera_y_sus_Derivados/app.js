(function(){
 'use strict';
 const E=window.MaderaEval,C=window.MaderaCentral,V=window.MaderaVisual,apps=window.MADERA_APPS;
 const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=n=>Number(n).toLocaleString('es-ES',{maximumFractionDigits:2});
 const app=apps.find(a=>a.id===document.body.dataset.app);
 const root=$('appRoot');
 const listView=!app;
 const stageInfo={
  A1:['Corteza: protege el tronco.','Cámbium: zona de crecimiento que forma nuevos tejidos.','Albura: madera exterior más reciente que participa en el transporte de agua y sales.','Duramen: madera interior más antigua que ya no realiza ese transporte y mantiene función de soporte.','Médula: zona central del tronco.'],
  A2:['Se corta el árbol seleccionado y se retiran ramas.','Se trasladan los troncos a las instalaciones.','Se retira la corteza.','Se divide el tronco con sierras para obtener piezas.','Se reduce y controla la humedad para el uso previsto.','Se regularizan y suavizan las superficies.','Se aplican acabados o tratamientos apropiados cuando proceden.'],
  A3:['Contrachapado: chapas encoladas y fibras cruzadas; en el canto se distinguen capas.','Aglomerado: partículas o virutas unidas con resinas y prensadas.','DM o MDF: fibras desfibradas, unidas y prensadas; estructura fina y uniforme.','Tablero de fibras duro o táblex: tablero fino empleado en traseras y fondos de cajones.'],
 };
 if(listView){
  root.innerHTML=`<section class="hero"><div><p class="eyebrow">Tema 3 · 1.º ESO</p><h1>La madera y sus derivados</h1><p class="stage-intro">Observa, compara y decide. Cuatro estaciones para comprender los materiales que proceden de los árboles.</p><div class="chips"><span class="chip">4 apps</span><span class="chip">40 retos</span><span class="chip">Individual o pareja</span></div></div><div class="hero-art">${V.visual('trunk')}</div></section><section class="grid" aria-label="Actividades del tema">${apps.map(a=>`<a class="card" href="./${a.file}"><small>${esc(a.id)} · ${esc(a.time)}</small><h2>${esc(a.title)}</h2><div class="visual">${V.visual({A1:'trunk',A2:'process',A3:'boards',A4:'case'}[a.id])}</div><p>${esc(a.intro)}</p><span class="arrow">Abrir actividad →</span></a>`).join('')}</section><section class="panel resource"><h2>Del árbol al papel</h2><p>En el recurso propuesto por el profesor, observa una materia prima, una transformación y un producto. Compara lo observado con el esquema trabajado en clase.</p><a class="button" href="https://www.youtube.com/watch?v=_IRHM_EPjnY&amp;t=284s" target="_blank" rel="noopener noreferrer">Vídeo sobre la fabricación del papel ↗</a></section>`;
  return;
 }
 const key='madera-pendiente-'+app.id;
 const S={mode:'',students:[],idx:0,records:Array(10).fill(null),drafts:Array(10).fill(null),hints:Array(10).fill(false),startedAt:'',submissionId:'',result:null,pending:null,sending:false,busy:false,explore:0,endpoint:C.DEFAULT_ENDPOINT,storageWarning:false};
 try{const e=localStorage.getItem('madera-endpoint');if(e&&C.validEndpoint(e))S.endpoint=e;}catch{}
 root.innerHTML=`<section class="hero"><div><p class="eyebrow">${app.id} · Tema 3 · 1.º ESO</p><h1>${esc(app.title)}</h1><p>${esc(app.intro)}</p><div class="chips"><span class="chip">${esc(app.block)}</span><span class="chip">10 retos · 10 puntos</span><span class="chip">${esc(app.time)}</span></div></div><div class="hero-art">${V.visual({A1:'trunk',A2:'process',A3:'boards',A4:'case'}[app.id])}</div></section>
 <nav class="tabs" aria-label="Secciones de la actividad"><button data-action="tabExplore" id="tabExplore" aria-pressed="true">Explora</button><button data-action="tabQuiz" id="tabQuiz" aria-pressed="false">Tus retos</button></nav>
 <section id="explore" class="panel"></section>
 <section id="challenge" hidden><section id="registration" class="panel notice"><h2>Prepara tu intento</h2><p>Introduce el ID que te ha facilitado el profesor. Si trabajáis en pareja, añadid los dos ID del mismo grupo.</p><label><input id="pair" type="checkbox"> Trabajamos en pareja</label><div class="ids"><label class="field" for="id1">Tu ID<input id="id1" autocomplete="off" autocapitalize="characters" spellcheck="false"></label><label class="field" for="id2" id="secondId" hidden>Segundo ID<input id="id2" autocomplete="off" autocapitalize="characters" spellcheck="false"></label></div><div class="actions"><button class="primary" data-action="verify" id="verify">Comprobar ID y empezar</button><button data-action="free" id="free">Practicar sin registro</button></div><p class="status" id="identityStatus" role="status" aria-live="polite"></p><p class="muted">Cada reto vale un punto. Las relaciones suman puntos parciales. Puedes pedir pistas: se registran y no restan. Cada respuesta se comprueba una vez.</p><details class="connection"><summary>Ajustes de conexión</summary><label for="endpoint">Código de conexión del profesor</label><input id="endpoint" type="password" autocomplete="off" spellcheck="false"><div class="actions"><button data-action="showEndpoint" aria-pressed="false" id="showEndpoint">Mostrar</button><button data-action="saveEndpoint">Aplicar conexión</button></div><p id="connectionStatus" class="status" role="status"></p></details></section><section id="quiz" hidden class="panel"></section><section id="result" hidden class="panel"></section></section>`;
 $('endpoint').value=S.endpoint;
 function status(id,message,kind=''){const a=$(id);a.textContent=message;a.className='status '+kind;}
 function tab(to){const ex=to==='explore';$('explore').hidden=!ex;$('challenge').hidden=ex;$('tabExplore').setAttribute('aria-pressed',ex);$('tabQuiz').setAttribute('aria-pressed',!ex);}
 function renderExplore(){
  if(app.id==='A1'){
   $('explore').innerHTML=`<h2>¿Qué guarda un tronco?</h2><div class="explore-layout"><div><div class="visual" id="exVisual">${V.visual('trunk',S.explore+1)}</div><div class="tools">${['Corteza','Cámbium','Albura','Duramen','Médula'].map((x,i)=>`<button data-part="${i}" aria-pressed="${i===S.explore}">${x}</button>`).join('')}</div></div><div><p id="exInfo" aria-live="polite">${stageInfo.A1[S.explore]}</p><h3>Una masa que cambia</h3><p>El volumen del taco es 100 cm³. Cambia su masa y observa la densidad.</p><label class="lab-label" for="mass">Masa del taco</label><input type="range" min="20" max="120" step="10" value="60" id="mass"><p id="labResult" class="lab-result" aria-live="polite">60 g ÷ 100 cm³ = 0,60 g/cm³</p><p class="muted">Datos didácticos. La masa de una pieza también depende de su tamaño; la densidad relaciona masa y volumen.</p></div></div>`;
  }else if(app.id==='A2'){
   const names=['Tala y desramado','Transporte','Descortezado','Aserrado','Secado','Cepillado y lijado','Tratamientos y acabados'];
   $('explore').innerHTML=`<h2>El recorrido de una pieza</h2><div class="explore-layout"><div class="visual">${V.visual('process')}</div><div><div class="step-number">${S.explore+1} / 7</div><h3>${names[S.explore]}</h3><p aria-live="polite">${stageInfo.A2[S.explore]}</p><div class="tools"><button data-action="stepPrev" ${S.explore===0?'disabled':''}>Anterior</button><button data-action="stepNext" ${S.explore===6?'disabled':''}>Siguiente etapa</button></div><p class="muted">Secuencia general: el orden concreto puede variar. Secar controla humedad, no elimina siempre toda el agua.</p></div></div><div class="field"><label for="commercial">Elige una forma comercial</label><select id="commercial"><option value="0">Tabla</option><option value="1">Tablón</option><option value="2">Listón</option><option value="3">Chapa</option></select><p id="formInfo" aria-live="polite">Pieza plana y alargada. Comprueba longitud, anchura y espesor.</p></div>`;
  }else if(app.id==='A3'){
   const kinds=['plywood','particle','mdf','hardboard'];
   $('explore').innerHTML=`<h2>Mira el canto</h2><div class="tools">${['Contrachapado','Aglomerado','DM o MDF','Fibras duras'].map((x,i)=>`<button data-part="${i}" aria-pressed="${i===S.explore}">${x}</button>`).join('')}</div><div class="explore-layout" style="margin-top:18px"><div class="visual">${V.visual(kinds[S.explore])}</div><div><h3>¿Chapas, partículas o fibras?</h3><p aria-live="polite">${stageInfo.A3[S.explore]}</p><p>La apariencia de la superficie puede ocultar la estructura. No todos los tableros sirven para humedad o exterior.</p></div></div><div class="resource"><h3>Otra transformación de las fibras</h3><p>Papel: obtener o recuperar fibras → mezcla con agua → formar lámina → retirar agua y prensar → secar y acabar.</p><p>El corcho procede de la corteza del alcornoque y se clasifica por separado de los tableros.</p></div>`;
  }else{
   $('explore').innerHTML=`<h2>Define antes de elegir</h2><div class="explore-layout"><div class="visual">${V.visual('case')}</div><div><p>Necesitamos una caja de tarjetas. Su material depende de la función y de las condiciones de uso.</p><label class="field" for="need">¿Qué quieres comprobar?<select id="need"><option value="prototype">Forma de un prototipo rápido</option><option value="lasting">Una solución duradera de interior</option><option value="outside">Uso expuesto a lluvia</option></select></label><p id="decisionInfo" class="lab-result" aria-live="polite">El cartón recuperado en buen estado puede servir para probar la forma y las medidas.</p></div></div><h3>Así se justifica una elección</h3><p>Para esta función elijo este material por esta propiedad, teniendo en cuenta esta limitación y esta medida de ahorro.</p><p class="muted">No hay un material que sea el mejor para todos los casos. El ejemplo no sustituye las pruebas de una pieza real.</p>`;
  }
 }
 function lockRegistration(value){$('verify').disabled=value;$('free').disabled=value;$('id1').disabled=value;$('id2').disabled=value;$('pair').disabled=value;}
 function start(mode,students=[]){S.mode=mode;S.students=students;S.idx=0;S.records=Array(10).fill(null);S.drafts=Array(10).fill(null);S.hints=Array(10).fill(false);S.startedAt=new Date().toISOString();S.submissionId=globalThis.crypto?.randomUUID?.()||('madera-'+Date.now()+'-'+Math.random().toString(36).slice(2));S.result=null;$('id1').value='';$('id2').value='';$('registration').hidden=true;$('result').hidden=true;$('quiz').hidden=false;renderQuiz();}
 async function verify(){
  if(S.busy)return;
  const ids=[E.normId($('id1').value)];if($('pair').checked)ids.push(E.normId($('id2').value));
  if(ids.some(x=>!x)){status('identityStatus','Introduce los ID necesarios.','error');return;}
  if(new Set(ids).size!==ids.length){status('identityStatus','Los dos ID deben ser distintos.','error');return;}
  S.busy=true;lockRegistration(true);status('identityStatus','Comprobando el registro…');
  try{const students=[];for(const id of ids)students.push(await C.lookup(S.endpoint,id));E.validateStudents(students);start('registered',students);}
  catch(e){status('identityStatus',e.message||'No se pudo comprobar el registro.','error');}
  finally{S.busy=false;lockRegistration(false);}
 }
 function readAnswer(q){if(q.type==='choice'){const x=document.querySelector('input[name="answer"]:checked');return x?Number(x.value):null;}if(q.type==='number')return $('numeric').value;return q.fields.map((_,i)=>$('f'+i).value);}
 function renderQuiz(){
  const q=app.questions[S.idx],r=S.records[S.idx],v=S.drafts[S.idx];
  let form='';
  if(q.type==='choice')form=`<div class="options" role="group" aria-label="Opciones de respuesta">${q.options.map((x,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${v===i?'checked':''} ${r?'disabled':''}><span>${esc(x)}</span></label>`).join('')}</div>`;
  else if(q.type==='number')form=`<label class="field" for="numeric">Respuesta en ${esc(q.unit)}<input id="numeric" inputmode="decimal" autocomplete="off" value="${esc(v??'')}" ${r?'disabled':''}></label>`;
  else form=q.fields.map((f,i)=>`<div class="field"><label for="f${i}">${esc(f.label)}</label><select id="f${i}" ${r?'disabled':''}><option value="">Elige…</option>${f.options.map(x=>`<option value="${esc(x)}" ${String(v?.[i])===String(x)?'selected':''}>${esc(x)}</option>`).join('')}</select></div>`).join('');
  const checked=S.records.filter(Boolean).length;
  $('quiz').innerHTML=`<div class="quiz-top"><span class="mini-label">${S.mode==='registered'?esc(S.students.map(x=>x.name).join(' · ')):'Práctica sin registro'}</span><span>${checked} / 10 comprobados <progress value="${checked}" max="10" aria-label="Retos comprobados">${checked}</progress></span></div><div class="eyebrow">Reto ${S.idx+1} / 10</div><h2 class="q-title" tabindex="-1" id="qHeading">${esc(q.title)}</h2><p>${esc(q.prompt)}</p><div class="q-layout"><div class="visual">${V.visual(q.visual)}</div><div>${form}<div class="tools" style="margin-top:18px"><button data-action="hint" ${S.hints[S.idx]?'disabled':''}>Pedir pista</button><button class="primary" data-action="check" ${r?'disabled':''}>Comprobar respuesta</button></div><p class="status" id="questionStatus" role="status" aria-live="polite"></p><div id="hint" class="hint" ${S.hints[S.idx]?'':'hidden'}>${esc(q.hint)}</div></div></div>${r?feedback(q,r):''}<div class="quiz-nav"><button data-action="prev" ${S.idx===0?'disabled':''}>Anterior</button><button class="primary" data-action="next" ${r?'':'disabled'}>${S.idx===9?'Finalizar y guardar':'Siguiente reto →'}</button></div>`;
 }
 function feedback(q,r){return `<div class="feedback ${r.score<1?'partial':''}" role="status"><strong>${r.score===1?'Bien razonado':r.score>0?'Hay relaciones correctas':'Revisa la explicación'} · ${fmt(r.score)} / 1</strong><p>${esc(q.explain)}</p><ul>${r.details.map(x=>`<li>${esc(x.label)}: ${x.correct?'correcto':'respuesta adecuada: '+esc(x.expected)}</li>`).join('')}</ul></div>`;}
 function persist(){
  try{if(S.pending)sessionStorage.setItem(key,JSON.stringify(S.pending));else sessionStorage.removeItem(key);S.storageWarning=false;}
  catch{S.storageWarning=true;}
 }
 function finish(){
  if(S.records.some(x=>!x))return;
  if(!S.result){S.result={activity:'1ESO_T3_'+app.id,title:app.title,submissionId:S.submissionId,score:Number(S.records.reduce((s,r)=>s+r.score,0).toFixed(4)),maximo:10,records:S.records.map((r,i)=>({...r,id:app.questions[i].id,title:app.questions[i].title})),hints:S.hints,startedAt:S.startedAt,finishedAt:new Date().toISOString(),url:location.href};}
  if(S.mode==='registered'&&!S.pending){S.pending={result:S.result,students:S.students.map(({id,course,group})=>({id,course,group})),endpoint:S.endpoint,confirmed:[],uncertain:false};persist();}
  renderResult();if(S.pending)send(false);
 }
 function renderResult(){
  const r=S.result;if(!r)return;
  $('registration').hidden=true;$('quiz').hidden=true;$('result').hidden=false;
  $('result').innerHTML=`<p class="eyebrow">Trabajo terminado</p><h2 tabindex="-1" id="resultHeading">Tu resultado</h2><div class="score">${fmt(r.score)} <small>/ 10</small></div><p>Diez retos de un punto. Las relaciones pueden sumar puntos parciales. Pistas utilizadas: ${r.hints.filter(Boolean).length}; no restan puntos.</p><div class="table-scroll"><table><thead><tr><th>Reto</th><th>Trabajo</th><th>Puntos</th></tr></thead><tbody>${r.records.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.title)}</td><td>${fmt(x.score)} / 1</td></tr>`).join('')}</tbody></table></div><p class="status raw-error" id="sendStatus" role="status" aria-live="polite"></p><div class="actions"><button class="primary" data-action="retry" id="retry" ${S.pending?'':'hidden'}>Reintentar el mismo envío</button><button data-action="download">Descargar resultado</button><button data-action="reset" id="reset">Cambiar de alumno o empezar de nuevo</button></div><p class="muted">${S.pending?'El resultado pendiente se conserva en esta pestaña si el navegador permite almacenamiento de sesión. Descarga una copia antes de cerrar.':'El perfil del alumno no se guarda en el dispositivo.'}</p>`;
  if(S.pending)status('sendStatus','Resultado pendiente de confirmación. Confirmados: '+S.pending.confirmed.length+' de '+S.pending.students.length+'.');
  else status('sendStatus',S.mode==='registered'?'Guardado confirmado para todos los ID del intento.':'Práctica sin registro: resultado calculado, sin envío al profesor.',S.mode==='registered'?'ok':'');
  if(S.storageWarning)status('sendStatus','El navegador no permite conservar el pendiente al recargar. Mantén abierta esta página y descarga una copia.','error');
 }
 async function send(retry){
  if(!S.pending||S.sending)return;
  const p=S.pending;
  if(retry&&p.uncertain&&!confirm('El envío anterior no tuvo confirmación. Comprueba con el profesor si ya figura en el registro para evitar duplicados. ¿Reintentar el mismo envío?'))return;
  S.sending=true;$('retry').disabled=true;$('reset').disabled=true;status('sendStatus','Enviando el resultado al registro del profesor…');
  try{
   for(const student of p.students){
    if(p.confirmed.includes(student.id))continue;
    p.uncertain=true;persist();
    const data=await C.submitOne(p.endpoint,p.result,student);
    if(E.norm(data.curso)!==E.norm(student.course)||E.norm(data.grupo)!==E.norm(student.group))throw Error('El curso o el grupo confirmado no coincide con el registro consultado. Revísalo con el profesor.');
    p.confirmed.push(student.id);p.uncertain=false;persist();
   }
   S.pending=null;persist();$('retry').hidden=true;status('sendStatus','El servidor ha confirmado el guardado para '+(p.students.length===2?'los dos ID.':'tu ID.'),'ok');
  }catch(e){status('sendStatus',(e.message||'No se pudo confirmar el envío.')+'\nConfirmados: '+p.confirmed.length+' de '+p.students.length+'. El resultado queda pendiente. Descarga una copia y consulta al profesor antes de reintentar.','error');$('retry').hidden=false;}
  finally{S.sending=false;$('retry').disabled=false;$('reset').disabled=false;}
 }
 function download(){if(!S.result)return;const data={...S.result,registered:S.mode==='registered',studentIds:S.pending?S.pending.students.map(x=>x.id):S.students.map(x=>x.id),confirmedIds:S.pending?.confirmed??(S.mode==='registered'?S.students.map(x=>x.id):[]),pending:!!S.pending};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Madera_'+app.id+'_resultado.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
 function reset(){if(S.sending)return;if(S.pending){status('sendStatus','Primero confirma el envío pendiente o descarga el resultado y revísalo con el profesor. El intento se mantiene protegido.','error');return;}S.mode='';S.students=[];S.result=null;$('quiz').hidden=true;$('result').hidden=true;$('registration').hidden=false;$('pair').checked=false;$('secondId').hidden=true;$('id1').value='';$('id2').value='';status('identityStatus','');$('id1').focus();}
 root.addEventListener('click',e=>{
  const part=e.target.closest('[data-part]');if(part){S.explore=Number(part.dataset.part);renderExplore();return;}
  const b=e.target.closest('[data-action]');if(!b||b.disabled)return;
  const action=b.dataset.action;
  if(action==='tabExplore')tab('explore');else if(action==='tabQuiz')tab('quiz');
  else if(action==='stepPrev'||action==='stepNext'){S.explore=Math.max(0,Math.min(6,S.explore+(action==='stepPrev'?-1:1)));renderExplore();}
  else if(action==='free'&&!S.busy)start('free');else if(action==='verify')verify();
  else if(action==='showEndpoint'){const show=$('endpoint').type==='password';$('endpoint').type=show?'text':'password';b.textContent=show?'Ocultar':'Mostrar';b.setAttribute('aria-pressed',show);}
  else if(action==='saveEndpoint'){if(S.busy)return;const value=$('endpoint').value.trim();if(!C.validEndpoint(value)){status('connectionStatus','Utiliza una URL de Apps Script válida terminada en /exec.','error');return;}S.endpoint=value;try{localStorage.setItem('madera-endpoint',value);}catch{}status('connectionStatus','Conexión aplicada.','ok');}
  else if(action==='hint'){S.hints[S.idx]=true;$('hint').hidden=false;b.disabled=true;}
  else if(action==='check'){const q=app.questions[S.idx];if(S.records[S.idx])return;const v=readAnswer(q);try{const r=E.evaluate(q,v);S.drafts[S.idx]=v;S.records[S.idx]=r;renderQuiz();}catch(err){status('questionStatus',err.message,'error');}}
  else if(action==='prev'){S.drafts[S.idx]=readAnswer(app.questions[S.idx]);S.idx--;renderQuiz();$('qHeading').focus();}
  else if(action==='next'){if(!S.records[S.idx])return;if(S.idx===9){finish();$('resultHeading').focus();}else{S.idx++;renderQuiz();$('qHeading').focus();}}
  else if(action==='retry')send(true);else if(action==='download')download();else if(action==='reset')reset();
 });
 root.addEventListener('input',e=>{if(e.target.id==='mass')$('labResult').textContent=e.target.value+' g ÷ 100 cm³ = '+(Number(e.target.value)/100).toLocaleString('es-ES',{minimumFractionDigits:2})+' g/cm³';});
 root.addEventListener('change',e=>{
  if(e.target.id==='pair'){$('secondId').hidden=!e.target.checked;if(!e.target.checked)$('id2').value='';}
  if(e.target.id==='commercial')$('formInfo').textContent=['Pieza plana y alargada. Comprueba longitud, anchura y espesor.','Pieza de mayor espesor respecto a una tabla. Consulta sus medidas.','Pieza larga de sección relativamente pequeña; puede servir en marcos y apoyos.','Lámina fina de madera para revestir o fabricar contrachapado.'][Number(e.target.value)];
  if(e.target.id==='need')$('decisionInfo').textContent={prototype:'El cartón recuperado en buen estado puede servir para probar la forma y las medidas.',lasting:'Valora un recorte de contrachapado o una pieza adecuada: espesor, estado, dimensiones y uniones importan.',outside:'Comprueba que el producto sea adecuado para exterior. Pintarlo no garantiza que soporte la lluvia.'}[e.target.value];
 });
 root.addEventListener('keydown',e=>{if(e.key==='Enter'&&['id1','id2'].includes(e.target.id)){e.preventDefault();verify();}});
 window.addEventListener('beforeunload',e=>{if(S.pending){e.preventDefault();e.returnValue='';}});
 renderExplore();
 try{const raw=sessionStorage.getItem(key);if(raw){const p=JSON.parse(raw);if(p.result?.activity==='1ESO_T3_'+app.id&&Array.isArray(p.students)&&Array.isArray(p.confirmed)){S.pending=p;S.result=p.result;S.mode='registered';S.students=p.students;renderResult();tab('quiz');}}}catch{}
})();
