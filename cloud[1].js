const SUPABASE_URL='https://btlmbsbeypnplmkslpcw.supabase.co';
const SUPABASE_KEY='sb_publishable_w4674OcoxsOlkSl0i4J6aA_wwBWjCfN';
const TABLE_URL=SUPABASE_URL+'/rest/v1/site_content';
const STORAGE_URL=SUPABASE_URL+'/storage/v1/object';
const PUBLIC_STORAGE_URL=SUPABASE_URL+'/storage/v1/object/public/site-photos/';
const headers={apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'};

async function cloudGet(){
 const r=await fetch(TABLE_URL+'?id=eq.1&select=*',{headers});
 if(!r.ok)throw new Error(await r.text());
 const rows=await r.json(); return rows[0]||null;
}
async function cloudSave(patch){
 const r=await fetch(TABLE_URL+'?id=eq.1',{method:'PATCH',headers:{...headers,Prefer:'return=representation'},body:JSON.stringify({...patch,updated_at:new Date().toISOString()})});
 if(!r.ok)throw new Error(await r.text());
 const rows=await r.json(); if(!rows.length)throw new Error('Запись site_content с id=1 не найдена'); return rows[0];
}
function makeStoragePath(path){return path.split('/').map(encodeURIComponent).join('/');}
async function cloudUpload(file,path){
 const safePath=makeStoragePath(path);
 const r=await fetch(STORAGE_URL+'/site-photos/'+safePath,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':file.type||'image/jpeg','x-upsert':'true'},body:file});
 if(!r.ok){const t=await r.text();console.error('Supabase Storage error:',r.status,t);throw new Error('Storage '+r.status+': '+t);}
 return PUBLIC_STORAGE_URL+safePath;
}
async function cloudDelete(path){
 const safePath=makeStoragePath(path);
 const r=await fetch(STORAGE_URL+'/site-photos/'+safePath,{method:'DELETE',headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
 if(!r.ok)throw new Error(await r.text());
}
