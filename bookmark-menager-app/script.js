const mainSection = document.getElementById("main-section");
const bookmarksListSection = document.getElementById("bookmark-list-section");
const formSection = document.getElementById("form-section");
const addBookmarkBtn = document.getElementById("add-bookmark-button");
const addBookmarkBtnForm = document.getElementById("add-bookmark-button-form");
const closeFormBtn = document.getElementById("close-form-button");
const closeListBtn = document.getElementById("close-list-button");
const vievCategoryBtn = document.getElementById("view-category-button");
const deleteBtn = document.getElementById("delete-bookmark-button")
const categoryName = document.querySelector(".category-name");
const categoryDropdown = document.getElementById("category-dropdown");
const categoryList = document.getElementById("category-list");
const nameN = document.getElementById("name");
const url = document.getElementById("url");

let bookmarkObj = {}; 


const getBookmarks = () => {
  try {
    const data = JSON.parse(localStorage.getItem("bookmarks"));
    if (!Array.isArray(data)) return [];
    return data.every(item => 
      item && typeof item === "object" && "name" in item && "category" in item && "url" in item
    ) ? data : [];
  } catch (e) {
    return [];
  }
};

function displayOrCloseForm() {
  mainSection.classList.toggle("hidden");
  formSection.classList.toggle("hidden");
};

function displayOrHideCategory() {
  mainSection.classList.toggle("hidden");
  bookmarksListSection.classList.toggle("hidden");
}


addBookmarkBtn.addEventListener("click", () => {
  categoryName.innerText = categoryDropdown.value;
  displayOrCloseForm(); 
});
closeFormBtn.addEventListener("click", () => {
  mainSection.classList.toggle("hidden");
  formSection.classList.toggle("hidden");
});
addBookmarkBtnForm.addEventListener ("click", () => {
  const bookmarks = getBookmarks();
  console.log(nameN)
  bookmarkObj = {
  name: nameN.value,
  category: categoryDropdown.value,
  url: url.value
}; 
bookmarks.push(bookmarkObj);
localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
displayOrCloseForm(); 
nameN.value = "";
url.value = ""
console.log(bookmarks)
});

vievCategoryBtn.addEventListener("click", () => {
  categoryName.innerText = categoryDropdown.value;
  displayOrHideCategory();
  const bookmarks = getBookmarks(); 
  const filteredBookmarks = bookmarks.filter(bookmark => bookmark.category === categoryDropdown.value);
  if (!filteredBookmarks.length){
    categoryList.innerHTML = `<p>No Bookmarks Found</p>`
  } else {
    categoryList.innerHTML = filteredBookmarks.map(({name, category, url}) => {
     return `<input type="radio" id="${name}" name="bookmark-radio" value="${name}" />
      <label for="${name}"><a href="${url}">${name}</a></label>`
    } ).join("");
    

  }
  
})
closeListBtn.addEventListener("click", () => displayOrHideCategory()
);
deleteBtn.addEventListener("click", () => {
  const checked = document.querySelector('input[name="bookmark-radio"]:checked');
  if (checked) {
    let bookmarks = getBookmarks(); 
    bookmarks = bookmarks.filter(({name, category, url}) => {
      return !(name === checked.value && category === categoryDropdown.value)
    })
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    bookmarks = getBookmarks(); 

      const filteredBookmarks = bookmarks.filter(bookmark => bookmark.category === categoryDropdown.value);
  if (!filteredBookmarks.length){
    categoryList.innerHTML = `<p>No Bookmarks Found<p>`
  } else {
    categoryList.innerHTML = filteredBookmarks.map(({name, category, url}) => {
     return `<input type="radio" id="${name}" name="bookmark-radio" value="${name}" />
      <label for="${name}"><a href="${url}">${name}</a></label>`
    } ).join("");
    

  }




  }
})