const regexPattern = document.getElementById("pattern");
const stringToTest = document.getElementById("test-string");
const testButton = document.getElementById("test-btn");
const testResult = document.getElementById("result");
const caseInsensitiveFlag = document.getElementById("i");
const globalFlag = document.getElementById("g");
function getFlags() {
  let str= "";
  if (caseInsensitiveFlag.checked) {
    str += "i";
  }if (globalFlag.checked) {
    str+= "g";
 }
 return str;
}
testButton.addEventListener("click", () => {
  const regex = new RegExp(regexPattern.value, getFlags());
  const checking = stringToTest.innerText.match(regex);
stringToTest.innerHTML = stringToTest.innerText.replace(regex, '<span class="highlight">$&</span>');
if (checking === null) {
  testResult.innerText = "no match";
} else {
 testResult.innerText = checking.join(", ");
}
})
