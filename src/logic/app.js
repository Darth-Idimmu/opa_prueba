// Módulo de configuración
const Config = {
  elements: [
    { name: 'E1', weight: 5, calories: 3 },
    { name: 'E2', weight: 3, calories: 5 },
    { name: 'E3', weight: 5, calories: 2 },
    { name: 'E4', weight: 1, calories: 8 },
    { name: 'E5', weight: 2, calories: 3 }
  ],
  selectors: {
    minCalories: '#minCalories',
    maxWeight: '#maxWeight',
    results: '#results',
    combinationsList: '#combinationsList'
  }
};

// Módulo de utilidades
const Utils = {
  getInputValue: (selector) => parseInt(document.querySelector(selector).value),
  showElement: (selector) => document.querySelector(selector).style.display = 'block',
  clearElement: (selector) => document.querySelector(selector).innerHTML = ''
};

// Módulo principal de cálculo
const CombinationCalculator = {
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelector('button').addEventListener('click', this.handleCalculate);
    });
  },

  handleCalculate: () => {
    const minCal = Utils.getInputValue(Config.selectors.minCalories);
    const maxW = Utils.getInputValue(Config.selectors.maxWeight);
    
    if (!minCal || !maxW) {
      alert("⚠️ Completa ambos campos requeridos");
      return;
    }

    const validCombinations = CombinationCalculator.calculateValidCombinations(minCal, maxW);
    CombinationCalculator.displayResults(validCombinations);
  },

  calculateValidCombinations: (minCal, maxW) => {
    const allCombinations = [];
    
    for (let i = 1; i < 32; i++) {
      const combination = [];
      let totalWeight = 0;
      let totalCalories = 0;
      
      for (let j = 0; j < 5; j++) {
        if (i & (1 << j)) {
          combination.push(Config.elements[j]);
          totalWeight += Config.elements[j].weight;
          totalCalories += Config.elements[j].calories;
        }
      }

      if (totalCalories >= minCal && totalWeight <= maxW) {
        allCombinations.push({
          items: combination,
          weight: totalWeight,
          calories: totalCalories
        });
      }
    }

    return allCombinations.sort((a, b) => 
      a.weight === b.weight ? b.calories - a.calories : a.weight - b.weight
    );
  },

  displayResults: (combinations) => {
    Utils.clearElement(Config.selectors.combinationsList);
    
    if (combinations.length > 0) {
      Utils.showElement(Config.selectors.results);
      combinations.forEach(comb => {
        const combinationHTML = `
          <div class="col-12">
            <div class="card combination-card mb-2">
              <div class="card-body">
                <h5 class="card-title">${comb.items.map(e => e.name).join(' + ')}</h5>
                <p class="card-text">
                  📦 Peso total: ${comb.weight} kg<br>
                  🔥 Calorías totales: ${comb.calories}
                </p>
              </div>
            </div>
          </div>
        `;
        document.querySelector(Config.selectors.combinationsList)
          .insertAdjacentHTML('beforeend', combinationHTML);
      });
    } else {
      alert("😞 No se encontraron combinaciones válidas");
    }
  }
};

// Inicializar la aplicación
CombinationCalculator.init();