/* Control docente compartido. El servidor es la fuente de verdad. */
(()=>{'use strict';
 const settings=window.PORTAL_CONTROL_SETTINGS;
 if(!settings)throw Error('Falta la configuración del portal.');
 const copy=v=>JSON.parse(JSON.stringify(v));
 const subscribers=new Set(),endpoint=settings.endpoint,protocol=settings.protocol;
 const cacheKey='portal_shared_cache_v1_'+endpoint.split('/').slice(-2,-1)[0],sessionKey='portal_teacher_session_v2';
 const safeGet=(storage,key)=>{try{return window[storage].getItem(key)}catch(_){return null}};
 const safeSet=(storage,key,value)=>{try{window[storage].setItem(key,value)}catch(_){}};
 const safeRemove=(storage,key)=>{try{window[storage].removeItem(key)}catch(_){}};
 let config=copy(settings.defaults),revision=0,connected=false,pending=false,message='',session=null,refreshing=null;
 try{const cached=JSON.parse(safeGet('localStorage',cacheKey)||'null');if(cached&&validConfig(cached.config)&&Number.isInteger(cached.revision)){config=cached.config;revision=cached.revision}}catch(_){}
 try{const saved=JSON.parse(safeGet('sessionStorage',sessionKey)||'null');if(saved&&saved.endpoint===endpoint&&typeof saved.token==='string'&&Number(saved.expiresAt)>Date.now())session=saved}catch(_){}
 function validConfig(value){
  if(!value||!Array.isArray(value.favorites)||value.favorites.some(id=>!Object.hasOwn(settings.defaults.themes,id))||new Set(value.favorites).size!==value.favorites.length||!value.themes)return false;
  return Object.entries(settings.defaults.themes).every(([course,themes])=>value.themes[course]&&Object.keys(themes).every(theme=>['active','upcoming','hidden'].includes(value.themes[course][theme])));
 }
 function authenticated(){if(session&&session.expiresAt<=Date.now()){session=null;safeRemove('sessionStorage',sessionKey)}return !!session}
 function snapshot(){return {config:copy(config),revision,connected,pending,message,authenticated:authenticated()}}
 function notify(){const state=snapshot();for(const callback of subscribers){try{callback(state)}catch(e){console.error('No se pudo actualizar la vista del portal.',e)}}}
 function apply(data){
  if(data.service!==protocol||!Number.isInteger(data.revision)||data.revision<1||!validConfig(data.config))throw Object.assign(Error('La configuración central no es válida.'),{code:'INVALID_CONFIG'});
  const changed=revision!==data.revision||JSON.stringify(config)!==JSON.stringify(data.config)||!connected;
  config=copy(data.config);revision=data.revision;connected=true;message='';
  safeSet('localStorage',cacheKey,JSON.stringify({config,revision}));if(changed)notify();
 }
 async function request(data){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  try{
   let url=endpoint,options={redirect:'follow',signal:controller.signal};
   if(data){options.method='POST';options.headers={'Content-Type':'text/plain;charset=utf-8'};options.body=JSON.stringify(data)}
   else{url+='?action=portal_config&_='+Date.now();options.method='GET';options.cache='no-store'}
   const response=await fetch(url,options);if(!response.ok)throw Error('El servidor no confirmó la operación.');
   const result=await response.json();
   if(result.service!==protocol)throw Object.assign(Error('El control docente compartido está pendiente de activar en el sistema central.'),{code:'SETUP_REQUIRED'});
   return result;
  }catch(e){if(e.name==='AbortError')throw Object.assign(Error('La consulta al sistema central ha agotado el tiempo. Vuelve a intentarlo.'),{code:'NETWORK_ERROR'});throw e}
  finally{clearTimeout(timer)}
 }
 function serverError(data){return Object.assign(Error(data.error||'No se pudo confirmar la operación.'),{code:data.code||'SERVER_ERROR'})}
 async function refresh(){
  if(refreshing)return refreshing;
  refreshing=(async()=>{try{const data=await request();if(data.ok!==true)throw serverError(data);if(!data.capabilities?.includes('patch')||!data.capabilities?.includes('login'))throw Error('El control docente está pendiente de activar.');apply(data);return true}
   catch(e){const changed=connected||message!==e.message;connected=false;message=e.message;if(changed)notify();return false}
   finally{refreshing=null}})();return refreshing;
 }
 async function ensureReady(){if(!connected)await refresh();if(!connected)throw Object.assign(Error(message||'El control docente está pendiente de activar.'),{code:'SETUP_REQUIRED'})}
 async function login(password){
  await ensureReady();const data=await request({action:'portal_login',password});
  if(data.ok!==true)throw serverError(data);
  if(typeof data.token!=='string'||!Number.isFinite(data.expiresAt)||data.expiresAt<=Date.now())throw Error('El servidor no confirmó la sesión docente.');
  session={endpoint,token:data.token,expiresAt:data.expiresAt};safeSet('sessionStorage',sessionKey,JSON.stringify(session));notify();return true;
 }
 async function patch(change){
  if(pending)throw Error('Espera a que termine el guardado anterior.');
  await ensureReady();if(!authenticated())throw Object.assign(Error('Introduce la contraseña docente para guardar.'),{code:'AUTH_REQUIRED'});
  const requestId=crypto.randomUUID().replaceAll('-','');pending=true;notify();
  try{
   const data=await request({action:'portal_patch',token:session.token,requestId,baseRevision:revision,patch:change});
   if(data.ok!==true){if(data.config)apply(data);if(data.code==='AUTH_REQUIRED'){session=null;safeRemove('sessionStorage',sessionKey)}throw serverError(data)}
   if(data.saved!==true||data.requestId!==requestId)throw Error('El servidor no confirmó este guardado.');apply(data);
   try{channel?.postMessage({type:'configuration-changed'})}catch(_){}return snapshot();
  }catch(e){
   if(!['AUTH_REQUIRED','REVISION_CONFLICT','BAD_REQUEST'].includes(e.code)){
    await refresh();throw Object.assign(Error('No se pudo confirmar el guardado. Revisa el estado mostrado antes de volver a intentarlo.'),{code:'UNCONFIRMED'});
   }throw e;
  }finally{pending=false;notify()}
 }
 async function logout(){const token=session?.token;session=null;safeRemove('sessionStorage',sessionKey);notify();if(token&&connected){try{await request({action:'portal_logout',token})}catch(_){}}}
 let channel=null;try{channel=new BroadcastChannel('portal-control-v1');channel.onmessage=e=>{if(e.data?.type==='configuration-changed')refresh()}}catch(_){}
 window.addEventListener('focus',()=>refresh());document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
 setInterval(()=>{if(!document.hidden)refresh();if(session&&!authenticated())notify()},15000);
 window.PortalControl={snapshot,subscribe(callback){subscribers.add(callback);callback(snapshot());return()=>subscribers.delete(callback)},refresh,ensureReady,login,patch,logout,authenticated};
 refresh();
})();
