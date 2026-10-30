// login scripts
function log() {
  let logEmail = document.getElementById("logEmail").value;
  let logPassw = document.getElementById("logPassw").value;
  // console.log(logEmail,logPassw);
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.email === logEmail) {
    if (user.password === logPassw) {
      alert("Login successfull");
      window.location.href = "dashboard.html";
    } else {
      alert("Incorrect Password");
    }
  } else {
    alert("User not found!");
    alert("Please sign up first.");
    window.location.href = "register.html";
  }
}

// signup scripts
function signUp() {
  let name = document.getElementById("sgnName").value;
  let email = document.getElementById("sgnEmail").value;
  let password = document.getElementById("sgnPassw").value;
  let confirmPassword = document.getElementById("sgnConPassw").value;

  let user = JSON.parse(localStorage.getItem("user"));
  if (user && email === user.email) {
    alert("You already have an account. Please log in.");
    window.location.href = "index.html";
    return;
  } else if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  let newUser = {
    name: name,
    email: email,
    password: password,
  };
  localStorage.setItem("user", JSON.stringify(newUser));
  alert("Registration Successfully");
  window.location.href = "index.html";
}

// dashboard scripts
let user = JSON.parse(localStorage.getItem("user"));
if (user) {
  document.getElementById("userhead").innerHTML = `Welcome ${user.name}`;
}
let totalIncome = 0;
let totalBalance = 0;
let totalExpense = 0;
let totalTransactions = 0;
let transactions = [];

function addIncome() {
  let incomeType = document.getElementById("incomeType").value;
  let incomeAmt = Number(document.getElementById("incomeAmt").value);

  if (incomeType === "" || incomeAmt <= 0) {
    alert("Enter a Valid Amount Details");
    return;
  }

  totalIncome += incomeAmt;
  totalBalance += incomeAmt;

  document.querySelector("#totalIncome h2").innerText = `₹ ${totalIncome}`;
  document.querySelector("#totalBalance h2").innerText = `₹ ${totalBalance}`;

  displayTransactions("Income", incomeType, incomeAmt);

  document.getElementById("incomeType").value = "";
  document.getElementById("incomeAmt").value = "";

  totalTransactions++;
  document.querySelector("#totalTransactions h2").innerText = totalTransactions;
}

function addExpense() {
  let expenseType = document.getElementById("expenseType").value;
  let expenseAmt = Number(document.getElementById("expenseAmt").value);

  if (expenseType === "" || expenseAmt <= 0) {
    alert("Enter Valid Expense Details");
    return;
  }
  totalExpense += expenseAmt;
  totalBalance -= expenseAmt;

  document.querySelector("#totalExpense h2").innerText = `₹ ${totalExpense}`;
  document.querySelector("#totalBalance h2").innerText = `₹ ${totalBalance}`;

  displayTransactions("Expense", expenseType, expenseAmt);

  document.getElementById("expenseType").value = "";
  document.getElementById("expenseAmt").value = "";

  totalTransactions++;
  document.querySelector("#totalTransactions h2").innerText = totalTransactions;
}

function displayTransactions(type, category, amount) {
  transactions.push({
    type: type,
    category: category,
    amount: amount,
  });
  let tbody = document.getElementById("transaction-list");

  tbody.innerHTML += `
        <tr>
            <td>${tbody.rows.length + 1}</td>

            <td class="${type === "Income" ? "text-success" : "text-danger"}">
                ${type}
            </td>

            <td class="${type === "Income" ? "text-success" : "text-danger"}">
                ${category}
            </td>

            <td class="${type === "Income" ? "text-success" : "text-danger"}">
                ₹${amount}
            </td>

            <td>${new Date().toLocaleDateString("en-IN")}</td>
        </tr>
    `;
}

function logout() {
  let confirmLogout = confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    window.location.href = "index.html";
  }
}

function clearAll() {
  let confirmClear = confirm(
    "Are you sure you want to delete all transactions?",
  );
  if (confirmClear) {
    totalIncome = 0;
    totalExpense = 0;
    totalBalance = 0;
    totalTransactions = 0;
    transactions = [];

    if (expenseChart) {
      expenseChart.destroy();
      expenseChart = null;
    }

    document.getElementById("chartContainer").classList.add("d-none");

    document.querySelector("#totalIncome h2").innerText = "₹0";
    document.querySelector("#totalExpense h2").innerText = "₹0";
    document.querySelector("#totalBalance h2").innerText = "₹0";
    document.querySelector("#totalTransactions h2").innerText = "0";

    document.getElementById("transaction-list").innerHTML = "";
  }
}

let expenseChart = null;

function getExpenseCategories() {
  let expenses = {};

  transactions.forEach((item) => {
    if (item.type === "Expense") {
      if (expenses[item.category]) {
        expenses[item.category] += Number(item.amount);
      } else {
        expenses[item.category] = Number(item.amount);
      }
    }
  });

  return expenses;
}

function showBarChart() {
  let expenses = getExpenseCategories();

  let categories = Object.keys(expenses);
  let amounts = Object.values(expenses);

  document.getElementById("chartContainer").classList.remove("d-none");

  let ctx = document.getElementById("expenseBarChart");

  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: categories,

      datasets: [
        {
          label: "Expenses (₹)",
          data: amounts,

          backgroundColor: [
            "#4e79a7",
            "#59a14f",
            "#f28e2b",
            "#e15759",
            "#af7aa1",
            "#76b7b2",
          ],

          borderRadius: 5,
          barThickness: 22,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
}
