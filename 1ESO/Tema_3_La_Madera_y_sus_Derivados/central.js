(function(root){
 'use strict';
 const DEFAULT_ENDPOINT='https://script.google.com/macros/s/AKfycbzYhutDT6EZ7meQq2KfVdKq0h8JH9GYnOmZVqjW_IkmOvdMdjS7FxWQWezmx8SfWQf9/exec';
 const validEndpoint=s=>/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(s);
 async function request(url,options={},fetcher=root.fetch){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),30000);
  try{const r=await fetcher(url,{...options,redirect:'follow',signal:controller.signal});if(!r.ok)throw Error('El servidor respondió con HTTP '+r.status+'.');return await r.json();}
  catch(e){if(e.name==='AbortError')throw Error('Se agotó el tiempo de espera.');throw e;}
  finally{clearTimeout(timer);}
 }
 async function lookup(endpoint,id,fetcher){
  id=String(id).trim().toUpperCase();
  const u=new URL(endpoint);u.searchParams.set('action','lookup');u.searchParams.set('id',id);u.searchParams.set('_',Date.now());
  const r=await request(u.href,{method:'GET',cache:'no-store'},fetcher);
  if(!r.ok||!r.encontrado)throw Error(r.error||'El ID no existe o está inactivo.');
  const a=r.alumno;
  if(id==='NX-01'){
   if(r.modo_prueba!==true&&a?.modo_prueba!==true)throw Error('El servidor no ha confirmado el modo de prueba de NX-01.');
   return {id,name:a?.nombre||'USUARIO DE PRUEBA',course:a?.curso||'PRUEBA',group:a?.grupo||'NX',modo_prueba:true};
  }
  if(!a||a.modo_prueba===true||r.modo_prueba===true)throw Error('No se ha confirmado un alumno ordinario válido.');
  if(a.id&&String(a.id).trim().toUpperCase()!==id)throw Error('El servidor ha respondido con un ID distinto.');
  return {id,name:a.nombre,course:a.curso,group:a.grupo,modo_prueba:false};
 }
 function payload(result,student){
  const registroId=result.submissionId+':'+student.id;
  return {id:student.id,tema:'Tema 3 La madera y sus derivados',actividad:result.activity,puntuacion:result.score,maximo:10,
   submissionId:result.submissionId,requestId:registroId,registroId,
   evidencia:JSON.stringify({retos:result.records,pistas:result.hints,intentos:result.records.map(()=>1),descuentoConsejos:result.records.reduce((s,r)=>s+(r.hintDeduction||0),0),modo_prueba:student.modo_prueba===true}),
   detalle:JSON.stringify({submissionId:result.submissionId,registroId,inicio:result.startedAt,fin:result.finishedAt,titulo:result.title,appVersion:'madera-pdi-nx01-20261104',urlOrigen:result.url,modo_prueba:student.modo_prueba===true})};
 }
 async function submitOne(endpoint,result,student,fetcher){
  const data=await request(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload(result,student))},fetcher);
  if(data?.ok!==true||data.guardado!==true)throw Error(data?.error||'El servidor no confirmó el guardado.');
  return data;
 }

 const api={DEFAULT_ENDPOINT,validEndpoint,lookup,payload,submitOne};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MaderaCentral=api;
})(typeof globalThis!=='undefined'?globalThis:this);

