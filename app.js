const tg = window.Telegram?.WebApp;


// ==============================
// TELEGRAM
// ==============================

if (tg) {
  tg.ready();
  tg.expand();
}


// ==============================
// USER
// ==============================

const telegramUser =
  tg?.initDataUnsafe?.user;


if (telegramUser) {

  const welcome =
    document.getElementById("welcome");

  if (welcome) {

    welcome.textContent =
      "Welcome, " +
      (telegramUser.first_name || "Miner");

  }

}


// ==============================
// REFERRAL PAGE BUTTON
// ==============================

const referralBtn =
  document.getElementById("referralBtn");


if (referralBtn) {

  referralBtn.addEventListener(
    "click",
    function () {

      window.location.href =
        "referrals.html";

    }
  );

}


// ==============================
// BALANCE
// ==============================

let balance = Number(
  localStorage.getItem("lbc_balance") || 0
);


let sessionReward = Number(
  localStorage.getItem(
    "lbc_session_reward"
  ) || 0
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

let miningStart = Number(
  localStorage.getItem(
    "lbc_mining_start"
  ) || 0
);

let running = false;

let seconds = 0;

let miningInterval = null;


// ==============================
// UPDATE SCREEN
// ==============================

function updateScreen() {

  const balanceElement =
    document.getElementById("balance");

  const sessionElement =
    document.getElementById("session");

  const timerElement =
    document.getElementById("timer");

  const statusElement =
    document.getElementById("status");

  const dotElement =
    document.getElementById("dot");

  const buttonElement =
    document.getElementById("mineBtn");


  if (balanceElement) {

    balanceElement.textContent =
      balance.toFixed(4);

  }


  if (sessionElement) {

    sessionElement.textContent =
      sessionReward.toFixed(4) +
      " LBC";

  }


  const hours =
    String(
      Math.floor(seconds / 3600)
    ).padStart(2, "0");


  const minutes =
    String(
      Math.floor(
        (seconds % 3600) / 60
      )
    ).padStart(2, "0");


  const secs =
    String(
      seconds % 60
    ).padStart(2, "0");


  if (timerElement) {

    timerElement.textContent =
      hours + ":" +
      minutes + ":" +
      secs;

  }


  if (running) {

    if (statusElement) {

      statusElement.textContent =
        "Mining Active";

    }


    if (dotElement) {

      dotElement.style.background =
        "#22c55e";

    }


    if (buttonElement) {

      buttonElement.textContent =
        "MINING ACTIVE";

      buttonElement.disabled =
        true;

    }

  } else {

    if (statusElement) {

      statusElement.textContent =
        "Ready to Mine";

    }


    if (dotElement) {

      dotElement.style.background =
        "#64748b";

    }


    if (buttonElement) {

      buttonElement.textContent =
        "START MINING";

      buttonElement.disabled =
        false;

    }

  }

}


// ==============================
// START MINING BUTTON
// ==============================

const mineButton =
  document.getElementById("mineBtn");


if (mineButton) {

  mineButton.addEventListener(
    "click",
    function () {

      if (running) {
        return;
      }


      // New mining session

      miningStart =
        Date.now();

      seconds = 0;

      sessionReward = 0;

      running = true;


      localStorage.setItem(
        "lbc_mining_start",
        String(miningStart)
      );


      localStorage.setItem(
        "lbc_session_reward",
        "0"
      );


      localStorage.setItem(
        "lbc_last_reward",
        "0"
      );


      updateScreen();

      startMining();

    }
  );

}


// ==============================
// MINING LOOP
// ==============================

function startMining() {

  if (miningInterval) {

    clearInterval(
      miningInterval
    );

  }


  miningInterval =
    setInterval(
      function () {

        if (!miningStart) {

          clearInterval(
            miningInterval
          );

          return;

        }


        const elapsed =
          Date.now() -
          miningStart;


        // ======================
        // 24 HOURS COMPLETE
        // ======================

        if (
          elapsed >=
          MAX_MINING_TIME
        ) {

          seconds =
            24 * 60 * 60;

          const finalReward =
            24 * 60 *
            rewardPerMinute;


          const lastReward =
            Number(
              localStorage.getItem(
                "lbc_last_reward"
              ) || 0
            );


          const difference =
            finalReward -
            lastReward;


          if (difference > 0) {

            balance +=
              difference;

          }


          sessionReward =
            finalReward;


          localStorage.setItem(
            "lbc_balance",
            balance.toFixed(8)
          );


          localStorage.setItem(
            "lbc_session_reward",
            sessionReward.toFixed(8)
          );


          localStorage.setItem(
            "lbc_last_reward",
            finalReward.toFixed(8)
          );


          localStorage.removeItem(
            "lbc_mining_start"
          );


          running = false;


          clearInterval(
            miningInterval
          );


          miningInterval = null;


          updateScreen();

          return;

        }


        // ======================
        // ACTIVE MINING
        // ======================

        seconds =
          Math.floor(
            elapsed / 1000
          );


        const currentReward =
          seconds *
          rewardPerSecond;


        const lastReward =
          Number(
            localStorage.getItem(
              "lbc_last_reward"
            ) || 0
          );


        const difference =
          currentReward -
          lastReward;


        if (difference > 0) {

          balance +=
            difference;


          localStorage.setItem(
            "lbc_balance",
            balance.toFixed(8)
          );


          localStorage.setItem(
            "lbc_last_reward",
            currentReward.toFixed(8)
          );

        }


        sessionReward =
          currentReward;


        localStorage.setItem(
          "lbc_session_reward",
          sessionReward.toFixed(8)
        );


        updateScreen();

      },
      1000
    );

}


// ==============================
// RESTORE MINING
// ==============================

function restoreMining() {

  if (!miningStart) {

    running = false;

    seconds = 0;

    updateScreen();

    return;

  }


  const elapsed =
    Date.now() -
    miningStart;


  // 24 hours already completed

  if (
    elapsed >=
    MAX_MINING_TIME
  ) {

    running = false;

    seconds =
      24 * 60 * 60;

    localStorage.removeItem(
      "lbc_mining_start"
    );

    updateScreen();

    return;

  }


  running = true;


  seconds =
    Math.floor(
      elapsed / 1000
    );


  updateScreen();

  startMining();

}


// ==============================
// START APP
// ==============================

restoreMining();
