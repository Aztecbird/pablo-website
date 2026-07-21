const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Lightbox Gallery Viewer
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-image") : null;
const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

if (galleryItems.length && lightbox && lightboxImg) {
    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const img = item.querySelector("img");
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden"; // Prevent background scroll
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable scroll
    };

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });
}
