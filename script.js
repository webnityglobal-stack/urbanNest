
/* ==========================================
   UrbanNest Realty - Website Interactions
   Fully Updated script.js
========================================== */

/* Replace with your real WhatsApp business number.
   Country code + number, without +, spaces or dashes. */
const WHATSAPP_NUMBER = "919876543210";

/* ==========================================
   DOM ELEMENTS
========================================== */

const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menuToggle");

const propertyCards = [
  ...document.querySelectorAll(".property-card")
];

const filterButtons = [
  ...document.querySelectorAll(".filter-btn")
];

const noResults = document.getElementById("noResults");
const toast = document.getElementById("toast");

/* Safely update footer year */
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* ==========================================
   MOBILE NAVIGATION
========================================== */

function closeMobileMenu() {
  if (!nav || !menuToggle) return;

  nav.classList.remove("open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  menuToggle.textContent = "☰";
}

function toggleMobileMenu() {
  if (!nav || !menuToggle) return;

  const isOpen = nav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );

  menuToggle.textContent = isOpen ? "✕" : "☰";
}

/* Attach mobile menu events */
if (nav && menuToggle) {
  menuToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMobileMenu();
  });

  /* Close menu after clicking a navigation link */
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  /* Close menu when clicking outside the navigation */
  document.addEventListener("click", (event) => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  /* Close menu with Escape key */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  /* Close mobile menu when returning to desktop layout */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

/* ==========================================
   TOAST NOTIFICATIONS
========================================== */

let toastTimer;

function showToast(message) {
  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

/* ==========================================
   PROPERTY FILTERING
========================================== */

let selectedType = "all";

function filterProperties() {
  const locationElement = document.getElementById("searchLocation");
  const budgetElement = document.getElementById("searchBudget");

  const location = locationElement
    ? locationElement.value
    : "all";

  const budget = budgetElement
    ? budgetElement.value
    : "all";

  let visibleCount = 0;

  propertyCards.forEach((card) => {
    const matchesType =
      selectedType === "all" ||
      card.dataset.type === selectedType;

    const matchesLocation =
      location === "all" ||
      card.dataset.location === location;

    const cardBudget = Number(card.dataset.budget);

    const matchesBudget =
      budget === "all" ||
      (budget === "1" && cardBudget === 1) ||
      (budget === "2" && cardBudget === 2) ||
      (budget === "3" && cardBudget === 3);

    const isVisible =
      matchesType && matchesLocation && matchesBudget;

    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount++;
    }
  });

  if (noResults) {
    noResults.hidden = visibleCount !== 0;
  }
}

/* Property type filter buttons */
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedType = button.dataset.filter || "all";

    filterButtons.forEach((item) => {
      const isActive = item === button;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    filterProperties();
  });
});

/* Search form */
const searchForm = document.getElementById("searchForm");

if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchType = document.getElementById("searchType");

    selectedType = searchType
      ? searchType.value
      : "all";

    filterButtons.forEach((button) => {
      const isActive =
        (button.dataset.filter || "all") === selectedType;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    filterProperties();

    const propertiesSection = document.getElementById("properties");

    if (propertiesSection) {
      propertiesSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    const hasResults = propertyCards.some(
      (card) => !card.hidden
    );

    if (!hasResults) {
      showToast(
        "No exact match found. Try different filters or send us an enquiry."
      );
    }
  });
}

/* ==========================================
   FAVOURITE PROPERTY BUTTONS
========================================== */

document.querySelectorAll(".heart-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const saved = button.classList.toggle("saved");

    button.textContent = saved ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(saved));

    const propertyCard = button.closest(".property-card");
    const heading = propertyCard
      ? propertyCard.querySelector("h3")
      : null;

    const propertyName = heading
      ? heading.textContent.trim()
      : "Property";

    showToast(
      saved
        ? `${propertyName} added to favourites.`
        : `${propertyName} removed from favourites.`
    );
  });
});

/* ==========================================
   LOCATION CARD ENQUIRY
========================================== */

document.querySelectorAll(".location-card").forEach((card) => {
  card.addEventListener("click", () => {
    const clientLocation = document.getElementById("clientLocation");

    if (clientLocation && card.dataset.city) {
      clientLocation.value = card.dataset.city;
    }
  });
});

/* ==========================================
   WHATSAPP HELPER
========================================== */

function openWhatsApp(message) {
  if (!/^[0-9]{10,15}$/.test(WHATSAPP_NUMBER)) {
    showToast(
      "Please configure your WhatsApp business number in script.js."
    );
    return;
  }

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
}

/* ==========================================
   CONTACT FORM
========================================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameElement = document.getElementById("clientName");
    const phoneElement = document.getElementById("clientPhone");
    const interestElement = document.getElementById("clientInterest");
    const locationElement = document.getElementById("clientLocation");

    const name = nameElement ? nameElement.value.trim() : "";
    const phone = phoneElement ? phoneElement.value.trim() : "";
    const interest = interestElement ? interestElement.value : "";
    const location = locationElement
      ? locationElement.value.trim()
      : "";

    if (!name || !phone || !interest) {
      showToast("Please complete the required fields.");
      return;
    }

    const message = [
      "Hello UrbanNest Realty!",
      "",
      "I would like to enquire about a property.",
      "Name: " + name,
      "Phone: " + phone,
      "Interest: " + interest,
      "Preferred location: " + (location || "Not specified"),
      "",
      "Please contact me with suitable options."
    ].join("\n");

    openWhatsApp(message);
  });
}

/* ==========================================
   FLOATING WHATSAPP BUTTON
========================================== */

const whatsappFloat = document.getElementById("whatsappFloat");

if (whatsappFloat) {
  whatsappFloat.addEventListener("click", (event) => {
    event.preventDefault();

    openWhatsApp(
      "Hello UrbanNest Realty! I would like to know more about your properties."
    );
  });
}

/* ==========================================
   INITIAL PAGE STATE
========================================== */

filterProperties();

if (menuToggle) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}
