/* ================== СОСТОЯНИЕ ИГРЫ ================== */

let gold = 0;

let enemy = {
  level: 1,
  hp: 100,
  maxHp: 100
};

let clickDamage = 1;

/* ------------------ ГЕРОИ ------------------ */
let heroes = [
  { name: "Alexa", level: 0, baseCost: 100, damage: 2 },
  { name: "Natalia", level: 0, baseCost: 150, damage: 4 },
  { name: "Mercedes", level: 0, baseCost: 250, damage: 8 }
];

/* ---------------- УЛУЧШЕНИЯ ---------------- */
let upgrades = [
  { name: "Меч", level: 0, baseCost: 50, bonus: 1 },
  { name: "Кинжал", level: 0, baseCost: 200, bonus: 3 }
];

/* ================== СОХРАНЕНИЕ ================== */

function save() {
  localStorage.setItem("gold", gold);
  localStorage.setItem("enemy", JSON.stringify(enemy));
  localStorage.setItem("heroes", JSON.stringify(heroes));
  localStorage.setItem("upgrades", JSON.stringify(upgrades));
  localStorage.setItem("clickDamage", clickDamage);
}

function load() {
  const g = localStorage.getItem("gold");
  const e = localStorage.getItem("enemy");
  const h = localStorage.getItem("heroes");
  const u = localStorage.getItem("upgrades");
  const c = localStorage.getItem("clickDamage");

  if (g !== null) gold = Number(g);
  if (e) enemy = JSON.parse(e);
  if (h) heroes = JSON.parse(h);
  if (u) upgrades = JSON.parse(u);
  if (c) clickDamage = Number(c);
}

/* ========== ФИКС NaN / СТАРЫХ СОХРАНЕНИЙ ========== */

function fixData() {
  heroes.forEach(hero => {
    if (!hero.baseCost || isNaN(hero.baseCost)) hero.baseCost = 100;
    if (!hero.level || isNaN(hero.level)) hero.level = 0;
  });

  upgrades.forEach(upg => {
    if (!upg.baseCost || isNaN(upg.baseCost)) upg.baseCost = 50;
    if (!upg.level || isNaN(upg.level)) upg.level = 0;
  });

  if (!clickDamage || isNaN(clickDamage)) clickDamage = 1;
}

/* ================== ФОРМУЛЫ ================== */

function heroCost(hero) {
  return Math.floor(hero.baseCost * Math.pow(1.25, hero.level));
}

function upgradeCost(upg) {
  return Math.floor(upg.baseCost * Math.pow(1.3, upg.level));
}

function totalDamage() {
  let dmg = clickDamage;
  heroes.forEach(h => dmg += h.level * h.damage);
  return dmg;
}

/* ================== БОЙ ================== */

function hitEnemy() {
  enemy.hp -= totalDamage();

  if (enemy.hp <= 0) killEnemy();

  updateUI();
  save();
}

function killEnemy() {
  gold += Math.floor(enemy.maxHp / 10);

  enemy.level++;
  enemy.maxHp = Math.floor(enemy.maxHp * 1.3);
  enemy.hp = enemy.maxHp;
}

/* ================== ПОКУПКИ ================== */

function buyHero(i) {
  const hero = heroes[i];
  const cost = heroCost(hero);

  if (gold >= cost) {
    gold -= cost;
    hero.level++;
    updateUI();
    save();
  }
}

function buyUpgrade(i) {
  const upg = upgrades[i];
  const cost = upgradeCost(upg);

  if (gold >= cost) {
    gold -= cost;
    upg.level++;
    clickDamage += upg.bonus;
    updateUI();
    save();
  }
}

/* ================== UI ================== */

function updateUI() {
  document.getElementById("gold").textContent = gold;
  document.getElementById("dragonLevel").textContent = enemy.level;
  document.getElementById("hp").textContent = enemy.hp;
  document.getElementById("maxHp").textContent = enemy.maxHp;

  document.getElementById("hpFill").style.width =
    (enemy.hp / enemy.maxHp * 100) + "%";

  /* ГЕРОИ */
  const heroesDiv = document.getElementById("heroes");
  heroesDiv.innerHTML = "";
  heroes.forEach((h, i) => {
    heroesDiv.innerHTML += `
      <div class="hero-card">
        <b>${h.name}</b><br>
        Уровень: ${h.level}<br>
        Цена: ${heroCost(h)} 💰<br>
        <button onclick="buyHero(${i})">HIRE</button>
      </div>
    `;
  });

  /* УЛУЧШЕНИЯ */
  const upgDiv = document.getElementById("upgrades");
  upgDiv.innerHTML = "";
  upgrades.forEach((u, i) => {
    upgDiv.innerHTML += `
      <div class="hero-card">
        <b>${u.name}</b><br>
        Уровень: ${u.level}<br>
        Цена: ${upgradeCost(u)} 💰<br>
        <button onclick="buyUpgrade(${i})">BUY</button>
      </div>
    `;
  });
}

/* ================== ИНИЦИАЛИЗАЦИЯ ================== */

load();
fixData();
updateUI();

document.getElementById("enemy").addEventListener("click", hitEnemy);
