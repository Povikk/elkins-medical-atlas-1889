const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const baseUrl = "http://127.0.0.1:4173/";
const outputDir = path.resolve(__dirname, "../tmp/site-qa");
fs.mkdirSync(outputDir, { recursive: true });

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function finishIntervention(page, id, choiceMode) {
  await page.evaluate((flowId) => window.start(flowId), id);
  for (let guard = 0; guard < 60; guard += 1) {
    if ((await page.locator("#flow").innerText()).includes("Intervention terminée")) return;
    const choices = page.locator("#flow .choice");
    const choiceCount = await choices.count();
    if (choiceCount) {
      const zone = await page.evaluate(()=>!!zoneKeyForStep(flows[currentFlow].steps[stepIndex]));
      await choices.nth(choiceMode === "last" ? choiceCount - 1 : 0).click();
      if(zone)await page.getByRole('button',{name:'Valider les zones',exact:true}).click();
      continue;
    }
    const next = page.locator("#flow .next");
    check(await next.count(), `Bouton suivant absent pour ${id}`);
    await next.click();
  }
  throw new Error(`Parcours trop long ou bloqué: ${id}`);
}

async function finishSurgery(page, id) {
  await page.evaluate((surgeryId) => window.openSurgery(surgeryId), id);
  for (let guard = 0; guard < 20; guard += 1) {
    if ((await page.locator("#surgeryFlow").innerText()).includes("Scène chirurgicale terminée")) return;
    const next = page.locator("#surgeryFlow .next");
    check(await next.count(), `Bouton suivant absent pour la chirurgie ${id}`);
    await next.click();
  }
  throw new Error(`Parcours chirurgical bloqué: ${id}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 2560, height: 1440 } });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  check((await page.locator("html").getAttribute("data-theme")) === "dark", "Le mode sombre n'est pas le thème par défaut");
  check(await page.getByRole("heading", { name: "Elkins & Elkins Medical Atlas" }).isVisible(), "Titre absent");
  check(await page.locator("#home button").count() === 6, "Accueil incomplet");
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Débordement horizontal en 2K");
  await page.screenshot({ path: path.join(outputDir, "desktop-2k.png"), fullPage: true });

  const themeButton = page.locator("#themeToggle");
  if ((await page.locator("html").getAttribute("data-theme")) !== "dark") await themeButton.click();
  check((await page.locator("html").getAttribute("data-theme")) === "dark", "Mode sombre non activé");
  check((await themeButton.innerText()).includes("Mode clair"), "Libellé du thème incorrect");
  await page.reload({ waitUntil: "networkidle" });
  check((await page.locator("html").getAttribute("data-theme")) === "dark", "Préférence sombre non conservée");
  await page.screenshot({ path: path.join(outputDir, "desktop-2k-dark.png"), fullPage: true });
  await page.locator("#themeToggle").click();
  check((await page.locator("html").getAttribute("data-theme")) === "light", "Retour au mode clair impossible");

  await page.getByRole("button", { name: /Lexique/ }).click();
  for (const tab of ["Médicaments", "Matériel", "Symptômes"]) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    check(await page.locator("#lexGrid > *").count() > 0, `Onglet vide: ${tab}`);
  }
  await page.getByRole("button", { name: "Médicaments", exact: true }).click();
  await page.locator("#lexSearch").fill("morphine");
  check(await page.locator("#lexGrid .lex-card").count() === 1, "Recherche du Lexique incorrecte");
  check((await page.locator("#lexGrid").innerText()).includes("Morphine"), "Résultat Morphine absent");

  await page.evaluate(() => window.showAtlas());
  check(await page.locator("#atlas").isVisible(), "Atlas anatomique absent");
  check(await page.locator("[data-anatomy-tab]").count() === 3, "Onglets anatomiques incomplets");
  await page.waitForFunction(() => {
    const image = document.querySelector("#anatomyStage img");
    return image && image.complete && image.naturalWidth > 0;
  });
  await page.locator(".anatomy-hotspot").first().hover();
  check((await page.locator("#anatomyTooltip").innerText()).includes("Crâne"), "Fiche au survol absente");
  await page.getByRole("tab", { name: "Muscles" }).click();
  check((await page.locator("#anatomyStage img").getAttribute("src")).includes("plate-8.webp"), "Planche Muscles incorrecte");
  await page.locator(".anatomy-hotspot").nth(1).focus();
  check((await page.locator("#anatomyTooltip").innerText()).includes("Deltoïde"), "Fiche au clavier absente");
  await page.getByRole("tab", { name: "Organes" }).click();
  await page.getByLabel("Afficher la fiche : Poumon droit", {exact:true}).click({ position: { x: 5, y: 5 } });
  check((await page.locator("#anatomyTooltip").innerText()).includes("Poumon droit"), "Fiche au toucher absente");
  await page.getByRole("button", { name: "Agrandir la planche" }).click();
  check(await page.locator("#anatomyDialog").evaluate(element => element.open), "Agrandissement absent");
  await page.getByRole("button", { name: "Fermer" }).click();
  await page.screenshot({ path: path.join(outputDir, "atlas-desktop.png"), fullPage: true });
  await page.locator("#themeToggle").click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outputDir, "atlas-desktop-dark.png"), fullPage: true });
  await page.locator("#themeToggle").click();

  const interventionIds = ["unknown", "gunshot", "animal", "knife", "fight", "horse", "fracture", "minor", "drowning", "head", "burn", "poison"];
  for (const id of interventionIds) {
    await finishIntervention(page, id, "first");
    await finishIntervention(page, id, "last");
  }

  await page.evaluate(() => window.start("horse"));
  const materialButton = page.locator("#flow .material-btn");
  check(await materialButton.count() === 0, "Ancien bouton Matériel encore présent");
  check(await page.locator("#flow .care-memo-cell").count() === 4, "Pense-bête absent en détaillé");
  await page.locator("#flow .compact-toggle").click();
  check(await page.locator("#flow .compact-toggle").getAttribute("aria-pressed") === "true", "Mode compact non activé");
  check(await page.locator("#flow .rp-line").count() <= 1, "Mode compact affiche trop de phrases");

  const surgeryIds = ["amputation", "major_bleeding", "deep_bullet", "abdominal", "trepanation", "infected_wound"];
  for (const id of surgeryIds) await finishSurgery(page, id);

  await page.evaluate(() => window.start("gunshot"));
  await page.evaluate(() => window.showCases());
  check(await page.locator("#flow").isHidden(), "L'ancien parcours reste visible après retour aux interventions");
  check(await page.locator("#cases").isVisible(), "La liste des interventions ne réapparaît pas");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Débordement horizontal sur mobile");
  await page.evaluate(() => window.showAtlas());
  await page.getByRole("tab", { name: "Organes" }).click();
  await page.getByLabel("Afficher la fiche : Poumon droit", {exact:true}).click({ position: { x: 5, y: 5 } });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outputDir, "atlas-mobile.png"), fullPage: true });
  await page.evaluate(() => window.goHome());
  await page.getByRole("button", { name: /Intervention/ }).click();
  check(await page.locator("#cases").isVisible(), "Liste des interventions absente sur mobile");
  await page.screenshot({ path: path.join(outputDir, "mobile-390.png"), fullPage: true });
  await page.locator("#themeToggle").click();
  check((await page.locator("html").getAttribute("data-theme")) === "dark", "Mode sombre mobile non activé");
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Débordement sombre sur mobile");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outputDir, "mobile-390-dark.png"), fullPage: true });

  check(errors.length === 0, errors.join("\n"));
  await browser.close();
  console.log(JSON.stringify({
    status: "ok",
    interventions: interventionIds.length,
    interventionRuns: interventionIds.length * 2,
    surgeries: surgeryIds.length,
    lexiconTabs: 3,
    viewports: ["2560x1440", "390x844"],
    themes: ["light", "dark"]
  }));
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
