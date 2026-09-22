const tg =
  window.Telegram?.WebApp;


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


const userId =
  telegramUser?.id || "guest";


// ==============================
// REFERRAL CODE
// ==============================

const referralCode =
  "LBC" + userId;


// ==============================
// REFERRAL LINK
// ==============================

const referralLink =
  "https://t.me/LBCMiningBot?startapp=ref_" +
  userId;


// ==============================
// DISPLAY CODE
// ==============================

const codeElement =
  document.getElementById(
    "refCode"
  );


if (codeElement) {

  codeElement.textContent =
    referralCode;

}


// ==============================
// DISPLAY LINK
// ==============================

const linkElement =
  document.getElementById(
    "refLink"
  );


if (linkElement) {

  linkElement.textContent =
    referralLink;

}


// ==============================
// REFERRAL COUNT
// ==============================

const referralCount =
  Number(
    localStorage.getItem(
      "lbc_referrals"
    ) || 0
  );


const countElement =
  document.getElementById(
    "referrals"
  );


if (countElement) {

  countElement.textContent =
    referralCount;

}


// ==============================
// COPY BUTTON
// ==============================

const copyButton =
  document.getElementById(
    "copyRefBtn"
  );


if (copyButton) {

  copyButton.addEventListener(
    "click",
    async function () {

      try {

        await navigator.clipboard
          .writeText(
            referralLink
          );


        copyButton.textContent =
          "✅ LINK COPIED!";


        setTimeout(
          function () {

            copyButton.textContent =
              "📋 COPY REFERRAL LINK";

          },
          2000
        );


      } catch (error) {

        copyButton.textContent =
          "COPY FAILED";

      }

    }
  );

}


// ==============================
// BACK TO MINING
// ==============================

const backButton =
  document.getElementById(
    "backBtn"
  );


if (backButton) {

  backButton.addEventListener(
    "click",
    function () {

      window.location.href =
        "index.html";

    }
  );

}
