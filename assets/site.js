(function () {
  var storeLinks = window.COMPACTKIT_STORE_URLS || {};
  var wishlistConfig = window.COMPACTKIT_WISHLIST || {};
  var root = document.documentElement;
  var THEME_STORAGE_KEY = "compactkit-theme";

  function readStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage failures and still apply the theme for this session.
    }
  }

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }

    return "dark";
  }

  function getPreferredTheme() {
    var savedTheme = readStoredTheme();

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return "dark";
  }

  function setRootTheme(theme) {
    root.setAttribute("data-theme", theme);
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(theme === "light" ? "theme-light" : "theme-dark");
  }

  function updateThemeToggle(theme) {
    var darkModeEnabled = theme === "dark";
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    var i;

    for (i = 0; i < toggles.length; i += 1) {
      toggles[i].setAttribute("aria-label", darkModeEnabled ? "Dark mode on" : "Dark mode off");
      toggles[i].setAttribute("aria-checked", String(darkModeEnabled));
      toggles[i].setAttribute("title", darkModeEnabled ? "Dark mode on" : "Dark mode off");
    }

    var states = document.querySelectorAll("[data-theme-state]");

    for (i = 0; i < states.length; i += 1) {
      states[i].textContent = darkModeEnabled ? "On" : "Off";
    }
  }

  function applyTheme(theme) {
    setRootTheme(theme);
    updateThemeToggle(theme);
  }

  function bindThemeToggle() {
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    var i;

    for (i = 0; i < toggles.length; i += 1) {
      toggles[i].addEventListener("click", function () {
        var currentTheme = root.getAttribute("data-theme") || getPreferredTheme();
        var nextTheme = currentTheme === "light" ? "dark" : "light";
        saveTheme(nextTheme);
        applyTheme(nextTheme);
      });
    }
  }

  function bindStoreLinks() {
    var links = document.querySelectorAll("[data-store-link]");
    var i;

    for (i = 0; i < links.length; i += 1) {
      var storeKey = links[i].getAttribute("data-store-link");
      var url = storeLinks[storeKey];

      if (url) {
        links[i].setAttribute("href", url);
      }
    }
  }

  function bindWishlistForm() {
    var form = document.querySelector("[data-wishlist-form]");
    var input = document.querySelector("[data-wishlist-email]");
    var message = document.querySelector("[data-wishlist-message]");

    if (!form || !input) {
      return;
    }

    form.addEventListener("submit", function (event) {
      var email = input.value.replace(/^\s+|\s+$/g, "");

      event.preventDefault();

      if (!email || !input.checkValidity()) {
        if (message) {
          message.textContent = "Please enter a valid email address first.";
          message.classList.add("is-error");
          message.classList.remove("is-success");
        }
        input.focus();
        return;
      }

      if (message) {
        message.classList.remove("is-error");
      }

      if (wishlistConfig.webAppUrl) {
        var formData = new FormData();
        formData.append("email", email);
        formData.append("source", "landing-page");
        formData.append("userAgent", window.navigator.userAgent || "");

        if (message) {
          message.textContent = "Submitting your wishlist signup...";
        }

        fetch(wishlistConfig.webAppUrl, {
          method: "POST",
          body: formData,
          mode: "no-cors",
        })
          .then(function () {
            form.reset();
            if (message) {
              message.textContent = "You're on the wishlist. We'll let you know when CompactKit launches.";
              message.classList.add("is-success");
            }
          })
          .catch(function () {
            if (message) {
              message.textContent =
                "We couldn't reach the wishlist sheet right now. Please try again.";
              message.classList.add("is-error");
              message.classList.remove("is-success");
            }
          });

        return;
      }

      if (message) {
        message.textContent =
          "Add the Google Apps Script web app URL in assets/wishlist-config.js to store signups in the sheet.";
        message.classList.add("is-error");
        message.classList.remove("is-success");
      }
    });
  }

  function initSite() {
    applyTheme(getPreferredTheme());
    bindThemeToggle();
    bindStoreLinks();
    bindWishlistForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSite);
  } else {
    initSite();
  }
})();
