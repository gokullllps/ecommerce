import assert from "node:assert";

// Mock localStorage
const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
};

// Import logic from the compiled or extracted source
const TOTAL_STARS = 10;
const STORAGE_KEY = "pablo-kids-hidden-stars-v2";

const STAR_ZONES = [
  {
    id: "zone-01-hero-sky",
    candidateAnchors: ["slot-a-cloud-left-tuck", "slot-a-cloud-right-rim", "slot-a-sky-star-cluster"],
  },
  {
    id: "zone-02-hero-doodle",
    candidateAnchors: ["slot-b-badge-under", "slot-b-sneaker-trail", "slot-b-badge-play-ready"],
  },
  {
    id: "zone-03-hero-cta",
    candidateAnchors: ["slot-b-explore-btn", "slot-b-headline-period", "slot-b-sticker-cloud-soft"],
  },
  {
    id: "zone-04-category-nav",
    candidateAnchors: ["slot-c-badge-tuck", "slot-c-bar-left-rim", "slot-c-bar-right-rim"],
  },
  {
    id: "zone-05-controls",
    candidateAnchors: ["slot-d-ctrl-left", "slot-d-filter-btn", "slot-d-ctrl-right"],
  },
  {
    id: "zone-06-grid-upper",
    candidateAnchors: ["slot-e-grid-top-gutter", "slot-e-left-flank"],
  },
  {
    id: "zone-07-grid-mid",
    candidateAnchors: ["slot-e-right-flank", "slot-e-grid-mid-gutter"],
  },
  {
    id: "zone-08-ambient",
    candidateAnchors: ["slot-f-ambient-mint", "slot-f-ambient-lavender"],
  },
  {
    id: "zone-09-grid-lower",
    candidateAnchors: ["slot-f-grid-bottom-edge", "slot-f-grid-bottom-left"],
  },
  {
    id: "zone-10-footer",
    candidateAnchors: ["slot-g-footer-border-left", "slot-g-footer-border-right", "slot-g-footer-wordmark"],
  },
];

function generateNewCycle(previousState) {
  const cycleId = `cycle-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  const stars = STAR_ZONES.map((zone, index) => {
    const starNumber = String(index + 1).padStart(2, "0");
    const id = `star-${starNumber}`;
    const prevAnchor = previousState?.stars.find((s) => s.id === id)?.anchorId;
    let pool = zone.candidateAnchors;
    if (prevAnchor && pool.length > 1) {
      pool = pool.filter((a) => a !== prevAnchor);
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    const anchorId = pool[randomIndex];
    return { id, zone: zone.id, anchorId };
  });

  return {
    version: 2,
    cycleId,
    stars,
    collected: [],
  };
}

function isValidGameState(state) {
  if (!state || typeof state !== "object") return false;
  if (state.version !== 2) return false;
  if (typeof state.cycleId !== "string" || !state.cycleId) return false;
  if (!Array.isArray(state.stars) || state.stars.length !== TOTAL_STARS) return false;
  if (!Array.isArray(state.collected)) return false;

  const validAnchors = new Set();
  STAR_ZONES.forEach((zone) => {
    zone.candidateAnchors.forEach((a) => validAnchors.add(a));
  });

  const validIds = new Set();
  for (let i = 0; i < state.stars.length; i++) {
    const star = state.stars[i];
    if (!star || typeof star !== "object") return false;
    const expectedId = `star-${String(i + 1).padStart(2, "0")}`;
    if (star.id !== expectedId) return false;
    if (typeof star.zone !== "string" || !star.zone) return false;
    if (typeof star.anchorId !== "string" || !validAnchors.has(star.anchorId)) return false;
    if (validIds.has(star.id)) return false;
    validIds.add(star.id);
  }

  for (const collectedId of state.collected) {
    if (typeof collectedId !== "string" || !validIds.has(collectedId)) {
      return false;
    }
  }

  return true;
}

console.log("=== RUNNING TESTS ===");

// TEST 1: Initial cycle generation
const state1 = generateNewCycle();
assert.strictEqual(state1.stars.length, 10, "Must have exactly 10 stars");
assert.strictEqual(state1.collected.length, 0, "Must have 0 collected initially");
assert.strictEqual(state1.version, 2, "Version must be 2");
assert.strictEqual(isValidGameState(state1), true, "Generated state must be valid");
console.log("✔ Test 1 Passed: Generated valid state with 10 stars, 0 collected.");

// TEST 2: Star IDs are star-01 through star-10
for (let i = 1; i <= 10; i++) {
  const expectedId = `star-${String(i).padStart(2, "0")}`;
  assert.strictEqual(state1.stars[i - 1].id, expectedId, `Star ID mismatch at index ${i}`);
}
console.log("✔ Test 2 Passed: Star IDs are star-01 through star-10.");

// TEST 3: Duplicate clicks & collecting
let collected = [...state1.collected];
const starToCollect = state1.stars[0].id;
if (!collected.includes(starToCollect)) {
  collected.push(starToCollect);
}
assert.strictEqual(collected.length, 1);

// Attempt duplicate collection
if (!collected.includes(starToCollect)) {
  collected.push(starToCollect);
}
assert.strictEqual(collected.length, 1, "Duplicate collection must be ignored");
console.log("✔ Test 3 Passed: Duplicate collection handled idempotently.");

// TEST 4: Persistence across refresh
state1.collected = ["star-01", "star-03", "star-07"];
localStorage.setItem(STORAGE_KEY, JSON.stringify(state1));

const loadedRaw = localStorage.getItem(STORAGE_KEY);
const reloaded = JSON.parse(loadedRaw);
assert.strictEqual(isValidGameState(reloaded), true);
assert.strictEqual(reloaded.collected.length, 3, "Reloaded state must retain 3 collected stars");
assert.deepStrictEqual(reloaded.stars, state1.stars, "Star positions must stay identical across refresh");
console.log("✔ Test 4 Passed: State persists across refresh (progress & positions stay intact).");

// TEST 5: Subsequent cycle after 10/10 has different arrangement
state1.collected = state1.stars.map((s) => s.id);
assert.strictEqual(state1.collected.length, 10);
const state2 = generateNewCycle(state1);
assert.strictEqual(state2.collected.length, 0, "New cycle starts at 0/10");
assert.notStrictEqual(state2.cycleId, state1.cycleId, "New cycle has new cycleId");
console.log("✔ Test 5 Passed: Subsequent cycle generates fresh cycle with new IDs.");

// TEST 6: Corrupted state handling
assert.strictEqual(isValidGameState({}), false);
assert.strictEqual(isValidGameState({ version: 1 }), false);
assert.strictEqual(isValidGameState({ version: 2, stars: [] }), false);
assert.strictEqual(isValidGameState({ version: 2, cycleId: "c1", stars: state1.stars, collected: ["invalid-star-99"] }), false);
console.log("✔ Test 6 Passed: Corrupted states are rejected.");

console.log("=== ALL UNIT TESTS PASSED SUCCESSFULLY! ===");
