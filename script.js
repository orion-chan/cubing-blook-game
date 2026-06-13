const button = document.getElementById("open-button");
const prizeText = document.getElementById("prize-text");
const blookImage = document.getElementById("blook-image");

function openPack() {
  let roll = Math.random() * 100;

  // Each Blook now has text AND a web link to a cube picture
  if (roll < 70) {
    return {
      text: "Rubik's 3x3 (Common)",
      img: "https://unsplash.com"
    };
  } else if (roll < 95) {
    return {
      text: "Gan Pyraminx (Rare)",
      img: "https://unsplash.com"
    };
  } else {
    return {
      text: "Gan 16 Maglev Max (Legendary)",
      img: "https://unsplash.com"
    };
  }
}

button.addEventListener("click", function() {
  let prize = openPack();
  
  // 1. Update the text on screen
  prizeText.innerText = prize.text;
  
  // 2. Change the picture to match the prize
  blookImage.src = prize.img;
  
  // 3. Make the image visible
  blookImage.style.display = "block";
});
