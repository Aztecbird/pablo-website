const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Lightbox Gallery Viewer
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-image") : null;
const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

if (galleryItems.length && lightbox && lightboxImg) {
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");

    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const img = item.querySelector("img");
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                if (lightboxCaption) {
                    lightboxCaption.textContent = img.alt;
                }
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
        if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
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

// Plugin Updates Subscription Form
const subscribeForm = document.getElementById("plugin-subscribe-form");
const subscribeEmail = document.getElementById("plugin-email-input");
const subscribeBtn = document.getElementById("plugin-subscribe-btn");
const subscribeMsg = document.getElementById("plugin-subscribe-msg");

if (subscribeForm && subscribeEmail && subscribeBtn && subscribeMsg) {
    if (localStorage.getItem("pablo_plugin_subscribed") === "true") {
        subscribeMsg.style.display = "block";
        subscribeMsg.style.background = "rgba(16, 185, 129, 0.08)";
        subscribeMsg.style.borderColor = "rgba(16, 185, 129, 0.25)";
        subscribeMsg.style.color = "#065f46";
        subscribeMsg.innerHTML = "✓ You are subscribed to Pablo's plugin updates &amp; preset releases!";
        subscribeEmail.value = localStorage.getItem("pablo_plugin_subscribed_email") || "";
        subscribeBtn.disabled = true;
        subscribeBtn.style.opacity = "0.7";
        subscribeBtn.innerHTML = "Subscribed ✓";
    }

    subscribeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = subscribeEmail.value.trim();
        if (!email) return;

        const originalBtnHtml = subscribeBtn.innerHTML;
        subscribeBtn.disabled = true;
        subscribeBtn.style.opacity = "0.7";
        subscribeBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle></svg>
            <span>Subscribing...</span>
        `;

        try {
            const response = await fetch("https://formsubmit.co/ajax/aztecbird@mac.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    _subject: "New Subscriber: Music Software & Plugin Updates",
                    _template: "table"
                })
            });

            if (response.ok) {
                subscribeMsg.style.display = "block";
                subscribeMsg.style.background = "rgba(16, 185, 129, 0.1)";
                subscribeMsg.style.borderColor = "rgba(16, 185, 129, 0.3)";
                subscribeMsg.style.color = "#065f46";
                subscribeMsg.innerHTML = "✓ Thank you! You're now on the list to receive plugin updates, free preset packs, and new releases.";
                subscribeEmail.value = "";
                subscribeBtn.innerHTML = "Subscribed ✓";
                try {
                    localStorage.setItem("pablo_plugin_subscribed", "true");
                    localStorage.setItem("pablo_plugin_subscribed_email", email);
                } catch (err) {}
            } else {
                throw new Error("Form submission response not ok");
            }
        } catch (err) {
            subscribeMsg.style.display = "block";
            subscribeMsg.style.background = "rgba(239, 68, 68, 0.1)";
            subscribeMsg.style.borderColor = "rgba(239, 68, 68, 0.3)";
            subscribeMsg.style.color = "#991b1b";
            subscribeMsg.innerHTML = `Direct email submission: <a href="mailto:aztecbird@mac.com?subject=Plugin%20Updates%20Subscription&body=Please%20subscribe%20${encodeURIComponent(email)}%20to%20plugin%20updates." style="color: inherit; text-decoration: underline;">Click here to send to aztecbird@mac.com</a>`;
            subscribeBtn.disabled = false;
            subscribeBtn.style.opacity = "1";
            subscribeBtn.innerHTML = originalBtnHtml;
        }
    });
}

