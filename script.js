
/* UrbanNest Realty - Website interactions */

/* IMPORTANT: Replace this with your real WhatsApp number.
   Use country code + number, without +, spaces or dashes. */
const WHATSAPP_NUMBER = "919876543210";

const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menuToggle");
const propertyCards = [...document.querySelectorAll(".property-card")];
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const noResults = document.getElementById("noResults");
const toast = document.getElementById("toast");

document.getElementById("year").textContent = new Date().getFullYear();

/* Mobile navigation */
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

/* Small notification */
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* Property filtering */
let selectedType = "all";

function filterProperties() {
  const location = document.getElementById("searchLocation").value;
  const budget = document.getElementById("searchBudget").value;

  let visibleCount = 0;

  propertyCards.forEach(card => {
    const matchesType =
      selectedType === "all" || card.dataset.type === selectedType;

    const matchesLocation =
      location === "all" || card.dataset.location === location;

    const cardBudget = Number(card.dataset.budget);
    const matchesBudget =
      budget === "all" ||
      (budget === "1" && cardBudget === 1) ||
      (budget === "2" && cardBudget === 2) ||
      (budget === "3" && cardBudget === 3);

    const visible = matchesType && matchesLocation && matchesBudget;

    card.hidden = !visible;
    if (visible) visibleCount++;
  });

  noResults.hidden = visibleCount !== 0;
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedType = button.dataset.filter;

    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    filterProperties();
  });
});

document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();

  const chosenType = document.getElementById("searchType").value;
  selectedType = chosenType;

  filterButtons.forEach(button => {
    const active = button.dataset.filter === chosenType;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  filterProperties();
  document.getElementById("properties").scrollIntoView({ behavior: "smooth" });

  if (!propertyCards.some(card => !card.hidden)) {
    showToast("No exact match found. Try different filters or send us an enquiry.");
  }
});

/* Favourite buttons */
document.querySelectorAll(".heart-btn").forEach(button => {
  button.addEventListener("click", () => {
    const saved = button.classList.toggle("saved");
    button.textContent = saved ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(saved));

    const name = button.closest(".property-card")
      .querySelector("h3").textContent;

    showToast(saved ? `${name} added to favourites.` : `${name} removed from favourites.`);
  });
});

/* Location cards prefill the enquiry form */
document.querySelectorAll(".location-card").forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("clientLocation").value = card.dataset.city;
  });
});

/* WhatsApp helper */
function openWhatsApp(message) {
  if (!/^[0-9]{10,15}$/.test(WHATSAPP_NUMBER)) {
    showToast("Please configure your WhatsApp business number in script.js.");
    return;
  }

  const url = "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
}

/* Contact form: opens WhatsApp with enquiry details */
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("clientName").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();
  const interest = document.getElementById("clientInterest").value;
  const location = document.getElementById("clientLocation").value.trim();

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

/* Floating WhatsApp button */
document.getElementById("whatsappFloat").addEventListener("click", event => {
  event.preventDefault();
  openWhatsApp("Hello UrbanNest Realty! I would like to know more about your properties.");
});

/* Initial state */
filterProperties();
