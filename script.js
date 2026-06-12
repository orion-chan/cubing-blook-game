let tokens = 100;

// List of all your cubing items grouped by internal rarity boundaries
const blooks = {
    Common: ["Standard 3x3", "Rubik's Brand", "Layer-by-Layer Guide"],
    Rare: ["2x2 Cube", "4x4 Cube", "Pyraminx"],
    Epic: ["Megaminx", "Magnetic Speedcube"],
    Legendary: ["Max Park Edition", "Blindfolded 3x3"]
};

document.getElementById("open-button").addEventListener("click", () => {
    if (tokens < 20) {
        alert("Not enough tokens! Refresh the page to get more.");
        return;
    }

    // Deduct 20 tokens for opening a pack
    tokens -= 20;
    document.getElementById("token-count").innerText = tokens;

    // Generate a random decimal number between 0 and 100
    let randomNumber = Math.random() * 100;
    let selectedRarity = "Common";

    // Mathematical boundary checking for drop rates
    if (randomNumber < 2.9) {
        selectedRarity = "Legendary"; // 2.9% chance
    } else if (randomNumber < 14.9) {
        selectedRarity = "Epic";      // 12% chance (14.9 - 2.9)
    } else if (randomNumber < 39.9) {
        selectedRarity = "Rare";      // 25% chance (39.9 - 14.9)
    } else {
        selectedRarity = "Common";    // Remaining 60% chance
    }

    // Pick a random specific cube from that chosen rarity tier
    const tierList = blooks[selectedRarity];
    const finalBlook = tierList[Math.floor(Math.random() * tierList.length)];

    // Display the results on the web page screen
    document.getElementById("blook-name").innerText = finalBlook;
    document.getElementById("blook-rarity").innerText = `Rarity: ${selectedRarity}`;
});
