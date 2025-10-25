let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function updateTotal() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  document.getElementById('total-amount').textContent = total.toFixed(2);
}

// Render categories with icons and total
function renderCategories() {
  const container = document.querySelector('.category-cards');
  container.innerHTML = '';
  const icons = {
    "Food & Drinks": "🍔",
    "Transport": "🚗",
    "Entertainment": "🎬",
    "Utilities": "💡",
    "Health & Fitness": "💪",
    "Home": "🏠",
    "Groceries": "🛒",
    "Shopping": "🛍",
    "Others": "📦"
  };

  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  for (const category in icons) {
    const spent = categoryTotals[category] || 0;
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `<h3>${icons[category]} ${category}</h3>
                      <p>$${spent.toFixed(2)}</p>`;
    container.appendChild(card);
  }
}

// Render expense history
function renderHistory() {
  const historyList = document.getElementById('expense-list');
  historyList.innerHTML = '';
  expenses.forEach((e, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${e.date}</span>
      <span>${e.name}</span>
      <span>${e.category}</span>
      <span>$${e.amount.toFixed(2)}</span>
      <div>
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </div>`;
    historyList.appendChild(li);
  });
}

function displayExpenses() {
  updateTotal();
  renderCategories();
  renderHistory();
}

function editExpense(index) {
  const e = expenses[index];
  document.getElementById('expense-name').value = e.name;
  document.getElementById('expense-amount').value = e.amount;
  document.getElementById('expense-category').value = e.category;
  document.getElementById('expense-paidby').value = e.paidBy;
  document.getElementById('expense-sharedwith').value = e.sharedWith;
  deleteExpense(index);
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  displayExpenses();
}

// Add Expense
document.getElementById('expense-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('expense-name').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const category = document.getElementById('expense-category').value;
  const paidBy = document.getElementById('expense-paidby').value || 'Unknown';
  const sharedWith = document.getElementById('expense-sharedwith').value;
  
  expenses.push({ name, amount, category, paidBy, sharedWith, date: new Date().toLocaleDateString() });
  localStorage.setItem('expenses', JSON.stringify(expenses));
  
  displayExpenses();
  this.reset();
});

function splitTotal() {
  const membersInput = document.getElementById('members').value;
  const members = membersInput.split(',').map(m => m.trim()).filter(m => m !== '');
  const splitList = document.getElementById('split-list');
  splitList.innerHTML = '';

  if (members.length === 0) {
    alert("Please enter at least one member.");
    return;
  }

  if (expenses.length === 0) {
    alert("No expenses added yet.");
    return;
  }

  // ✅ Get today's date in local format (same format used in expenses)
  const today = new Date().toLocaleDateString();

  // ✅ Filter only today's expenses
  const todayExpenses = expenses.filter(e => e.date === today);

  if (todayExpenses.length === 0) {
    alert("No expenses found for today.");
    return;
  }

  // ✅ Calculate today's total
  const total = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  // ✅ Use the payer of the last expense today
  const payer = todayExpenses[todayExpenses.length - 1].paidBy || 'Unknown';

  // Add payer if not in members list
  if (!members.includes(payer)) members.push(payer);

  const perPerson = total / members.length;

  members.forEach(member => {
    const li = document.createElement('li');
    if (member === payer) {
      const owed = total - perPerson;
      li.textContent = `${member} is owed $${owed.toFixed(2)}`;
    } else {
      li.textContent = `${member} owes $${perPerson.toFixed(2)}`;
    }
    splitList.appendChild(li);
  });
}
