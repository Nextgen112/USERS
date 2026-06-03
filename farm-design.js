// Hosted at: https://nextgen112.github.io/NextGenerationHackers/farm-design.js
(function(){
    const D = document;
    const auto = window.NexusAutomation;
    if(!auto) return console.error("Nexus Automation Pipeline links failed to resolve.");

    if (!D.getElementById('wcf_styles')) {
        let st = D.createElement('style'); st.id = 'wcf_styles';
        st.innerHTML = `#wcf_ui{display:none;position:fixed;top:10px;left:10px;z-index:99999;background:#1a1a24;color:#e2e8f0;padding:8px;border-radius:6px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:11px;width:280px;max-height:90vh;overflow-y:auto;border:1px solid #2d3748;box-shadow:0 4px 8px rgba(0,0,0,0.5);}#wcf_ui h3{margin:0 0 8px;text-align:center;font-size:13px;color:#38bdf8;font-weight:600;border-bottom:1px solid #2d3748;padding-bottom:6px;}.wcf-btn{width:100%;background:#334155;color:#f8fafc;border:1px solid #475569;padding:5px;border-radius:4px;cursor:pointer;font-weight:600;transition:all 0.15s;margin-bottom:6px;font-size:11px;}.wcf-btn:hover{background:#475569;}.wcf-btn-blue{background:#0284c7;border-color:#0369a1;}.wcf-btn-green{background:#16a34a;border-color:#15803d;}.wcf-btn-red{background:#dc2626;border-color:#b91c1c;}.wcf-panel{background:#0f172a;border:1px solid #1e293b;border-radius:4px;padding:6px;margin-bottom:6px;}.wcf-input{background:#1e293b;color:#f8fafc;border:1px solid #475569;border-radius:3px;padding:3px;font-size:10px;}.wcf-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;padding-bottom:2px;border-bottom:1px solid #1e293b;font-size:10px;}.wcf-small-btn{background:#334155;color:#fff;border:1px solid #475569;border-radius:3px;cursor:pointer;padding:2px 6px;font-size:9px;}.wcf-scroll{max-height:120px;overflow-y:auto;padding-right:3px;margin-top:3px;font-size:10px;}.wcf-scroll::-webkit-scrollbar{width:4px;}.wcf-scroll::-webkit-scrollbar-thumb{background:#475569;border-radius:2px;}`;
        D.head.appendChild(st);
    }

    var mainContainer = D.getElementById('wcf_ui');
    if(!mainContainer){
        mainContainer = D.createElement('div'); mainContainer.id = 'wcf_ui';
        D.body.appendChild(mainContainer);
    }

    function generateDisplayPanel(){
        let s = '<h3>🛸 ECO NEXUS HUB</h3>';
        s += '<div id="wcf_st" class="wcf-panel" style="text-align:center;color:#4ade80;font-weight:bold;font-size:11px;">Idle</div>';
        s += '<button id="nexus_scan" class="wcf-btn wcf-btn-blue">📡 RUN ECO SCAN</button>';
        s += '<div class="wcf-panel"><div class="wcf-row" style="border:none;"><b>🎯 Formation:</b> <select id="wcf_mode" class="wcf-input" style="width:60%;"><option value="spread">Spread Matrix</option><option value="swarm">Swarm Matrix</option></select></div><div class="wcf-row" style="border:none;"><b>🔢 Max Operations:</b> <input id="wcf_hc" type="number" value="30" class="wcf-input" style="width:60%;"></div></div>';
        s += '<div class="wcf-panel"><b>📦 Cataloged Targets:</b><div id="wcf_fb" class="wcf-scroll"></div></div>';
        s += '<div class="wcf-panel"><b>🎯 Dispatched Targets:</b><div id="wcf_tb" class="wcf-scroll"></div></div>';
        s += '<button id="wcf_tg" class="wcf-btn wcf-btn-green" style="margin-bottom:6px;">▶️ ACCELERATE AUTOMATION</button>';
        s += '<div class="wcf-panel"><div style="display:flex;justify-content:space-between;"><b>🚜 Combat Teams</b><button id="nexus_refresh_pl" class="wcf-small-btn">⟳</button></div><div id="wcf_pl" class="wcf-scroll" style="max-height:100px;"></div></div>';
        s += '<button id="nexus_hide" class="wcf-btn wcf-btn-red" style="margin-bottom:0;">✖️ Hide Panel</button>';
        mainContainer.innerHTML = s;

        D.getElementById('nexus_scan').onclick = triggerScanSequence;
        D.getElementById('wcf_tg').onclick = switchProcessingState;
        D.getElementById('nexus_refresh_pl').onclick = refreshTeamLayout;
        D.getElementById('nexus_hide').onclick = () => mainContainer.style.display = 'none';
    }

    let uiUpdatePending = false;
    window.__wcfRefreshUI = function() {
        if (uiUpdatePending || mainContainer.style.display === 'none') return;
        uiUpdatePending = true;
        requestAnimationFrame(() => { 
            updateTargetInterface();
            updateScannerInterface();
            uiUpdatePending = false;
        });
    };

    function refreshTeamLayout(){
        if (mainContainer.style.display === 'none') return;
        requestAnimationFrame(() => {
            let p = auto.cP(), h = '';
            let displayPanel = D.getElementById('wcf_pl');
            if(!displayPanel) return;
            if(!p.length){ displayPanel.innerHTML = '<i style="color:#ef4444;">No operational divisions!</i>'; return; }
            let cfg = JSON.parse(localStorage.getItem('wcf_p_cfg') || '{}');
            let activePlats = auto.getAP();
            
            p.forEach(x => {
                let checkedState = activePlats.includes(String(x.id)) ? 'checked' : '';
                let filterVal = cfg[x.id] || '';
                h += `<div class="wcf-row"><label style="cursor:pointer;flex-grow:1;overflow:hidden;text-overflow:ellipsis;"><input type="checkbox" class="p_chk" value="${x.id}" ${checkedState} style="margin-right:3px;"> ${x.n} ${x.atk ? '🔴' : x.mov ? '🟡' : ''}</label><input type="text" placeholder="All" value="${filterVal}" class="wcf-input team-filter" data-id="${x.id}" style="width:45px;padding:2px;"></div>`;
            });
            displayPanel.innerHTML = h;

            D.querySelectorAll('.p_chk').forEach(el => el.onchange = saveTeamSelections);
            D.querySelectorAll('.team-filter').forEach(el => el.oninput = function() { saveIndividualFilter(this.dataset.id, this.value); });
        });
    }

    function saveIndividualFilter(pid, val){
        let cfg = JSON.parse(localStorage.getItem('wcf_p_cfg') || '{}');
        cfg[pid] = val.trim();
        localStorage.setItem('wcf_p_cfg', JSON.stringify(cfg));
    }

    function saveTeamSelections(){
        let checkedValues = Array.from(D.querySelectorAll('.p_chk:checked')).map(c => c.value);
        auto.setAP(checkedValues);
    }

    function updateTargetInterface(){
        let d = D.getElementById('wcf_tb'); if(!d) return;
        let localB = auto.getTargets();
        if(!localB.length){ d.innerHTML = '<i style="color:#94a3b8;">No tasks configured</i>'; return; }
        let pool = auto.cP();
        let localPT = auto.getPT();

        d.innerHTML = localB.map((t, i) => {
            let tk = t.x + '_' + t.y, pids = Object.keys(localPT).filter(k => localPT[k] == tk), st = '⏳';
            if(pids.length > 0){
                let nms = [], iA = !1;
                pids.forEach(pid => { let p = pool.find(x => x.id == pid); if(p){ nms.push(p.n); if(p.atk) iA = !0; } });
                st = iA ? '🔴' + nms.join(',') : '🟡' + nms.join(',');
            }
            return `<div class="wcf-row"><span>[${t.n}] (${t.x},${t.y}) ${st}</span><button class="wcf-small-btn target-del-btn" data-index="${i}" style="background:#dc2626;">X</button></div>`;
        }).join('');

        D.querySelectorAll('.target-del-btn').forEach(btn => btn.onclick = function() { removeTargetNode(parseInt(this.dataset.index)); });
    }

    function removeTargetNode(i){
        let localB = auto.getTargets(); let localPT = auto.getPT();
        let t = localB[i];
        if(t){
            let tk = t.x + '_' + t.y;
            for(let k in localPT){ if(localPT[k] == tk) delete localPT[k]; }
        }
        localB.splice(i, 1); auto.setTargets(localB); updateTargetInterface();
    }

    function updateScannerInterface(){
        let d = D.getElementById('wcf_fb'); if(!d) return;
        let localS = auto.getScanning();
        if(!localS.length){ d.innerHTML = '<i>Initialize scan matrix...</i>'; return; }
        let groups = {};
        localS.forEach(t => { let key = (t.spawn || t.tag || 'Unknown') + '_L' + t.l; if(!groups[key]) groups[key] = []; groups[key].push(t); });
        let h = '';
        for(let k in groups){ h += `<button class="wcf-btn group-add-btn" data-key="${k}" style="text-align:left;font-size:10px;padding:4px;margin-bottom:3px;">➕ ${groups[k].length}x ${k}</button>`; }
        d.innerHTML = h;

        D.querySelectorAll('.group-add-btn').forEach(btn => btn.onclick = function() { injectGroupCluster(this.dataset.key); });
    }

    function injectGroupCluster(key){
        let added = 0; let maxToAdd = parseInt(D.getElementById('wcf_hc').value) || 30;
        let localS = auto.getScanning(); let localB = auto.getTargets();
        localS.forEach(t => {
            if(added >= maxToAdd) return;
            let tKey = (t.spawn || t.tag || 'Unknown') + '_L' + t.l;
            if(tKey === key){
                if(!localB.find(b => b.x == t.x && b.y == t.y)){
                    localB.push({x: t.x, y: t.y, id: t.id, n: 'L' + t.l + ' ' + t.n, l: t.l}); added++;
                }
            }
        });
        auto.setTargets(localB); auto.uS('Injected ' + added + ' vectors', '#4ade80'); updateTargetInterface();
    }

    function triggerScanSequence(){
        let v = auto.getE(), c = 0; let localS = [];
        v.forEach(e => {
            let o = e.obj;
            if(o && o.type === 3 && o.coord){
                let info = auto.parseBaseInfo(o);
                localS.push({x: o.coord.x, y: o.coord.y, id: e.id, n: info.name, tag: info.tag || info.spawn || 'base', spawn: info.spawn, l: info.level}); c++;
            }
        });
        auto.setScanning(localS); auto.uS('Discovered ' + c + ' targets', '#38bdf8'); updateScannerInterface();
    }

    function switchProcessingState(){
        let state = !auto.getFlags(); auto.setFlags(state);
        let b = D.getElementById('wcf_tg'); if(!b) return;
        if(state){
            b.innerHTML = '⏸️ INTERRUPT FLOW'; b.className = 'wcf-btn wcf-btn-red'; auto.loop();
        } else {
            b.innerHTML = '▶️ ACCELERATE AUTOMATION'; b.className = 'wcf-btn wcf-btn-green'; auto.uS('Process Paused', '#fbbf24');
        }
    }

    if (!D.getElementById('nexus_launcher_btn')) {
        let mb = D.createElement('button'); mb.id = 'nexus_launcher_btn';
        mb.innerHTML = '⚙️ Nexus Farm';
        mb.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;background:#1e293b;color:#f8fafc;border:1px solid #475569;padding:5px 10px;border-radius:5px;cursor:pointer;font-weight:bold;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.3);';
        mb.onclick = function(){
            if(mainContainer.style.display === 'none' || mainContainer.style.display === ''){
                mainContainer.style.display = 'block'; refreshTeamLayout();
            } else {
                mainContainer.style.display = 'none';
            }
        };
        D.body.appendChild(mb);
    }

    generateDisplayPanel(); refreshTeamLayout(); window.__wcfRefreshUI();
    auto.uS('Low-CPU Framework Active', '#38bdf8');
})();