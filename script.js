let SavingsAmount = 0;
let ExpenseAmount = 0;
let InvestmentAmount = 0;
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const select = document.querySelector("select");
const amount = document.getElementById("amount");
const totalAmount = document.querySelector(".totalAmount");
const toggleHistory = document.querySelectorAll("body img");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

const show = () => document.body.classList.toggle("show");

toggleHistory.forEach((toggle) => {
  toggle.addEventListener("click", show);
});

let doughnut = new Chart("myChart", {
  type: "doughnut",
  data: {
    datasets: [
      {
        data: [100, 100, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
        borderRadius: 28,
        spacing: 10,
      },
    ],
  },
  options: {
    cutout: 144,
    aspectRatio: 1.05,
  },
});

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

//Add Transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("please add text and amount");
  } else {
    selectValues();
    const chartDataValues = [InvestmentAmount, ExpenseAmount, SavingsAmount];

    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      chartValues: chartDataValues,
    };

    updateChart(transaction);
    transactions.push(transaction);
    addTransactionDOM(transaction);

    updateValues();
    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

function updateChart(transaction) {
  doughnut.data.datasets[0].data = transaction.chartValues;
  doughnut.update();
  updateLocalStorage();
}

const generateID = () => Math.floor(Math.random() * 1000000000);

function selectValues() {
  if (select.value === "Investment") {
    InvestmentAmount += +amount.value;
  } else if (select.value === "Expense") {
    ExpenseAmount += +amount.value;
  } else {
    SavingsAmount += +amount.value;
  }
}

//Add Trasactions to DOM list
function addTransactionDOM(transaction) {
  const item = document.createElement("li");

  item.innerHTML = `
  ${svg}<span> ${transaction.text}</span>`;
  list.appendChild(item);
  item.onclick = (e) => {
    let elem = e.currentTarget.innerHTML;
    if (elem.includes("svg")) {
      removeTransaction(transaction.id);
    }
  };
}

//Update the balance income and expence
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  totalAmount.innerHTML = `₹${Math.abs(total)}`;
}

//Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  totalAmount.innerHTML = "₹";
  updateLocalStorage();
  Init();
}

//update Local Storage Transaction
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//Init App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  transactions.forEach(updateChart);
  updateValues();
}

Init();

form.addEventListener("submit", addTransaction);
