// --- ALL BLOOK INVENTORIES ---
const allBlooks = {
  // WCA Pack List
  wca: [
    { name: "White 3x3", rarity: "Common", chance: 70 },
    { name: "Pyraminx", rarity: "Rare", chance: 25 },
    { name: "Megaminx", rarity: "Legendary", chance: 5 }
  ],
  // Shape Mod Pack List
  shape: [
    { name: "Mirror Blocks", rarity: "Common", chance: 65 },
    { name: "Ghost Cube", rarity: "Epic", chance: 30 },
    { name: "Fisher Cube", rarity: "Legendary", chance: 5 }
  ],
  // Premium Concept Pack List
  concept: [
    { name: "Magnetic Core 3x3", rarity: "Epic", chance: 90 },
    { name: "Golden 3x3", rarity: "Mystical", chance: 10 }
  ]
};

// --- ACCOUNT STATE (Loads from local browser memory if available) ---
let account = JSON.parse(localStorage.getItem("cubing_save")) || {
  tokens: 200,
  totalOpened: 0,
  unlockedBlooks: [] // List of item names owned
};

// Start system initialization
updateUI();

// --- SAVE SYSTEM ---
function saveGame() {
  localStorage.setItem("cubing_save", JSON.stringify(account));
}

function resetAccount() {
  if(confirm("Are you sure you want to delete your progress?")) {
    localStorage.removeItem("cubing_save");
    location.reload();
  }
}

// --- UI DASHBOARD MANAGMENT ---
function showPage(pageId) {
  document.getElementById("market-page").style.display = "none";
  document.getElementById("collection-page").style.display = "none";
  document.getElementById("stats-page").style.display = "none";
  
  document.getElementById(pageId + "-page").style.display = "block";
  if(pageId === 'collection') updateCollectionGrid();
}

function updateUI() {
  document.getElementById("token-count").innerText = account.tokens;
  document.getElementById("stat-tokens").innerText = account.tokens;
  document.getElementById("stat-opened").innerText = account.totalOpened;
  
  // Calculate total existing catalog size (3 + 3 + 2 = 8 items)
  let totalInGame = 8; 
  document.getElementById("stat-unlocked").innerText = `${account.unlockedBlooks.length}/${totalInGame}`;
}

// --- OPEN PACK TRANSACTION ENGINE ---
function buyPack(packType) {
  let cost = packType === 'wca' ? 20 : packType === 'shape' ? 35 : 50;
  
  if (account.tokens < cost) {
    alert("Insufficient tokens! You need more coins to trade for this pack.");
    return;
  }

  // Deduct resources
  account.tokens -= cost;
  account.totalOpened += 1;
  
  // Choose item inside pack using weighted odds logic
  let packItems = allBlooks[packType];
  let roll = Math.random() * 100;
  let prize = packItems[0]; // fallback default
  
  let currentOddsAccumulator = 0;
  for(let item of packItems) {
    currentOddsAccumulator += item.chance;
    if(roll <= currentOddsAccumulator) {
      prize = item;
      break;
    }
  }

  // Inventory Save Integration
  if (!account.unlockedBlooks.includes(prize.name)) {
    account.unlockedBlooks.push(prize.name);
  }

  saveGame();
  updateUI();

  // Draw Result Window
  const resultDiv = document.getElementById("pack-result");
  document.getElementById("prize-rarity").innerText = `[${prize.rarity.toUpperCase()}]`;
  document.getElementById("prize-name").innerText = prize.name;
  resultDiv.style.display = "inline-block";
}

// --- DYNAMIC INVENTORY GALLERY ---
function updateCollectionGrid() {
  const grid = document.getElementById("collection-grid");
  grid.innerHTML = ""; // Wipe board clear

  // Scan every existing item across all 3 pack categories
  Object.keys(allBlooks).forEach(packKey => {
    allBlooks[packKey].forEach(blook => {
      let isOwned = account.unlockedBlooks.includes(blook.name);
      
      if (isOwned) {
        grid.innerHTML += `
          <div class="grid-blook">
            <div style="font-size:40px; margin-bottom:10px;">📦</div>
            <div>${blook.name}</div>
            <span style="font-size:11px; color:#0d9488;">${blook.rarity}</span>
          </div>`;
      } else {
        grid.innerHTML += `
          <div class="grid-blook locked">
            <div style="font-size:40px; margin-bottom:10px; opacity:0.3;">🔒</div>
            <div>???</div>
            <span style="font-size:11px;">Locked</span>
          </div>`;
      }
    });
  });
}
