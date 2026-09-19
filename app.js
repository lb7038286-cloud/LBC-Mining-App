const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const telegramUser = tg?.initDataUnsafe?.user;

if (telegramUser) {
  document.getElementById("welcome").textContent =
    "Welcome, " + (telegramUser.first_name || "Miner");
}

let balance = Number(
  localStorage.getItem("lbc_balance") || 0
);

let running = false;
let seconds = 0;
let sessionReward = 0;

let miningInterval = null;

const rewardPerMinute = 0.10;
const rewardPerSecond = rewardPerMinute / 60;

function updateScreen() {

  document.getElementById("balance").textContent =
    balance.toFixed(4);

  document.getElementById("session").textContent =
    sessionReward.toFixed(4) + " LBC";

  const hours = String(
    Math.floor(seconds / 3600)
  ).padStart(2, "0");

  const minutes = String(
    Math.floor((seconds % 3600) / 60)
  ).padStart(2, "0");

  const secs = String(
    seconds % 60
  ).padStart(2, "0");

  document.getElementById("timer").textContent =
    hours + ":" + minutes + ":" + secs;

  const status = document.getElementById("status");
  const dot = document.getElementById("dot");
  const button = document.getElementById("mineBtn");

  if (running) {

    status.textContent = "Mining Active";

    dot.style.background = "#22c55e";

    button.textContent = "STOP MINING";

    button.classList.add("stop");

  } else {

    status.textContent = "Mining Stopped";

    dot.style.background = "#64748b";

    button.textContent = "START MINING";

    button.classList.remove("stop");
  }
}

document
  .getElementById("mineBtn")
  .addEventListener("click", function () {

    running = !running;

    if (running) {

      miningInterval = setInterval(function () {

        seconds++;

        const reward = rewardPerSecond;

        balance += reward;

        sessionReward += reward;

        localStorage.setItem(
          "lbc_balance",
          balance.toFixed(8)
        );

        updateScreen();

      }, 1000);

    } else {

      clearInterval(miningInterval);

    }

    updateScreen();
  });

updateScreen();
