(function() { 
    var D = document; 
    var core = window.NexusCore; 
    if (!core) return console.error('Nexus Application Framework interface links failed to resolve.'); 

    if (!D.getElementById('nexus-styles')) { 
        var CSS = '.wcbg{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(6,8,14,0.75);backdrop-filter:blur(8px);z-index:99999;display:none;align-items:center;justify-content:center;font-family:sans-serif;transition:opacity 0.25s ease-out}.wcpanel{background:rgba(13,17,26,0.95);border:1px solid rgba(0,210,255,0.25);box-shadow:0 20px 50px rgba(0,0,0,0.6),0 0 20px rgba(0,210,255,0.1);border-radius:16px;width:90%;max-width:450px;max-height:85vh;overflow-y:auto;padding:24px;color:#f0f4f8;position:relative;scrollbar-width:thin;scrollbar-color:rgba(0,210,255,0.2) transparent}.wctitle{background:linear-gradient(90deg,#00f2fe,#4facfe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center;font-size:16px;font-weight:800;margin-bottom:20px;letter-spacing:5px;text-transform:uppercase}.wctabs{display:flex;gap:6px;margin-bottom:18px;background:rgba(0,0,0,0.3);padding:5px;border-radius:10px;overflow-x:auto}.wctab{flex:1;padding:8px 6px;background:transparent;border:none;color:#74859a;cursor:pointer;font-size:11px;font-weight:700;border-radius:6px;text-transform:uppercase;text-align:center;min-width:75px;transition:all 0.2s ease}.wctab:hover{color:#00f2fe;background:rgba(0,210,255,0.08)}.wctab.on{background:linear-gradient(135deg,#4facfe,#00f2fe);color:#07090e;font-weight:800;box-shadow:0 2px 8px rgba(0,210,255,0.3)}.wcsec{display:none}.wcsec.on{display:block;animation:fadeIn 0.2s ease-out}.wcgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px}.wcbtn{padding:11px 10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;cursor:pointer;font-size:11.5px;font-weight:600;border-radius:8px;text-transform:capitalize;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:all 0.15s ease}.wcbtn:hover{background:rgba(0,210,255,0.12);color:#00f2fe;border-color:rgba(0,210,255,0.4);transform:translateY(-1px)}.wcbtn:active{transform:translateY(0)}.wcbtn.buying{opacity:.3;pointer-events:none}.wclbl{color:#475569;font-size:10px;margin:16px 0 8px;text-transform:uppercase;letter-spacing:2px;font-weight:700;display:flex;align-items:center;gap:8px}.wclbl::after{content:77;flex:1;height:1px;background:rgba(255,255,255,0.06)}.wcclose{position:absolute;top:20px;right:20px;color:#64748b;font-size:14px;cursor:pointer;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.03);transition:all 0.2s}.wcclose:hover{color:#ff4b72;background:rgba(255,75,114,0.15);transform:rotate(90deg)}.wclog{max-height:95px;overflow-y:auto;font-size:11px;color:#94a3b8;background:rgba(0,0,0,0.4);padding:12px;border-radius:10px;margin-top:18px;border:1px solid rgba(255,255,255,0.03)}.wclog div{margin:4px 0;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.02);display:flex;align-items:center;gap:6px}.wclog .ok{color:#2ecc71;font-weight:600}.wclog .err{color:#ff4b72;font-weight:600}.wcbuyall{display:block;width:100%;padding:12px;margin:12px 0 4px;background:rgba(0,242,254,0.06);color:#00f2fe;border:1px solid rgba(0,210,255,0.2);cursor:pointer;font-weight:700;text-transform:uppercase;font-size:11px;border-radius:8px;transition:all 0.2s ease}.wcbuyall:hover{background:linear-gradient(90deg,#4facfe,#00f2fe);color:#07090e;box-shadow:0 4px 12px rgba(0,210,255,0.2)}.search-bar{display:flex;gap:8px;margin-bottom:18px;padding:4px;background:rgba(0,0,0,0.25);border-radius:8px;border:1px solid rgba(255,255,255,0.03)}.search-bar input{flex:1;background:transparent;border:none;padding:8px 12px;color:#fff;font-size:12px;outline:none}.search-bar button{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:6px;color:#00f2fe;padding:0 18px;cursor:pointer;font-weight:700;font-size:11px;transition:all 0.15s}.search-bar button:hover{background:rgba(0,210,255,0.15);border-color:rgba(0,210,255,0.3)}@keyframes fadeIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}';
        var styleNode = D.createElement('style');
        styleNode.id = 'nexus-styles';
        styleNode.innerHTML = CSS;
        D.head.appendChild(styleNode); 
    } 

    var structuralWrapper = D.getElementById('wcbg'); 
    if (!structuralWrapper) { 
        structuralWrapper = D.createElement('div');
        structuralWrapper.className = 'wcbg';
        structuralWrapper.id = 'wcbg';
        D.body.appendChild(structuralWrapper); 
    } 

    structuralWrapper.innerHTML = '';
    var panel = D.createElement('div'); panel.className = 'wcpanel'; panel.id = 'wcp';
    var closeBtn = D.createElement('div'); closeBtn.className = 'wcclose'; closeBtn.id = 'wcX'; closeBtn.textContent = '✕';
    var title = D.createElement('div'); title.className = 'wctitle'; title.textContent = 'NEXUS CONTROL HUB';
    var sBar = D.createElement('div'); sBar.className = 'search-bar'; sBar.id = 'searchBar';
    var sInput = D.createElement('input'); sInput.type = 'text'; sInput.id = 'quickSearchInput'; sInput.placeholder = 'Search operational matrices...';
    var sBtn = D.createElement('button'); sBtn.id = 'quickSearchBtn'; sBtn.textContent = 'DEPLOY';
    sBar.appendChild(sInput); sBar.appendChild(sBtn);
    var tabsDom = D.createElement('div'); tabsDom.className = 'wctabs'; tabsDom.id = 'wctabs';
    var contentDom = D.createElement('div'); contentDom.id = 'wccontent';
    var logDom = D.createElement('div'); logDom.className = 'wclog'; logDom.id = 'wclog';
    panel.appendChild(closeBtn); panel.appendChild(title); panel.appendChild(sBar); panel.appendChild(tabsDom); panel.appendChild(contentDom); panel.appendChild(logDom);
    structuralWrapper.appendChild(panel);

    window.NEXUS_LOG_PANEL = logDom; 
    var searchInput = sInput; 
    var searchBtn = sBtn;

    function executeIndexSearch(query) { 
        var structuralResults = []; 
        var lowCaseQuery = query.toLowerCase().trim(); 
        if (!lowCaseQuery) return structuralResults; 
        for (var i = 0; i < core.BUFFS.length; i++) { 
            var b = core.BUFFS[i];
            var targetSku = b.id || b.s; 
            if (b.n.toLowerCase().indexOf(lowCaseQuery) !== -1 || targetSku.toLowerCase().indexOf(lowCaseQuery) !== -1) {
                structuralResults.push({ sku: targetSku, store: 'operationstore' });
            }
        } 
        for (var sId in core.HEROES) { 
            var dataset = core.HEROES[sId];
            for (var j = 0; j < dataset.length; j++) { 
                var h = dataset[j];
                if (h.toLowerCase().indexOf(lowCaseQuery) !== -1) {
                    structuralResults.push({ sku: core.buildSkuString(sId, h), store: sId });
                }
            } 
        } 
        return structuralResults; 
    } 

    async function executeDirectDeployment() { 
        var q = searchInput.value.trim(); 
        if (!q) { core.writeLog('Search input criteria empty', 'err'); return; } 
        core.writeLog('Querying structured database profiles: " + q, ""); 
        var searchMatches = executeIndexSearch(q); 
        if (searchMatches.length === 0) { core.writeLog('No valid matching configurations found', 'err'); return; } 
        core.writeLog('Initializing rapid module dispatch: ' + searchMatches[0].sku, 'ok');
        await core.executePurchase(searchMatches[0].sku); 
    } 

    searchBtn.onclick = executeDirectDeployment;
    searchInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') executeDirectDeployment(); }); 
    
    var tabsContainer = tabsDom; 
    var contentContainer = contentDom;

    function buildInterfaceLayout() { 
        var designFragment = D.createDocumentFragment(); 
        var storeList = Array.isArray(core.STORES) ? core.STORES : Object.keys(core.STORES || {});
        
        for (var i = 0; i < storeList.length; i++) {
            var st = storeList[i];
            var sectionContainer = D.createElement('div');
            sectionContainer.className = 'wcsec';
            sectionContainer.id = 'sec-' + st; 
            
            if (st === 'operationstore' || st === 'operation_store') { 
                var utilityLabel = D.createElement('div');
                utilityLabel.className = 'wclbl';
                utilityLabel.textContent = 'Tactical Modification Profiles';
                sectionContainer.appendChild(utilityLabel); 
                
                var utilityGrid = D.createElement('div');
                utilityGrid.className = 'wcgrid';
                for (var j = 0; j < core.BUFFS.length; j++) {
                    (function(bf) {
                        var actionButton = D.createElement('button');
                        actionButton.className = 'wcbtn';
                        actionButton.textContent = bf.n;
                        actionButton.onclick = function() { 
                            var self = this;
                            self.classList.add('buying');
                            core.executePurchase(bf.id || bf.s);
                            setTimeout(function() { self.classList.remove('buying'); }, 500);
                        };
                        utilityGrid.appendChild(actionButton); 
                    })(core.BUFFS[j]);
                }
                sectionContainer.appendChild(utilityGrid); 
            } 
            
            var headerLabel = D.createElement('div');
            headerLabel.className = 'wclbl';
            headerLabel.textContent = st.replace('store', '').replace('_', '') + ' Operations Division';
            sectionContainer.appendChild(headerLabel); 
            
            var itemGrid = D.createElement('div');
            itemGrid.className = 'wcgrid'; 
            var activeDataset = (core.HEROES ? core.HEROES[st] : []) || []; 
            
            if (activeDataset.length === 0 || (activeDataset.length === 1 && activeDataset[0] === '')) { 
                var emptyContainer = D.createElement('div');
                emptyContainer.style.textAlign = 'center';
                emptyContainer.style.fontSize = '11px';
                emptyContainer.style.color = '#475569';
                emptyContainer.style.padding = '16px';
                emptyContainer.style.width = '100%';
                emptyContainer.textContent = 'No cataloged assets located inside this sector context.';
                itemGrid.appendChild(emptyContainer); 
            } else { 
                for (var k = 0; k < activeDataset.length; k++) {
                    (function(h) {
                        var actionButton = D.createElement('button');
                        actionButton.className = 'wcbtn';
                        actionButton.textContent = h;
                        actionButton.onclick = function() { 
                            var self = this;
                            self.classList.add('buying'); 
                            var calculatedSkus = (st === 'sectorbreachstore') ? core.resolveSectorCandidates(h) : [core.buildSkuString(st, h)];
                            for (var m = 0; m < calculatedSkus.length; m++) {
                                if (calculatedSkus[m]) core.executePurchase(calculatedSkus[m]);
                            }
                            setTimeout(function() { self.classList.remove('buying'); }, 500);
                        };
                        itemGrid.appendChild(actionButton); 
                    })(activeDataset[k]);
                } 
            } 
            sectionContainer.appendChild(itemGrid); 
            
            if (activeDataset.length > 0 && activeDataset[0] !== '') { 
                (function(dataset, currentStore) {
                    var batchDeployButton = D.createElement('button');
                    batchDeployButton.className = 'wcbuyall';
                    batchDeployButton.textContent = 'Batch Deploy';
                    batchDeployButton.onclick = async function() { 
                        batchDeployButton.disabled = true;
                        batchDeployButton.textContent = 'Deploying...'; 
                        for (var x = 0; x < dataset.length; x++) { 
                            var operationalSkus = (currentStore === 'sectorbreachstore') ? core.resolveSectorCandidates(dataset[x]) : [core.buildSkuString(currentStore, dataset[x])]; 
                            for (var y = 0; y < operationalSkus.length; y++) { 
                                if (operationalSkus[y]) { 
                                    await core.executePurchase(operationalSkus[y]);
                                    await core.delay(500); 
                                } 
                            } 
                        } 
                        batchDeployButton.disabled = false;
                        batchDeployButton.textContent = 'Batch Deploy'; 
                    };
                    sectionContainer.appendChild(batchDeployButton); 
                })(activeDataset, st);
            } 
            designFragment.appendChild(sectionContainer); 
        }
        contentContainer.appendChild(designFragment); 
    } 
    
    buildInterfaceLayout();
    tabsContainer.innerHTML = ''; 
    var storeList = Array.isArray(core.STORES) ? core.STORES : Object.keys(core.STORES || {});
    
    for (var i = 0; i < storeList.length; i++) {
        var selectionTab = D.createElement('button');
        selectionTab.className = 'wctab';
        selectionTab.textContent = storeList[i].replace('store', '').replace('_', '');
        selectionTab.setAttribute('data-store', storeList[i]);
        selectionTab.onclick = function() { switchViewTab(this.getAttribute('data-store')); };
        tabsContainer.appendChild(selectionTab); 
    }

    function switchViewTab(st) { 
        var cachedTabs = D.querySelectorAll('.wctab');
        var cachedSections = D.querySelectorAll('.wcsec');
        for (var idx = 0; idx < cachedTabs.length; idx++) {
            if (cachedTabs[idx].getAttribute('data-store') === st) {
                cachedTabs[idx].classList.add('on');
            } else {
                cachedTabs[idx].classList.remove('on');
            }
        }
        for (var idx = 0; idx < cachedSections.length; idx++) {
            if (cachedSections[idx].id === 'sec-' + st) {
                cachedSections[idx].classList.add('on');
            } else {
                cachedSections[idx].classList.remove('on');
            }
        }
    } 
    
    switchViewTab(storeList[0] || 'operationstore'); 
    var closePanelButton = D.getElementById('wcX');

    function openUserInterface() { structuralWrapper.style.display = 'flex'; }
    function closeUserInterface() { structuralWrapper.style.display = 'none'; } 
    
    closePanelButton.onclick = closeUserInterface;
    structuralWrapper.onclick = function(e) { if (e.target === structuralWrapper) closeUserInterface(); }; 
    
    if (!window.__NEXUS_KEY_BOUND__) { 
        window.__NEXUS_KEY_BOUND__ = true;
        D.addEventListener('keydown', function(e) { 
            if (e.key === 'F10') { 
                e.preventDefault(); 
                if (structuralWrapper.style.display === 'flex') { 
                    closeUserInterface(); 
                } else { 
                    openUserInterface(); 
                } 
            } 
        }, true); 
    } 
    
    core.writeLog('Modular Graphic Subsystems Re-Synchronized.', 'ok'); 
})();