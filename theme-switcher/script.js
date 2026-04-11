const list = document.getElementById("theme-dropdown");
const button = document.getElementById("theme-switcher-button");
button.addEventListener("click", function() {
  list.hidden = !list.hidden;
  button.setAttribute("aria-expanded", !list.hidden);
});
const themes = [
  { name: "alien", message: "Hello Aliens" },
  { name: "space", message: "Artemis II" },
];

const items = document.querySelectorAll("[role='menuitem']");

items.forEach(function(item) {
  item.addEventListener("click", function() {
    const theme = themes.find(function(t) {
  return t.name === item.textContent;
});
const message = document.querySelector("p");
message.innerText = theme.message;
document.body.className = `theme-${theme["name"].toLowerCase()}`;
list.hidden = true;
    button.setAttribute("aria-expanded", "false");
  });
});