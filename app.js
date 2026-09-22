const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}


// ==============================
// TELEGRAM USER
// ==============================

const telegramUser = tg?.initDataUnsafe?.user;

if (telegramUser) {

  document.getElementById("welcome").textContent =
    "Welcome, " + (telegramUser.first_name || "Miner");

}


// ==============================
// USER ID
// ==============================

const userId = telegramUser?.id || "guest";


// ==============================
// REFERRAL SYSTEM
// ==============================

const referralCode = "LBC" + userId;

const referralLink =
  "https://t.me/LBCMiningBot?startapp=ref_" + userId;


// Show referral code
document.getElementById("refCode").textContent =
  referralCode;


// Show referral link
document.getElementById("refLink").textContent =
  referralLink;


// ==============================
// REFERRAL COUNT
// ==============================

let referralCount = Number(
  localStorage.getItem("lbc_referrals") || 0
);

document.getElementById("referrals").textContent =
  referralCount;


// ==============================
// CHECK INCOMING REFERRAL
// ==============================

const startParam =
  tg?.initDataUnsafe?.start_param || "";


// If someone opened the app
// using another user's referral link
if (
  startParam.startsWith("ref_") &&
  startParam !== localStorage.getItem("used_referral")
) {

  const referredBy =
    startParam.replace("ref_", "");

  // Don't count yourself
  if (referredBy !== String(userId)) {

    localStorage.setItem(
      "used_referral",
      startParam
    );

  }

}


// ==============================
// COPY REFERRAL LINK
// ==============================

document
  .getElementById("copyRefBtn")
  .addEventListener("click", async function () {

    try {

      await navigator.clipboard.writeText(referralLink);

      this.textContent = "✅ LINK COPIED!";

      setTimeout(() => {

        this.textContent =
          "📋 COPY REFERRAL LINK";

      }, 2000);

    } catch (error) {

      alert("Please copy the referral link manually.");

    }

  });


// ==============================
// BALANCE
// ==============================

let balance = Number(
  localStorage.getItem("lbc_balance") || 0
);


// ==============================
// MINING SETTINGS
// ==============================

const rewardPerMinute = 0.10;

const rewardPerSecond =
  rewardPerMinute / 60;

const MAX_MINING_TIME =
  24 * 60 * 60 * 1000;


// ==============================
// MINING DATA
// ==============================

let miningStart =
  Number(localStorage.getItem("lbc_mining_start") || 0);

let running = false;

let seconds = 0;

let sessionReward = Number(
  localStorage.getItem("lbc_session_reward") || 0
);

let miningInterval = null;


// ==============================
// CHECK MINING STATUS
// ==============================

function checkMiningStatus() {

  if (!miningStart) {

    running = false;

    seconds = 0;

    return;

  }

  const now = Date.now();

  const elapsed =
    now - miningStart;


  // 24 hours completed
  if (elapsed >= MAX_MINING_TIME) {

    const finalSeconds =
      Math.floor(MAX_MINING_TIME / 1000);

    const alreadyCounted =
      Number(
        localStorage.getItem("lbc_counted_seconds") || 0
      );

    const remainingSeconds =
      finalSeconds - alreadyCounted;

    if (remainingSeconds > 0) {

      const reward =
        remainingSeconds * rewardPerSecond;

      balance += reward;

      sessionReward += reward;

    }

    localStorage.setItem(
      "lbc_balance",
      balance.toFixed(8)
    );

    localStorage.setItem(
      "lbc_session_reward",
      sessionReward.toFixed(8)
    );

    localStorage.removeItem(
      "lbc_mining_start"
    );

    localStorage.removeItem(
      "lbc_counted_seconds"
    );

    running = false;

    seconds = finalSeconds;

    return;

  }


  // Mining still active
  running = true;

  seconds =
    Math.floor(elapsed / 1000);

}


// ==============================
// UPDATE SCREEN
// ==============================

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


  const status =
    document.getElementById("status");

  const dot =
    document.getElementById("dot");

  const button =
    document.getElementById("mineBtn");


  if (running) {

    status.textContent =
      "Mining Active";

    dot.style.background =
      "#22c55e";

    button.textContent =
      "MINING ACTIVE";

    button.disabled =
      true;

  } else {

    status.textContent =
      "Mining Completed";

    dot.style.background =
      "#64748b";

    button.textContent =
      "START MINING";

    button.disabled =
      false;

  }

}


// ==============================
// START MINING
// ==============================

document
  .getElementById("mineBtn")
  .addEventListener("click", function () {

    if (running) {
      return;
    }


    // Start new 24-hour session
    miningStart = Date.now();

    seconds = 0;

    sessionReward = 0;


    localStorage.setItem(
      "lbc_mining_start",
      miningStart
    );

    localStorage.setItem(
      "lbc_counted_seconds",
      "0"
    );

    localStorage.setItem(
      "lbc_session_reward",
      "0"
    );


    running = true;


    updateScreen();


    startMiningTimer();

  });


// ==============================
// MINING TIMER
// ==============================

function startMiningTimer() {

  if (miningInterval) {

    clearInterval(miningInterval);

  }


  miningInterval =
    setInterval(function () {

      if (!miningStart) {

        clearInterval(miningInterval);

        return;

      }


      const elapsed =
        Date.now() - miningStart;


      // 24 hours finished
      if (elapsed >= MAX_MINING_TIME) {

        checkMiningStatus();

        clearInterval(miningInterval);

        updateScreen();

        return;

      }


      seconds =
        Math.floor(elapsed / 1000);


      const countedSeconds =
        Number(
          localStorage.getItem(
            "lbc_counted_seconds"
          ) || 0
        );


      const currentSeconds =
        Math.min(
          seconds,
          Math.floor(MAX_MINING_TIME / 1000)
        );


      const newSeconds =
        currentSeconds - countedSeconds;


      if (newSeconds > 0) {

        const reward =
          newSeconds * rewardPerSecond;


        balance += reward;

        sessionReward += reward;


        localStorage.setItem(
          "lbc_balance",
          balance.toFixed(8)
        );


        localStorage.setItem(
          "lbc_session_reward",
          sessionReward.toFixed(8)
        );


        localStorage.setItem(
          "lbc_counted_seconds",
          currentSeconds
        );

      }


      updateScreen();

    }, 1000);

}


// ==============================
// INITIAL LOAD
// ==============================

checkMiningStatus();

updateScreen();


// Continue mining after reopening app
if (running) {

  startMiningTimer();

}
