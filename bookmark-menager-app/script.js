const mainSection = document.getElementById("main-section");
const formSection = document.getElementById("form-section");
const addBookmarkBtn = document.getElementById("add-bookmark-button");
const closeFormBtn = document.getElementById("close-form-button");
const categoryName = document.querySelector(".category-name");
const categoryDropdown = document.getElementById("category-dropdown");
const name = document.getElementById("name");
const url = document.getElementById("url");
const bookmarks = [];
let bookmarkObj = {
  name: name.value,
  category: categoryName.value,
  url: url.value
}; 

function getBookmarks() {
  const bookmars = JSON.parse(localStorage.getItem("bookmarks")) || [];
  return bookmars;
}
console.log(getBookmarks())

function displayOrCloseForm() {
  mainSection.classList.toggle("hidden");
  formSection.classList.toggle("hidden");
};
addBookmarkBtn.addEventListener("click", () => {
  categoryName.innerText = categoryDropdown.value;
  displayOrCloseForm(); 
});
closeFormBtn.addEventListener("click", () => {
  mainSection.classList.toggle("hidden");
  formSection.classList.toggle("hidden");
})