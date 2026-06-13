const catalog = {
  wca: [
    { name: "White 3x3", rarity: "Common", weight: 70, art: "3x3", color: "#3b82f6" },
    { name: "Pyraminx", rarity: "Rare", weight: 25, art: "PYR", color: "#ec4899" },
    { name: "Megaminx", rarity: "Legendary", weight: 5, art: "MEG", color: "#eab308" }
  ],
  mod: [
    { name: "Mirror Cube", rarity: "Common", weight: 65, art: "MIR", color: "#64748b" },
    { name: "Ghost Cube", rarity: "Epic", weight: 30, art: "GHO", color: "#8b5cf6" },
    { name: "Fisher Cube", rarity: "Legendary", weight: 5, art: "FIS", color: "#f97316" }
  ]
};

let account = { tokens: 500, opened: 0, owned: [], avatar: "🎲" };

// --- WORKSPACE NAV BAR DETECTORS ---
document.getElementById('btn-market').addEventListener('click', () => switchTab('market'));
document.getElementById('btn-blocks').addEventListener('click', () => switchTab('blocks'));
document.getElementById('btn-stats').addEventListener('click', () => switchTab('stats'));

// --- SHOP PURCHASING DETECTORS ---
document.getElementById('pack-wca').addEventListener('click', () => purchaseBox('wca'));
document.getElementById('pack-mod').addEventListener('click', () => purchaseBox('mod'));
document.getElementById('btn-close-modal').addEventListener('click', dismissRewardPopup);

function syncMetrics() {
  document.getElementById("user-tokens").innerText = account.tokens;
  document.getElementById("global-avatar").innerText = account.avatar;
  document.getElementById("stat-opened").innerText = account.opened;
  document.getElementById("stat-unlocked").innerText = account.owned.length + "/6";
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  
  document.getElementById(`btn-${tabId === 'market' ? 'market' : tabId === 'blocks' ? 'blocks' : 'stats'}`).classList.add('active');
  document.getElementById(`${tabId}-screen`).style.display = 'block';
  
  if(tabId === 'blocks') renderGallery();
}

function purchaseBox(boxType) {
  let cost = boxType === 'wca' ? 25 : 40;
  if(account.tokens < cost) { alert("Not enough tokens!"); return; }

  account.tokens -= cost;
  account.opened += 1;

  let items = catalog[boxType];
  let roll = Math.random() * 100;
  let prize = items[0];
  let checkRange = 0;

  for (let i = 0; i < items.length; i++) {
    checkRange += items[i].weight;
    if(roll <= checkRange) { prize = items[i]; break; }
  }

  if (!account.owned.includes(prize.name)) { account.owned.push(prize.name); }
  syncMetrics();

  document.getElementById("popup-art").innerText = prize.art;
  document.getElementById("popup-art").style.backgroundColor = prize.color;
  document.getElementById("popup-name").innerText = prize.name;
  
  let tag = document.getElementById("popup-rarity");
  tag.innerText = prize.rarity;
  tag.className = "rarity-tag " + prize.rarity;
  document.getElementById("reward-popup").style.display = "flex";
}

function dismissRewardPopup() {
  document.getElementById("reward-popup").style.display = "none";
}

function renderGallery() {
  const grid = document.getElementById("blook-render-grid");
  grid.innerHTML = "";

  Object.keys(catalog).forEach(boxKey => {
    catalog[boxKey].forEach(blook => {
      let isOwned = account.owned.includes(blook.name);
      
      let itemDiv = document.createElement('div');
      itemDiv.className = "gallery-item" + (isOwned ? "" : " locked");
      
      itemDiv.innerHTML = `
        <div class="blook-render" style="background-color: ${isOwned ? blook.color : '#94a3b8'}; width:80px; height:100px; font-size:24px; border-radius:12px; margin:0 auto 10px auto;">${isOwned ? blook.art : '🔒'}</div>
        <div>${isOwned ? blook.name : '???'}</div>
      `;
      
      if(isOwned) {
        itemDiv.style.cursor = "pointer";
        itemDiv.addEventListener('click', () => {
          account.avatar = blook.art;
          syncMetrics();
          alert("Avatar updated!");
        });
      }
      grid.appendChild(itemDiv);
    });
  });
}

// Run updates on start
syncMetrics();
