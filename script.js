// SYSTEM GAME DATABASE ENGINE
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

// INITIALIZE USER STATE DATA MAPPING
let account = {
  tokens: 500,
  opened: 0,
  owned: [],
  avatar: "🎲"
};

// SYNCHRONIZE DATA INTERFACES
syncMetrics();

function syncMetrics() {
  document.getElementById("user-tokens").innerText = account.tokens;
  document.getElementById("global-avatar").innerText = account.avatar;
  document.getElementById("stat-opened").innerText = account.opened;
  document.getElementById("stat-unlocked").innerText = account.owned.length + "/6";
}

function switchTab(tabId) {
  // Reset navigation status bars
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  
  // Activate selected elements
  if(tabId === 'market') {
    document.getElementById('btn-market').classList.add('active');
    document.getElementById('market-screen').style.display = 'block';
  } else if(tabId === 'blocks') {
    document.getElementById('btn-blocks').classList.add('active');
    document.getElementById('blocks-screen').style.display = 'block';
    renderGallery();
  } else if(tabId === 'stats') {
    document.getElementById('btn-stats').classList.add('active');
    document.getElementById('stats-screen').style.display = 'block';
  }
}

function purchaseBox(boxType) {
  let cost = boxType === 'wca' ? 25 : 40;
  
  if(account.tokens < cost) {
    alert("You don't have enough tokens to buy this booster pack!");
    return;
  }

  account.tokens -= cost;
  account.opened += 1;

  // SYSTEM RANDOMIZER ROLLING MECHANISM
  let items = catalog[boxType];
  let roll = Math.random() * 100;
  let prize = items[0];
  let checkRange = 0;

  for (let i = 0; i < items.length; i++) {
    checkRange += items[i].weight;
    if(roll <= checkRange) {
      prize = items[i];
      break;
    }
  }

  // UPDATE OWNERSHIP INVENTORY RECORD LIST
  if (!account.owned.includes(prize.name)) {
    account.owned.push(prize.name);
  }

  syncMetrics();

  // INITIATE BLOOKET MODAL VIEW SYSTEM
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
  grid.innerHTML = ""; // Clear active layout board

  Object.keys(catalog).forEach(boxKey => {
    catalog[boxKey].forEach(blook => {
      let isOwned = account.owned.includes(blook.name);
      
      if(isOwned) {
        grid.innerHTML += `
          <div class="gallery-item" onclick="changeAvatar('${blook.art}')" style="cursor:pointer;">
            <div class="blook-render" style="background-color: ${blook.color}; width:80px; height:100px; font-size:24px; border-radius:12px; margin:0 auto 10px auto;">${blook.art}</div>
            <div>${blook.name}</div>
          </div>`;
      } else {
        grid.innerHTML += `
          <div class="gallery-item locked">
            <div class="blook-render" style="width:80px; height:100px; font-size:24px; border-radius:12px; margin:0 auto 10px auto;">🔒</div>
            <div>???</div>
          </div>`;
      }
    });
  });
}

function changeAvatar(avatarArt) {
  account.avatar = avatarArt;
  syncMetrics();
  alert("Your display avatar has been updated!");
}
