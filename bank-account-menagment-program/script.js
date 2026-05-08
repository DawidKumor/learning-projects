class BankAccount {
  transactions = [];
  constructor(balance = 0) {
    this.balance = balance;
  }
  deposit(dep) {
if (dep > 0) {
  this.transactions.push({
    type: "deposit",
    amount: dep
  });
  this.balance += dep;
  return `Successfully deposited $${dep}. New balance: $${this.balance}`
} else {
  return "Deposit amount must be greater than zero.";
}
  }
  withdraw(wit) {
    if (wit > 0 && wit <= this.balance) {
      this.transactions.push({
    type: "withdraw",
    amount: wit
  });
  this.balance -= wit;
  return `Successfully withdrew $${wit}. New balance: $${this.balance}`
    } else {
      return "Insufficient balance or invalid amount."
    }
  }
  checkBalance() {
    return `Current balance: $${this.balance}`
  }
  listAllDeposits() {
    const allDeposits = this.transactions.filter(({type}) => {
return type === "deposit"
    }).map(({amount}) => {
      return amount
    }).join(",")
    return `Deposits: ${allDeposits}`
  }
  listAllWithdrawals() {
    const allWithdrawals = this.transactions.filter(({type}) => {
return type === "withdraw"
    }).map(({amount}) => {
      return amount
    }).join(",")
    return `Withdrawals: ${allWithdrawals}`
  }
}

const myAccount = new BankAccount(1500);
myAccount.deposit(3000);
myAccount.withdraw(800);
myAccount.withdraw(1000);
myAccount.deposit(300);
myAccount.withdraw(200);
console.log(myAccount.checkBalance())
console.log(myAccount.listAllDeposits())
console.log(myAccount.listAllWithdrawals())