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
  const u=new URL(endpoint);u.searchParams.set('action','lookup');u.searchParams.set('id',id);u.searchParams.set('_',Date.now());
  const r=await request(u.href,{method:'GET',cache:'no-store'},fetcher);
  if(!r.ok||!r.encontrado||!r.alumno)throw Error(r.error||'El ID no existe o está inactivo.');
  return {id,name:r.alumno.nombre,course:r.alumno.curso,group:r.alumno.grupo};
 }
 function payload(result,student){return {id:student.id,tema:'Tema 3 La madera y sus derivados',actividad:result.activity,puntuacion:result.score,maximo:10,
  evidencia:JSON.stringify({retos:result.records,pistas:result.hints,intentos:result.records.map(()=>1)}),
  detalle:JSON.stringify({submissionId:result.submissionId,inicio:result.startedAt,fin:result.finishedAt,titulo:result.title,appVersion:'madera-1.0-central-v6',urlOrigen:result.url})};}
 async function submitOne(endpoint,result,student,fetcher){
  const data=await request(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload(result,student))},fetcher);
  if(!data?.ok||data.guardado!==true)throw Error(data?.error||'El servidor no confirmó el guardado.');
  return data;
 }
 const api={DEFAULT_ENDPOINT,validEndpoint,lookup,payload,submitOne};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MaderaCentral=api;
})(typeof globalThis!=='undefined'?globalThis:this);
