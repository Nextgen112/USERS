The game's underlying asset loader (`WarCommander.js` / Kixeye's framework) runs custom injection routines that can choke on modern JavaScript template literals (those backticks ``` used for multi-line text). When the framework tries to parse or evaluate the file, it misinterprets the spacing and throws that `Unexpected string` syntax error.

To completely bypass the game's older loader quirks, the script below converts the design code into a completely flat, ultra-safe, single-line string asset. This keeps all the anti-lag optimizations and visual updates but packages them in a format the game framework will accept.

### Clean & Compatible Script

javascript
(function() { 
    const D = document; 
    const core = window.NexusCore; 
    if (!core) return console.error("Nexus Application Framework interface links failed to resolve."); 

    if (!D.getElementById("nexus-styles")) { 
        var CSS = '.wcbg{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(6,8,14,0.75);backdrop-filter:blur(8px);z-index:99999;display:none;align-items:center;justify-content:center;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;transition:opacity 0.25s ease-out}.wcpanel{background:rgba(13,17,26,0.95);border:1px solid rgba(0,210,255,0.25);box-shadow:0 20px 50px rgba(0,0,0,0.6),0 0 20px rgba(0,210,255,0.1);border-radius:16px;width:90%;max-width:450px;max-height:85vh;overflow-y:auto;padding:24px;color:#f0f4f8;position:relative;scrollbar-width:thin;scrollbar-color:rgba(0,210,255,0.2) transparent}.wctitle{background:linear-gradient(90deg,#00f2fe,#4facfe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center;font-size:16px;font-weight:800;margin-bottom:20px;letter-spacing:5px;text-transform:uppercase}.wctabs{display:flex;gap:6px;margin-bottom:18px;background:rgba(0,0,0,0.3);padding:5px;border-radius:10px;overflow-x:auto}.wctab{flex:1;padding:8px 6px;background:transparent;border:none;color:#74859a;cursor:pointer;font-size:11px;font-weight:700;border-radius:6px;text-transform:uppercase;text-align:center;min-width:75px;transition:all 0.2s ease}.wctab:hover{color:#00f2fe;background:rgba(0,210,255,0.08)}.wctab.on{background:linear-gradient(135deg,#4facfe,#00f2fe);color:#07090e;font-weight:800;box-shadow:0 2px 8px rgba(0,210,255,0.3)}.wcsec{display:none}.wcsec.on{display:block;animation:fadeIn 0.2s ease-out}.wcgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px}.wcbtn{padding:11px 10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;cursor:pointer;font-size:11.5px;font-weight:600;border-radius:8px;text-transform:capitalize;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:all 0.15s ease}.wcbtn:hover{background:rgba(0,210,255,0.12);color:#00f2fe;border-color:rgba(0,210,255,0.4);transform:translateY(-1px)}.wcbtn:active{transform:translateY(0)}.wcbtn.buying{opacity:.3;pointer-events:none}.wclbl{color:#475569;font-size:10px;margin:16px 0 8px;text-transform:uppercase;letter-spacing:2px;font-weight:700;display:flex;align-items:center;gap:8px}.wclbl::after{content:"";flex:1;height:1px;background:rgba(255,255,255,0.06)}.wcclose{position:absolute;top:20px;right:20px;color:#64748b;font-size:14px;cursor:pointer;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.03);transition:all 0.2s}.wcclose:hover{color:#ff4b72;background:rgba(255,75,114,0.15);transform:rotate(90deg)}.wclog{max-height:95px;overflow-y:auto;font-size:11px;color:#94a3b8;background:rgba(0,0,0,0.4);padding:12px;border-radius:10px;margin-top:18px;border:1px solid rgba(255,255,255,0.03)}.wclog div{margin:4px 0;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.02);display:flex;align-items:center;gap:6px}.wclog .ok{color:#2ecc71;font-weight:600}.wclog .err{color:#ff4b72;font-weight:600}.wcbuyall{display:block;width:100%;padding:12px;margin:12px 0 4px;background:rgba(0,242,254,0.06);color:#00f2fe;border:1px solid rgba(0,210,255,0.2);cursor:pointer;font-weight:700;text-transform:uppercase;font-size:11px;border-radius:8px;transition:all 0.2s ease}.wcbuyall:hover{background:linear-gradient(90deg,#4facfe,#00f2fe);color:#07090e;box-shadow:0 4px 12px rgba(0,210,255,0.2)}.search-bar{display:flex;gap:8px;margin-bottom:18px;padding:4px;background:rgba(0,0,0,0.25);border-radius:8px;border:1px solid rgba(255,255,255,0.03)}.search-bar input{flex:1;background:transparent;border:none;padding:8px 12px;color:#fff;font-size:12px;outline:none}.search-bar button{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:6px;color:#00f2fe;padding:0 18px;cursor:pointer;font-weight:700;font-size:11px;transition:all 0.15s}.search-bar button:hover{background:rgba(0,210,255,0.15);border-color:rgba(0,210,255,0.3)}@keyframes fadeIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}';
        var styleNode = D.createElement("style");
        styleNode.id = "nexus-styles";
        styleNode.innerHTML = CSS;
        D.head.appendChild(styleNode); 
    } 

    var structuralWrapper = D.getElementById("wcbg"); 
    if (!structuralWrapper) { 
        structuralWrapper = D.createElement("div");
        structuralWrapper.className = "wcbg";
        structuralWrapper.id = "wcbg";
        D.body.appendChild(structuralWrapper); 
    } 

    structuralWrapper.innerHTML = '<div class="wcpanel" id="wcp"><div class="wcclose" id="wcX">✕</div><div class="wctitle">NEXUS CONTROL HUB</div><div class="search-bar" id="searchBar"><input type="text" id="quickSearchInput" placeholder="Search operational matrices..."><button id="quickSearchBtn">DEPLOY</button></div><div class="wctabs" id="wctabs"></div><div id="wccontent"></div><div class="wclog" id="wclog"></div></div>';
    
    window.NEXUS_LOG_PANEL = D.getElementById("wclog"); 
    var searchInput = D.getElementById("quickSearchInput"); 
    var searchBtn = D.getElementById("quickSearchBtn");

    function executeIndexSearch(query) { 
        const structuralResults = []; 
        const lowCaseQuery = query.toLowerCase().trim(); 
        if (!lowCaseQuery) return structuralResults; 
        for (let b of core.BUFFS) { 
            const targetSku = b.id || b.s; 
            if (b.n.toLowerCase().includes(lowCaseQuery) || targetSku.toLowerCase().includes(lowCaseQuery)) structuralResults.push({ sku: targetSku, store: "operationstore" }) 
        } 
        for (let sId in core.HEROES) { 
            for (let h of core.HEROES[sId]) { 
                if (h.toLowerCase().includes(lowCaseQuery)) structuralResults.push({ sku: core.buildSkuString(sId, h), store: sId }) 
            } 
        } 
        return structuralResults; 
    } 

    async function executeDirectDeployment() { 
        var q = searchInput.value.trim(); 
        if (!q) { core.writeLog("Search input criteria empty", "err"); return } 
        core.writeLog("Querying structured database profiles: " + q, ""); 
        var searchMatches = executeIndexSearch(q); 
        if (searchMatches.length === 0) { core.writeLog("No valid matching configurations found", "err"); return } 
        core.writeLog("Initializing rapid module dispatch: " + searchMatches[0].sku, "ok");
        await core.executePurchase(searchMatches[0].sku); 
    } 

    searchBtn.onclick = executeDirectDeployment;
    searchInput.addEventListener("keypress", function(e) { if (e.key === "Enter") executeDirectDeployment() }); 
    
    var tabsContainer = D.getElementById("wctabs"); 
    var contentContainer = D.getElementById("wccontent");

    function buildInterfaceLayout() { 
        var designFragment = D.createDocumentFragment(); 
        var storeList = Array.isArray(core.STORES) ? core.STORES : Object.keys(core.STORES || {});
        
        storeList.forEach(function(st) { 
            var sectionContainer = D.createElement("div");
            sectionContainer.className = "wcsec";
            sectionContainer.id = "sec-" + st; 
            
            if (st === "operationstore" || st === "operation_store") { 
                var utilityLabel = D.createElement("div");
                utilityLabel.className = "wclbl";
                utilityLabel.textContent = "Tactical Modification Profiles";
                sectionContainer.appendChild(utilityLabel); 
                
                var utilityGrid = D.createElement("div");
                utilityGrid.className = "wcgrid";
                core.BUFFS.forEach(function(bf) { 
                    var actionButton = D.createElement("button");
                    actionButton.className = "wcbtn";
                    actionButton.textContent = bf.n;
                    actionButton.onclick = function() { 
                        this.classList.add("buying");
                        core.executePurchase(bf.id || bf.s);
                        setTimeout(() => actionButton.classList.remove("buying"), 500) 
                    };
                    utilityGrid.appendChild(actionButton); 
                });
                sectionContainer.appendChild(utilityGrid); 
            } 
            
            var headerLabel = D.createElement("div");
            headerLabel.className = "wclbl";
            headerLabel.textContent = st.replace("store", "").replace("_", "") + " Operations Division";
            sectionContainer.appendChild(headerLabel); 
            
            var itemGrid = D.createElement("div");
            itemGrid.className = "wcgrid"; 
            var activeDataset = (core.HEROES ? core.HEROES[st] : []) || []; 
            
            if (activeDataset.length === 0 || (activeDataset.length === 1 && activeDataset[0] === "")) { 
                var emptyContainer = D.createElement("div");
                emptyContainer.style.cssText = "color:#475569;text-align:center;font-size:11px;grid-column:1/-1;padding:16px;";
                emptyContainer.textContent = "No cataloged assets located inside this sector context.";
                itemGrid.appendChild(emptyContainer); 
            } else { 
                activeDataset.forEach(function(h) { 
                    var actionButton = D.createElement("button");
                    actionButton.className = "wcbtn";
                    actionButton.textContent = h;
                    actionButton.onclick = function() { 
                        this.classList.add("buying"); 
                        var calculatedSkus = (st === "sectorbreachstore") ? core.resolveSectorCandidates(h) : [core.buildSkuString(st, h)];
                        calculatedSkus.forEach(s => { if (s) core.executePurchase(s) });
                        setTimeout(() => actionButton.classList.remove("buying"), 500) 
                    };
                    itemGrid.appendChild(actionButton); 
                }); 
            } 
            sectionContainer.appendChild(itemGrid); 
            
            if (activeDataset.length > 0 && activeDataset[0] !== "") { 
                var batchDeployButton = D.createElement("button");
                batchDeployButton.className = "wcbuyall";
                batchDeployButton.textContent = "Batch Deploy";
                batchDeployButton.onclick = async function() { 
                    batchDeployButton.disabled = true;
                    batchDeployButton.textContent = "Deploying..."; 
                    for (var i = 0; i < activeDataset.length; i++) { 
                        var operationalSkus = (st === "sectorbreachstore") ? core.resolveSectorCandidates(activeDataset[i]) : [core.buildSkuString(st, activeDataset[i])]; 
                        for (var j = 0; j < operationalSkus.length; j++) { 
                            if (operationalSkus[j]) { 
                                await core.executePurchase(operationalSkus[j]);
                                await core.delay(500); 
                            } 
                        } 
                    } 
                    batchDeployButton.disabled = false;
                    batchDeployButton.textContent = "Batch Deploy"; 
                };
                sectionContainer.appendChild(batchDeployButton); 
            } 
            designFragment.appendChild(sectionContainer); 
        });
        contentContainer.appendChild(designFragment); 
    } 
    
    buildInterfaceLayout();
    tabsContainer.innerHTML = ""; 
    var storeList = Array.isArray(core.STORES) ? core.STORES : Object.keys(core.STORES || {});
    
    storeList.forEach(function(st) { 
        var selectionTab = D.createElement("button");
        selectionTab.className = "wctab";
        selectionTab.textContent = st.replace("store", "").replace("_", "");
        selectionTab.dataset.store = st;
        selectionTab.onclick = function() { switchViewTab(st) };
        tabsContainer.appendChild(selectionTab); 
    });

    const cachedTabs = Array.from(D.querySelectorAll(".wctab"));
    const cachedSections = Array.from(D.querySelectorAll(".wcsec"));

    function switchViewTab(st) { 
        cachedTabs.forEach(t => t.classList.toggle("on", t.dataset.store === st));
        cachedSections.forEach(s => s.classList.toggle("on", s.id === "sec-" + st)); 
    } 
    
    switchViewTab(storeList[0] || "operationstore"); 
    var closePanelButton = D.getElementById("wcX");

    function openUserInterface() { structuralWrapper.style.display = "flex" }
    function closeUserInterface() { structuralWrapper.style.display = "none" } 
    
    closePanelButton.onclick = closeUserInterface;
    structuralWrapper.onclick = e => { if (e.target === structuralWrapper) closeUserInterface() }; 
    
    if (!window.__NEXUS_KEY_BOUND__) { 
        window.__NEXUS_KEY_BOUND__ = true;
        D.addEventListener("keydown", function(e) { 
            if (e.key === "F10") { 
                e.preventDefault(); 
                if (structuralWrapper.style.display === "flex") { 
                    closeUserInterface(); 
                } else { 
                    openUserInterface(); 
                } 
            } 
        }, true); 
    } 
    
    core.writeLog("Modular Graphic Subsystems Re-Synchronized.", "ok"); 
})();