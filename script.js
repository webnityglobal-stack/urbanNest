
/* =========================================================
   URBANNEST REALTY — COMPLETE SCRIPT.JS
   Mobile Navigation | Property Filters | Favourites
   Contact Form | WhatsApp | Location | Toast | Current Year
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* =======================================================
     1. COMMON ELEMENTS
  ======================================================= */

  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menuToggle");
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const currentYear = document.getElementById("currentYear");

  const whatsappFloat = document.getElementById("whatsappFloat");
  const footerWhatsApp = document.getElementById("footerWhatsApp");

  // IMPORTANT: Replace this demo number with your WhatsApp
  // business number, including country code and no + sign.
  const WHATSAPP_NUMBER = "919876543210";

  let toastTimer;

  /* =======================================================
     2. CURRENT YEAR
  ======================================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =======================================================
     3. TOAST NOTIFICATION
  ======================================================= */

  function showToast(message) {
    if (!toast) {
      alert(message);
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 3000);
  }

  /* =======================================================
     4. MOBILE HAMBURGER NAVIGATION — FIXED
  ======================================================= */

  function openMobileMenu() {
    if (!nav || !menuToggle) return;

    nav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    menuToggle.textContent = "✕";
  }

  function closeMobileMenu() {
    if (!nav || !menuToggle) return;

    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  }

  function toggleMobileMenu() {
    if (!nav || !menuToggle) return;

    const isOpen = nav.classList.contains("open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (nav && menuToggle) {
    // Ensure the button behaves as a button, not a form submit.
    menuToggle.setAttribute("type", "button");

    menuToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleMobileMenu();
    });

    // Close the menu after selecting a navigation link.
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileMenu();
      });
    });

    // Close the menu when clicking outside the header navigation.
    document.addEventListener("click", function (event) {
      const clickedInsideNav = nav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMobileMenu();
      }
    });

    // Close the menu with Escape.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    // Reset mobile menu when switching back to desktop width.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  /* =======================================================
     5. WHATSAPP LINK HELPER
  ======================================================= */

  function getWhatsAppUrl(message) {
    const number = WHATSAPP_NUMBER.replace(/\D/g, "");

    return (
      "https://wa.me/" +
      number +
      "?text=" +
      encodeURIComponent(message)
    );
  }

  function setWhatsAppLink(element, message) {
    if (!element) return;

    element.href = getWhatsAppUrl(message);
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  }

  setWhatsAppLink(
    whatsappFloat,
    "Hello UrbanNest Realty! I would like to know more about your properties."
  );

  setWhatsAppLink(
    footerWhatsApp,
    "Hello UrbanNest Realty! I would like to discuss a property."
  );

  /* =======================================================
     6. CONTACT FORM → WHATSAPP
  ======================================================= */

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const nameElement = document.getElementById("clientName");
      const phoneElement = document.getElementById("clientPhone");
      const interestElement = document.getElementById("clientInterest");
      const locationElement = document.getElementById("clientLocation");

      const clientName = nameElement
        ? nameElement.value.trim()
        : "";

      const clientPhone = phoneElement
        ? phoneElement.value.trim()
        : "";

      const clientInterest = interestElement
        ? interestElement.value.trim()
        : "";

      const clientLocation = locationElement
        ? locationElement.value.trim()
        : "";

      const message = [
        "Hello UrbanNest Realty!",
        "",
        "I would like to enquire about a property.",
        "",
        "Name: " + clientName,
        "Phone: " + clientPhone,
        "Interested in: " + clientInterest,
        "Preferred location: " + (clientLocation || "Not specified"),
        "",
        "Please contact me with suitable property options."
      ].join("\n");

      const whatsappUrl = getWhatsAppUrl(message);

      // Open WhatsApp with the enquiry prefilled.
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      showToast("Your enquiry is ready to send on WhatsApp.");

      // Do not clear the form automatically.
      // The visitor can review their details if needed.
    });
  }

  /* =======================================================
     7. LOCATION LINKS / LOCATION PREFILL
  ======================================================= */

  document.querySelectorAll("[data-location]").forEach(function (item) {
    item.addEventListener("click", function () {
      const selectedLocation = item
        .getAttribute("data-location")
        .trim();

      const locationInput = document.getElementById("clientLocation");

      if (locationInput) {
        locationInput.value = selectedLocation;
      }

      // If the contact section exists, move to it.
      const contactSection = document.getElementById("contact");

      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* =======================================================
     8. PROPERTY SEARCH AND FILTERS
     Supports common property filter element IDs.
  ======================================================= */

  const propertySearch =
    document.getElementById("propertySearch") ||
    document.getElementById("searchInput");

  const propertyTypeFilter =
    document.getElementById("propertyType") ||
    document.getElementById("typeFilter");

  const locationFilter =
    document.getElementById("locationFilter");

  const priceFilter =
    document.getElementById("priceFilter");

  const searchForm = document.getElementById("searchForm");

  function getPropertyCards() {
    const selectors = [
      ".property-card",
      ".property-item",
      "[data-property-card]"
    ];

    for (const selector of selectors) {
      const cards = document.querySelectorAll(selector);

      if (cards.length > 0) {
        return Array.from(cards);
      }
    }

    return [];
  }

  function getCardText(card) {
    return (card.innerText || card.textContent || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function filterProperties() {
    const cards = getPropertyCards();

    if (cards.length === 0) return;

    const searchText = propertySearch
      ? propertySearch.value.trim().toLowerCase()
      : "";

    const selectedType = propertyTypeFilter
      ? propertyTypeFilter.value.trim().toLowerCase()
      : "";

    const selectedLocation = locationFilter
      ? locationFilter.value.trim().toLowerCase()
      : "";

    const selectedPrice = priceFilter
      ? priceFilter.value.trim()
      : "";

    let visibleCount = 0;

    cards.forEach(function (card) {
      const cardText = getCardText(card);

      const cardType = (
        card.getAttribute("data-type") || ""
      ).toLowerCase();

      const cardLocation = (
        card.getAttribute("data-location") || ""
      ).toLowerCase();

      const cardPrice = Number(
        card.getAttribute("data-price") ||
        card.getAttribute("data-price-value") ||
        0
      );

      const matchesSearch =
        !searchText || cardText.includes(searchText);

      const matchesType =
        !selectedType ||
        selectedType === "all" ||
        selectedType === "any" ||
        cardType === selectedType ||
        cardText.includes(selectedType);

      const matchesLocation =
        !selectedLocation ||
        selectedLocation === "all" ||
        selectedLocation === "any" ||
        cardLocation === selectedLocation ||
        cardText.includes(selectedLocation);

      let matchesPrice = true;

      if (selectedPrice && cardPrice > 0) {
        if (selectedPrice === "under-50") {
          matchesPrice = cardPrice < 5000000;
        } else if (selectedPrice === "50-100") {
          matchesPrice =
            cardPrice >= 5000000 && cardPrice <= 10000000;
        } else if (selectedPrice === "100-200") {
          matchesPrice =
            cardPrice > 10000000 && cardPrice <= 20000000;
        } else if (selectedPrice === "above-200") {
          matchesPrice = cardPrice > 20000000;
        }
      }

      const shouldShow =
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesPrice;

      card.hidden = !shouldShow;
      card.style.display = shouldShow ? "" : "none";

      if (shouldShow) {
        visibleCount++;
      }
    });

    const resultsCount = document.getElementById("resultsCount");

    if (resultsCount) {
      resultsCount.textContent =
        visibleCount + (visibleCount === 1
          ? " property found"
          : " properties found");
    }

    const noResults = document.getElementById("noResults");

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
      noResults.style.display =
        visibleCount === 0 ? "" : "none";
    }
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      filterProperties();

      const propertiesSection =
        document.getElementById("properties") ||
        document.getElementById("propertyListing");

      if (propertiesSection) {
        propertiesSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  if (propertySearch) {
    propertySearch.addEventListener("input", filterProperties);
  }

  if (propertyTypeFilter) {
    propertyTypeFilter.addEventListener("change", filterProperties);
  }

  if (locationFilter) {
    locationFilter.addEventListener("change", filterProperties);
  }

  if (priceFilter) {
    priceFilter.addEventListener("change", filterProperties);
  }

  /* =======================================================
     9. RESET PROPERTY FILTERS
  ======================================================= */

  const resetFiltersButton =
    document.getElementById("resetFilters") ||
    document.getElementById("clearFilters");

  if (resetFiltersButton) {
    resetFiltersButton.addEventListener("click", function (event) {
      event.preventDefault();

      if (propertySearch) propertySearch.value = "";
      if (propertyTypeFilter) propertyTypeFilter.value = "";
      if (locationFilter) locationFilter.value = "";
      if (priceFilter) priceFilter.value = "";

      filterProperties();
    });
  }

  /* =======================================================
     10. FAVOURITES / SAVE PROPERTY
     Works with .favorite-btn or [data-favorite].
  ======================================================= */

  const FAVOURITES_KEY = "urbannest_favourites";

  function readFavourites() {
    try {
      const saved = localStorage.getItem(FAVOURITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Could not read saved favourites:", error);
      return [];
    }
  }

  function saveFavourites(favourites) {
    try {
      localStorage.setItem(
        FAVOURITES_KEY,
        JSON.stringify(favourites)
      );
    } catch (error) {
      console.warn("Could not save favourites:", error);
      showToast("Your browser could not save this favourite.");
    }
  }

  function getPropertyIdentifier(button) {
    const card = button.closest(
      ".property-card, .property-item, [data-property-card]"
    );

    return (
      button.getAttribute("data-property-id") ||
      (card && card.getAttribute("data-property-id")) ||
      (card && card.querySelector("h2, h3, h4") &&
        card.querySelector("h2, h3, h4").textContent.trim()) ||
      window.location.pathname
    );
  }

  function updateFavouriteButton(button, isFavourite) {
    button.classList.toggle("is-favourite", isFavourite);
    button.classList.toggle("active", isFavourite);
    button.setAttribute("aria-pressed", String(isFavourite));

    const label = isFavourite
      ? "Remove from favourites"
      : "Add to favourites";

    button.setAttribute("aria-label", label);
    button.title = label;

    const labelElement = button.querySelector("[data-favorite-label]");

    if (labelElement) {
      labelElement.textContent = isFavourite
        ? "Saved"
        : "Save";
    }
  }

  const favouriteButtons = document.querySelectorAll(
    ".favorite-btn, .favourite-btn, [data-favorite]"
  );

  favouriteButtons.forEach(function (button) {
    const propertyId = getPropertyIdentifier(button);
    const initialFavourites = readFavourites();

    updateFavouriteButton(
      button,
      initialFavourites.includes(propertyId)
    );

    button.addEventListener("click", function (event) {
      event.preventDefault();

      const id = getPropertyIdentifier(button);
      let favourites = readFavourites();

      if (favourites.includes(id)) {
        favourites = favourites.filter(function (item) {
          return item !== id;
        });

        updateFavouriteButton(button, false);
        showToast("Property removed from favourites.");
      } else {
        favourites.push(id);

        updateFavouriteButton(button, true);
        showToast("Property added to favourites.");
      }

      saveFavourites(favourites);
    });
  });

  /* =======================================================
     11. PROPERTY ENQUIRY BUTTONS
  ======================================================= */

  document.querySelectorAll(
    "[data-property-enquiry], .property-enquiry"
  ).forEach(function (button) {
    button.addEventListener("click", function (event) {
      const card = button.closest(
        ".property-card, .property-item, [data-property-card]"
      );

      const titleElement = card
        ? card.querySelector("h2, h3, h4")
        : null;

      const propertyName = titleElement
        ? titleElement.textContent.trim()
        : "a property listed on your website";

      const message =
        "Hello UrbanNest Realty! I am interested in " +
        propertyName +
        ". Please share more details.";

      // Use a link's default navigation when the element is an anchor.
      if (button.tagName.toLowerCase() === "a") {
        button.href = getWhatsAppUrl(message);
        button.target = "_blank";
        button.rel = "noopener noreferrer";
        return;
      }

      event.preventDefault();

      window.open(
        getWhatsAppUrl(message),
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  /* =======================================================
     12. SMOOTH SCROLL FOR SAME-PAGE ANCHORS
  ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      closeMobileMenu();
    });
  });

  /* =======================================================
     13. SAFE INITIAL FILTER
  ======================================================= */

  filterProperties();

  console.log("UrbanNest Realty script loaded successfully.");
});
