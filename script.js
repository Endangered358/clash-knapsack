document.getElementById("csvFile").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function () {
    const lines = reader.result.split("\n").map(l => l.split(","));
    let html = "<table>";
    lines.forEach(row => {
      html += "<tr>" + row.map(cell => `<td>${cell}</td>`).join("") + "</tr>";
    });
    html += "</table>";
    document.getElementById("output").innerHTML = html;
  };
  reader.readAsText(e.target.files[0]);
});