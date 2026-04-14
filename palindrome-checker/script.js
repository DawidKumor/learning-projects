const button = document.getElementById("check-btn");
const textInput = document.getElementById("text-input");
const result = document.getElementById("result");
const palindromeDef = document.querySelector(".palindrome-definition");
button.addEventListener("click", () => {
  if (textInput.value === "") {
    return alert("Please input a value");
    
  }
  const text = textInput.value.replace(/[^a-z0-9]/gi,"").toLowerCase()
  const reverse = text.split("").reverse().join("");
  if (text === reverse) {
    result.removeAttribute("hidden")
result.innerText = `${textInput.value} is a palindrome`
  } else {
    result.removeAttribute("hidden")
    result.innerText = `${textInput.value} is not a palindrome`}
})
button.addEventListener("mouseenter", () => {
    palindromeDef.classList.add("palindrome-colored");
})
button.addEventListener("mouseleave", () => {
    palindromeDef.classList.remove("palindrome-colored");
})