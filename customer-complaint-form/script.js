const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const orderNo = document.getElementById("order-no");
const productCode = document.getElementById("product-code");
const quantity = document.getElementById("quantity");
const complaintsGroup = document.querySelectorAll("input[name='complaint']");
const other = document.getElementById("other-complaint");
const complaintDesc = document.getElementById("complaint-description");
const solutionsGroup = document.querySelectorAll("input[name='solutions']");
const otherSolution = document.getElementById("other-solution");
const solutionDesc = document.getElementById("solution-description");
const submitBtn = document.getElementById("submit-btn");
const form = document.querySelector("#form");
function validateForm() {
  const obj = {
    "full-name": false,
    "email": false,
    "order-no": false,
    "product-code": false,
    "quantity": false,
    "complaints-group": false,
    "complaint-description": false,
    "solutions-group": false,
    "solution-description":false
  };

  if (fullName.value !== "") {
  obj["full-name"] = true;
  }
  const regexEmail = /^\w+@/i;
  if (email.value.match(regexEmail)) {
    obj["email"] = true;
  }
  const regexOrder = /^2024\d{6}$/;
  if (orderNo.value.match(regexOrder)) {
    obj["order-no"] = true;
  }
  const regexProductsCode = /^[a-zA-Z]{2}\d{2}-[a-zA-Z]\d{3}-[a-zA-Z]{2}\d$/;
  if (productCode.value.match(regexProductsCode)) {
    obj["product-code"] = true;
  }
  const regexQuantity= /^\+?[1-9]\d*$/;
  if (quantity.value.match(regexQuantity) && Number(quantity.value) > 0) {
    obj["quantity"] = true;
  }
  obj["complaints-group"] = Array.from(complaintsGroup).some(complaint => complaint.checked);

  if (!other.checked || complaintDesc.value.length >= 20) {
    obj["complaint-description"] = true;
  }
  obj["solutions-group"] = Array.from(solutionsGroup).some(solution => solution.checked);
  if (!otherSolution.checked || solutionDesc.value.length >= 20) {
    obj["solution-description"] = true;
  }


return obj;
}
function isValid(obj) {
 return Object.values(obj).every(bin => bin)
}

form.addEventListener("change", (e) => {
  const object = validateForm();
  if (e.target.type === "radio") {
    e.target.closest('fieldset').style.borderColor = object["solutions-group"] ? "green" : "red";
    
    } else if (e.target.type === "checkbox") {
    e.target.closest('fieldset').style.borderColor = object["complaints-group"] ? "green" : "red";
    } else {
      e.target.style.borderColor = object[e.target.id] ? "green" : "red";
    }
})
form.addEventListener("submit", (e) => {
  e.preventDefault();
  isValid(validateForm());
})