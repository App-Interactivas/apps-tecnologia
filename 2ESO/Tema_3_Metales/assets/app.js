/* PDI · Metales 2.º ESO · Flujo 2.0.0 · 2026-11-04
 * El servidor es responsable de excluir NX-01 de grupos y recuentos.
 * El buzón local contiene solo intentos pendientes, nunca un perfil de acceso.
 * La idempotencia tras una respuesta perdida requiere el parche central adjunto.
 */
(() => {'use strict';
const A=window.METALES_APP,$=id=>document.getElementById(id);
const KEY='pdi_pending_metales_'+A.id+'_v2',LEGACY='pdi_pending_metales_'+A.id+'_v1';
const ENDPOINT="https://script.google.com/macros/s/AKfycbzYhutDT6EZ7meQq2KfVdKq0h8JH9GYnOmZVqjW_IkmOvdMdjS7FxWQWezmx8SfWQf9/exec";
const normalize=s=>String(s||'').trim().toUpperCase().replace(/\s+/g,'');
const course=s=>String(s||'').replace(/[^0-9A-Z]/gi,'').toUpperCase();
const group=s=>String(s||'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const uid=()=>crypto.randomUUID?.()||'metales-'+Date.now()+'-'+Math.random().toString(36).slice(2);
let identity=null,mode=null,at=0,answers=[],finished=false,startedAt=null,submission=null,busy=false,sending=false,queue=[];
const pendingValid=x=>x&&Array.isArray(x.ids)&&x.ids.length>0&&x.ids.length<=2&&x.result&&typeof x.result.submissionId==='string'&&Array.isArray(x.sentIds)&&!(x.ids.includes('NX-01')&&x.ids.length!==1);
try{const old=localStorage.getItem(KEY)??localStorage.getItem(LEGACY)??'[]';const parsed=JSON.parse(old);if(Array.isArray(parsed))queue=parsed.filter(pendingValid).map(x=>({ids:x.ids.map(normalize),result:x.result,sentIds:x.sentIds.map(normalize)}));}catch(e){}
function persist(){try{if(queue.length)localStorage.setItem(KEY,JSON.stringify(queue));else localStorage.removeItem(KEY);localStorage.removeItem(LEGACY);$('storageNotice').hidden=true;return true;}catch(e){$('storageNotice').textContent='No se puede conservar el resultado al cerrar. Mantén esta pestaña abierta y pulsa Reintentar.';$('storageNotice').hidden=false;return false;}}
async function request(url,opts={}){const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),25000);try{const r=await fetch(url,{...opts,redirect:'follow',signal:ctl.signal});if(!r.ok)throw Error('Error HTTP '+r.status+'.');let d;try{d=await r.json();}catch(e){throw Error('El servidor no ha devuelto una confirmación válida.');}return d;}catch(e){if(e.name==='AbortError')throw Error('Se agotó el tiempo de conexión.');throw e;}finally{clearTimeout(t);}}
function status(text,error=false){$('identityStatus').textContent=text;$('identityStatus').className='status'+(error?' error':'');}
function badge(){ $('testBadge').hidden=!identity?.test; }
async function verify(){
 if(busy)return;
 const ids=[$('student1').value,$('student2').value].map(normalize).filter(Boolean);
 if(!normalize($('student1').value)){status('Introduce tu ID.',true);return;}
 if(ids.length===2&&ids.includes('NX-01')){status('NX-01 se utiliza solo. Deja el segundo ID vacío; no se combina con otro ID.',true);return;}
 if(ids.length===2&&ids[0]===ids[1]){status('Los ID de la pareja deben ser distintos.',true);return;}
 busy=true;$('verify').disabled=true;$('student1').disabled=$('student2').disabled=true;status('Comprobando ID…');
 try{
  const students=await Promise.all(ids.map(async id=>{
   const x=await request(ENDPOINT+'?action=lookup&id='+encodeURIComponent(id)+'&_='+Date.now(),{cache:'no-store'});
   if(x?.ok!==true||x.encontrado!==true||!x.alumno)throw Error(x?.error||'ID no encontrado o inactivo: '+id);
   const s=x.alumno;
   if(normalize(s.id)!==id)throw Error('El servidor no ha confirmado el ID solicitado.');
   if(id==='NX-01'){
    if(s.modo_prueba!==true)throw Error('El servidor no ha confirmado el modo prueba de NX-01.');
    return s; // Antes de comprobar curso o grupo ordinarios.
   }
   if(s.modo_prueba===true)throw Error('El modo prueba solo está disponible con NX-01.');
   if(course(s.curso)!=='2ESO')throw Error('El ID debe corresponder a 2.º ESO.');
   if(!String(s.nombre||'').trim()||!String(s.grupo||'').trim())throw Error('Falta el nombre o grupo oficial. Consulta al profesor.');
   return s;
  }));
  if(ids.length===2&&group(students[0].grupo)!==group(students[1].grupo))throw Error('Los dos alumnos deben pertenecer al mismo grupo.');
  identity={ids,names:students.map(s=>String(s.nombre||'')),group:String(students[0].grupo||''),test:ids[0]==='NX-01'};
  $('student1').value=$('student2').value='';status('');showChoices();
 }catch(e){identity=null;badge();status(e.message,true);}
 finally{busy=false;$('verify').disabled=false;$('student1').disabled=$('student2').disabled=false;}
}
function showChoices(){
 if(!identity)return;
 mode=null;$('identityPanel').hidden=true;$('choices').hidden=false;$('practicePanel').hidden=$('quiz').hidden=$('result').hidden=true;
 $('greeting').textContent='Hola, '+identity.names.join(' y ')+'.';
 $('officialGroup').textContent=identity.test?'Acceso de prueba confirmado por el servidor.':'Grupo '+identity.group+' · 2.º ESO';
 $('recordName').textContent=A.id+' · '+A.title+' · 12 retos';
 $('start').disabled=queue.length>0;
 $('start').title=queue.length?'Primero reintenta el resultado pendiente.':'';
 badge();if(queue.length)network('pending','Hay un resultado pendiente. Reintenta su envío antes de iniciar otra actividad evaluable.');
 $('greeting').focus();
}
function signOut(){if(busy)return;identity=null;mode=null;submission=null;answers=[];finished=false;$('choices').hidden=$('practicePanel').hidden=$('quiz').hidden=$('result').hidden=true;$('identityPanel').hidden=false;$('student1').value=$('student2').value='';status('');badge();$('student1').focus();}
function practice(){if(!identity)return;mode='practice';$('choices').hidden=true;$('practicePanel').hidden=false;badge();}
function start(m){
 if(!identity||(m==='record'&&queue.length))return;
 mode=m;at=0;finished=false;submission=null;startedAt=new Date().toISOString();
 answers=A.questions.map(()=>({attempts:0,hint:false,done:false,point:0,response:null,correct:false}));
 $('choices').hidden=$('practicePanel').hidden=$('identityPanel').hidden=$('result').hidden=true;$('quiz').hidden=false;
 if(!queue.length)$('networkPanel').hidden=true;
 render();
}
function render(){
 const q=A.questions[at],r=answers[at];
 $('qTitle').textContent=q.text;$('qCount').textContent='Reto '+(at+1)+' de '+A.questions.length;
 $('qProgress').max=A.questions.length;$('qProgress').value=answers.filter(x=>x.done).length;
 $('modeTag').textContent=mode==='record'?'ACTIVIDAD EVALUABLE':'PRACTICAR SIN NOTA';$('modeTag').className='tag '+(mode==='record'?'record-tag':'practice-tag');
 $('qFigure').innerHTML=q.figure?diagram(q.figure):'';const area=$('answerArea');area.replaceChildren();
 if(q.type==='choice'){
  q.options.forEach((text,i)=>{const label=document.createElement('label');label.className='option';const input=document.createElement('input');input.type='radio';input.name='option';input.value=i;input.disabled=r.done;input.checked=r.response===i;const span=document.createElement('span');span.textContent=text;label.append(input,span);area.append(label);});
 }else if(q.type==='number'){
  const label=document.createElement('label');label.textContent='Respuesta en '+q.unit;const input=document.createElement('input');input.id='numberAnswer';input.type='text';input.inputMode='decimal';input.autocomplete='off';input.value=r.response??'';input.disabled=r.done;label.append(input);area.append(label);
 }else{
  q.answer.forEach((_,i)=>{const row=document.createElement('div');row.className='step';const label=document.createElement('label');label.htmlFor='step'+i;label.textContent=(i+1)+'.';const select=document.createElement('select');select.id='step'+i;select.disabled=r.done;const empty=document.createElement('option');empty.value='';empty.textContent='Elige una etapa';select.append(empty);q.options.forEach((text,j)=>{const o=document.createElement('option');o.value=j;o.textContent=text;select.append(o);});if(r.response)select.value=r.response[i];row.append(label,select);area.append(row);});
 }
 $('hintText').textContent=q.hint;$('hintText').hidden=!r.hint;
 $('hintCost').textContent=mode==='record'?'Consejo opcional: si lo pides antes de responder, un acierto en este reto valdrá 0,5 puntos en lugar de 1. Un error vale 0.':'Consejo de práctica: puedes abrirlo; no se enviará ninguna nota.';
 $('hintReveal').disabled=r.hint||r.attempts>0||r.done;$('hintReveal').textContent=r.hint?'Consejo utilizado':'Pedir consejo';
 $('feedback').hidden=!r.done;$('feedback').textContent=r.done?((r.correct?'Correcto. ':'Solución: '+solution(q)+'. ')+q.why+' · '+r.point+' puntos.'):'';
 $('feedback').className='feedback '+(r.correct?'good':'notice');$('answerError').textContent='';$('check').disabled=r.done;$('prev').disabled=at===0;$('next').disabled=!r.done;
 $('next').textContent=at===A.questions.length-1?(mode==='record'?'Finalizar actividad':'Ver resultado de práctica'):'Siguiente reto';$('qTitle').focus();
}
function readAnswer(q){if(q.type==='choice'){const s=document.querySelector('input[name=option]:checked');if(!s)throw Error('Elige una respuesta.');return Number(s.value);}if(q.type==='number'){const s=$('numberAnswer').value.trim();if(!/^\d+(?:[.,]\d+)?$/.test(s))throw Error('Escribe un número válido, sin la unidad; puedes usar coma decimal.');return Number(s.replace(',','.'));}const a=q.answer.map((_,i)=>$('step'+i).value);if(a.some(x=>x===''))throw Error('Elige una etapa para cada posición.');if(new Set(a).size!==a.length)throw Error('Cada etapa debe aparecer una sola vez.');return a.map(Number);}
function correct(q,v){if(q.type==='number')return Math.abs(v-q.answer)<0.005;if(q.type==='order')return v.every((x,i)=>x===q.answer[i]);return v===q.answer;}
function check(){
 const q=A.questions[at],r=answers[at];if(r.done||finished)return;let v;
 try{v=readAnswer(q);}catch(e){$('answerError').textContent=e.message;return;}
 $('answerError').textContent='';r.response=v;r.attempts++;r.correct=correct(q,v);
 if(r.correct){r.done=true;r.point=Math.min(r.attempts===1?1:0.5,r.hint?0.5:1);render();}
 else if(r.attempts>=2){r.done=true;r.point=0;render();}
 else{
  $('hintReveal').disabled=true;$('feedback').hidden=false;$('feedback').className='feedback error';
  $('feedback').textContent='Todavía no. '+q.hint+' Revisa y vuelve a responder: si aciertas, este reto suma 0,5 puntos.';
 }
}
function solution(q){if(q.type==='number')return String(q.answer).replace('.',',')+' '+q.unit;if(q.type==='order')return q.answer.map(i=>q.options[i]).join(' → ');return q.options[q.answer];}
function complete(){
 if(finished||answers.some(x=>!x.done))return;finished=true;
 const points=answers.reduce((s,x)=>s+x.point,0);
 submission={theme:'Tema 3 · Metales',activity:'2ESO_T3_'+A.id,score:Math.round(points/A.questions.length*1000)/100,scores:answers.map(x=>x.point),hints:answers.map(x=>x.hint),attempts:answers.map(x=>x.attempts),startedAt,finishedAt:new Date().toISOString(),submissionId:uid(),title:A.title,appVersion:'2.0.0',modo_prueba:identity.test,
 evidence:{maximoRetos:A.questions.length,criterio:'1 punto primer acierto; 0,5 segundo; 0 tras dos errores; con consejo, máximo 0,5 por acierto (sin acumular descuentos)',descuentoConsejoPuntosReto:0.5,descuentoConsejosAplicado:answers.reduce((s,r)=>s+(r.hint&&r.correct&&r.attempts===1?0.5:0),0),respuestas:answers.map((r,i)=>({reto:i+1,respuesta:r.response,correcta:r.correct,puntos:r.point,consejo:r.hint,intentos:r.attempts,costeConsejoAnunciado:0.5,descuentoConsejoAplicado:r.hint&&r.correct&&r.attempts===1?0.5:0}))},originUrl:location.href};
 $('quiz').hidden=true;$('result').hidden=false;$('score').textContent=submission.score.toFixed(2).replace('.',',')+' / 10';
 $('resultText').textContent=mode==='record'?'Actividad finalizada. El resultado se envía automáticamente.':'Práctica terminada. Este resultado no cuenta para la nota y no se envía.';
 $('review').replaceChildren();A.questions.forEach((q,i)=>{const z=document.createElement('div');z.className='review';const h=document.createElement('strong');h.textContent=(i+1)+'. '+q.text;const p=document.createElement('p');p.textContent='Solución: '+solution(q)+'. '+q.why+' · Puntos: '+answers[i].point;z.append(h,p);$('review').append(z);});$('resultTitle').focus();
 if(mode==='record')submit();
}
function payload(item,id){const r=item.result;return{id,tema:r.theme,actividad:r.activity,puntuacion:r.score,maximo:10,submissionId:r.submissionId,intento_id:r.submissionId,
 evidencia:JSON.stringify({puntuacionesRetos:r.scores,pistasUsadas:r.hints.filter(Boolean).length,intentosTotales:r.attempts.reduce((a,b)=>a+b,0),modo_prueba:r.modo_prueba===true,resultado:r.evidence}),
 detalle:JSON.stringify({inicio:r.startedAt,fin:r.finishedAt,intentos:r.attempts,pistas:r.hints,submissionId:r.submissionId,titulo:r.title,appVersion:r.appVersion,modo_prueba:r.modo_prueba===true,urlOrigen:r.originUrl})};}
function network(state,text){
 $('networkPanel').hidden=false;$('networkPanel').className='card network '+state;
 $('networkTitle').textContent=state==='sent'?'ENVIADO':state==='sending'?'Enviando…':state==='error'?'Resultado pendiente de envío':'Resultado pendiente';
 $('networkText').textContent=text;$('retry').hidden=!queue.length||sending;$('retry').disabled=sending;
 if(state==='sent'){$('networkTitle').tabIndex=-1;$('networkTitle').focus();}
}
async function processQueue(){
 // Recupera las confirmaciones que otra pestaña haya guardado antes de tomar el turno.
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(Array.isArray(saved))queue=saved.filter(pendingValid);}catch(e){}
 network('sending','Espera la confirmación del servidor.');
 try{
  while(queue.length){const item=queue[0];
   for(const id of item.ids.filter(x=>!item.sentIds.includes(x))){
    const r=await request(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload(item,id))});
    if(r?.ok!==true||r.guardado!==true)throw Error(r?.error||'El servidor no ha confirmado el guardado para '+id+'.');
    item.sentIds.push(id);persist();
   }
   queue.shift();persist();
  }
  network('sent','El servidor ha confirmado todos los envíos del intento.');
 }catch(e){persist();network('error',e.message+' El resultado sigue pendiente. Pulsa Reintentar; no necesitas repetir los retos.');}
}
async function transmit(){if(sending||!queue.length)return;sending=true;$('retry').disabled=true;
 try{if(navigator.locks?.request)await navigator.locks.request(KEY,processQueue);else await processQueue();}
 finally{sending=false;$('retry').disabled=false;$('retry').hidden=!queue.length;$('start').disabled=queue.length>0;}
}
function submit(){if(!submission||!identity||mode!=='record')return;
 if(!queue.some(x=>x.result.submissionId===submission.submissionId)){
  queue.push({ids:[...identity.ids],result:JSON.parse(JSON.stringify(submission)),sentIds:[]});persist();
 }
 transmit();
}
function explore(){let z=$('explore');if(A.explore==='properties'){z.innerHTML='<h2>Explora la masa de una pieza</h2><p>Compara metales con el mismo volumen. Esto no demuestra igual resistencia.</p><div class="two"><div class="diagram">'+diagram('plate')+'</div><div><label>Volumen en cm³<input id="volume" type="text" inputmode="decimal" value="10"></label><label>Material<select id="material"><option value="8.92">Cobre · 8,92 g/cm³</option><option value="2.70">Aluminio · 2,70 g/cm³</option></select></label><p id="mass" class="notice" aria-live="polite"></p></div></div><p><span class="chip">Ductilidad → hilos</span><span class="chip">Maleabilidad → láminas</span><span class="chip">Dureza → rayado</span><span class="chip">Tenacidad → impacto</span></p>';const calc=()=>{let s=$('volume').value.trim();let v=Number(s.replace(',','.'));$('mass').textContent=/^\d+(?:[.,]\d+)?$/.test(s)&&v>0&&v<=100000?'Masa = '+String((v*Number($('material').value)).toFixed(2)).replace('.',',')+' g':'Introduce un volumen positivo de hasta 100 000 cm³.';};$('volume').addEventListener('input',calc);$('material').addEventListener('change',calc);calc();}else if(A.explore==='families'){z.innerHTML='<h2>Composición antes que apariencia</h2><div class="two"><div><h3>Férricos</h3><p>Hierro como componente principal.</p><p class="notice">Hierro de muy bajo carbono · Aceros · Fundiciones</p></div><div><h3>No férricos</h3><p>Otra base principal; propiedades variadas.</p><p class="notice">Aluminio · Cobre · Estaño · Cinc · Titanio</p></div></div><p>Metalurgia: ámbito de los metales. Siderurgia: hierro y sus aleaciones. El imán aporta una pista, pero no define por sí solo toda la clasificación.</p>';}else{z.innerHTML='<h2>Observa el movimiento</h2><label>Comparación<select id="process"><option value="drawing">Trefilado: tirar</option><option value="extrusion">Extrusión: empujar</option><option value="rollers">Laminado: rodillos</option><option value="lathe">Torneado: gira la pieza</option></select></label><div id="processFigure" class="diagram"></div><p class="notice">Una técnica industrial se estudia aquí mediante esquemas. Las operaciones de taller requieren preparación y autorización del docente.</p>';const show=()=>{$('processFigure').innerHTML=diagram($('process').value);};$('process').addEventListener('change',show);show();}}
$('verify').addEventListener('click',verify);
for(const id of ['student1','student2'])$(id).addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();verify();}});
$('change').addEventListener('click',signOut);$('changeAfter').addEventListener('click',signOut);
$('practice').addEventListener('click',practice);$('start').addEventListener('click',()=>start('record'));
$('backModes').addEventListener('click',showChoices);$('practiceQuiz').addEventListener('click',()=>start('practice'));
$('check').addEventListener('click',check);
$('prev').addEventListener('click',()=>{if(at>0){at--;render();}});
$('next').addEventListener('click',()=>{if(!answers[at].done||finished)return;if(at===A.questions.length-1)complete();else{at++;render();}});
$('hintReveal').addEventListener('click',()=>{const r=answers[at];if(finished||r.done||r.attempts||r.hint)return;r.hint=true;$('hintText').hidden=false;$('hintReveal').disabled=true;$('hintReveal').textContent='Consejo utilizado';});
$('retry').addEventListener('click',transmit);$('again').addEventListener('click',showChoices);
explore();if(queue.length){persist();network('pending','Hay un resultado pendiente. Pulsa Reintentar para enviarlo sin repetir la actividad.');}
})();
