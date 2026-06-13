const catalog = {
  wca: [
    { name: "White 3x3", art: "🟦", weight: 75 },
    { name: "Pyraminx", art: "🔺", weight: 25 }
  ],
  mod: [
    { name: "Mirror Cube", art: "🪞", weight: 70 },
    { name: "Ghost Cube", art: "👻", weight: 30 }
  ]
};

let account = { tokens: 500, opened: 0, owned: [] };

function switchTab(tabId) {
  document.getElementById('market-screen').style.display = tabId === 'market' ? 'block' : 'none';
  document.getElementById('blocks-screen').style.display = tabId === 'blocks' ? 'block' : 'none';
  document.getElementById('stats-screen').style.display = tabId === 'stats' ? 'block' : 'none';
  if(tabId === 'blocks') renderInventory();
}

function purchaseBox(boxType) {
  let cost = boxType === 'wca' ? 25 : 40;
  if(account.tokens < cost) { alert("No tokens!"); return; }
  
  account.tokens -= cost;
  account.opened++;
  
  let items = catalog[boxType];
  let prize = Math.random() * 100 < items[0].weight ? items[0] : items[1];
  
  if(!account.owned.includes(prize.name)) account.owned.push(prize.name);
  
  document.getElementById('user-tokens').innerText = account.tokens;
  document.getElementById('stat-opened').innerText = account.opened;
  document.getElementById('popup-art').innerText = prize.art;
  document.getElementById('popup-name').innerText = prize.name;
  document.getElementById('reward-popup').style.display = 'block';
}

function renderInventory() {
  let grid = document.getElementById('blook-render-grid');
  grid.innerHTML = "";
  Object.keys(catalog).forEach(key => {
    catalog[key].forEach(blook => {
      let hasIt = account.owned.includes(blook.name);
      grid.innerHTML += `<div style="display:inline-block; margin:10px; padding:10px; border:1px solid gray; opacity:${hasIt?1:0.3}">
        <h2>${hasIt ? blook.art : '🔒'}</h2>
        <p>${hasIt ? blook.name : '???'}</p>
      </div>`;
    });
  });
}
