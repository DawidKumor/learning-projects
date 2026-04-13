const button = document.getElementById("check-btn");
const textInput = document.getElementById("text-input");
const result = document.getElementById("result")
button.addEventListener("click", () => {
  if (textInput.value === "") {
    return alert("Please input a value");
    
  }
  let reverse = textInput.value.split("").reverse().join("")
  if (textInput.value === reverse) {
result.innerText = `${textInput.value} is a palindrome`
  } else if(textInput.value !== reverse) 
  {result.innerText = `${textInput.value} is not a palindrome`}
})