(function(){
 'use strict';
 const E=window.MaderaEval,C=window.MaderaCentral,V=window.MaderaVisual,apps=window.MADERA_APPS;
 const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=n=>Number(n).toLocaleString('es-ES',{maximumFractionDigits:2});
 const app=apps.find(a=>a.id===document.body.dataset.app);
 const root=$('appRoot');
 const listView=!app;
 const stageInfo={
  A1:[
   {name:'Corteza',where:'Es la cubierta exterior del tronco.',features:['Protege los tejidos interiores frente a golpes y condiciones del entorno.','Se encuentra por fuera del cámbium; no forma parte de la madera.']},
   {name:'Cámbium',where:'Es una capa muy fina situada entre la corteza y la madera.',features:['Sus células originan nuevos tejidos y permiten que el tronco crezca en grosor.','Forma madera hacia el interior. El detalle ampliado ayuda a localizar esta capa tan estrecha.']},
   {name:'Albura',where:'Es la madera exterior más reciente, situada por dentro del cámbium.',features:['Participa en el transporte de agua y sales minerales desde las raíces.','Suele ser más clara que el duramen, aunque el contraste depende de la especie.']},
   {name:'Duramen',where:'Es la madera interior más antigua, alrededor de la médula.',features:['Ya no realiza el transporte de agua y sales minerales de la albura.','Mantiene una función de soporte; en muchas especies es más oscuro.']},
   {name:'Médula',where:'Es la pequeña zona central del tronco.',features:['Se formó cuando el tallo era joven.','No debe confundirse con el duramen: la médula ocupa el centro y el duramen la rodea.']}
  ],
  A2:['Se corta el árbol seleccionado y se retiran ramas.','Se trasladan los troncos a las instalaciones.','Se retira la corteza.','Se divide el tronco con sierras para obtener piezas.','Se reduce y controla la humedad para el uso previsto.','Se regularizan y suavizan las superficies.','Se aplican acabados o tratamientos apropiados cuando proceden.'],
  A3:['Contrachapado: chapas encoladas y fibras cruzadas; en el canto se distinguen capas.','Aglomerado: partículas o virutas unidas con resinas y prensadas.','DM o MDF: fibras desfibradas, unidas y prensadas; estructura fina y uniforme.','Tablero de fibras duro o táblex: tablero fino empleado en traseras y fondos de cajones.'],
 };
 if(listView){
  root.innerHTML=`<section class="hero"><div><p class="eyebrow">Tema 3 · 1.º ESO</p><h1>La madera y sus derivados</h1><p class="stage-intro">Observa, compara y decide. Cuatro estaciones para comprender los materiales que proceden de los árboles.</p><div class="chips"><span class="chip">4 apps</span><span class="chip">40 retos</span><span class="chip">Individual o pareja</span></div></div><div class="hero-art">${V.visual('trunk')}</div></section><section class="grid" aria-label="Actividades del tema">${apps.map(a=>`<a class="card" href="./${a.file}"><small>${esc(a.id)} · ${esc(a.time)}</small><h2>${esc(a.title)}</h2><div class="visual">${V.visual({A1:'trunk',A2:'process',A3:'boards',A4:'case'}[a.id])}</div><p>${esc(a.intro)}</p><span class="arrow">Abrir actividad →</span></a>`).join('')}</section><section class="panel resource"><h2>Del árbol al papel</h2><p>En el recurso propuesto por el profesor, observa una materia prima, una transformación y un producto. Compara lo observado con el esquema trabajado en clase.</p><a class="button" href="https://www.youtube.com/watch?v=_IRHM_EPjnY&amp;t=284s" target="_blank" rel="noopener noreferrer">Vídeo sobre la fabricación del papel ↗</a></section>`;
  return;
 }
 const key='madera-pdi-v2-'+app.id,legacyKey='madera-pendiente-'+app.id;
 const S={mode:'',students:[],idx:0,records:[],drafts:[],hints:[],startedAt:'',submissionId:'',result:null,pending:null,sending:false,busy:false,explore:0,endpoint:C.DEFAULT_ENDPOINT,storageWarning:false,sent:false,review:false};
 let receipts=[];
 try{const e=localStorage.getItem('madera-endpoint');if(e&&C.validEndpoint(e))S.endpoint=e;}catch{}
 try{
  receipts=JSON.parse(sessionStorage.getItem(key+'-recibos')||'[]');if(!Array.isArray(receipts))receipts=[];
  const raw=sessionStorage.getItem(key)||sessionStorage.getItem(legacyKey);
  if(raw){const p=JSON.parse(raw),ids=p.ids||p.students?.map(x=>x.id);
   if(p.result?.activity==='1ESO_T3_'+app.id&&ids?.length&&Array.isArray(p.confirmed)&&!receipts.includes(p.result.submissionId)){
    S.pending={result:p.result,ids:[...ids],confirmed:p.confirmed.filter(x=>ids.includes(x)),endpoint:p.endpoint||S.endpoint,uncertain:!!p.uncertain};
    S.result=p.result;S.endpoint=S.pending.endpoint;persist();sessionStorage.removeItem(legacyKey);
   }
  }
 }catch{S.storageWarning=true;}
 root.innerHTML=`<section class="hero"><div><p class="eyebrow">${app.id} · Tema 3 · 1.º ESO</p><h1>${esc(app.title)}</h1><p>${esc(app.intro)}</p></div><div class="hero-art">${V.visual({A1:'trunk',A2:'process',A3:'boards',A4:'case'}[app.id])}</div></section>
 <section id="registration" class="panel entry"><h2>Entra con tu ID</h2><p>Introduce el ID que te ha facilitado el profesor.</p><label><input id="pair" type="checkbox"> Trabajamos en pareja</label><div class="ids"><label class="field" for="id1">Tu ID<input id="id1" autocomplete="off" autocapitalize="characters" spellcheck="false"></label><label class="field" for="id2" id="secondId" hidden>Segundo ID<input id="id2" autocomplete="off" autocapitalize="characters" spellcheck="false"></label></div><button class="primary" data-action="verify" id="verify">Entrar</button><p class="status" id="identityStatus" role="status" aria-live="polite"></p><p id="pendingEntry" class="pending-note" ${S.pending?'':'hidden'}>Hay un resultado pendiente. Introduce los mismos ID para recuperarlo sin repetir los retos.</p><details class="connection"><summary>Conexión</summary><label for="endpoint">Código de conexión del profesor</label><input id="endpoint" type="password" autocomplete="off" spellcheck="false"><div class="actions"><button data-action="showEndpoint" aria-pressed="false" id="showEndpoint">Mostrar</button><button data-action="saveEndpoint">Aplicar conexión</button></div><p id="connectionStatus" class="status" role="status"></p></details></section>
 <section id="workspace" hidden><section class="identity-bar"><div><p id="greeting"></p><p id="testBadge" class="test-badge" hidden>MODO PRUEBA · NX-01</p></div><button data-action="changeStudent" id="changeStudent">Cambiar de alumno</button></section>
 <section id="hub" class="panel"><h2>¿Cómo quieres trabajar?</h2><div class="mode-grid"><button class="mode-card practice" data-action="practice"><span class="mode-icon" aria-hidden="true">↗</span><strong>PRACTICAR SIN NOTA</strong><span>Explora y ensaya los diez retos. No se envía calificación.</span></button><button class="mode-card graded" data-action="graded" id="gradedCard"><span class="mode-icon" aria-hidden="true">✓</span><strong>ACTIVIDAD EVALUABLE</strong><span>${esc(app.title)} · 10 retos · 10 puntos. Cuenta para la nota y se envía al terminar.</span></button></div><p class="score-rules">En la actividad evaluable, un consejo reduce de 1 a 0,5 puntos el valor de un acierto. Un error vale 0. Las relaciones conservan su puntuación parcial, reducida a la mitad si pides consejo.</p></section>
 <section id="activity" hidden><div class="activity-bar"><p id="modeLabel" class="mode-label"></p><button data-action="home" id="home">Volver a las opciones</button></div><nav class="tabs" id="practiceTabs" hidden aria-label="Práctica sin nota"><button data-action="tabExplore" id="tabExplore" aria-pressed="true">Explorar</button><button data-action="tabQuiz" id="tabQuiz" aria-pressed="false">Ensayar los retos</button></nav><section id="explore" class="panel" hidden></section><section id="quiz" class="panel" hidden></section><section id="result" class="panel" hidden></section></section></section>`;
 $('endpoint').value=S.endpoint;
 function status(id,message,kind=''){const a=$(id);a.textContent=message;a.className='status '+kind;}
 function persist(){try{if(S.pending)sessionStorage.setItem(key,JSON.stringify(S.pending));else sessionStorage.removeItem(key);S.storageWarning=false;}catch{S.storageWarning=true;}}
 function lockRegistration(v){['verify','id1','id2','pair'].forEach(id=>$(id).disabled=v);}
 function isTest(){return S.students.length===1&&S.students[0].id==='NX-01'&&S.students[0].modo_prueba===true;}
 function greet(){
  $('greeting').textContent=isTest()?'USUARIO DE PRUEBA':'Hola, '+S.students.map(x=>x.name).join(' y ')+' · Grupo '+S.students[0].group;
  $('testBadge').hidden=!isTest();$('workspace').classList.toggle('test-session',isTest());
 }
 async function verify(){
  if(S.busy)return;
  let first=E.normId($('id1').value),second=E.normId($('id2').value),ids=[first];
  if(first==='NX-01'){
   if(second){status('identityStatus','NX-01 se utiliza solo. Deja vacío el segundo ID.','error');return;}
  }else{
   if(second==='NX-01'){status('identityStatus','NX-01 se utiliza solo en el primer campo.','error');return;}
   if($('pair').checked)ids.push(second);
  }
  if(ids.some(x=>!x)){status('identityStatus','Introduce los ID necesarios.','error');return;}
  if(new Set(ids).size!==ids.length){status('identityStatus','Los dos ID deben ser distintos.','error');return;}
  if(S.pending&&[...ids].sort().join('|')!==[...S.pending.ids].sort().join('|')){status('identityStatus','Hay un envío pendiente: introduce los mismos ID del intento para recuperarlo.','error');return;}
  S.busy=true;lockRegistration(true);status('identityStatus','Comprobando el ID…');
  try{
   const students=[];for(const id of ids)students.push(await C.lookup(S.endpoint,id));E.validateStudents(students);S.students=students;greet();
   $('id1').value='';$('id2').value='';$('registration').hidden=true;$('workspace').hidden=false;
   if(S.pending){S.result=S.pending.result;S.mode='registered';S.submissionId=S.result.submissionId;S.sent=false;showActivity();renderResult();}
   else showHub();
  }catch(e){S.students=[];status('identityStatus',e.message||'No se pudo comprobar el registro.','error');}
  finally{S.busy=false;lockRegistration(false);}
 }
 function showHub(){
  $('hub').hidden=false;$('activity').hidden=true;
  $('gradedCard').querySelector('strong').textContent=S.sent?'ACTIVIDAD ENVIADA · REVISAR':'ACTIVIDAD EVALUABLE';
 }
 function showActivity(){
  $('hub').hidden=true;$('activity').hidden=false;$('explore').hidden=true;$('quiz').hidden=true;$('result').hidden=true;
  $('practiceTabs').hidden=S.mode!=='practice';$('home').disabled=!!S.pending||S.sending;
  $('modeLabel').textContent=S.review?'REVISIÓN · NOTA YA CERRADA':S.mode==='practice'?'PRACTICAR · SIN NOTA':'ACTIVIDAD EVALUABLE · CUENTA PARA LA NOTA';
  $('modeLabel').className='mode-label '+(S.mode==='practice'?'practice-label':'graded-label');
 }
 function begin(mode){
  if(!S.students.length||S.pending||S.sending)return;
  if(mode==='registered'&&S.sent){S.mode=mode;showActivity();renderResult();return;}
  S.mode=mode;S.review=false;S.idx=0;S.records=Array(10).fill(null);S.drafts=Array(10).fill(null);S.hints=Array(10).fill(false);
  S.result=null;S.startedAt=new Date().toISOString();S.submissionId=globalThis.crypto?.randomUUID?.()||('madera-'+Date.now()+'-'+Math.random().toString(36).slice(2));
  showActivity();if(mode==='practice')tab('explore');else{$('quiz').hidden=false;renderQuiz();}
 }
 function tab(to){if(S.mode!=='practice')return;const ex=to==='explore';$('explore').hidden=!ex;$('quiz').hidden=ex;$('result').hidden=true;$('tabExplore').setAttribute('aria-pressed',ex);$('tabQuiz').setAttribute('aria-pressed',!ex);if(ex)renderExplore();else renderQuiz();}
  function renderExplore(){
  if(app.id==='A1'){
   $('explore').innerHTML=`<h2>¿Qué guarda un tronco?</h2><div class="explore-layout"><div><div class="visual" id="exVisual">${V.visual('trunk',S.explore+1)}</div><div class="tools">${['Corteza','Cámbium','Albura','Duramen','Médula'].map((x,i)=>`<button data-part="${i}" aria-pressed="${i===S.explore}">${x}</button>`).join('')}</div></div><div><section id="exInfo" class="part-info" aria-live="polite" aria-atomic="true"><p class="mini-label">Parte ${S.explore+1} de 5 · resaltada en amarillo</p><h3>${stageInfo.A1[S.explore].name}</h3><p>${stageInfo.A1[S.explore].where}</p><ul>${stageInfo.A1[S.explore].features.map(x=>`<li>${x}</li>`).join('')}</ul></section><h3>Una masa que cambia</h3><p>El volumen del taco es 100 cm³. Cambia su masa y observa la densidad.</p><label class="lab-label" for="mass">Masa del taco</label><input type="range" min="20" max="120" step="10" value="60" id="mass"><p id="labResult" class="lab-result" aria-live="polite">60 g ÷ 100 cm³ = 0,60 g/cm³</p><p class="muted">Datos didácticos. La masa de una pieza también depende de su tamaño; la densidad relaciona masa y volumen.</p></div></div>`;
  }else if(app.id==='A2'){
   const names=['Tala y desramado','Transporte','Descortezado','Aserrado','Secado','Cepillado y lijado','Tratamientos y acabados'];
   $('explore').innerHTML=`<h2>El recorrido de una pieza</h2><div class="explore-layout"><div class="visual">${V.visual('process',S.explore+1)}</div><div><div class="step-number">${S.explore+1} / 7</div><h3>${names[S.explore]}</h3><p aria-live="polite">${stageInfo.A2[S.explore]}</p><div class="tools"><button data-action="stepPrev" ${S.explore===0?'disabled':''}>Anterior</button><button data-action="stepNext" ${S.explore===6?'disabled':''}>Siguiente etapa</button></div><p class="muted">Secuencia general: el orden concreto puede variar. Secar controla humedad, no elimina siempre toda el agua.</p></div></div><div class="field"><label for="commercial">Elige una forma comercial</label><select id="commercial"><option value="0">Tabla</option><option value="1">Tablón</option><option value="2">Listón</option><option value="3">Chapa</option></select><p id="formInfo" aria-live="polite">Pieza plana y alargada. Comprueba longitud, anchura y espesor.</p></div>`;
  }else if(app.id==='A3'){
   const kinds=['plywood','particle','mdf','hardboard'];
   $('explore').innerHTML=`<h2>Mira el canto</h2><div class="tools">${['Contrachapado','Aglomerado','DM o MDF','Fibras duras'].map((x,i)=>`<button data-part="${i}" aria-pressed="${i===S.explore}">${x}</button>`).join('')}</div><div class="explore-layout" style="margin-top:18px"><div class="visual">${V.visual(kinds[S.explore])}</div><div><h3>¿Chapas, partículas o fibras?</h3><p aria-live="polite">${stageInfo.A3[S.explore]}</p><p>La apariencia de la superficie puede ocultar la estructura. No todos los tableros sirven para humedad o exterior.</p></div></div><div class="resource"><h3>Otra transformación de las fibras</h3><p>Papel: obtener o recuperar fibras → mezcla con agua → formar lámina → retirar agua y prensar → secar y acabar.</p><p>El corcho procede de la corteza del alcornoque y se clasifica por separado de los tableros.</p></div>`;
  }else{
   $('explore').innerHTML=`<h2>Define antes de elegir</h2><div class="explore-layout"><div class="visual">${V.visual('case')}</div><div><p>Necesitamos una caja de tarjetas. Su material depende de la función y de las condiciones de uso.</p><label class="field" for="need">¿Qué quieres comprobar?<select id="need"><option value="prototype">Forma de un prototipo rápido</option><option value="lasting">Una solución duradera de interior</option><option value="outside">Uso expuesto a lluvia</option></select></label><p id="decisionInfo" class="lab-result" aria-live="polite">El cartón recuperado en buen estado puede servir para probar la forma y las medidas.</p></div></div><h3>Así se justifica una elección</h3><p>Para esta función elijo este material por esta propiedad, teniendo en cuenta esta limitación y esta medida de ahorro.</p><p class="muted">No hay un material que sea el mejor para todos los casos. El ejemplo no sustituye las pruebas de una pieza real.</p>`;
  }
 }

  function readAnswer(q){if(q.type==='choice'){const x=document.querySelector('input[name="answer"]:checked');return x?Number(x.value):null;}if(q.type==='number')return $('numeric').value;return q.fields.map((_,i)=>$('f'+i).value);}

 function renderQuiz(){
  const q=app.questions[S.idx],r=S.records[S.idx],v=S.drafts[S.idx],graded=S.mode==='registered';let form='';
  if(q.type==='choice')form=`<div class="options" role="group" aria-label="Opciones de respuesta">${q.options.map((x,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${v===i?'checked':''} ${r?'disabled':''}><span>${esc(x)}</span></label>`).join('')}</div>`;
  else if(q.type==='number')form=`<label class="field" for="numeric">Respuesta en ${esc(q.unit)}<input id="numeric" inputmode="decimal" autocomplete="off" value="${esc(v??'')}" ${r?'disabled':''}></label>`;
  else form=q.fields.map((f,i)=>`<div class="field"><label for="f${i}">${esc(f.label)}</label><select id="f${i}" ${r?'disabled':''}><option value="">Elige…</option>${f.options.map(x=>`<option value="${esc(x)}" ${String(v?.[i])===String(x)?'selected':''}>${esc(x)}</option>`).join('')}</select></div>`).join('');
  const checked=S.records.filter(Boolean).length;
  $('quiz').innerHTML=`<div class="quiz-top"><span class="mini-label">${isTest()?'MODO PRUEBA · NX-01':esc(S.students.map(x=>x.name).join(' · '))}</span><span>${checked} / 10 comprobados <progress value="${checked}" max="10" aria-label="Retos comprobados">${checked}</progress></span></div><div class="eyebrow">Reto ${S.idx+1} / 10</div><h2 class="q-title" tabindex="-1" id="qHeading">${esc(q.title)}</h2><p>${esc(q.prompt)}</p><div class="q-layout"><div class="visual">${V.visual(q.visual)}</div><div>${form}<div class="tools" style="margin-top:18px"><button data-action="hint" ${S.hints[S.idx]||r?'disabled':''}>${graded?'Ver consejo · acierto: 0,5 puntos':'Ver consejo · sin descuento'}</button><button class="primary" data-action="check" ${r?'disabled':''}>Comprobar respuesta</button></div><p class="status" id="questionStatus" role="status" aria-live="polite"></p><div id="hint" class="hint" ${S.hints[S.idx]?'':'hidden'}>${esc(q.hint)}</div></div></div>${r?feedback(q,r):''}<div class="quiz-nav"><button data-action="prev" ${S.idx===0?'disabled':''}>Anterior</button><button class="primary" data-action="next" ${r?'':'disabled'}>${S.idx===9?(S.review?'Volver al resultado':graded?'Finalizar actividad':'Ver resultado de práctica'):'Siguiente reto →'}</button></div>`;
 }
 function feedback(q,r){return `<div class="feedback ${r.rawScore<1?'partial':''}" role="status"><strong>${r.rawScore===1?'Bien razonado':r.rawScore>0?'Hay relaciones correctas':'Revisa la explicación'} · ${fmt(r.score)} / 1</strong>${r.hintUsed&&S.mode==='registered'?`<p>Consejo aplicado: máximo 0,5 puntos en este reto. Descuento: ${fmt(r.hintDeduction)} puntos.</p>`:''}<p>${esc(q.explain)}</p><ul>${r.details.map(x=>`<li>${esc(x.label)}: ${x.correct?'correcto':'respuesta adecuada: '+esc(x.expected)}</li>`).join('')}</ul></div>`;}
 function finish(){
  if(S.records.some(x=>!x)||S.review){renderResult();return;}
  if(!S.result)S.result=JSON.parse(JSON.stringify({activity:'1ESO_T3_'+app.id,title:app.title,submissionId:S.submissionId,score:Number(S.records.reduce((s,r)=>s+r.score,0).toFixed(4)),maximo:10,records:S.records.map((r,i)=>({...r,id:app.questions[i].id,title:app.questions[i].title})),hints:[...S.hints],startedAt:S.startedAt,finishedAt:new Date().toISOString(),url:location.href}));
  if(S.mode==='registered'&&!S.sent&&!S.pending&&!receipts.includes(S.result.submissionId)){S.pending={result:S.result,ids:S.students.map(x=>x.id),endpoint:S.endpoint,confirmed:[],uncertain:false};persist();}
  renderResult();if(S.pending)send();
 }
 function renderResult(){
  const r=S.result;if(!r)return;S.review=false;showActivity();$('explore').hidden=true;$('quiz').hidden=true;$('result').hidden=false;$('practiceTabs').hidden=true;
  $('result').innerHTML=`<p class="eyebrow">${S.mode==='practice'?'Práctica sin nota':'Actividad terminada'}</p><h2 tabindex="-1" id="resultHeading">Tu resultado</h2><div class="score">${fmt(r.score)} <small>/ 10</small></div><p>Consejos utilizados: ${r.hints.filter(Boolean).length}. ${S.mode==='registered'?'La puntuación incluye los descuentos anunciados.':'Esta práctica no envía calificación.'}</p><div id="sendStatus" class="send-banner" role="status" aria-live="polite"></div><div class="table-scroll"><table><thead><tr><th>Reto</th><th>Trabajo</th><th>Puntos</th><th>Consejo</th></tr></thead><tbody>${r.records.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.title)}</td><td>${fmt(x.score)} / 1</td><td>${r.hints[i]?'Sí':'No'}</td></tr>`).join('')}</tbody></table></div><div class="actions"><button class="primary" data-action="retry" id="retry" ${S.pending?'':'hidden'}>Reintentar</button><button data-action="review" ${S.pending?'disabled':''}>Revisar respuestas</button><button data-action="download">Descargar resultado</button><button data-action="home" ${S.pending?'disabled':''}>Volver a las opciones</button></div>`;
  updateSend();
 }
 function updateSend(message='',kind=''){
  if(!$('sendStatus'))return;
  let text=message|| (S.pending?'Resultado pendiente de envío.':S.mode==='practice'?'PRÁCTICA SIN NOTA · No se ha enviado calificación.':S.sent?'ENVIADO':'Resultado pendiente de confirmación.');
  $('sendStatus').textContent=text;$('sendStatus').className='send-banner '+(kind||(S.sent&&S.mode==='registered'?'sent':S.mode==='practice'?'practice-label':'pending'));
  if($('retry')){$('retry').hidden=!S.pending;$('retry').disabled=S.sending;}
  $('changeStudent').disabled=!!S.pending||S.sending;$('home').disabled=!!S.pending||S.sending;
 }
 async function send(){
  if(!S.pending||S.sending||!S.students.length)return;
  const p=S.pending;if(receipts.includes(p.result.submissionId))return;
  S.sending=true;updateSend('Enviando…','sending');
  try{
   for(const id of p.ids){
    if(p.confirmed.includes(id))continue;
    const student=S.students.find(x=>x.id===id);if(!student)throw Error('Comprueba de nuevo los ID del intento.');
    p.uncertain=true;persist();
    const data=await C.submitOne(p.endpoint,p.result,student);
    if(!student.modo_prueba&&(E.norm(data.curso)!==E.norm(student.course)||E.norm(data.grupo)!==E.norm(student.group)))throw Error('El grupo o el curso confirmado no coincide con el alumno validado.');
    p.confirmed.push(id);p.uncertain=false;persist();
   }
   if(p.confirmed.length!==p.ids.length)throw Error('Faltan confirmaciones del servidor.');
   receipts.push(p.result.submissionId);try{sessionStorage.setItem(key+'-recibos',JSON.stringify(receipts));}catch{}
   S.sent=true;S.pending=null;persist();updateSend('ENVIADO','sent');
   $('result').querySelectorAll('[data-action="review"],[data-action="home"]').forEach(b=>b.disabled=false);
  }catch(e){updateSend((e.message||'No se pudo confirmar el envío.')+' Confirmados: '+p.confirmed.length+' de '+p.ids.length+'. El resultado se conserva. Pulsa Reintentar.'+(S.storageWarning?' Mantén esta pestaña abierta y descarga una copia.':''),'failed');}
  finally{S.sending=false;updateSend($('sendStatus').textContent,$('sendStatus').classList.contains('sent')?'sent':S.pending?'failed':'sent');}
 }
 function review(){if(S.pending||!S.result)return;S.review=true;S.records=JSON.parse(JSON.stringify(S.result.records));S.hints=[...S.result.hints];S.drafts=S.records.map((r,i)=>app.questions[i].type==='choice'?app.questions[i].options.indexOf(r.details[0].actual):app.questions[i].type==='number'?r.details[0].actual:r.details.map(d=>d.actual));S.idx=0;showActivity();$('quiz').hidden=false;renderQuiz();}
 function home(){if(S.pending||S.sending)return;if(S.mode==='registered'&&S.result&&S.sent){S.savedGraded={result:S.result,records:S.records,drafts:S.drafts,hints:S.hints};}showHub();}
 function changeStudent(){if(S.pending||S.sending)return;S.students=[];S.result=null;S.sent=false;S.review=false;S.savedGraded=null;$('workspace').hidden=true;$('registration').hidden=false;$('pair').checked=false;$('secondId').hidden=true;$('id1').value='';$('id2').value='';status('identityStatus','');$('id1').focus();}
 function download(){if(!S.result)return;const data={...S.result,studentIds:S.pending?.ids||S.students.map(x=>x.id),confirmedIds:S.pending?.confirmed||(S.mode==='registered'&&S.sent?S.students.map(x=>x.id):[]),pending:!!S.pending,practice:S.mode==='practice'};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Madera_'+app.id+'_resultado.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
 root.addEventListener('click',e=>{
  const part=e.target.closest('[data-part]');if(part){S.explore=Number(part.dataset.part);renderExplore();root.querySelector(`[data-part="${S.explore}"]`).focus();return;}
  const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const action=b.dataset.action;
  if(action==='verify')verify();else if(action==='changeStudent')changeStudent();else if(action==='practice')begin('practice');
  else if(action==='graded'){if(S.sent&&S.savedGraded){Object.assign(S,S.savedGraded);S.mode='registered';showActivity();renderResult();}else begin('registered');}
  else if(action==='home')home();else if(action==='tabExplore')tab('explore');else if(action==='tabQuiz')tab('quiz');
  else if(action==='stepPrev'||action==='stepNext'){S.explore=Math.max(0,Math.min(6,S.explore+(action==='stepPrev'?-1:1)));renderExplore();}
  else if(action==='hint'){if(S.records[S.idx]||S.review)return;S.hints[S.idx]=true;$('hint').hidden=false;b.disabled=true;}
  else if(action==='check'){if(S.records[S.idx]||S.review)return;const q=app.questions[S.idx],v=readAnswer(q);try{S.records[S.idx]=E.applyHint(E.evaluate(q,v),S.hints[S.idx],S.mode==='registered');S.drafts[S.idx]=v;renderQuiz();}catch(err){status('questionStatus',err.message,'error');}}
  else if(action==='prev'){S.drafts[S.idx]=readAnswer(app.questions[S.idx]);S.idx--;renderQuiz();$('qHeading').focus();}
  else if(action==='next'){if(!S.records[S.idx])return;if(S.idx===9){finish();$('resultHeading').focus();}else{S.idx++;renderQuiz();$('qHeading').focus();}}
  else if(action==='retry')send();else if(action==='download')download();else if(action==='review')review();
  else if(action==='showEndpoint'){const show=$('endpoint').type==='password';$('endpoint').type=show?'text':'password';b.textContent=show?'Ocultar':'Mostrar';b.setAttribute('aria-pressed',show);}
  else if(action==='saveEndpoint'){if(S.busy||S.pending)return;const v=$('endpoint').value.trim();if(!C.validEndpoint(v)){status('connectionStatus','Revisa el código de conexión.','error');return;}S.endpoint=v;try{localStorage.setItem('madera-endpoint',v);}catch{}status('connectionStatus','Conexión aplicada.','ok');}
 });
  root.addEventListener('input',e=>{if(e.target.id==='mass')$('labResult').textContent=e.target.value+' g ÷ 100 cm³ = '+(Number(e.target.value)/100).toLocaleString('es-ES',{minimumFractionDigits:2})+' g/cm³';});
 root.addEventListener('change',e=>{
  if(e.target.id==='pair'){$('secondId').hidden=!e.target.checked;if(!e.target.checked)$('id2').value='';}
  if(e.target.id==='commercial')$('formInfo').textContent=['Pieza plana y alargada. Comprueba longitud, anchura y espesor.','Pieza de mayor espesor respecto a una tabla. Consulta sus medidas.','Pieza larga de sección relativamente pequeña; puede servir en marcos y apoyos.','Lámina fina de madera para revestir o fabricar contrachapado.'][Number(e.target.value)];
  if(e.target.id==='need')$('decisionInfo').textContent={prototype:'El cartón recuperado en buen estado puede servir para probar la forma y las medidas.',lasting:'Valora un recorte de contrachapado o una pieza adecuada: espesor, estado, dimensiones y uniones importan.',outside:'Comprueba que el producto sea adecuado para exterior. Pintarlo no garantiza que soporte la lluvia.'}[e.target.value];
 });

 root.addEventListener('keydown',e=>{if(e.key==='Enter'&&['id1','id2'].includes(e.target.id)){e.preventDefault();verify();}});
 window.addEventListener('beforeunload',e=>{if(S.pending){e.preventDefault();e.returnValue='';}});
})();
