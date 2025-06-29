function getInputArray(id) {
  const input = document.getElementById(id).value;
  return input
    .split(",")
    .map(s => s.trim())
    .map(Number)
    .filter(n => !isNaN(n));
}

function maxValueWithBudget(costArrays, valueArrays, totalMoney) {
  const n = costArrays.length; // number of categories
  const W = Math.floor(totalMoney);

  // Prefix sums for costs and values per category
  const prefixCosts = costArrays.map(arr => {
    const prefix = [0];
    arr.forEach(c => prefix.push(prefix[prefix.length - 1] + c));
    return prefix;
  });
  const prefixValues = valueArrays.map(arr => {
    const prefix = [0];
    arr.forEach(v => prefix.push(prefix[prefix.length - 1] + v));
    return prefix;
  });

  // dp[i][w] = max value using first i categories with budget w
  // We'll use 2D DP: categories x budget
  // Also keep track of choices: how many items chosen from category i at dp[i][w]
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  const choice = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const maxK = prefixCosts[i - 1].length - 1;
    for (let w = 0; w <= W; w++) {
      let bestVal = dp[i - 1][w];
      let bestK = 0;
      for (let k = 0; k <= maxK; k++) {
        const costK = prefixCosts[i - 1][k];
        if (costK <= w) {
          const valK = prefixValues[i - 1][k];
          const candidate = dp[i - 1][w - costK] + valK;
          if (candidate > bestVal) {
            bestVal = candidate;
            bestK = k;
          }
        } else {
          break;
        }
      }
      dp[i][w] = bestVal;
      choice[i][w] = bestK;
    }
  }

  // Recover purchases chosen per category by backtracking
  let remBudget = W;
  const purchases = new Array(n).fill(0);
  for (let i = n; i >= 1; i--) {
    const k = choice[i][remBudget];
    purchases[i - 1] = k;
    remBudget -= prefixCosts[i - 1][k];
  }

  return {
    maxValue: dp[n][W],
    purchasesPerCategory: purchases,
  };
}

function readAllInputs() {
  const heroesCost = getInputArray("heroesCost");
  const heroesVal = getInputArray("heroesVal");
  
  const buildingCost = getInputArray("buildingCost");
  const buildingVal = getInputArray("buildingVal");
  
  const fightingCost = getInputArray("fightingCost");
  const fightingVal = getInputArray("fightingVal");
  
  const builderPotionCost = getInputArray("builderPotionCost");
  const builderPotionVal = getInputArray("builderPotionVal");
  
  const researchPotionCost = getInputArray("researchPotionCost");
  const researchPotionVal = getInputArray("researchPotionVal");

  const resourcePotionCost = getInputArray("researchPotionCost");
  const resourcePotionVal = getInputArray("researchPotionVal");



  const totalMoneyInput = document.getElementById("totalMoney").value;
  const totalMoney = parseFloat(totalMoneyInput) || 0; // convert to number, default 0

  console.log("Total Money:", totalMoney);
  console.log("Heroes Cost:", heroesCost);
  console.log("Heroes Hours Saved:", heroesVal);
  console.log("Building Cost:", buildingCost);
  console.log("Building Hours Saved:", buildingVal);
  console.log("Fighting Cost:", fightingCost);
  console.log("Fighting Hours Saved:", fightingVal);
  console.log("Builder Potion Cost:", builderPotionCost);
  console.log("Builder Potion Hours Saved:", builderPotionVal);
  console.log("Research Potion Cost:", researchPotionCost);
  console.log("Research Potion Hours Saved:", researchPotionVal);

  // Now you can do calculations with these arrays!
  const dict = {
    0: "Books of Heroes",
    1: "Books of Building",
    2: "Books of Fighting",
    3: "Builder Potions",
    4: "Research Potions"
  }
  const cost = [heroesCost, buildingCost, fightingCost, builderPotionCost, researchPotionCost, resourcePotionCost]
  const values = [heroesVal, buildingVal, fightingVal, builderPotionVal, researchPotionVal, resourcePotionVal]
  
  const result = maxValueWithBudget(cost, values, totalMoney);
  console.log("Max saved hours:", result.maxValue);
  console.log("Purchases per category:", result.purchasesPerCategory);

  let totalSpent = 0;

  result.purchasesPerCategory.forEach((count, i) => {
    // Sum up the first `count` costs from each category
    totalSpent += cost[i].slice(0, count).reduce((a, b) => a + b, 0);
  });


  const resultDiv = document.getElementById("result");

  let output = `<h2>Max Saved Hours: ${result.maxValue}</h2>`;
  output += `<h3>Total Money Spent: ${totalSpent}</h3>`;
  output += `<h3>Purchases per category:</h3><ul>`;

  result.purchasesPerCategory.forEach((count, i) => {
    output += `<li>${dict[i]}: ${count} purchases</li>`;
  });

  output += `</ul>`;

  resultDiv.innerHTML = output;
}