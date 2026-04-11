const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const closeBtn = document.querySelector("#close-btn");
galleryItems.forEach(img => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImage.src = img.src.replace("-thumbnail", "");
  })
})
closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
})

lightbox.addEventListener("click", () => {
  lightbox.style.display = "none";
});

lightboxImage.addEventListener("click", (e) => {
  e.stopPropagation();
})