(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Scroll reveal
  const revealTargets = document.querySelectorAll(
    ".section-head, .about-grid, .role, .project, .skill-group, .contact-row"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));

  // Console easter egg for recruiters who peek
  console.log(
    "%cPat Guettler",
    "font-family:sans-serif;font-size:20px;font-weight:700;color:#e8a54b;"
  );
  console.log(
    "%cCurious about the forge? Try the Konami code — or click the filament spool in the footer five times.",
    "font-family:sans-serif;font-size:12px;color:#9aa3ad;"
  );
})();
