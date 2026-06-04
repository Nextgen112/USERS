(function(){
  if(window.__WCF_ENGINE_LOADED__) return;
  window.__WCF_ENGINE_LOADED__ = true;

  let B=[],F=!1,M=null,loopTmr=null,PT={},S=[],CD={},WA={},DQ=0;
  function lg(m){console.log('[AUTOFARM] '+m)}
  let AP=JSON.parse(localStorage.getItem('wcf_plats')||'[]');
  
  function getE(){
    try{
      let ctrl=null;
      try{ctrl=_0x81d9a8.get_controller()}catch(e){ctrl=_0x19471e._controller||_0x19471e.get_controller()}
      let m=ctrl.get_visibleEntityMap(),d=m._map?m._map.h:m.h||m,r=[];
      for(let k in d)if(d[k]&&typeof d[k]==='object')r.push({id:k,obj:d[k]});
      return r;
    }catch(e){return[]}
  }
  
  function cP(){
    try{
      let r=[],inst=null;
      try{inst=_0x4a57d3.get_Instance()}catch(e){try{inst=_0x4a2327.get_Instance()}catch(e2){try{inst=ClientLib.Data.MainData.GetInstance().get_WorldMap().GetPlatoons()}catch(e3){}}}
      if(!inst&&typeof ClientLib!=='undefined'&&ClientLib.Data&&ClientLib.Data.MainData){
        let md=ClientLib.Data.MainData.GetInstance();
        if(md&&md.get_WorldMap){
          let wm=md.get_WorldMap();
          if(wm&&wm.GetPlatoons)r=wm.GetPlatoons();
        }
      }
      if(!r.length&&inst){
        try{r=inst.GetWorldMapPlatoonList()||[]}catch(e){try{r=inst.get_Platoons()||[]}catch(e2){try{r=inst.GetPlatoons()||[]}catch(e3){}}}
      }
      let res=[];
      for(let i=0;i<r.length;i++){
        let p=r[i]._platoon||r[i];
        if(p&&p.get_Name){
          let s=0;
          try{s=p.get_status()}catch(e){try{s=p.get_state()}catch(e2){s=p.status||0}}
          let inB=!1;
          try{inB=p.isInBattle()}catch(e){inB=p.inBattle||!1}
          let atk=(s===3||s===4||inB),mov=!1;
          let mvw=null;
          try{mvw=_0x81d9a8.get_MapView()}catch(e){mvw=_0x19471e.get_MapView()}
          try{mov=mvw.isMovingPlatoon(p)}catch(e){}
          let mp=null,sid=null;
          try{mp=mvw.get_movingPlatoons()}catch(e){}
          try{sid=p.get_mapEntity().get_entityId()}catch(e){sid=p.id||null}
          let md2=null;
          if(mp&&sid)try{md2=mp.h?mp.h[sid]:mp[sid]}catch(e){}
          if(mov||(md2&&md2.get_ETA&&md2.get_ETA()!=''))mov=!0;
          let pid=null;
          try{pid=p.get_ID()}catch(e){try{pid=p.id}catch(e2){pid=sid}}
          res.push({n:p.get_Name(),o:p,id:pid,atk:atk,mov:mov})
        }
      }
      return res;
    }catch(e){lg('Platoon err: '+e.message);return[]}
  }
  
  function parseBaseInfo(o){
    let tg='',lv=0,sp='',nm='Base';
    if(o.attributes&&Array.isArray(o.attributes)){
      for(let a=0;a<o.attributes.length;a++){
        let attr=o.attributes[a];
        if(attr.key=='analyticsTag')tg=attr.value;
        if(attr.key=='level')lv=parseInt(attr.value)||0;
        if(attr.key=='spawnRuleName')sp=attr.value;
      }
    }
    if(!lv&&sp){let m=sp.match(/(\d+)/);if(m)lv=parseInt(m[1])||0}
    if(!sp&&o.spawnRuleName)sp=o.spawnRuleName;
    if(!tg&&o.analyticsTag)tg=o.analyticsTag;
    if(!lv&&o.level)lv=parseInt(o.level)||0;
    let str=((o.getName?o.getName():o.name)||tg||sp||'').toLowerCase();
    if(str.includes('intel'))nm='Intel';
    else if(str.includes('supplydepot')||str.includes('supply depot'))nm='Supplydepot';
    else if(str.includes('shadowops')||str.includes('sh_ops'))nm='ShadowOps';
    else if(str.includes('thorium ii')||str.includes('thorium_02'))nm='Thorium II';
    else if(str.includes('thorium i')||str.includes('thorium_01'))nm='Thorium I';
    else if(str.includes('thorium'))nm='Thorium';
    else if(str.includes('shop'))nm='Shops';
    else if(str.includes('medal'))nm='Medals';
    else if(str.includes('material'))nm='Materials';
    else if(str.includes('supply'))nm='Supplies';
    else if(str.includes('orbiter'))nm='Orbiter';
    else if(str.includes('skirmish'))nm='Skirmish';
    else if(str.includes('event'))nm='Event';
    else if(str.includes('iridium'))nm='Iridium';
    else if(str.includes('metal')||str.includes('oil'))nm='MetalOil';
    else if(sp){let p=sp.split('_')[0];if(p)nm=p}
    return{tag:tg,level:lv,spawn:sp,name:nm}
  }
  
  window.__wcfAutoRefill=function(tgtName){
    let v=getE(),added=0,max=parseInt(document.getElementById('wcf_hc').value)||30;
    if(B.length>=max)return;
    v.forEach(e=>{
      let o=e.obj;
      if(o&&o.coord){
        let info=parseBaseInfo(o);
        if(info.name===tgtName){
          let x=o.coord.x,y=o.coord.y;
          let inQ=B.find(b=>b.x===x&&b.y===y);
          if(!inQ&&B.length<max){
            B.push({x:x,y:y,id:e.id,n:info.name,l:info.level});added++;
          }
          if(!S.find(s=>s.x===x&&s.y===y))S.push({x:x,y:y,id:e.id,n:info.name,tag:info.tag||info.spawn||'base',spawn:info.spawn,l:info.level});
        }
      }
    });
    if(added>0){uS('Auto-Found '+added+' new '+tgtName+'!','#a855f7');upT();window.__upF()}
  };
  
  function mkUI(){
    if(M&&M.parentNode)return;
    let h=`<style>#wcf_ui *{box-sizing:border-box;}#wcf_ui::-webkit-scrollbar,#wcf_pl::-webkit-scrollbar,#wcf_fb::-webkit-scrollbar,#wcf_tb::-webkit-scrollbar{width:6px;}#wcf_ui::-webkit-scrollbar-track,#wcf_pl::-webkit-scrollbar-track,#wcf_fb::-webkit-scrollbar-track,#wcf_tb::-webkit-scrollbar-track{background:#0f172a;border-radius:4px;}#wcf_ui::-webkit-scrollbar-thumb,#wcf_pl::-webkit-scrollbar-thumb,#wcf_fb::-webkit-scrollbar-thumb,#wcf_tb::-webkit-scrollbar-thumb{background:#334155;border-radius:4px;}#wcf_ui::-webkit-scrollbar-thumb:hover{background:#475569;}</style><div id="wcf_ui" style="position:fixed;top:60px;right:20px;width:320px;background:rgba(15,23,42,0.95);backdrop-filter:blur(10px);color:#f8fafc;border:1px solid #a855f7;border-radius:12px;z-index:99999;font-family:-apple-system,sans-serif;padding:15px;box-shadow:0 15px 25px rgba(0,0,0,0.6), 0 0 15px rgba(168,85,247,0.2);display:flex;flex-direction:column;max-height:85vh;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #334155;padding-bottom:8px;"><span style="font-size:16px;font-weight:900;color:#a855f7;text-shadow:0 0 8px rgba(168,85,247,0.5);">⚔️ ULTIMATE V17</span><button onclick="document.getElementById('wcf_ui').style.display='none'" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;font-size:16px;">✖</button></div><button id="wcf_tg" style="width:100%;padding:10px;background:linear-gradient(90deg, #16a34a, #15803d);color:white;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:14px;box-shadow:0 0 10px rgba(22,163,74,0.4);transition:all 0.3s;margin-bottom:10px;">🚀 START AUTO-CHAIN</button><div id="wcf_st" style="font-size:12px;margin-bottom:12px;color:#94a3b8;text-align:center;background:#1e293b;padding:6px;border-radius:4px;border:1px dashed #475569;">System Idle...</div><div style="font-size:11px;color:#94a3b8;font-weight:bold;text-transform:uppercase;margin-bottom:6px;">Active Platoons</div><div id="wcf_pl" style="max-height:130px;overflow-y:auto;margin-bottom:12px;padding-right:4px;"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><div style="font-size:11px;color:#94a3b8;font-weight:bold;text-transform:uppercase;">Radar Targets</div><button onclick="window.__wcfAS()" style="background:linear-gradient(90deg, #2563eb, #1d4ed8);color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:bold;">SCAN MAP</button></div><div style="display:flex;align-items:center;margin-bottom:6px;font-size:11px;gap:4px;"><span style="color:#cbd5e1;">Limit:</span><input type="number" id="wcf_hc" value="30" style="width:42px;background:#1e293b;color:white;border:1px solid #475569;border-radius:3px;padding:2px;font-size:11px;outline:none;"><label style="color:#cbd5e1;cursor:pointer;display:flex;align-items:center;margin-left:6px;"><input type="checkbox" id="wcf_hide_pvp" onchange="window.__upF()" style="margin-right:2px;accent-color:#a855f7;">Hide PvP</label><label style="color:#cbd5e1;cursor:pointer;display:flex;align-items:center;margin-left:6px;"><input type="checkbox" id="wcf_hide_farm" onchange="window.__upF()" style="margin-right:2px;accent-color:#a855f7;">Hide Farm</label></div><div id="wcf_fb" style="max-height:130px;overflow-y:auto;margin-bottom:12px;padding-right:4px;"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><div style="font-size:11px;color:#94a3b8;font-weight:bold;text-transform:uppercase;">Queue / Active</div><select id="wcf_mode" style="background:#1e293b;color:white;border:1px solid #475569;border-radius:4px;padding:3px;font-size:10px;outline:none;cursor:pointer;"><option value="spread">Spread ATK</option><option value="focus">Focus ATK</option></select></div><div id="wcf_tb" style="max-height:130px;overflow-y:auto;padding-right:4px;flex-grow:1;"></div></div>`;
    let d=document.createElement('div');d.innerHTML=h;document.body.appendChild(d);
    M=document.getElementById('wcf_ui');
    document.getElementById('wcf_tg').onclick=tgl;
    window.__wcfRP();
    upT();
    window.__upF();
    let mb=document.createElement('button');
    mb.innerHTML='⚔️ Ultimate Farm';
    mb.style.cssText='position:fixed;top:15px;right:15px;z-index:99999;background:linear-gradient(135deg, #1e293b, #0f172a);color:#a855f7;border:1px solid #a855f7;padding:8px 15px;border-radius:8px;cursor:pointer;font-weight:bold;box-shadow:0 0 10px rgba(168,85,247,0.3);transition:0.3s;';
    mb.onmouseover=()=>mb.style.boxShadow='0 0 15px rgba(168,85,247,0.6)';
    mb.onmouseout=()=>mb.style.boxShadow='0 0 10px rgba(168,85,247,0.3)';
    mb.onclick=function(){
      if(M.style.display==='none'||M.style.display===''){
        M.style.display='flex';window.__wcfRP()
      }else{
        M.style.display='none'
      }
    };
    document.body.appendChild(mb)
  }
  
  window.__wcfRP=function(){
    let p=cP(),h='';
    if(!p.length){document.getElementById('wcf_pl').innerHTML='<div style="padding:10px;text-align:center;color:#ef4444;font-style:italic;">No platoons found!</div>';return}
    let cfg=JSON.parse(localStorage.getItem('wcf_p_cfg')||'{}');
    p.forEach(x=>{
      let c=AP.includes(String(x.id))?'checked':'';
      let flt=cfg[x.id]||'';
      let stBadge=x.atk?'<span style="background:#166534;color:#4ade80;padding:2px 4px;border-radius:3px;font-size:9px;margin-left:4px;">ATK</span>':x.mov?'<span style="background:#854d0e;color:#facc15;padding:2px 4px;border-radius:3px;font-size:9px;margin-left:4px;">MOV</span>':'';
      h+='<div style="display:flex;align-items:center;background:#1e293b;padding:6px;border-radius:4px;margin-bottom:4px;border:1px solid #334155;"><label style="cursor:pointer;flex-grow:1;display:flex;align-items:center;overflow:hidden;"><input type="checkbox" class="p_chk" value="'+x.id+'" onchange="window.__wcfSP()" '+c+' style="margin-right:8px;accent-color:#a855f7;width:14px;height:14px;"><span style="font-size:12px;font-weight:600;color:#e2e8f0;white-space:nowrap;">'+x.n+'</span>'+stBadge+'</label><input type="text" placeholder="Filter" value="'+flt+'" oninput="window.__wcfSaveFlt(\''+x.id+'\',this.value)" style="width:50px;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:3px;padding:3px;font-size:10px;text-align:center;margin-left:5px;outline:none;"></div>';
    });
    document.getElementById('wcf_pl').innerHTML=h
  };
  
  window.__wcfSaveFlt=function(pid,val){
    let cfg=JSON.parse(localStorage.getItem('wcf_p_cfg')||'{}');
    cfg[pid]=val.trim();
    localStorage.setItem('wcf_p_cfg',JSON.stringify(cfg))
  };
  
  window.__wcfSP=function(){
    AP=Array.from(document.querySelectorAll('.p_chk:checked')).map(c=>c.value);
    localStorage.setItem('wcf_plats',JSON.stringify(AP))
  };
  
  function uS(t,c){
    let d=document.getElementById('wcf_st');
    if(d){d.innerHTML=t;d.style.color=c||'#4ade80'}
  }
  
  function upT(){
    let d=document.getElementById('wcf_tb');
    if(!d)return;
    if(!B.length){d.innerHTML='<div style="padding:10px;text-align:center;color:#64748b;font-style:italic;">No active targets.</div>';return}
    let pool=cP();
    d.innerHTML=B.map((t,i)=>{
      let tk=t.x+'_'+t.y,pids=Object.keys(PT).filter(k=>PT[k]==tk),st='<span style="color:#64748b;font-size:10px;">[WAITING]</span>';
      if(pids.length>0){
        let nms=[],iA=!1;
        pids.forEach(pid=>{
          let p=pool.find(x=>x.id==pid);
          if(p){nms.push(p.n);if(p.atk)iA=!0}
        });
        st=iA?'<span style="color:#4ade80;font-size:10px;font-weight:bold;">[BTL: '+nms.join(', ')+']</span>':'<span style="color:#facc15;font-size:10px;font-weight:bold;">[FLY: '+nms.join(', ')+']</span>'
      }
      return'<div style="display:flex;justify-content:space-between;align-items:center;background:#1e293b;padding:6px 8px;border-radius:4px;margin-bottom:4px;border-left:3px solid '+(st.includes('BTL')?'#4ade80':(st.includes('FLY')?'#facc15':'#475569'))+';"><div style="display:flex;flex-direction:column;"><span style="font-size:12px;font-weight:bold;color:#f8fafc;">'+t.n+' <span style="color:#a855f7;font-weight:normal;">LVL '+t.l+'</span></span><span style="font-size:10px;color:#94a3b8;">('+t.x+', '+t.y+') '+st+'</span></div><button onclick="window.__wcfDT('+i+')" style="background:#dc2626;color:white;border:none;border-radius:4px;width:20px;height:20px;cursor:pointer;font-weight:bold;">×</button></div>'
    }).join('')
  }
  
  window.__upF=function(){
    let d=document.getElementById('wcf_fb');
    if(!d)return;
    let hidePvp=document.getElementById('wcf_hide_pvp')?document.getElementById('wcf_hide_pvp').checked:!1;
    let hideFarm=document.getElementById('wcf_hide_farm')?document.getElementById('wcf_hide_farm').checked:!1;
    let ignoreFarmTypes=['materials','supplies','metaloil','iridium','shops','medals'];
    let groups={};
    S.forEach(t=>{
      if(hidePvp&&t.n==='Base')return;
      if(hideFarm&&ignoreFarmTypes.includes(t.n.toLowerCase()))return;
      let key=t.n+'_LVL'+t.l;
      if(!groups[key])groups[key]=[];
      groups[key].push(t)
    });
    let sortedKeys=Object.keys(groups).sort((a,b)=>{
      let lvlA=parseInt(a.split('_LVL')[1])||0;
      let lvlB=parseInt(b.split('_LVL')[1])||0;
      return lvlB-lvlA
    });
    if(!sortedKeys.length){d.innerHTML='<div style="padding:10px;text-align:center;color:#64748b;font-style:italic;">No targets match filters.</div>';return}
    let h='';
    sortedKeys.forEach(k=>{
      let count=groups[k].length;
      let spl=k.split('_LVL');let nm=spl[0],lv=spl[1];
      let badgeColor=count===1?'#10b981':'#0284c7';
      let badgeTxt=count===1?'SOLO':'LVL '+lv;
      h+='<button onclick="window.__wcfAddGrp(\''+k+'\')" style="width:100%;text-align:left;padding:8px 10px;margin-bottom:6px;background:linear-gradient(90deg, #1e293b, #0f172a);border:1px solid #334155;border-radius:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:all 0.2s;"><div style="display:flex;align-items:center;"><span style="background:'+badgeColor+';color:white;font-size:10px;font-weight:bold;padding:2px 5px;border-radius:3px;margin-right:8px;">'+badgeTxt+'</span><span style="color:#e2e8f0;font-size:12px;font-weight:600;">'+nm+' '+(count===1?'(LVL '+lv+')':'')+'</span></div><span style="background:#475569;color:#fff;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:bold;">'+count+'</span></button>'
    });
    d.innerHTML=h
  };
  
  window.__wcfAddGrp=function(key){
    let added=0;
    let maxToAdd=parseInt(document.getElementById('wcf_hc').value)||30;
    S.forEach(t=>{
      if(added>=maxToAdd)return;
      let tKey=t.n+'_LVL'+t.l;
      if(tKey===key){
        if(!B.find(b=>b.x==t.x&&b.y==t.y)){
          B.push({x:t.x,y:t.y,id:t.id,n:t.n,l:t.l});added++
        }
      }
    });
    uS('Added '+added+' targets','#4ade80');
    upT()
  };
  
  window.__wcfDT=(i)=>{
    let t=B[i];
    if(t){
      let tk=t.x+'_'+t.y;
      for(let k in PT){if(PT[k]==tk)delete PT[k]}
    }
    B.splice(i,1);
    upT()
  };
  
  window.__wcfBGScan=function(){
    let v=getE(),u=!1;
    v.forEach(e=>{
      let o=e.obj;
      if(o&&o.coord){
        let info=parseBaseInfo(o);
        let x=o.coord.x,y=o.coord.y;
        if(!S.find(t=>t.x===x&&t.y===y)){
          S.push({x:x,y:y,id:e.id,n:info.name,tag:info.tag||info.spawn||'base',spawn:info.spawn,l:info.level});
          u=!0
        }
      }
    });
    if(u&&M&&M.style.display!=='none')window.__upF()
  };
  
  window.__wcfAS=function(){
    let v=getE(),c=0;
    S=[];
    v.forEach(e=>{
      let o=e.obj;
      if(o&&o.coord){
        let info=parseBaseInfo(o);
        let x=o.coord.x,y=o.coord.y;
        S.push({x:x,y:y,id:e.id,n:info.name,tag:info.tag||info.spawn||'base',spawn:info.spawn,l:info.level});
        c++
      }
    });
    uS('Scan completed! Found '+c+' targets.','#a855f7');
    window.__upF()
  };
  
  function lP(p,t){
    try{_0x33acf7.panToCoords(new _0x37924a(t.x,t.y))}catch(ex){}
    DQ++;
    setTimeout(function(){
      try{
        let ctrl=null;
        try{ctrl=_0x81d9a8.get_controller()}catch(e){ctrl=_0x19471e._controller||_0x19471e.get_controller()}
        let sid=p.o.get_mapEntity().get_entityId();
        let c={x:t.x,y:t.y,get_x:function(){return this.x},get_y:function(){return this.y},set_x:function(v){this.x=v},set_y:function(v){this.y=v}};
        try{ctrl.stopMovement(sid)}catch(ex){}
        let sc=!1;
        try{ctrl.startMovement(sid,c);sc=!0}catch(ex){}
        let h2=null,e2=null,mvw=null;
        try{mvw=_0x81d9a8.get_MapView()}catch(e){mvw=_0x19471e.get_MapView()}
        try{h2=mvw.getHexMapCell(t.x,t.y)}catch(e){try{let hm=null;try{hm=_0x81d9a8.get_hexMap()}catch(ex){hm=_0x19471e.get_hexMap()}h2=hm.getHexMapCell(t.x,t.y)}catch(e3){}}
        e2=h2?h2.getFirstEntity():null;
        if(!e2){let v=getE(),m=v.find(x=>(x.obj.name||x.obj.getName&&x.obj.getName()||x.id)===t.n||x.id===t.id);if(m)e2=m.obj}
        if(!sc&&h2){try{mvw.moveSquad(sid,h2,e2)}catch(e2){}}
        if(p.id&&ctrl.addPlatoonEngageAfterMove&&e2)ctrl.addPlatoonEngageAfterMove(p.id,e2)
      }catch(err){lg('Launch err: '+err.message)}
      setTimeout(function(){window.__wcfAutoRefill(t.n)},1500);
      DQ--;
    },100*DQ)
  }
  
  function tgl(){
    F=!F;
    let b=document.getElementById('wcf_tg');
    if(F){
      b.style.background='linear-gradient(90deg, #dc2626, #991b1b)';
      b.style.boxShadow='0 0 10px rgba(220,38,38,0.5)';
      b.innerHTML='⏹️ STOP ENGINE';
      loop()
    }else{
      b.style.background='linear-gradient(90deg, #16a34a, #15803d)';
      b.style.boxShadow='0 0 10px rgba(22,163,74,0.5)';
      b.innerHTML='🚀 START AUTO-CHAIN';
      if(loopTmr)clearTimeout(loopTmr);
      uS('Stopped','#fbbf24')
    }
  }
  
  function loop(){
    if(!F)return;
    window.__wcfBGScan();
    let pool=cP(),mode=document.getElementById('wcf_mode')?document.getElementById('wcf_mode').value:'spread',dispThisTick=!1,now=Date.now();
    let cfg=JSON.parse(localStorage.getItem('wcf_p_cfg')||'{}');
    if(AP.length===0)uS('No platoons checked!','#ef4444');
    else if(B.length===0&&Object.keys(PT).length===0)uS('No targets left!','#fbbf24');
    else{
      for(let pid of AP){
        let p=pool.find(x=>x.id==pid);
        if(!p)continue;
        let tKey=PT[pid];
        if(p.atk){
          WA[pid]=!0;
          if(tKey){
            let tx=parseFloat(tKey.split('_')[0]),ty=parseFloat(tKey.split('_')[1]);
            B=B.filter(t=>!(t.x==tx&&t.y==ty));
            for(let k in PT)if(PT[k]==tKey)delete PT[k];
            upT()
          }
        }else if(WA[pid]){
          WA[pid]=!1;
          CD[pid]=now+5000;
          lg(p.n+' attack done. Cooldown 5s.')
        }else if(!p.mov){
          if(CD[pid]&&now<CD[pid]){uS(p.n+' repairing...','#fbbf24');continue}
          let filter=cfg[pid]?cfg[pid].trim().toLowerCase():'';
          if(!tKey&&!dispThisTick){
            let tg=null;
            if(mode==='spread'){
              let asgKeys=Object.values(PT);
              tg=B.find(t=>{
                if(asgKeys.includes(t.x+'_'+t.y))return!1;
                if(filter){return t.n.toLowerCase().includes(filter)||String(t.l)===filter}
                return!0
              })
            }else{
              tg=B.find(t=>{
                if(filter){return t.n.toLowerCase().includes(filter)||String(t.l)===filter}
                return!0
              })
            }
            if(tg){
              PT[pid]=tg.x+'_'+tg.y;
              uS('Sent '+p.n+' ➔ ('+tg.x+','+tg.y+')','#a855f7');
              lP(p,tg);
              dispThisTick=!0;
              upT()
            }
          }else if(tKey&&!dispThisTick){
            let tx=parseFloat(tKey.split('_')[0]),ty=parseFloat(tKey.split('_')[1]),tg=B.find(t=>t.x==tx&&t.y==ty);
            if(tg){
              let match=!0;
              if(filter){match=tg.n.toLowerCase().includes(filter)||String(tg.l)===filter}
              if(match){lP(p,tg);dispThisTick=!0}else{delete PT[pid]}
            }else{delete PT[pid]}
          }
        }
      }
    }
    loopTmr=setTimeout(loop,3000)
  }
  
  mkUI();
})();