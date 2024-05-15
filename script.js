let SavingsAmount = 0;
let ExpenseAmount = 0;
let InvestmentAmount = 0;
const list = document.getElementById("list");
const form = document.getElementById("form");
const date = document.querySelector(".date");
const text = document.getElementById("text");
const select = document.querySelector("select");
const amount = document.getElementById("amount");
const blurbg = document.querySelector(".blur-bg");
const getDate = document.querySelector(".getDate");
const inputDate = document.querySelector(".inputDate");
const totalAmount = document.querySelector(".totalAmount");
const toggleHistory = document.querySelectorAll("body .img");

const show = () => document.body.classList.toggle("show");

function getCurrentDate() {
  const getCurrentDate = new Date();
  let day = getCurrentDate.getDate();
  let month = getCurrentDate.getMonth() + 1;
  let year = getCurrentDate.getFullYear();
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  const fullDate = `${day}/${month}/${year}`;
  return fullDate;
}

blurbg.onclick = () => document.body.classList.remove("show");

toggleHistory.forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    if (e.currentTarget.classList.contains("download")) {
      downloadPDFWithTable();
    } else {
      show();
    }
  });
});

date.addEventListener("click", () => {
  getDate.classList.toggle("display");
});

let doughnut = new Chart("myChart", {
  type: "doughnut",
  data: {
    datasets: [
      {
        data: [100, 100, 100],
        backgroundColor: ["#0d6a74", "#2b2a25", "#39505e"],
        hoverOffset: 3,
        borderRadius: 28,
        spacing: 10,
      },
    ],
  },
  options: {
    cutout: 114,
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
    const transactionDate = inputDate.value ? changeFormat() : getCurrentDate();

    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      type: select.value,
      chartValues: chartDataValues,
      transactionDate: transactionDate,
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

function changeFormat() {
  let selectedDate = new Date(inputDate.value);

  // Get the day, month, and year
  let day = selectedDate.getDate();
  let month = selectedDate.getMonth() + 1; // Months are zero indexed
  let year = selectedDate.getFullYear();

  // Format the date as dd-mm-yyyy
  let formattedDate =
    (day < 10 ? "0" : "") +
    day +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    year;
  return formattedDate;
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
  <div class="top">
    <img src="./trash.svg" class="trash" alt="trash"/>
    <span>${transaction.text}</span>
    <img src="./calendar.svg" class="calendar" alt="calendar">
  </div>
  <div class="parent">
    <div class="second flex">
      Date <div class="one">${transaction.transactionDate}</div>
    </div>
    <div class="third flex">
      ${transaction.type}<div class="one">${transaction.amount}</div>
    </div>
  </div>
  `;

  list.appendChild(item);
  item.addEventListener("click", function (event) {
    if (event.target.classList.contains("trash")) {
      removeTransaction(transaction, transaction.id);
    } else {
      if (event.target.classList.contains("calendar")) {
        let cal = document.querySelectorAll(".calendar");
        cal.forEach((toggle) => {
          toggle.addEventListener("click", (e) => {
            let element = e.currentTarget.parentElement.nextElementSibling;
            element.classList.toggle("flex");
          });
        });
      }
    }
  });
}

// Function to generate and download PDF with a table
function downloadPDFWithTable() {
  window.jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF();

  // Define table headers and data
  const headers = [
    "DATE",
    "NAME OF TRANSACTION",
    "TYPE OF TRANSACTION",
    "AMOUNT",
  ];
  const data = [];
  for (let i = 0; i < transactions.length; i++) {
    data.push([
      transactions[i].transactionDate,
      transactions[i].text,
      transactions[i].type,
      transactions[i].amount,
    ]);
  }
  // Auto-generate the table
  doc.autoTable({
    head: [headers],
    body: data,
  });

  // Save the PDF
  doc.save("table_document.pdf");
}

//Update the balance income and expence
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  totalAmount.innerHTML = `₹${Math.abs(total)}`;
}

//Remove Transaction by ID
function removeTransaction(getTransaction, id) {
  removeElement(id);
  transactions = transactions.filter((t) => t.id !== id);
  updateValues();
  if (totalAmount.innerHTML === "₹0") {
    SavingsAmount = 0;
    ExpenseAmount = 0;
    InvestmentAmount = 0;
    getTransaction.chartValues = [100, 100, 100];
  }
  updateChart(getTransaction);
  updateLocalStorage();
  Init();
}

function removeElement(id) {
  let removedTransactionType = 0;
  let removedTransactionAmount = 0;
  let i = 0;
  for (; i < transactions.length; i++) {
    if (transactions[i].id === id) {
      removedTransactionAmount = transactions[i].amount;
      removedTransactionType = transactions[i].type;
      break;
    }
  }
  for (; i < transactions.length; i++) {
    if (transactions[i].id !== id) {
      if (removedTransactionType === "Investment") {
        transactions[i].chartValues[0] -= removedTransactionAmount;
      } else if (removedTransactionType === "Expense") {
        transactions[i].chartValues[1] -= removedTransactionAmount;
      } else {
        transactions[i].chartValues[2] -= removedTransactionAmount;
      }
    }
  }
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
