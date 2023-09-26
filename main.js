const moneyText = document.getElementById("money");
const infoText = document.getElementById("info-text");
const betText = document.getElementById("bet-text");
const betIncrease = document.getElementById("bet-increase");
const betDecrease = document.getElementById("bet-decrease");
const playButton = document.getElementById("play");
betIncrease.addEventListener("click", increaseBet);
betDecrease.addEventListener("click", decreaseBet);
playButton.addEventListener("click", play);

const slots = [
    {img: document.getElementById("slot1"), lockButton: document.getElementById("lock1"), result: 0, locked: false},
    {img: document.getElementById("slot2"), lockButton: document.getElementById("lock2"), result: 0, locked: false},
    {img: document.getElementById("slot3"), lockButton: document.getElementById("lock3"), result: 0, locked: false},
    {img: document.getElementById("slot4"), lockButton: document.getElementById("lock4"), result: 0, locked: false}
];

const images = [
    "gfx/cherry.png", "gfx/pear.png", "gfx/watermelon.png", "gfx/apple.png", "gfx/seven.png"
];

const maxBet = 10;
const minBet = 1;

let money = 50;
let currentBet = 1;
let rerollLeft = true;
init()

function init() {
    for (const i in slots) {
        slots[i].lockButton.addEventListener("click", function(){ toggleLock(i) });
    }
}

function play() {
    infoText.setAttribute("class", "hidden");

    if (money < currentBet && rerollLeft) {
        infoText.innerText = "Raha ei riitä!";
        infoText.setAttribute("class", "info-alert");
        return;
    }

    if (rerollLeft) {
        money -= currentBet;
    }

    rollSlots();
    let reward = checkRewards();
    
    if (reward > 0) {
        money += reward;
        infoText.innerText = "Voitit " + reward + " euroa!";
        infoText.setAttribute("class", "info-win");
    }

    if (reward == 0 && rerollLeft) {
        rerollLeft = false;
        enableLocks();
        disableBet();
    }
    else {
        rerollLeft = true;
        disableLocks();
        enableBet();
    }

    moneyText.innerText = money + "€";
}

function rollSlots() {
    for (const i in slots) {
        const slot = slots[i];
        if (!rerollLeft && slot.locked) {
            continue;
        }
        let result = Math.floor(Math.random() * images.length);
        slot.result = result;
        slot.img.setAttribute("src", images[result]);
    }
}

function enableLocks() {
    for (const i in slots) {
        const slot = slots[i];
        slot.lockButton.setAttribute("class", "button");
    }
}

function disableLocks() {
    for (const i in slots) {
        const slot = slots[i];
        slot.lockButton.setAttribute("class", "button-disabled");
        slot.locked = false;
    }
}

function toggleLock(slotNumber) {
    if (!rerollLeft) {
        const slot = slots[slotNumber];
        slot.locked = !slot.locked;
        if (slot.locked) {
            slot.lockButton.setAttribute("class", "button-locked");
        }
        else {
            slot.lockButton.setAttribute("class", "button");
        }
    }
}

function enableBet() {
    betIncrease.setAttribute("class", "button");
    betDecrease.setAttribute("class", "button");
}

function disableBet() {
    betIncrease.setAttribute("class", "button-disabled");
    betDecrease.setAttribute("class", "button-disabled");
}

function increaseBet() {
    if (currentBet < maxBet && rerollLeft) {
        currentBet++;
        updateBetText();
    }
}

function decreaseBet() {
    if (currentBet > minBet && rerollLeft) {
        currentBet--;
        updateBetText();
    }
}

function updateBetText() {
    betText.innerText = "Panos: " + currentBet + "€";
}

function checkRewards() {
    const cherryValue = 3;
    const pearValue = 4;
    const melonValue = 5;
    const appleValue = 6;
    const tripleSevenValue = 5;
    const quadSevenValue = 10;

    let cherries = 0;
    let pears = 0;
    let melons = 0;
    let apples = 0;
    let sevens = 0;

    for (const i in slots) {
        const slot = slots[i];

        switch (slot.result) {
            case 0:
                cherries++;
                break;
            case 1:
                pears++;
                break;
            case 2:
                melons++;
                break;
            case 3:
                apples++;
                break;
            case 4:
                sevens++;
        }
    }

    let reward = 0;

    if (cherries == 4) {
        reward = cherryValue;
    }

    if (pears == 4) {
        reward = pearValue;
    }

    if (melons == 4) {
        reward = melonValue;
    }

    if (apples == 4) {
        reward = appleValue;
    }
    
    if (sevens == 3) {
        reward = tripleSevenValue;
    }
    
    if (sevens == 4) {
        reward = quadSevenValue;
    }

    return reward * currentBet;
}