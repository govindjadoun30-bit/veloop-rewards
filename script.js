/* =========================================================
   VELOOP REWARDS
   COMPLETE FRONT-END DEMO
   ========================================================= */


/* =========================================================
   USER STATE
   ========================================================= */

let state = {

  xp: 0,

  xpMax: 500,

  level: 0,

  ve: 0,

  sve: 0,

  gems: 0,

  score: 0,

  tasks: 0,

  streak: 0,

  currentRoute: "home"

};


/* =========================================================
   LEVEL SYSTEM
   ========================================================= */

const LEVEL_NAMES = [

  "Newcomer",
  "Starter",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Emerald",
  "Sapphire",
  "Master",
  "Legend"

];


const LEVEL_XP = [

  0,
  500,
  1200,
  2200,
  3500,
  5000,
  7000,
  9500,
  12500,
  16000,
  20000

];


function getLevelName(level) {

  return LEVEL_NAMES[level] || "Legend";

}


/* =========================================================
   UPDATE LEVEL
   ========================================================= */

function updateLevel() {

  const oldLevel =
    state.level;

  let newLevel = 0;


  for (
    let i = 1;
    i < LEVEL_XP.length;
    i++
  ) {

    if (
      state.xp >= LEVEL_XP[i]
    ) {

      newLevel = i;

    }

  }


  state.level =
    newLevel;


  if (state.level < 10) {

    state.xpMax =
      LEVEL_XP[state.level + 1];

  }

  else {

    state.xpMax =
      LEVEL_XP[10];

  }


  if (
    newLevel > oldLevel
  ) {

    setTimeout(
      function () {

        showToast(
          `🎉 Level ${String(newLevel).padStart(2, "0")} • ${getLevelName(newLevel)} unlocked!`
        );

      },
      100
    );

  }

}


/* =========================================================
   XP PERCENTAGE
   ========================================================= */

function getXPPercentage() {

  if (
    state.level >= 10
  ) {

    return 100;

  }


  const currentLevelXP =
    LEVEL_XP[state.level];


  const nextLevelXP =
    LEVEL_XP[state.level + 1];


  const progress =
    (
      (state.xp - currentLevelXP) /
      (nextLevelXP - currentLevelXP)
    ) * 100;


  return Math.max(
    0,
    Math.min(
      100,
      progress
    )
  );

}


/* =========================================================
   ADD XP
   ========================================================= */

function addXP(
  amount,
  message = ""
) {

  if (
    !amount ||
    amount <= 0
  ) {

    return;

  }


  state.xp +=
    amount;


  updateLevel();


  if (message) {

    showToast(
      `${message} +${amount} XP`
    );

  }


  render(
    state.currentRoute
  );

}


/* =========================================================
   COMPLETE TASK
   ========================================================= */

function completeTask(
  name,
  xp,
  ve = 0
) {

  state.xp +=
    xp;


  state.ve +=
    ve;


  state.tasks =
    Math.min(
      8,
      state.tasks + 1
    );


  if (
    state.streak === 0
  ) {

    state.streak = 1;

  }


  updateLevel();


  showToast(
    `${name} completed! +${xp} XP`
  );


  render("earn");

}


/* =========================================================
   HEADER
   ========================================================= */

function header(
  title,
  subtitle = ""
) {

  return `

    <div class="page-header">

      <h1>
        ${title}
      </h1>

      ${
        subtitle
          ? `<p>${subtitle}</p>`
          : ""
      }

    </div>

  `;

}


/* =========================================================
   HOME
   ========================================================= */

function home() {

  const percentage =
    getXPPercentage()
      .toFixed(1);


  const nextLevel =
    state.level < 10
      ? String(
          state.level + 1
        ).padStart(2, "0")
      : "MAX";


  return `

    <section>

      <div class="hello">

        ${
          state.level === 0
            ? "Welcome to VELOOP! 👋"
            : "Good Morning, VeLooper! 👋"
        }

      </div>


      <div class="sub">

        ${
          state.level === 0
            ? `
              Your reward journey starts here.<br>
              Complete your first activity and earn XP.
            `
            : `
              Level up your journey and unlock<br>
              epic rewards every day.
            `
        }

      </div>


      ${
        state.level === 0
          ? `
            <div class="start-hint">

              ✨ You are starting at
              <b>Level 00 — Newcomer</b>.

              Complete your first activity
              to begin your VELOOP journey.

            </div>
          `
          : ""
      }


      <!-- LEVEL -->

      <div class="level-card">

        <div class="level-top">

          <div class="level-badge">

            <small>
              ${getLevelName(state.level)}
            </small>

            <b>
              ${String(
                state.level
              ).padStart(2, "0")}
            </b>

          </div>


          <div>

            <div class="xp-number">
              ${state.xp.toLocaleString()} XP
            </div>

            <div class="xp-label">

              ${
                state.level >= 10
                  ? "Maximum level reached 👑"
                  : `to reach Level ${nextLevel}`
              }

            </div>

          </div>

        </div>


        <div class="xp-bar">

          <div
            class="xp-progress"
            style="
              width:${percentage}%
            "
          ></div>

        </div>


        <div class="tiny">

          ${
            state.level >= 10
              ? "20,000 / 20,000 XP"
              : `${state.xp.toLocaleString()} / ${state.xpMax.toLocaleString()} XP`
          }

        </div>

      </div>


      <!-- TODAY -->

      <div class="section-title">
        Today's Boost
      </div>


      <div class="boost-card">

        <div class="boost-grid">

          <div class="boost-item">

            <div class="boost-icon">
              ⚡
            </div>

            <b>
              ${state.xp} XP
            </b>

            <span>
              XP Earned
            </span>

          </div>


          <div class="boost-item">

            <div class="boost-icon">
              🎯
            </div>

            <b>
              ${state.tasks}/8
            </b>

            <span>
              Tasks Done
            </span>

          </div>


          <div class="boost-item">

            <div class="boost-icon">
              🔥
            </div>

            <b>
              ${state.streak}
            </b>

            <span>
              Day Streak
            </span>

          </div>

        </div>

      </div>


      <!-- EARN -->

      <div class="section-title">
        Earn More
      </div>


      <div class="earn-header">

        <div>

          <h3>
            Choose an activity
          </h3>

          <p>
            Complete activities to earn XP and rewards.
          </p>

        </div>


        <button
          class="arrow-btn"
          onclick="render('earn')"
          type="button">
          →
        </button>

      </div>


      <div class="action-grid">


        <div
          class="action-card"
          onclick="completeTask('Watch & Earn',50)">

          <div class="action-icon">
            ▶
          </div>

          <b>
            Watch
          </b>

          <span>
            +50 XP
          </span>

        </div>


        <div
          class="action-card"
          onclick="completeTask('Daily Task',75)">

          <div class="action-icon">
            ✓
          </div>

          <b>
            Tasks
          </b>

          <span>
            +75 XP
          </span>

        </div>


        <div
          class="action-card"
          onclick="completeTask('Referral',100,5)">

          <div class="action-icon">
            👥
          </div>

          <b>
            Refer
          </b>

          <span>
            +100 XP
          </span>

        </div>


        <div
          class="action-card"
          onclick="render('game')">

          <div class="action-icon">
            🎮
          </div>

          <b>
            Games
          </b>

          <span>
            Play & Earn
          </span>

        </div>


        <div
          class="action-card"
          onclick="render('game')">

          <div class="action-icon">
            ⚡
          </div>

          <b>
            Catcher
          </b>

          <span>
            Catch XP
          </span>

        </div>


        <div
          class="action-card"
          onclick="completeTask('Daily Streak',40)">

          <div class="action-icon">
            🔥
          </div>

          <b>
            Streak
          </b>

          <span>
            +40 XP
          </span>

        </div>


      </div>


      <!-- REWARD -->

      <div class="reward-card">

        <div>

          <h3>

            ${
              state.level === 0
                ? "Your First Rewards"
                : `${getLevelName(state.level)} Rewards`
            }

          </h3>

          <p>

            ${
              state.level === 0
                ? "Start earning XP to unlock your first reward."
                : "Keep earning to unlock more rewards."
            }

          </p>

        </div>


        <div class="reward-image">
          🎁
        </div>

      </div>

    </section>

  `;

}


/* =========================================================
   EARN
   ========================================================= */

function earn() {

  return `

    ${header(
      "Earn & Grow",
      "Complete simple activities and build your VELOOP level."
    )}


    <div class="boost-card">

      <div class="boost-grid">

        <div class="boost-item">

          <div class="boost-icon">
            ⚡
          </div>

          <b>
            ${state.xp} XP
          </b>

          <span>
            Earned
          </span>

        </div>


        <div class="boost-item">

          <div class="boost-icon">
            🎯
          </div>

          <b>
            ${state.tasks}/8
          </b>

          <span>
            Tasks
          </span>

        </div>


        <div class="boost-item">

          <div class="boost-icon">
            🔥
          </div>

          <b>
            ${state.streak}
          </b>

          <span>
            Streak
          </span>

        </div>

      </div>

    </div>


    <div class="section-title">
      Available Activities
    </div>


    ${earningCard(
      "🎬",
      "Watch & Earn",
      "Watch a short video and earn XP.",
      "+50 XP",
      "START",
      "completeTask('Watch & Earn',50)"
    )}


    ${earningCard(
      "🎯",
      "Daily Task",
      "Complete today's simple activity.",
      "+75 XP",
      "START",
      "completeTask('Daily Task',75)"
    )}


    ${earningCard(
      "👥",
      "Refer & Earn",
      "Invite friends to join VELOOP.",
      "+100 XP + 5 VEs",
      "START",
      "completeTask('Referral',100,5)"
    )}


    ${earningCard(
      "⚡",
      "XP Catcher",
      "Play a quick mini-game and catch XP.",
      "Play & Earn",
      "PLAY",
      "render('game')"
    )}


    ${earningCard(
      "🔥",
      "Daily Streak",
      "Keep your daily activity streak alive.",
      "+40 XP",
      "CLAIM",
      "completeTask('Daily Streak',40)"
    )}


    <div class="section-title">
      More Ways To Earn
    </div>


    <div class="action-grid">

      <div
        class="action-card"
        onclick="showToast('Games section coming soon 🎮')">

        <div class="action-icon">
          🎮
        </div>

        <b>Games</b>

        <span>
          Play & Earn
        </span>

      </div>


      <div
        class="action-card"
        onclick="showToast('Surveys coming soon 📋')">

        <div class="action-icon">
          📋
        </div>

        <b>Surveys</b>

        <span>
          Earn XP
        </span>

      </div>


      <div
        class="action-card"
        onclick="showToast('Offers coming soon 🎁')">

        <div class="action-icon">
          🎁
        </div>

        <b>Offers</b>

        <span>
          Special rewards
        </span>

      </div>

    </div>

  `;

}


/* =========================================================
   EARNING CARD
   ========================================================= */

function earningCard(
  icon,
  title,
  description,
  reward,
  buttonText,
  action
) {

  return `

    <div class="reward-card">

      <div>

        <h3>
          ${icon} ${title}
        </h3>

        <p>
          ${description}
        </p>

        <p>
          <strong>
            ${reward}
          </strong>
        </p>

      </div>


      <button
        class="btn"
        onclick="${action}"
        type="button">

        ${buttonText}

      </button>

    </div>

  `;

}


/* =========================================================
   REWARDS
   ========================================================= */

function rewards() {

  return `

    ${header(
      "Rewards",
      "Complete activities and unlock all 10 VELOOP levels."
    )}


    <div class="level-card">

      <div class="level-top">

        <div class="level-badge">

          <small>
            ${getLevelName(state.level)}
          </small>

          <b>
            ${String(
              state.level
            ).padStart(2, "0")}
          </b>

        </div>


        <div>

          <div class="xp-number">
            ${state.xp.toLocaleString()} XP
          </div>

          <div class="xp-label">

            ${
              state.level >= 10
                ? "Maximum level reached 👑"
                : `${Math.max(
                    0,
                    state.xpMax - state.xp
                  ).toLocaleString()} XP to next level`
            }

          </div>

        </div>

      </div>


      <div class="xp-bar">

        <div
          class="xp-progress"
          style="
            width:${getXPPercentage()}%
          "
        ></div>

      </div>


      <div class="tiny">

        Level
        ${String(
          state.level
        ).padStart(2, "0")}
        of 10

      </div>

    </div>


    <div class="section-title">
      Your VELOOP Journey
    </div>


    <div class="level-ladder">

      ${createLevelRow(0,"Newcomer",0)}

      ${createLevelRow(1,"Starter",500)}

      ${createLevelRow(2,"Bronze",1200)}

      ${createLevelRow(3,"Silver",2200)}

      ${createLevelRow(4,"Gold",3500)}

      ${createLevelRow(5,"Platinum",5000)}

      ${createLevelRow(6,"Diamond",7000)}

      ${createLevelRow(7,"Emerald",9500)}

      ${createLevelRow(8,"Sapphire",12500)}

      ${createLevelRow(9,"Master",16000)}

      ${createLevelRow(10,"Legend",20000)}

    </div>

  `;

}


/* =========================================================
   LEVEL ROW
   ========================================================= */

function createLevelRow(
  level,
  name,
  requiredXP
) {

  const unlocked =
    state.level >= level;


  const current =
    state.level === level;


  return `

    <div class="
      level-row
      ${current ? "current" : ""}
      ${unlocked ? "done" : ""}
    ">

      <span class="level-dot">

        ${String(
          level
        ).padStart(2,"0")}

      </span>


      <div>

        <b>
          ${name}
        </b>

        <small>

          ${
            level === 0
              ? "Starting point • 0 XP"
              : `Level ${String(
                  level
                ).padStart(2,"0")} • ${requiredXP.toLocaleString()} XP`
          }

        </small>

      </div>


      <strong>

        ${
          unlocked
            ? "✓"
            : "🔒"
        }

      </strong>

    </div>

  `;

}


/* =========================================================
   WALLET
   ========================================================= */

function wallet() {

  return `

    ${header(
      "Wallet",
      "Track your VELOOP earnings and rewards."
    )}


    <div class="wallet-card">

      <small>
        Available Balance
      </small>


      <div class="wallet-balance">

        ${state.ve.toLocaleString()}
        VEs

      </div>


      <div class="wallet-label">

        Your total available rewards

      </div>


      <div class="wallet-actions">

        <button
          class="btn"
          onclick="withdrawReward()"
          type="button">

          Withdraw

        </button>


        <button
          class="btn-secondary"
          onclick="showToast('Transaction history is empty')"
          type="button">

          History

        </button>

      </div>

    </div>


    <div class="section-title">
      Wallet Overview
    </div>


    <div class="boost-card">

      <div class="boost-grid">

        <div class="boost-item">

          <div class="boost-icon">
            💰
          </div>

          <b>
            ${state.ve}
          </b>

          <span>
            VEs
          </span>

        </div>


        <div class="boost-item">

          <div class="boost-icon">
            🪙
          </div>

          <b>
            ${state.sve}
          </b>

          <span>
            SVEs
          </span>

        </div>


        <div class="boost-item">

          <div class="boost-icon">
            💎
          </div>

          <b>
            ${state.gems}
          </b>

          <span>
            Gems
          </span>

        </div>

      </div>

    </div>


    <div class="section-title">
      Reward Information
    </div>


    <div class="reward-card">

      <div>

        <h3>
          VEs — VELOOP Earn Tokens
        </h3>

        <p>
          Your primary virtual reward currency.
        </p>

      </div>

    </div>


    <div class="reward-card">

      <div>

        <h3>
          SVEs — Silver VEs
        </h3>

        <p>
          SVEs can be converted into VEs according
          to the applicable platform rules.
        </p>

      </div>

    </div>


    <div class="section-title">
      Redemption
    </div>


    ${redemptionRow("₹10","2,400 VEs")}

    ${redemptionRow("₹25","5,800 VEs")}

    ${redemptionRow("₹50","10,000 VEs")}

    ${redemptionRow("₹100","19,500 VEs")}

    ${redemptionRow("₹150","28,500 VEs")}

    ${redemptionRow("₹300","52,500 VEs")}

    ${redemptionRow("₹500","80,500 VEs")}

    ${redemptionRow("₹1,000","150,000 VEs")}


    <div class="section-title">
      How To Earn More
    </div>


    <div class="activity-list">

      ${walletActivity(
        "⚡",
        "Complete Tasks",
        "Earn rewards by completing available activities."
      )}

      ${walletActivity(
        "🔥",
        "Maintain Streak",
        "Return every day for extra rewards."
      )}

      ${walletActivity(
        "🎮",
        "Play Games",
        "Play mini-games and collect rewards."
      )}

      ${walletActivity(
        "👥",
        "Refer Friends",
        "Invite friends and grow your rewards."
      )}

    </div>


    <div class="section-title">
      Withdrawal
    </div>


    <div class="reward-card">

      <div>

        <h3>
          💳 Cash Out
        </h3>

        <p>
          Check available redemption options
          based on your current VE balance.
        </p>

      </div>


      <button
        class="btn"
        onclick="withdrawReward()"
        type="button">

        CHECK

      </button>

    </div>

  `;

}


/* =========================================================
   REDEMPTION ROW
   ========================================================= */

function redemptionRow(
  amount,
  required
) {

  return `

    <div class="activity-item">

      <div class="activity-icon">
        ₹
      </div>

      <div class="activity-info">

        <b>
          ${amount}
        </b>

        <small>
          Required balance
        </small>

      </div>

      <div class="activity-reward">
        ${required}
      </div>

    </div>

  `;

}


/* =========================================================
   WALLET ACTIVITY
   ========================================================= */

function walletActivity(
  icon,
  title,
  description
) {

  return `

    <div class="activity-item">

      <div class="activity-icon">
        ${icon}
      </div>

      <div class="activity-info">

        <b>
          ${title}
        </b>

        <small>
          ${description}
        </small>

      </div>

      <div class="activity-reward">
        +XP
      </div>

    </div>

  `;

}


/* =========================================================
   WITHDRAW
   ========================================================= */

function withdrawReward() {

  if (
    state.ve <= 0
  ) {

    showToast(
      "You need VEs before you can withdraw."
    );

    return;

  }


  showToast(
    "Withdrawal options coming soon 💳"
  );

}


/* =========================================================
   PROFILE
   ========================================================= */

function profile() {

  return `

    ${header(
      "Profile",
      "Manage your VELOOP journey and progress."
    )}


    <div class="profile-card">

      <div class="avatar">
        V
      </div>

      <h2>
        New VeLooper
      </h2>

      <p>
        Level
        ${String(
          state.level
        ).padStart(2,"0")}
        •
        ${getLevelName(state.level)}
      </p>

    </div>


    <div class="section-title">
      Your Stats
    </div>


    <div class="boost-card">

      <div class="boost-grid">

        <div class="boost-item">

          <div class="boost-icon">
            ⭐
          </div>

          <b>
            ${state.xp}
          </b>

          <span>
            Total XP
          </span>

        </div>


        <div class="boost-item">

          <div class="boost-icon">
            🎯
          </div>

          <b>
            ${state.tasks}
          </b>

          <span>
            Tasks
          </span>

        </div>


        <div class="boost-item">

          <div class="boost-icon">
            🔥
          </div>

          <b>
            ${state.streak}
          </b>

          <span>
            Streak
          </span>

        </div>

      </div>

    </div>


    <div class="section-title">
      Current Level
    </div>


    <div class="level-card">

      <div class="level-top">

        <div class="level-badge">

          <small>
            ${getLevelName(state.level)}
          </small>

          <b>
            ${String(
              state.level
            ).padStart(2,"0")}
          </b>

        </div>


        <div>

          <div class="xp-number">
            ${state.xp.toLocaleString()} XP
          </div>

          <div class="xp-label">

            ${
              state.level >= 10
                ? "Maximum level reached 👑"
                : `${Math.max(
                    0,
                    state.xpMax - state.xp
                  ).toLocaleString()} XP remaining`
            }

          </div>

        </div>

      </div>


      <div class="xp-bar">

        <div
          class="xp-progress"
          style="
            width:${getXPPercentage()}%
          "
        ></div>

      </div>


      <div class="tiny">

        ${
          state.level >= 10
            ? "Legendary status unlocked"
            : `${getXPPercentage().toFixed(0)}% complete`
        }

      </div>

    </div>


    <div class="section-title">
      Account
    </div>


    <div class="activity-list">


      <div
        class="activity-item"
        onclick="showToast('Profile editing coming soon')">

        <div class="activity-icon">
          ✏️
        </div>

        <div class="activity-info">

          <b>
            Edit Profile
          </b>

          <small>
            Update your VELOOP profile.
          </small>

        </div>

        <div class="activity-reward">
          →
        </div>

      </div>


      <div
        class="activity-item"
        onclick="showToast('Notifications are enabled 🔔')">

        <div class="activity-icon">
          🔔
        </div>

        <div class="activity-info">

          <b>
            Notifications
          </b>

          <small>
            Stay updated about rewards and tasks.
          </small>

        </div>

        <div class="activity-reward">
          ON
        </div>

      </div>


      <div
        class="activity-item"
        onclick="showToast('Help center coming soon')">

        <div class="activity-icon">
          ❓
        </div>

        <div class="activity-info">

          <b>
            Help & Support
          </b>

          <small>
            Get help with your VELOOP account.
          </small>

        </div>

        <div class="activity-reward">
          →
        </div>

      </div>


    </div>


    <div class="reward-card">

      <div>

        <h3>
          🏆 Level Journey
        </h3>

        <p>
          View all VELOOP levels and unlockable ranks.
        </p>

      </div>


      <button
        class="btn"
        onclick="render('rewards')"
        type="button">

        VIEW

      </button>

    </div>

  `;

}


/* =========================================================
   XP CATCHER
   ========================================================= */

let gameTimer = null;

let gameTime = 20;

let gameScore = 0;

let gameRunning = false;


/* =========================================================
   GAME PAGE
   ========================================================= */

function game() {

  return `

    <div class="game-screen">

      <h1>
        XP Catcher ⚡
      </h1>

      <p>
        Catch XP orbs before time runs out.
      </p>


      <div
        class="boost-card"
        style="width:100%; margin-top:15px;">

        <div class="boost-grid">


          <div class="boost-item">

            <div class="boost-icon">
              ⏱️
            </div>

            <b id="gameTimer">
              20s
            </b>

            <span>
              Time
            </span>

          </div>


          <div class="boost-item">

            <div class="boost-icon">
              ⚡
            </div>

            <b id="gameScore">
              ${gameScore}
            </b>

            <span>
              Score
            </span>

          </div>


          <div class="boost-item">

            <div class="boost-icon">
              ⭐
            </div>

            <b>
              XP
            </b>

            <span>
              Reward
            </span>

          </div>


        </div>

      </div>


      <div
        class="game-area"
        id="gameArea">

        <div
          class="orb xp"
          style="left:15%;top:20%;"
          onclick="catchOrb(this,20)">

          +20

        </div>


        <div
          class="orb ve"
          style="left:62%;top:35%;"
          onclick="catchOrb(this,30)">

          +30

        </div>


        <div
          class="orb xp"
          style="left:35%;top:58%;"
          onclick="catchOrb(this,50)">

          +50

        </div>


        <div
          class="orb gem"
          style="left:72%;top:72%;"
          onclick="catchOrb(this,10)">

          <span>
            +10
          </span>

        </div>

      </div>


      <button
        class="btn full"
        style="margin-top:12px;"
        onclick="startGame()"
        type="button">

        START GAME

      </button>


      <p style="margin-top:10px;">
        Catch ⚡ XP • 💰 VEs • 💎 Gems
      </p>

    </div>

  `;

}


/* =========================================================
   CATCH ORB
   ========================================================= */

function catchOrb(
  element,
  value
) {

  if (
    !gameRunning ||
    !element
  ) {

    return;

  }


  const isVE =
    element.classList.contains("ve");


  const isGem =
    element.classList.contains("gem");


  element.remove();


  gameScore +=
    value;


  state.xp +=
    value;


  if (isVE) {

    state.ve += 1;

  }


  if (isGem) {

    state.gems += 1;

  }


  updateLevel();


  const scoreElement =
    document.getElementById(
      "gameScore"
    );


  if (scoreElement) {

    scoreElement.textContent =
      gameScore;

  }


  spawnOrb();

}


/* =========================================================
   SPAWN ORB
   ========================================================= */

function spawnOrb() {

  const gameArea =
    document.getElementById(
      "gameArea"
    );


  if (
    !gameArea ||
    !gameRunning
  ) {

    return;

  }


  const orb =
    document.createElement(
      "div"
    );


  const random =
    Math.random();


  let type;

  let value;


  if (
    random < 0.60
  ) {

    type = "xp";


    value =
      [
        10,
        20,
        30,
        50
      ][
        Math.floor(
          Math.random() * 4
        )
      ];

  }


  else if (
    random < 0.85
  ) {

    type = "ve";

    value = 30;

  }


  else {

    type = "gem";

    value = 10;

  }


  orb.className =
    `orb ${type}`;


  orb.innerHTML =
    type === "gem"
      ? `<span>+${value}</span>`
      : `+${value}`;


  orb.style.left =
    `${8 + Math.random() * 82}%`;


  orb.style.top =
    `${8 + Math.random() * 78}%`;


  orb.onclick =
    function () {

      catchOrb(
        orb,
        value
      );

    };


  gameArea.appendChild(
    orb
  );

}


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

  if (gameRunning) {

    return;

  }


  gameRunning = true;

  gameTime = 20;

  gameScore = 0;


  const gameArea =
    document.getElementById(
      "gameArea"
    );


  if (!gameArea) {

    gameRunning = false;

    return;

  }


  clearInterval(
    gameTimer
  );


  gameArea.innerHTML =
    "";


  const scoreElement =
    document.getElementById(
      "gameScore"
    );


  if (scoreElement) {

    scoreElement.textContent =
      "0";

  }


  const timerElement =
    document.getElementById(
      "gameTimer"
    );


  if (timerElement) {

    timerElement.textContent =
      "20s";

  }


  for (
    let i = 0;
    i < 6;
    i++
  ) {

    spawnOrb();

  }


  showToast(
    "Game started! Catch the rewards ⚡"
  );


  gameTimer =
    setInterval(
      function () {

        gameTime--;


        if (timerElement) {

          timerElement.textContent =
            `${gameTime}s`;

        }


        if (
          gameTime <= 0
        ) {

          endGame();

        }

      },
      1000
    );

}


/* =========================================================
   END GAME
   ========================================================= */

function endGame() {

  clearInterval(
    gameTimer
  );


  gameTimer =
    null;


  gameRunning =
    false;


  updateLevel();


  const gameArea =
    document.getElementById(
      "gameArea"
    );


  if (gameArea) {

    gameArea.innerHTML = `

      <div
        style="
          position:absolute;
          inset:0;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding:25px;
        "
      >

        <div style="font-size:55px;">
          🏆
        </div>

        <h2 style="margin-top:10px;">
          Challenge Complete!
        </h2>

        <p style="margin-top:6px;">
          You collected
          <strong>${gameScore} XP</strong>
        </p>

        <p style="margin-top:4px;">
          Keep playing to level up!
        </p>

      </div>

    `;

  }


  showToast(
    `Game complete! +${gameScore} XP 🎉`
  );


  setTimeout(
    function () {

      render("game");

    },
    1800
  );

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;


function showToast(
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );


  if (!toast) {

    return;

  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      function () {

        toast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setActiveNav(
  route
) {

  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      function (item) {

        item.classList.toggle(
          "active",
          item.dataset.route === route
        );

      }
    );

}


/* =========================================================
   MAIN RENDER
   ========================================================= */

function render(
  route = "home"
) {

  const app =
    document.getElementById(
      "app"
    );


  if (!app) {

    return;

  }


  state.currentRoute =
    route;


  setActiveNav(
    route
  );


  switch (route) {

    case "earn":

      app.innerHTML =
        earn();

      break;


    case "rewards":

      app.innerHTML =
        rewards();

      break;


    case "wallet":

      app.innerHTML =
        wallet();

      break;


    case "profile":

      app.innerHTML =
        profile();

      break;


    case "game":

      app.innerHTML =
        game();

      break;


    case "home":

    default:

      app.innerHTML =
        home();

      break;

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeApp() {

  updateLevel();

  render("home");


  /* NAVIGATION */

  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      function (item) {

        item.addEventListener(
          "click",
          function () {

            const route =
              item.dataset.route;


            render(
              route
            );

          }
        );

      }
    );


  /* NOTIFICATION */

  const notifyBtn =
    document.getElementById(
      "notifyBtn"
    );


  if (notifyBtn) {

    notifyBtn.addEventListener(
      "click",
      function () {

        showToast(
          "You're all caught up! ✨"
        );

      }
    );

  }


  /* MENU */

  const menuBtn =
    document.getElementById(
      "menuBtn"
    );


  if (menuBtn) {

    menuBtn.addEventListener(
      "click",
      function () {

        showToast(
          "Menu coming soon"
        );

      }
    );

  }

}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

}

else {

  initializeApp();

}