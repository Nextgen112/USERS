// Hosted at: https://nextgen112.github.io/NextGenerationHackers/matrix-design.js
(function(){
    const D = document;
    const core = window.NexusCore;
    if(!core) return console.error("Nexus Application Framework interface links failed to resolve.");

    // 1. Framework Component Design Layout Rendering Style Sheet Injection
    if (!D.getElementById("nexus-styles")) {
        var CSS = ".wcbg{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,12,18,.6);z-index:99999;display:none;align-items:center;justify-content:center;font-family:sans-serif}.wcpanel{background:rgba(20,24,35,.95);border:1px solid rgba(0,210,255,.25);border-radius:12px;width:450px;max-height:80vh;overflow-y:auto;padding:20px;color:#f0f4f8;position:relative}.wctitle{background:linear-gradient(90deg,#00f2fe,#4facfe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center;font-size:15px;font-weight:800;margin-bottom:16px;letter-spacing:4px}.wctabs{display:flex;gap:5px;margin-bottom:16px;background:rgba(0,0,0,.2);padding:4px;border-radius:8px;overflow-x:auto;white-space:nowrap}.wctab{flex:1;padding:7px 4px;background:transparent;border:none;color:#8a99ad;cursor:pointer;font-size:10px;font-weight:700;border-radius:6px;text-transform:uppercase;text-align:center;min-width:70px}.wctab:hover{color:#00f2fe;background:rgba(0,210,255,.05)}.wctab.on{background:linear-gradient(135deg,#4facfe,#00f2fe);color:#0b0e16;font-weight:800}.wcsec{display:none}.wcsec.on{display:block}.wcgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px}.wcbtn{padding:10px 8px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:#cbd5e1;cursor:pointer;font-size:11px;font-weight:600;border-radius:8px;text-transform:capitalize;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wcbtn:hover{background:rgba(0,210,255,.1);color:#00f2fe;border-color:rgba(0,210,255,.4)}.wcbtn.buying{opacity:.3;pointer-events:none}.wclbl{color:#64748b;font-size:10px;margin:12px 0 6px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;display:flex;align-items:center;gap:6px}.wclbl::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.05)}.wcclose{position:absolute;top:16px;right:18px;color:#64748b;font-size:16px;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,.03)}.wcclose:hover{color:#ff4b72;background:rgba(255,75,114,.1)}.wclog{max-height:85px;overflow-y:auto;font-size:10.5px;color:#94a3b8;background:rgba(0,0,0,.25);padding:10px;border-radius:8px;margin-top:16px;border:1px solid rgba(255,255,255,.04)}.wclog div{margin:3px 0;padding-bottom:3px;border-bottom:1px solid rgba(255,255,255,.02);display:flex;align-items:center}.wclog .ok{color:#2ecc71;font-weight:600}.wclog .err{color:#ff4b72;font-weight:600}.wcbuyall{display:block;width:100%;padding:11px;margin:10px 0 4px;background:rgba(0,242,254,.08);color:#00f2fe;border:1px solid rgba(0,210,255,.25);cursor:pointer;font-weight:700;text-transform:uppercase;font-size:11px;border-radius:8px}.wcbuyall:hover{background:linear-gradient(90deg,#4facfe,#00f2fe);color:#0b0e16}.search-bar{display:flex;gap:8px;margin-bottom:16px;padding:4px;background:rgba(0,0,0,.15);border-radius:8px}.search-bar input{flex:1;background:transparent;border:none;padding:8px 10px;color:#fff;font-size:12px;outline:none}.search-bar button{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:6px;color:#00f2fe;padding:0 16px;cursor:pointer;font-weight:700;font-size:11px}";
        var styleNode = D.createElement("style"); styleNode.id = "nexus-styles"; styleNode.innerHTML = CSS; D.head.appendChild(styleNode);
    }

    // 2. Structural Component DOM Assembler (Avoid duplicate main panel)
    var structuralWrapper = D.getElementById("wcbg");
    if (!structuralWrapper) {
        structuralWrapper = D.createElement("div"); structuralWrapper.className = "wcbg"; structuralWrapper.id = "wcbg";
        D.body.appendChild(structuralWrapper);
    }
    
    // Refresh the inner structure cleanly
    structuralWrapper.innerHTML = '<div class="wcpanel" id="wcp"><div class="wcclose" id="wcX">✕</div><div class="wctitle">NEXUS CONTROL HUB</div><div class="search-bar" id="searchBar"><input type="text" id="quickSearchInput" placeholder="Search operational matrices..."><button id="quickSearchBtn">DEPLOY</button></div><div class="wctabs" id="wctabs"></div><div id="wccontent"></div><div class="wclog" id="wclog"></div></div>';

    window.NEXUS_LOG_PANEL = D.getElementById("wclog");
    var searchInput = D.getElementById("quickSearchInput");
    var searchBtn = D.getElementById("quickSearchBtn");

    // 3. Search Engine Module parsing Core variables
    function executeIndexSearch(query) {
        const structuralResults = []; const lowCaseQuery = query.toLowerCase().trim(); if (!lowCaseQuery) return structuralResults;
        for (let b of core.BUFFS) { if (b.n.toLowerCase().includes(lowCaseQuery) || b.s.toLowerCase().includes(lowCaseQuery)) structuralResults.push({ sku: b.s, store: "operationstore" }) }
        for (let sId in core.HEROES) { for (let h of core.HEROES[sId]) { if (h.toLowerCase().includes(lowCaseQuery)) structuralResults.push({ sku: core.buildSkuString(sId, h), store: sId }) } }
        return structuralResults;
    }

    async function executeDirectDeployment() {
        var q = searchInput.value.trim(); if (!q) { core.writeLog("Search input criteria empty", "err"); return }
        core.writeLog("Querying structured database profiles: " + q, ""); var searchMatches = executeIndexSearch(q);
        if (searchMatches.length === 0) { core.writeLog("No valid matching configurations found", "err"); return }
        core.writeLog("Initializing rapid module dispatch: " + searchMatches[0].sku, "ok"); await core.executePurchase(searchMatches[0].sku);
    }
    searchBtn.onclick = executeDirectDeployment;
    searchInput.addEventListener("keypress", function (e) { if (e.key === "Enter") executeDirectDeployment() });

    var tabsContainer = D.getElementById("wctabs");
    var contentContainer = D.getElementById("wccontent");

    // 4. Dynamic Matrix GUI Interface Generation
    function buildInterfaceLayout() {
        var designFragment = D.createDocumentFragment();
        core.STORES.forEach(function (st) {
            var sectionContainer = D.createElement("div"); sectionContainer.className = "wcsec"; sectionContainer.id = "sec-" + st;
            if (st === "operationstore") {
                var utilityLabel = D.createElement("div"); utilityLabel.className = "wclbl"; utilityLabel.textContent = "Tactical Modification Profiles"; sectionContainer.appendChild(utilityLabel);
                var utilityGrid = D.createElement("div"); utilityGrid.className = "wcgrid";
                core.BUFFS.forEach(function (bf) {
                    var actionButton = D.createElement("button"); actionButton.className = "wcbtn"; actionButton.textContent = bf.n;
                    actionButton.onclick = function () { this.classList.add("buying"); core.executePurchase(bf.s); setTimeout(() => actionButton.classList.remove("buying"), 500) };
                    utilityGrid.appendChild(actionButton);
                });
                sectionContainer.appendChild(utilityGrid);
            }
            var headerLabel = D.createElement("div"); headerLabel.className = "wclbl"; headerLabel.textContent = st.replace("store", "") + " Operations Division"; sectionContainer.appendChild(headerLabel);
            var itemGrid = D.createElement("div"); itemGrid.className = "wcgrid";
            var activeDataset = core.HEROES[st] || [];
            if (activeDataset.length === 0 || (activeDataset.length === 1 && activeDataset[0] === "")) {
                var emptyContainer = D.createElement("div"); emptyContainer.style.cssText = "color:#475569;text-align:center;font-size:11px;grid-column:1/-1;padding:16px;"; emptyContainer.textContent = "No cataloged assets located inside this sector context."; itemGrid.appendChild(emptyContainer);
            } else {
                activeDataset.forEach(function (h) {
                    var actionButton = D.createElement("button"); actionButton.className = "wcbtn"; actionButton.textContent = h;
                    actionButton.onclick = function () { this.classList.add("buying"); var calculatedSkus = (st === "sectorbreachstore") ? core.resolveSectorCandidates(h) : [core.buildSkuString(st, h)]; calculatedSkus.forEach(s => { if (s) core.executePurchase(s) }); setTimeout(() => actionButton.classList.remove("buying"), 500) };
                    itemGrid.appendChild(actionButton);
                });
            }
            sectionContainer.appendChild(itemGrid);
            if (activeDataset.length > 0 && activeDataset[0] !== "") {
                var batchDeployButton = D.createElement("button"); batchDeployButton.className = "wcbuyall"; batchDeployButton.textContent = "⚡ Batch Deploy Sector Assets";
                batchDeployButton.onclick = async function () {
                    batchDeployButton.disabled = true; batchDeployButton.textContent = "Deploying Cluster Nodes...";
                    for (var i = 0; i < activeDataset.length; i++) {
                        var operationalSkus = (st === "sectorbreachstore") ? core.resolveSectorCandidates(activeDataset[i]) : [core.buildSkuString(st, activeDataset[i])];
                        for (var j = 0; j < operationalSkus.length; j++) { 
                            if (operationalSkus[j]) { 
                                await core.executePurchase(operationalSkus[j]); 
                                await core.delay(500); // ⚡ Changed to fast 500ms sleep loop
                            } 
                        }
                    }
                    batchDeployButton.disabled = false; batchDeployButton.textContent = "⚡ Batch Deploy Sector Assets";
                };
                sectionContainer.appendChild(batchDeployButton);
            }
            designFragment.appendChild(sectionContainer);
        });
        contentContainer.appendChild(designFragment);
    }
    buildInterfaceLayout();

    // Clear and build clean tabs
    tabsContainer.innerHTML = "";
    core.STORES.forEach(function (st) {
        var selectionTab = D.createElement("button"); selectionTab.className = "wctab"; selectionTab.textContent = st.replace("store", ""); selectionTab.dataset.store = st;
        selectionTab.onclick = function () { switchViewTab(st) }; tabsContainer.appendChild(selectionTab);
    });

    function switchViewTab(st) {
        D.querySelectorAll(".wctab").forEach(t => t.classList.toggle("on", t.dataset.store === st));
        D.querySelectorAll(".wcsec").forEach(s => s.classList.toggle("on", s.id === "sec-" + st));
    }
    switchViewTab("operationstore");

    var closePanelButton = D.getElementById("wcX"); 
    function openUserInterface() { structuralWrapper.style.display = "flex" }
    function closeUserInterface() { structuralWrapper.style.display = "none" }
    closePanelButton.onclick = closeUserInterface; structuralWrapper.onclick = e => { if (e.target === structuralWrapper) closeUserInterface() };

    // Register hotkey listener once
    if (!window.__NEXUS_KEY_BOUND__) {
        window.__NEXUS_KEY_BOUND__ = true;
        D.addEventListener("keydown", function (e) {
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