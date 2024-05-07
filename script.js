const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const select = document.querySelector("select");
const amount = document.getElementById("amount");
const balance = document.getElementById("balance");
const totalAmount = document.querySelector(".totalAmount");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

const canvas = document.querySelector("canvas");

new Chart("myChart", {
  type: "doughnut",
  data: {
    datasets: [
      {
        data: [200, 100, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
        borderRadius: 30,
        spacing: 10,
      },
    ],
  },
  options: {
    cutout: 115,
  },
});

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

//5
//Add Transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("please add text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = "";
    amount.value = "";
  }
}

//5.5
//Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

//2

//Add Trasactions to DOM list
function addTransactionDOM(transaction) {
  const item = document.createElement("li");
  if (select.value === "Investment") {
    item.classList.add("investment");
  } else if (select.value === "Expense") {
    item.classList.add("Expense");
  } else {
    item.classList.add("Savings");
  }
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

//4

//Update the balance income and expence
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  // const income = amounts
  //   .filter((item) => item > 0)
  //   .reduce((acc, item) => (acc += item), 0)
  //   .toFixed(2);
  // const expense = (
  //   amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
  //   -1
  // ).toFixed(2);
  totalAmount.innerHTML = `₹${Math.abs(total)}`;
}

//6

//Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  totalAmount.innerHTML = "₹";
  updateLocalStorage();
  Init();
}
//last
//update Local Storage Transaction
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//3

//Init App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

Init();

form.addEventListener("submit", addTransaction);
