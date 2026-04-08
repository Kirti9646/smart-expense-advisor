// static/main.js

async function loadAll() {
  await loadTransactions();
  await loadMonthly();
  await loadCategory();
}

// ADD EXPENSE
async function addExpense() {
  const data = {
    date: document.getElementById('date').value,
    category: document.getElementById('category').value,
    amount: parseFloat(document.getElementById('amount').value),
    notes: document.getElementById('notes').value
  };

  const res = await fetch('/api/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Expense saved successfully!");
    loadAll();
    document.getElementById('expenseForm').reset();
  }
  return false;
}

// LOAD RECENT TRANSACTIONS
async function loadTransactions() {
  const res = await fetch('/api/expenses');
  const data = await res.json();

  const tbody = document.getElementById('txTable');
  tbody.innerHTML = "";

  data.slice(0, 30).forEach(row => {
    tbody.innerHTML += `
      <tr class="border-b">
        <td class="p-2">${row.date}</td>
        <td class="p-2">${row.category}</td>
        <td class="p-2">₹${row.amount}</td>
        <td class="p-2">${row.notes}</td>
      </tr>`;
  });
}

let monthlyChart = null;
let catChart = null;

// MONTHLY CHART
async function loadMonthly() {
  const res = await fetch('/api/monthly');
  const data = await res.json();

  const labels = data.map(x => x.label);
  const values = data.map(x => x.amount);

  if (monthlyChart) monthlyChart.destroy();

  const ctx = document.getElementById('monthlyChart').getContext('2d');
  monthlyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Monthly Spend",
        data: values,
        backgroundColor: "#C9A856",
      }]
    }
  });
}

// CATEGORY CHART
async function loadCategory() {
  const res = await fetch('/api/category');
  const data = await res.json();

  const labels = data.map(x => x.category);
  const values = data.map(x => x.total);

  if (catChart) catChart.destroy();

  const ctx = document.getElementById('catChart').getContext('2d');
  catChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#C9A856", "#82B29A", "#6374AE",
          "#E6A157", "#D66D75", "#C779D0"
        ]
      }]
    }
  });
}

// PREDICTION
async function doPredict() {
  const res = await fetch('/api/predict');
  const d = await res.json();

  if (d.error) {
    document.getElementById('predictionBox').innerText = "Not enough data!";
    return;
  }

  document.getElementById('predictionBox').innerHTML = `
    <b>Next Month Prediction:</b> ₹${d.predicted_next_month}<br>
    <b>Advice:</b> ${d.advice}
  `;
}

window.onload = loadAll;
