// Hosted at: https://nextgen112.github.io/NextGenerationHackers/farm-design.js
(function(){
    const D = document;
    const auto = window.NexusAutomation;
    if(!auto) return console.error("Nexus Engine interface link missing.");

    if (!D.getElementById('wcf_styles')) {
        let st = D.createElement('style'); st.id = 'wcf_styles';
        st.innerHTML = `#wcf_ui{display:none;position:fixed;top:10px;left:10px;z-index:99999;background:#1a1a24;color:#e2e8f0;padding:8px;border-radius:6px;font-family:sans-serif;font-size:11px;width:280px;max-height:90vh;overflow-y:auto;border:1px solid #2d3748;box-shadow:0 4px 8px rgba(0,0,0,0.5);}#wcf_ui h3{margin:0 0 8px;text-align:center;font-size:13px;color:#38bdf8;border-bottom:1px solid #2d3748;padding-bottom:6px;}.wcf-btn{width:100%;background:#334155;color:#f8fafc;border:1px solid #475569;padding:5px;border-radius:4px;cursor:pointer;margin-bottom:6px;font-size:11px;}.wcf-btn-blue{background:#0284c7;border-color:#0369a1;}.wcf-btn-green{background:#16a34a;border-color:#15803d;}.wcf-btn-red{background:#dc2626;border-color:#b91c1c;}.wcf-panel{background:#0f172a;border:1px solid #1e293b;border-radius:4px;padding:6px;margin-bottom:6px;}.wcf-input{background:#1e293b;color:#f8fafc;border:1px solid #475569;border-radius:3px;padding:3px;font-size:10px;}.wcf-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;padding-bottom:2px;border-bottom:1px solid #1e293b;}.wcf-small-btn{background:#334155;color:#fff;border:1px solid #475569;border-radius:3px;cursor:pointer;padding:2px 6px;font-size:9px;}.wcf-scroll{max-height:120px;overflow-y:auto;}`;
        D.head.appendChild(st);
    }

    var mainContainer = D.getElementById('wcf_ui');
    if(!mainContainer){
        mainContainer = D.createElement('div'); mainContainer.id = 'wcf_ui';
        D.body.appendChild(mainContainer);
    }

    function drawUI(){
        let s = '<h3>🛸 NEXUS SYSTEM HUB</h3>';
        s += '<div id="wcf_st" class="wcf-panel" style="text-align:center;color:#4ade80;font-weight:bold;">Ready</div>';
        s += '<button id="nexus_scan" class="wcf-btn wcf-btn-blue">📡 RUN SECTOR SCAN</button>';
        s += '<div class="wcf-panel"><div class="wcf-row" style="border:none;"><b>🎯 Mode:</b> <select id="wcf_mode" class="wcf-input" style="width:60%;"><option value="spread">Spread</option><option value="swarm">Swarm</option></select></div><div class="wcf-row" style="border:none;"><b>🔢 Max Atk:</b> <input id="wcf_hc" type="number" value="30" class="wcf-input" style="width:60%;"></div></div>';
        s += '<div class="wcf-panel"><b>📦 Found Bases:</b><div id="wcf_fb" class="wcf-scroll"></div></div>';
        s += '<div class="wcf-panel"><b>🎯 Targets Queue:</b><div id="wcf_tb" class="wcf-scroll"></div></div>';
        s += '<button id="wcf_tg" class="wcf-btn wcf-btn-green">▶️ START FARMING</button>';
        s += '<div class="wcf-panel"><div style="display:flex;justify-content:space-between;"><b>🚜 Teams</b><button id="nexus_refresh_pl" class="wcf-small-btn">⟳</button></div><div id="wcf_pl" class="wcf-scroll"></div></div>';
        s += '<button id="nexus_hide" class="wcf-btn wcf-btn-red" style="margin-top:5px;">✖️ Close</button>';
        mainContainer.innerHTML = s;

        D.getElementById('nexus_scan').onclick = () => auto.scan();
        D.getElementById('wcf_tg').onclick = toggleEngineState;
        D.getElementById('nexus_refresh_pl').onclick = renderPlatoons;
        D.getElementById('nexus_hide').onclick = () => mainContainer.style.display = 'none';
    }

    let uiTimeout = null;
    window.__wcfRefreshUI = function() {
        if (mainContainer.style.display === 'none') return;
        if (uiTimeout) clearTimeout(uiTimeout);
        uiTimeout = setTimeout(() => { updateTargets(); updateScanner(); }, 100);
    };

    function renderPlatoons(){
        let p = auto.cP(), h = '', displayPanel = D.getElementById('wcf_pl');
        if(!displayPanel) return;
        let cfg = JSON.parse(localStorage.getItem('wcf_p_cfg') || '{}'), activePlats = auto.getAP();
        p.forEach(x => {
            let checked = activePlats.includes(String(x.id)) ? 'checked' : '';
            let fVal = cfg[x.id] || '';
            h += `<div class="wcf-row"><label><input type="checkbox" class="p_chk" value="${x.id}" ${checked}> ${x.n}</label><input type="text" value="${fVal}" class="wcf-input team-filter" data-id="${x.id}" style="width:45px;"></div>`;
        });
        displayPanel.innerHTML = h || 'No Platoons found';
        D.querySelectorAll('.p_chk').forEach(el => el.onchange = () => {
            auto.setAP(Array.from(D.querySelectorAll('.p_chk:checked')).map(c => c.value));
        });
    }

    function updateTargets(){
        let d = D.getElementById('wcf_tb'), localB = auto.getTargets(); if(!d) return;
        d.innerHTML = localB.map((t, i) => `<div class="wcf-row"><span>L${t.l} ${t.n} (${t.x},${t.y})</span><button class="wcf-small-btn" onclick="window.NexusAutomation.getTargets().splice(${i},1);window.__wcfRefreshUI();" style="background:#dc2626;">X</button></div>`).join('');
    }

    function updateScanner(){
        let d = D.getElementById('wcf_fb'), localS = auto.getScanning(); if(!d) return;
        let groups = {}; localS.forEach(t => { let key = t.n + '_L' + t.l; groups[key] = groups[key] || []; groups[key].push(t); });
        d.innerHTML = Object.keys(groups).map(k => `<button class="wcf-btn" onclick="window.__addCluster('${k}')" style="text-align:left;font-size:10px;margin-bottom:2px;">➕ ${groups[k].length}x ${k}</button>`).join('');
    }

    window.__addCluster = function(key){
        let added = 0, max = parseInt(D.getElementById('wcf_hc').value) || 30;
        let localS = auto.getScanning(), localB = auto.getTargets();
        localS.forEach(t => {
            if(added >= max) return;
            if((t.n + '_L' + t.l) === key && !localB.find(b => b.x == t.x && b.y == t.y)){
                localB.push({x: t.x, y: t.y, id: t.id, n: t.n, l: t.l}); added++;
            }
        });
        auto.setTargets(localB); window.__wcfRefreshUI();
    };

    function toggleEngineState(){
        let state = !auto.getFlags(); auto.setFlags(state);
        let b = D.getElementById('wcf_tg'); if(!b) return;
        if(state){ b.innerHTML = '⏸️ STOP AUTOMATION'; b.className = 'wcf-btn wcf-btn-red'; auto.loop(); } 
        else { b.innerHTML = '▶️ START FARMING'; b.className = 'wcf-btn wcf-btn-green'; auto.uS('Paused', '#fbbf24'); }
    }

    if (!D.getElementById('nexus_launcher_btn')) {
        let mb = D.createElement('button'); mb.id = 'nexus_launcher_btn'; mb.innerHTML = '⚙️ Nexus Farm';
        mb.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;background:#1e293b;color:#f8fafc;padding:5px 10px;border-radius:5px;cursor:pointer;font-size:12px;';
        mb.onclick = () => { mainContainer.style.display = (mainContainer.style.display === 'block') ? 'none' : 'block'; renderPlatoons(); window.__wcfRefreshUI(); };
        D.body.appendChild(mb);
    }

    drawUI(); renderPlatoons(); window.__wcfRefreshUI();
})();