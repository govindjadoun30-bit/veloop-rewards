/* =========================================================
   VELOOP REWARDS
   DARK PREMIUM VERSION
   ========================================================= */


/* =========================================================
   STATE
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
   LEVELS
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
   LEVEL UPDATE
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


  if (
    state.level < 10
  ) {

    state.xpMax =
      LEVEL_XP[state.level + 1];

  }

  else {

    state.xpMax =
      LEVEL_XP[10];

  }


  /* LEVEL UP */

  if (
    newLevel > oldLevel
  ) {

    setTimeout(
      () => {

        showLevelUpModal(
          newLevel
        );

      },
      250
    );

  }

}


/* =========================================================
   XP %
   ========================================================= */

function getXPPercentage() {

  if (
    state.level >= 10
  ) {

    return 100;

  }


  const current =
    LEVEL_XP[state.level];

  const next =
    LEVEL_XP[state.level + 1];


  return Math.max(
    0,
    Math.min(
      100,
      (
        (state.xp - current) /
        (next - current)
      ) * 100
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

    state.streak =
      1;

  }


  updateLevel();


  showToast(
    `${name} completed! +${xp} XP`
  );


  render(
    "earn"
  );

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
        ).padStart(2,"0")
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

        Level up your journey and unlock
        epic rewards every day.

      </div>


      ${
        state.level === 0
          ? `

            <div class="start-hint">

              ✨ Start your journey at
              <b>Level 00 — Newcomer</b>.

              Complete your first activity
              and begin earning XP.

            </div>

          `
          : ""
      }


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
                  : `to reach Level ${nextLevel}`
              }

            </div>

          </div>

        </div>


        <div class="xp-bar">

          <div
            class="xp-progress"
            style="width:${percentage}%">
          </div>

        </div>


        <div class="tiny">

          ${
            state.level >= 10
              ? "20,000 / 20,000 XP"
              : `${state.xp.toLocaleString()} / ${state.xpMax.toLocaleString()} XP`
          }

        </div>

      </div>


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
              Streak
            </span>

          </div>

        </div>

      </div>


      <div class="section-title">
        Earn More
      </div>


      <div class="earn-header">

        <div>

          <h3>
            Choose an activity
          </h3>

          <p>
            Earn XP and unlock better rewards.
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


        ${homeAction(
          "▶",
          "Watch",
          "+50 XP",
          "completeTask('Watch & Earn',50)"
        )}


        ${homeAction(
          "✓",
          "Tasks",
          "+75 XP",
          "completeTask('Daily Task',75)"
        )}


        ${homeAction(
          "👥",
          "Refer",
          "+100 XP",
          "completeTask('Referral',100,5)"
        )}


        ${homeAction(
          "🎮",
          "Games",
          "Play",
          "render('game')"
        )}


        ${homeAction(
          "⚡",
          "Catcher",
          "Catch XP",
          "render('game')"
        )}


        ${homeAction(
          "🔥",
          "Streak",
          "+40 XP",
          "completeTask('Daily Streak',40)"
        )}

      </div>


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
            Keep earning XP to unlock new levels,
            challenges and rewards.
          </p>

        </div>

        <div class="reward-image">
          🏆
        </div>

      </div>

    </section>

  `;

}


function homeAction(
  icon,
  title,
  reward,
  action
) {

  return `

    <div
      class="action-card"
      onclick="${action}">

      <div class="action-icon">
        ${icon}
      </div>

      <b>
        ${title}
      </b>

      <span>
        ${reward}
      </span>

    </div>

  `;

}


/* =========================================================
   EARN
   ========================================================= */

function earn() {

  return `

    ${header(
      "Earn & Grow",
      "Complete activities. Earn XP. Climb levels."
    )}


    <div class="boost-card">

      <div class="boost-grid">

        <div class="boost-item">

          <div class="boost-icon">
            ⚡
          </div>

          <b>
            ${state.xp}
          </b>

          <span>
            XP
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
      "Daily Mission",
      "Complete today's mission.",
      "+75 XP",
      "START",
      "completeTask('Daily Mission',75)"
    )}


    ${earningCard(
      "👥",
      "Refer & Earn",
      "Invite friends to VELOOP.",
      "+100 XP + 5 VEs",
      "START",
      "completeTask('Referral',100,5)"
    )}


    ${earningCard(
      "⚡",
      "XP Catcher",
      "Catch falling XP, VEs and Gems.",
      "PLAY",
      "PLAY",
      "render('game')"
    )}


    ${earningCard(
      "🔥",
      "Daily Streak",
      "Keep your streak alive.",
      "+40 XP",
      "CLAIM",
      "completeTask('Daily Streak',40)"
    )}


    <div class="section-title">
      More Ways To Earn
    </div>


    <div class="action-grid">

      ${homeAction(
        "🎮",
        "Games",
        "Play & Earn",
        "showToast('More games coming soon 🎮')"
      )}

      ${homeAction(
        "📋",
        "Surveys",
        "Earn XP",
        "showToast('Surveys coming soon 📋')"
      )}

      ${homeAction(
        "🎁",
        "Offers",
        "Special rewards",
        "showToast('Offers coming soon 🎁')"
      )}

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
      "Climb all 10 levels and unlock your journey."
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
                  ).toLocaleString()} XP to next level`
            }

          </div>

        </div>

      </div>


      <div class="xp-bar">

        <div
          class="xp-progress"
          style="width:${getXPPercentage()}%">
        </div>

      </div>

      <div class="tiny">
        Level ${String(
          state.level
        ).padStart(2,"0")} of 10
      </div>

    </div>


    <div class="section-title">
      VELOOP Journey
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
        ${unlocked ? "✓" : "🔒"}
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
        Your available virtual rewards
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
          onclick="showToast('No transactions yet')"
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


  `;

}


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
      "Manage your VELOOP journey."
    )}


    <div class="profile-card">

      <div class="avatar">
        V
      </div>

      <h2>
        New VeLooper
      </h2>

      <p>
        Level ${String(
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
            XP
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
      Account
    </div>


    <div class="activity-list">

      ${profileItem(
        "✏️",
        "Edit Profile",
        "Update your VELOOP profile.",
        "showToast('Profile editing coming soon')"
      )}

      ${profileItem(
        "🔔",
        "Notifications",
        "Stay updated about rewards.",
        "showToast('Notifications are enabled 🔔')"
      )}

      ${profileItem(
        "❓",
        "Help & Support",
        "Get help with VELOOP.",
        "showToast('Help center coming soon')"
      )}

    </div>


    <div class="reward-card">

      <div>

        <h3>
          🏆 Level Journey
        </h3>

        <p>
          View all VELOOP levels and ranks.
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


function profileItem(
  icon,
  title,
  description,
  action
) {

  return `

    <div
      class="activity-item"
      onclick="${action}">

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
        →
      </div>

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

let spawnTimer = null;

let basketX = 50;


/* =========================================================
   GAME PAGE
   ========================================================= */

function game() {

  return `

    <div class="game-screen">

      <h1>
        XP CATCHER ⚡
      </h1>

      <p>
        Move the basket and catch the falling rewards.
      </p>


      <div class="game-hud">

        <div class="hud-box">

          <b id="gameTimer">
            20s
          </b>

          <span>
            TIME
          </span>

        </div>


        <div class="hud-box">

          <b id="gameScore">
            ${gameScore}
          </b>

          <span>
            SCORE
          </span>

        </div>


        <div class="hud-box">

          <b id="gameXP">
            0
          </b>

          <span>
            ROUND XP
          </span>

        </div>

      </div>


      <div
        class="game-area"
        id="gameArea"
      >

        <div
          class="basket"
          id="basket"
        >

          <div class="basket-glow"></div>

          <div class="basket-rim"></div>

          <div class="basket-body"></div>

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
        🟣 XP &nbsp; 🟡 VEs &nbsp; 🟢 Gems
      </p>

    </div>

  `;

}


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

  if (
    gameRunning
  ) {

    return;

  }


  const gameArea =
    document.getElementById(
      "gameArea"
    );


  if (!gameArea) {

    return;

  }


  gameRunning =
    true;

  gameTime =
    20;

  gameScore =
    0;

  basketX =
    50;


  clearInterval(
    gameTimer
  );

  clearInterval(
    spawnTimer
  );


  gameArea
    .querySelectorAll(".orb")
    .forEach(
      orb => orb.remove()
    );


  updateBasket();


  updateGameHUD();


  for (
    let i = 0;
    i < 5;
    i++
  ) {

    createFallingOrb(
      true
    );

  }


  showToast(
    "Game started! Move the basket ⚡"
  );


  gameTimer =
    setInterval(
      () => {

        gameTime--;

        updateGameHUD();


        if (
          gameTime <= 0
        ) {

          endGame();

        }

      },
      1000
    );


  spawnTimer =
    setInterval(
      () => {

        if (
          gameRunning
        ) {

          createFallingOrb();

        }

      },
      700
    );

}


/* =========================================================
   CREATE FALLING ORB
   ========================================================= */

function createFallingOrb(
  instant = false
) {

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
    random < .58
  ) {

    type =
      "xp";

    value =
      [10,20,30,50]
      [
        Math.floor(
          Math.random() * 4
        )
      ];

  }

  else if (
    random < .84
  ) {

    type =
      "ve";

    value =
      30;

  }

  else {

    type =
      "gem";

    value =
      10;

  }


  orb.className =
    `orb ${type}`;


  orb.dataset.value =
    value;


  orb.innerHTML =
    type === "gem"
      ? `<span>+${value}</span>`
      : `+${value}`;


  let x =
    8 + Math.random() * 84;


  let y =
    instant
      ? 5 + Math.random() * 55
      : -8;


  orb.style.left =
    `${x}%`;

  orb.style.top =
    `${y}%`;


  gameArea.appendChild(
    orb
  );


  if (
    instant
  ) {

    animateOrb(
      orb,
      x,
      y
    );

  }

  else {

    requestAnimationFrame(
      () => {

        animateOrb(
          orb,
          x,
          y
        );

      }
    );

  }

}


/* =========================================================
   ORB MOVEMENT
   ========================================================= */

function animateOrb(
  orb,
  x,
  startY
) {

  let y =
    startY;

  const speed =
    0.30 +
    Math.random() * 0.20;


  function fall() {

    if (
      !orb.isConnected ||
      !gameRunning
    ) {

      return;

    }


    y +=
      speed;


    orb.style.top =
      `${y}%`;


    checkBasketCollision(
      orb,
      x,
      y
    );


    if (
      y > 108
    ) {

      orb.remove();

      return;

    }


    requestAnimationFrame(
      fall
    );

  }


  fall();

}


/* =========================================================
   COLLISION
   ========================================================= */

function checkBasketCollision(
  orb,
  x,
  y
) {

  if (
    !orb.isConnected ||
    !gameRunning
  ) {

    return;

  }


  /*
    Basket collision zone
    bottom ~ 20px
    basket height ~ 75px
  */

  if (
    y >= 80 &&
    y <= 94 &&
    Math.abs(
      x - basketX
    ) < 11
  ) {

    catchOrb(
      orb,
      Number(
        orb.dataset.value
      )
    );

  }

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
    !element ||
    !element.isConnected
  ) {

    return;

  }


  const isVE =
    element.classList.contains(
      "ve"
    );


  const isGem =
    element.classList.contains(
      "gem"
    );


  const rect =
    element.getBoundingClientRect();


  const gameArea =
    document.getElementById(
      "gameArea"
    );


  if (
    gameArea
  ) {

    createParticles(
      rect.left +
        rect.width / 2,

      rect.top +
        rect.height / 2
    );

  }


  element.remove();


  gameScore +=
    value;


  state.xp +=
    value;


  if (
    isVE
  ) {

    state.ve +=
      1;

  }


  if (
    isGem
  ) {

    state.gems +=
      1;

  }


  updateLevel();


  updateGameHUD();

}


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles(
  x,
  y
) {

  const colors = [
    "#ffd34e",
    "#a95cff",
    "#65e65d",
    "#fff"
  ];


  for (
    let i = 0;
    i < 10;
    i++
  ) {

    const particle =
      document.createElement(
        "div"
      );


    particle.className =
      "particle";


    particle.style.left =
      `${x}px`;


    particle.style.top =
      `${y}px`;


    particle.style.background =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    particle.style.setProperty(
      "--dx",
      `${(Math.random()-.5)*100}px`
    );


    particle.style.setProperty(
      "--dy",
      `${(Math.random()-.5)*100}px`
    );


    document.body.appendChild(
      particle
    );


    setTimeout(
      () => particle.remove(),
      650
    );

  }

}


/* =========================================================
   GAME HUD
   ========================================================= */

function updateGameHUD() {

  const timer =
    document.getElementById(
      "gameTimer"
    );

  const score =
    document.getElementById(
      "gameScore"
    );

  const xp =
    document.getElementById(
      "gameXP"
    );


  if (
    timer
  ) {

    timer.textContent =
      `${gameTime}s`;

  }


  if (
    score
  ) {

    score.textContent =
      gameScore;

  }


  if (
    xp
  ) {

    xp.textContent =
      gameScore;

  }

}


/* =========================================================
   BASKET CONTROL
   ========================================================= */

function updateBasket() {

  const basket =
    document.getElementById(
      "basket"
    );


  if (
    basket
  ) {

    basket.style.left =
      `${basketX}%`;

  }

}


/* =========================================================
   MOUSE CONTROL
   ========================================================= */

function setupMouseControl() {

  document.addEventListener(
    "mousemove",
    event => {

      if (
        !gameRunning
      ) {

        return;

      }


      const area =
        document.getElementById(
          "gameArea"
        );


      if (
        !area
      ) {

        return;

      }


      const rect =
        area.getBoundingClientRect();


      const x =
        (
          (event.clientX - rect.left) /
          rect.width
        ) * 100;


      basketX =
        Math.max(
          8,
          Math.min(
            92,
            x
          )
        );


      updateBasket();

    }
  );

}


/* =========================================================
   TOUCH CONTROL
   ========================================================= */

function setupTouchControl() {

  document.addEventListener(
    "touchmove",
    event => {

      if (
        !gameRunning
      ) {

        return;

      }


      const touch =
        event.touches[0];


      const area =
        document.getElementById(
          "gameArea"
        );


      if (
        !area
      ) {

        return;

      }


      const rect =
        area.getBoundingClientRect();


      const x =
        (
          (touch.clientX - rect.left) /
          rect.width
        ) * 100;


      basketX =
        Math.max(
          8,
          Math.min(
            92,
            x
          )
        );


      updateBasket();

    },
    {
      passive:true
    }
  );

}


/* =========================================================
   KEYBOARD CONTROL
   ========================================================= */

function setupKeyboardControl() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        !gameRunning
      ) {

        return;

      }


      if (
        event.key === "ArrowLeft"
      ) {

        basketX -=
          5;

      }


      if (
        event.key === "ArrowRight"
      ) {

        basketX +=
          5;

      }


      basketX =
        Math.max(
          8,
          Math.min(
            92,
            basketX
          )
        );


      updateBasket();

    }
  );

}


/* =========================================================
   END GAME
   ========================================================= */

function endGame() {

  if (
    !gameRunning
  ) {

    return;

  }


  gameRunning =
    false;


  clearInterval(
    gameTimer
  );

  clearInterval(
    spawnTimer
  );


  gameTimer =
    null;

  spawnTimer =
    null;


  const area =
    document.getElementById(
      "gameArea"
    );


  if (
    area
  ) {

    area
      .querySelectorAll(".orb")
      .forEach(
        orb => orb.remove()
      );

  }


  const finalXP =
    gameScore;


  const finalVE =
    Math.floor(
      gameScore / 10
    );


  state.ve +=
    finalVE;


  updateLevel();


  setTimeout(
    () => {

      showChallengeComplete(
        finalXP,
        finalVE
      );

    },
    250
  );

}


/* =========================================================
   LEVEL UP MODAL
   ========================================================= */

function showLevelUpModal(
  level
) {

  const modal =
    document.getElementById(
      "modalBox"
    );


  if (
    !modal
  ) {

    return;

  }


  const levelName =
    getLevelName(
      level
    );


  const rewardVE =
    level * 100;


  const rewardGems =
    level * 5;


  state.ve +=
    rewardVE;


  state.gems +=
    rewardGems;


  modal.innerHTML = `

    <div class="modal-title">
      LEVEL UP!
    </div>


    <div class="modal-subtitle">
      You've reached a new level
    </div>


    <div class="level-up-art">

      <div class="level-up-ring"></div>

      <div class="level-up-badge">

        <span>
          LEVEL
        </span>

        <strong>
          ${String(
            level
          ).padStart(2,"0")}
        </strong>

      </div>

    </div>


    <h2>
      ${levelName}
    </h2>


    <div class="reward-popup-grid">

      <div class="popup-reward">

        <b>
          +${rewardVE}
        </b>

        <span>
          VEs
        </span>

      </div>


      <div class="popup-reward">

        <b>
          +${rewardGems}
        </b>

        <span>
          Gems
        </span>

      </div>

    </div>


    <div class="reward-card">

      <div style="text-align:left">

        <h3>
          🚀 Level Benefits
        </h3>

        <p>
          Higher daily XP limit
        </p>

        <p>
          New challenges unlocked
        </p>

        <p>
          Better reward opportunities
        </p>

      </div>

    </div>


    <button
      class="btn full"
      style="margin-top:12px"
      onclick="closeModal()"
      type="button">

      CLAIM REWARDS

    </button>

  `;


  openModal();


  createConfetti();

}


/* =========================================================
   CHALLENGE COMPLETE
   ========================================================= */

function showChallengeComplete(
  score,
  ve
) {

  const modal =
    document.getElementById(
      "modalBox"
    );


  if (
    !modal
  ) {

    return;

  }


  modal.innerHTML = `

    <div class="modal-title">
      CHALLENGE COMPLETE!
    </div>


    <div class="modal-subtitle">
      Outstanding! 🎉
    </div>


    <div class="trophy">
      🏆
    </div>


    <div>

      <span style="color:#aaa">
        FINAL SCORE
      </span>

      <div class="final-score">
        ${score}

        ${
          score >= 100
            ? `<span class="best-badge">NEW BEST!</span>`
            : ""
        }

      </div>

    </div>


    <div class="reward-popup-grid">

      <div class="popup-reward">

        <b>
          +${score}
        </b>

        <span>
          Experience
        </span>

      </div>


      <div class="popup-reward">

        <b>
          +${ve}
        </b>

        <span>
          Your Reward
        </span>

      </div>

    </div>


    <button
      class="btn full"
      onclick="
        closeModal();
        render('game');
      "
      type="button">

      PLAY AGAIN

    </button>


    <button
      class="btn-secondary full"
      style="margin-top:8px"
      onclick="
        closeModal();
        render('home');
      "
      type="button">

      BACK TO DASHBOARD

    </button>

  `;


  openModal();


  createConfetti();

}


/* =========================================================
   CONFETTI
   ========================================================= */

function createConfetti() {

  const pieces =
    32;


  for (
    let i = 0;
    i < pieces;
    i++
  ) {

    const piece =
      document.createElement(
        "div"
      );


    piece.className =
      "confetti";


    const colors = [
      "#ffd447",
      "#9d55ff",
      "#5be05d",
      "#ff7a2f",
      "#fff"
    ];


    piece.style.background =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    piece.style.left =
      `${Math.random()*100}%`;


    piece.style.animationDelay =
      `${Math.random()*.5}s`;


    piece.style.transform =
      `rotate(${Math.random()*360}deg)`;


    document.body.appendChild(
      piece
    );


    setTimeout(
      () => piece.remove(),
      2300
    );

  }

}


/* =========================================================
   MODAL
   ========================================================= */

function openModal() {

  const layer =
    document.getElementById(
      "modalLayer"
    );


  if (
    layer
  ) {

    layer.classList.add(
      "show"
    );

  }

}


function closeModal() {

  const layer =
    document.getElementById(
      "modalLayer"
    );


  if (
    layer
  ) {

    layer.classList.remove(
      "show"
    );

  }

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


  if (
    !toast
  ) {

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
      () => {

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
      item => {

        item.classList.toggle(
          "active",
          item.dataset.route === route
        );

      }
    );

}


/* =========================================================
   RENDER
   ========================================================= */

function render(
  route = "home"
) {

  const app =
    document.getElementById(
      "app"
    );


  if (
    !app
  ) {

    return;

  }


  /* stop game when leaving it */

  if (
    state.currentRoute === "game" &&
    route !== "game"
  ) {

    gameRunning =
      false;

    clearInterval(
      gameTimer
    );

    clearInterval(
      spawnTimer
    );

  }


  state.currentRoute =
    route;


  setActiveNav(
    route
  );


  switch (
    route
  ) {

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

      setupGameControls();

      break;


    default:

      app.innerHTML =
        home();

  }


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}


/* =========================================================
   GAME CONTROLS
   ========================================================= */

function setupGameControls() {

  setupMouseControl();

  setupTouchControl();

  setupKeyboardControl();

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeApp() {

  updateLevel();

  render(
    "home"
  );


  /* NAV */

  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      item => {

        item.addEventListener(
          "click",
          () => {

            render(
              item.dataset.route
            );

          }
        );

      }
    );


  /* NOTIFICATIONS */

  const notifyBtn =
    document.getElementById(
      "notifyBtn"
    );


  if (
    notifyBtn
  ) {

    notifyBtn.addEventListener(
      "click",
      () => {

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


  if (
    menuBtn
  ) {

    menuBtn.addEventListener(
      "click",
      () => {

        showToast(
          "VELOOP Menu ✨"
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
