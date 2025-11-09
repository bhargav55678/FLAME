// flame.js - safe, robust FLAME implementation

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("flameForm");
  const resetBtn = document.getElementById("resetBtn");
  const resultText = document.getElementById("resultText");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const n1 = document.getElementById("name1").value;
    const n2 = document.getElementById("name2").value;
    const result = computeFlame(n1, n2);
    resultText.textContent = result;
  });

  resetBtn.addEventListener("click", () => {
    document.getElementById("name1").value = "";
    document.getElementById("name2").value = "";
    resultText.textContent = "Result will appear here";
  });
});

/**
 * Clean name: remove non-letters and spaces, toLowerCase
 * @param {string} s
 * @returns {string}
 */
function cleanName(s) {
  if (!s) return "";
  // keep letters only (Unicode letters), remove spaces and punctuation
  // Using simple replacement for typical names:
  return s.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Proper FLAMES elimination method:
 * 1. Remove common characters between names.
 * 2. Count remaining letters.
 * 3. Use elimination on ['F','L','A','M','E','S'] until one left.
 * @param {string} name1
 * @param {string} name2
 * @returns {string} relationship phrase
 */
function computeFlame(name1, name2) {
  const a = cleanName(name1);
  const b = cleanName(name2);

  if (a.length === 0 || b.length === 0) {
    return "Please enter both valid names (letters only).";
  }

  // Convert to arrays to allow marking used letters
  const arr1 = a.split('');
  const arr2 = b.split('');
  // Remove common letters by marking matched ones
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        arr1[i] = null; // mark removed
        arr2[j] = null;
        break;
      }
    }
  }

  // Count remaining (non-null) letters
  const remainingCount = (arr1.filter(Boolean).length + arr2.filter(Boolean).length);

  if (remainingCount === 0) {
    // special-case: all letters matched
    return "All letters matched — close bond! (Try different names)";
  }

  // FLAMES elimination array
  let flames = ['F','L','A','M','E','S'];

  // Eliminate until one remains
  let idx = 0;
  while (flames.length > 1) {
    // index to remove: (idx + remainingCount - 1) % flames.length
    const removeIndex = ( (idx + remainingCount - 1) % flames.length );
    flames.splice(removeIndex, 1);
    // next index is same as removeIndex (since list shifted)
    idx = removeIndex % flames.length;
  }

  const map = {
    F: 'Friends',
    L: 'Lovers',
    A: 'Affection',
    M: 'Marriage',
    E: 'Enemies',
    S: 'Siblings'
  };

  const letter = flames[0];
  const relation = map[letter] || 'Unknown';

  return `Your relationship: ${relation} (${letter})`;
}
