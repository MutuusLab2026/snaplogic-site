/* Puts one shared section (assets/sections.js) where this tag stands:
     <script src="assets/section.js?v=…" data-section="cta"></script>
   A file rather than an inline <script>vfSection('cta')</script>, so the pages' Content Security Policy can forbid
   inline scripts. Optional data-kicker="…" replaces the section's small line above its name; data-no-kicker drops it (where the template allows). Runs synchronously, so document.currentScript is this tag and the markup lands right here. */
vfSection(document.currentScript.dataset.section, document.currentScript.dataset);
