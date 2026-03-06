/* app.js — CollectSavy Landing Page */
(function () {
  "use strict";

  /* ===== THEME TOGGLE (disabled for now) =====
  var toggle = document.querySelector("[data-theme-toggle]");
  var root = document.documentElement;
  var urlParams = new URLSearchParams(window.location.search);
  var forcedTheme = urlParams.get("theme");
  var theme = forcedTheme
    ? forcedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  root.setAttribute("data-theme", theme);
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
      toggle.setAttribute(
        "aria-label",
        "Switch to " + (theme === "dark" ? "light" : "dark") + " mode"
      );
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.innerHTML =
      theme === "dark"
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  ===== END THEME TOGGLE ===== */

  /* Force light mode */
  document.documentElement.setAttribute("data-theme", "light");

  /* ===== STICKY HEADER — reveal on scroll ===== */
  var header = document.querySelector(".site-header");
  if (header) {
    var revealThreshold = 80;
    var scrolledThreshold = 10;
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > revealThreshold) {
          header.classList.add("site-header--visible");
          header.classList.add("site-header--scrolled");
        } else {
          header.classList.remove("site-header--visible");
          header.classList.remove("site-header--scrolled");
        }
      },
      { passive: true }
    );
  }

  /* ===== EMAIL FORM — ActiveCampaign Integration ===== */
  var form = document.getElementById("signup-form");
  var emailInput = form ? form.querySelector('input[name="email"]') : null;
  var successMsg = document.querySelector(".hero__success");
  var errorMsg = document.querySelector(".hero__error");
  var formWrapper = form ? form.closest(".hero__form-wrapper") : null;

  if (form && emailInput) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Reset states
      emailInput.classList.remove("error");
      if (errorMsg) errorMsg.classList.remove("visible");

      var email = emailInput.value.trim();

      // Validate email
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailPattern.test(email)) {
        emailInput.classList.add("error");
        if (errorMsg) {
          errorMsg.textContent = "Please enter a valid email address.";
          errorMsg.classList.add("visible");
        }
        emailInput.focus();
        return;
      }

      // Disable button while submitting
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      // Submit to ActiveCampaign via JSONP (cross-origin safe)
      var formData = new FormData(form);
      var serialized = Array.from(formData.entries())
        .map(function (pair) {
          return encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]);
        })
        .join("&");

      // JSONP callback to confirm success
      var callbackName = "_acFormCallback_" + Date.now();
      window[callbackName] = function () {
        delete window[callbackName];
      };

      var script = document.createElement("script");
      script.src = "https://solesavy.activehosted.com/proc.php?" + serialized + "&jsonp=" + callbackName;
      script.onerror = function () {
        // Even on error, AC often processes the request
        console.warn("AC script tag error — submission may still have succeeded.");
      };
      document.head.appendChild(script);

      // Show success state
      if (formWrapper) formWrapper.style.display = "none";
      if (successMsg) successMsg.classList.add("visible");
      var noteEl = document.querySelector(".hero__note");
      if (noteEl) noteEl.style.display = "none";
      if (errorMsg) errorMsg.classList.remove("visible");
    });

    // Clear error on input
    emailInput.addEventListener("input", function () {
      emailInput.classList.remove("error");
      if (errorMsg) errorMsg.classList.remove("visible");
    });
  }

  /* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
