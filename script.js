function calculate() {
  // Get values from inputs
  const n1 = parseInt(document.getElementById("num1").value) || 0;
  const n2 = parseInt(document.getElementById("num2").value) || 0;
  const n3 = parseInt(document.getElementById("num3").value) || 0;
  const n4 = parseInt(document.getElementById("num4").value) || 0;

  // Example calculation: sum
  const sum = n1 + n2 + n3 + n4;

  // Output the result
  document.getElementById("result").textContent = `Sum: ${sum}`;
}