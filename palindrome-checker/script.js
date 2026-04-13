const button = document.getElementById("check-btn");
const textInput = document.getElementById("text-input");
const result = document.getElementById("result")
button.addEventListener("click", () => {
  if (textInput.value === "") {
    return alert("Please input a value");
    
  }
  const text = textInput.value.replace(/[^a-z0-9]/gi,"").toLowerCase()
  const reverse = text.split("").reverse().join("");
  if (text === reverse) {
result.innerText = `${textInput.value} is a palindrome`
  } else {result.innerText = `${textInput.value} is not a palindrome`}
})