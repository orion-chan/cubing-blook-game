// 1. GAME DATA STATE (The "Account" variables)
let userData = {
    tokens: 100,
    inventory: {} // Stores structure like: {"Standard 3x3": 2, "Pyraminx": 1}
};

// Available game items
const blooks = {
    Common: ["Standard 3x3", "Rubik's Brand", "Layer-by-Layer Guide"],
    Rare: ["2x2 Cube", "4x4 Cube", "Pyraminx"],
    Epic: ["Megaminx", "Magnetic Speedcube"],
    Legendary: ["Max Park Edition", "Blindfolded 3x3"]
};

// Helper function to map an item name back to its rarity tier
function getRarity(blookName) {
    for (let rarity in blooks) {
        if (blooks[rarity].includes(blookName)) return rarity;
    }
    return "Common";
}

// 2. SAVE AND LOAD DATA FUNCTIONS
function saveToBrowser() {
    localStorage.setItem("cubingGameAccount", JSON.stringify(userData));
}

function loadFromBrowser() {
    const savedData = localStorage.getItem("cubingGameAccount");
    if (savedData) {
        userData = JSON.parse(savedData);
    }
    updateUI();
}

// 3. UI RENDER ENGINES
function updateUI() {
    // Update tokens on screen
    document.getElementById("token-count").innerText = userData.tokens;

    // Clear and rebuild the collection page visual elements
    const grid = document.getElementById("collection-grid");
    grid.innerHTML = "";

    // Loop through all collected items in user account inventory
    for (let blookName in userData.inventory) {
        const count = userData.inventory[blookName];
        const rarity = getRarity(blookName);

        if (count > 0) {
            const itemCard = document.createElement("div");
            itemCard.className = `blook-item ${rarity}-border`;
            itemCard.innerHTML = `
                <div><strong>${blookName}</strong></div>
                <div style="font-size:12px; color:#aaa;">${rarity}</div>
                <div>Qty: ${count}</div>
            `;
            grid.appendChild(itemCard);
        }
    }
}

// 4. PACK OPENING LOGIC WITH SAVING
document.getElementById("open-button").addEventListener("click", () => {
    if (userData.tokens < 20) {
        alert("Out of tokens! Use the reset button below to start over.");
        return;
    }

    userData.tokens -= 20;

    let randomNumber = Math.random() * 100;
    let selectedRarity = "Common";

    if (randomNumber < 2.9) selectedRarity = "Legendary";
    else if (randomNumber < 14.9) selectedRarity = "Epic";
    else if (randomNumber < 39.9) selectedRarity = "Rare";
    else selectedRarity = "Common";

    const tierList = blooks[selectedRarity];
    const finalBlook = tierList[Math.floor(Math.random() * tierList.length)];

    // Add item to inventory tracking state
    if (userData.inventory[finalBlook]) {
        userData.inventory[finalBlook] += 1; // Increase quantity if already owned
    } else {
        userData.inventory[finalBlook] = 1;  // Set quantity to 1 if new discovery
    }

    // Display result on screen
    document.getElementById("blook-name").innerText = finalBlook;
    document.getElementById("blook-rarity").innerText = `Rarity: ${selectedRarity}`;

    saveToBrowser();
    updateUI();
});

// 5. NAVIGATION CONTROLS (TABS)
document.getElementById("tab-shop").addEventListener("click", () => {
    switchTab("page-shop", "tab-shop");
});

document.getElementById("tab-collection").addEventListener("click", () => {
    switchTab("page-collection", "tab-collection");
});

function switchTab(pageId, tabId) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.querySelectorAll(".nav-btn").forEach(t => t.classList.remove("active"));
    
    document.getElementById(pageId).classList.remove("hidden");
    document.getElementById(tabId).classList.add("active");
}

// 6. LOGOUT / RESET ENGINE
document.getElementById("reset-account").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete your account data and reset?")) {
        localStorage.removeItem("cubingGameAccount");
        userData = { tokens: 100, inventory: {} };
        updateUI();
        alert("Account reset complete!");
    }
});

// Run automatically when the webpage first loads up
loadFromBrowser();
