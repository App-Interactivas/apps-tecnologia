(function(root){
 'use strict';
 const normId=v=>String(v??'').trim().toUpperCase().replace(/\s+/g,'');
 const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');
 function number(v){if(typeof v==='number')return Number.isFinite(v)?v:NaN;const s=String(v??'').trim();return /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(s)?Number(s.replace(',','.')):NaN;}
 function complete(q,v){
  if(q.type==='choice')return Number.isInteger(v)&&v>=0&&v<q.options.length;
  if(q.type==='number')return Number.isFinite(number(v));
  return Array.isArray(v)&&q.fields.every((f,i)=>f.number?Number.isFinite(number(v[i])):String(v[i]??'').trim()!=='')&&(q.type!=='order'||new Set(v).size===q.fields.length);
 }
 function evaluate(q,v){
  if(!complete(q,v))throw Error(q.type==='order'?'Asigna una posición distinta a cada etapa.':'Completa todas las respuestas antes de comprobar.');
  let details;
  if(q.type==='choice')details=[{label:q.title,correct:v===q.answer,actual:q.options[v],expected:q.options[q.answer]}];
  else if(q.type==='number')details=[{label:q.title,correct:Math.abs(number(v)-q.answer)<=(q.tolerance??.005),actual:v,expected:String(q.answer)+' '+(q.unit??'')}];
  else details=q.fields.map((f,i)=>({label:f.label,correct:f.number?Math.abs(number(v[i])-f.answer)<=(f.tolerance??.005):String(v[i])===String(f.answer),actual:v[i],expected:String(f.answer)}));
  return {score:details.filter(x=>x.correct).length/details.length,details};
 }
 function validateStudents(students){
  if(!Array.isArray(students)||students.length<1||students.length>2)throw Error('Introduce uno o dos ID.');
  const test=students.filter(x=>normId(x.id)==='NX-01');
  if(test.length){
   if(students.length!==1)throw Error('NX-01 se utiliza solo, sin un segundo ID.');
   if(test[0].modo_prueba!==true)throw Error('El servidor no ha confirmado el modo de prueba de NX-01.');
   return students;
  }
  if(students.some(x=>x.modo_prueba===true))throw Error('El modo de prueba solo está disponible para NX-01.');
  if(students.some(x=>!x.id||!x.name||!x.group||norm(x.course)!=='1ESO'))throw Error('Cada ID debe estar activo y tener nombre, curso de 1.º ESO y grupo.');
  if(new Set(students.map(x=>normId(x.id))).size!==students.length)throw Error('Los dos ID deben ser distintos.');
  if(students.length===2&&norm(students[0].group)!==norm(students[1].group))throw Error('Los dos ID deben pertenecer al mismo grupo.');
  return students;
 }
 function applyHint(record,used,evaluable){
  const rawScore=record.score,score=evaluable&&used?rawScore*.5:rawScore;
  return {...record,rawScore,score,hintUsed:!!used,hintDeduction:rawScore-score,hintMaximum:evaluable&&used?.5:1};
 }

 const api={normId,norm,number,complete,evaluate,validateStudents,applyHint};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MaderaEval=api;
})(typeof globalThis!=='undefined'?globalThis:this);

