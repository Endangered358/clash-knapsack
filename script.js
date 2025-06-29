function getInputArray(id) {
  const input = document.getElementById(id).value;
  return input
    .split(",")
    .map(s => s.trim())
    .map(Number)
    .filter(n => !isNaN(n));
}

function getInputNumber(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function maxValueWithBudget(costArray, valueArrays, totalMoney) {
  const n = costArray.length;
  const W = Math.floor(totalMoney);

  const prefixValues = valueArrays.map(arr => {
    const prefix = [0];
    arr.forEach(v => prefix.push(prefix[prefix.length - 1] + v));
    return prefix;
  });

  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  const choice = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const unitCost = costArray[i - 1];
    const maxItems = valueArrays[i - 1].length;

    for (let w = 0; w <= W; w++) {
      let bestVal = dp[i - 1][w];
      let bestK = 0;
      for (let k = 0; k <= maxItems; k++) {
        const costK = k * unitCost;
        if (costK > w) break;

        const valK = prefixValues[i - 1][k];
        const candidate = dp[i - 1][w - costK] + valK;
        if (candidate > bestVal) {
          bestVal = candidate;
          bestK = k;
        }
      }
      dp[i][w] = bestVal;
      choice[i][w] = bestK;
    }
  }

  let remBudget = W;
  const purchases = new Array(n).fill(0);
  for (let i = n; i >= 1; i--) {
    const k = choice[i][remBudget];
    purchases[i - 1] = k;
    remBudget -= k * costArray[i - 1];
  }

  return {
    maxValue: dp[n][W],
    purchasesPerCategory: purchases,
  };
}

function readAllInputs() {
  const heroesCost = getInputNumber("heroesCost");
  const heroesVal = getInputArray("heroesVal");

  const buildingCost = getInputNumber("buildingCost");
  const buildingVal = getInputArray("buildingVal");

  const fightingCost = getInputNumber("fightingCost");
  const fightingVal = getInputArray("fightingVal");

  const builderPotionCost = getInputNumber("builderPotionCost");
  const builderPotionVal = getInputArray("builderPotionVal");

  const researchPotionCost = getInputNumber("researchPotionCost");
  const researchPotionVal = getInputArray("researchPotionVal");

  const resourcePotionCost = getInputNumber("resourcePotionCost");
  const resourcePotionVal = getInputArray("resourcePotionVal");

  const totalMoney = getInputNumber("totalMoney");

  const cost = [
    heroesCost,
    buildingCost,
    fightingCost,
    builderPotionCost,
    researchPotionCost,
    resourcePotionCost
  ];

  const values = [
    heroesVal,
    buildingVal,
    fightingVal,
    builderPotionVal,
    researchPotionVal,
    resourcePotionVal
  ];

  const dict = {
    0: "Books of Heroes",
    1: "Books of Building",
    2: "Books of Fighting",
    3: "Builder Potions",
    4: "Research Potions",
    5: "Resource Potions"
  };

  const result = maxValueWithBudget(cost, values, totalMoney);

  let totalSpent = 0;
  result.purchasesPerCategory.forEach((count, i) => {
    totalSpent += count * cost[i];
  });

  const resultDiv = document.getElementById("result");
  let output = `<h2>Max Saved Hours: ${result.maxValue}</h2>`;
  output += `<h3>Total Money Spent: ${totalSpent}</h3>`;
  output += `<h3>Purchases per category:</h3><ul>`;
  result.purchasesPerCategory.forEach((count, i) => {
    output += `<li>${dict[i]}: ${count} purchase${count !== 1 ? 's' : ''}</li>`;
  });
  output += `</ul>`;

  resultDiv.innerHTML = output;
}