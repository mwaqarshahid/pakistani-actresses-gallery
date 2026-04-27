const main = document.querySelector(".profiles");
const { actresses, poses } = window.StyleIconsData;
const { instagramIcon } = window.StyleIcons;

const createImageFallback = (frame, poseLabel) => {
  frame.classList.remove("gallery-frame--loading");
  frame.removeAttribute("aria-busy");
  frame.innerHTML = `
    <div class="photo-placeholder">
      <svg class="sil-svg" width="42" height="68" fill="var(--lav)" aria-hidden="true">
        <use href="#silhouette"></use>
      </svg>
      <span class="pose-lbl">${poseLabel}</span>
    </div>
  `;
};

/** Tried in order; first file that exists wins. */
const ACTRESS_IMAGE_EXTENSIONS = ["webp", "jpg", "jpeg", "png"];

const buildActressImagePath = (actress, pose, extension) => {
  return `./assets/images/actresses/${actress.slug}/${pose.key}.${extension}`;
};

const buildActressExplicitImagePath = (actress, pose) => {
  const fileName = actress?.images?.[pose.key];
  if (!fileName) {
    return null;
  }
  return `./assets/images/actresses/${actress.slug}/${fileName}`;
};

const createGalleryFrame = (actress, pose) => {
  const frame = document.createElement("div");
  frame.className = "gallery-frame gallery-frame--loading";
  frame.setAttribute("aria-busy", "true");

  const loader = document.createElement("div");
  loader.className = "gallery-loader";
  loader.setAttribute("aria-hidden", "true");
  const spinner = document.createElement("span");
  spinner.className = "gallery-loader__spinner";
  loader.appendChild(spinner);

  const image = document.createElement("img");
  image.className = "gallery-img";
  image.alt = `${actress.name} — ${pose.label}`;
  image.loading = "lazy";

  let attempt = 0;
  let settled = false;

  const finishLoading = () => {
    if (settled) {
      return;
    }
    settled = true;
    frame.classList.remove("gallery-frame--loading");
    frame.removeAttribute("aria-busy");
    loader.classList.add("gallery-loader--hidden");
    image.classList.add("gallery-img--loaded");
    image.onerror = null;
  };

  image.onload = () => {
    finishLoading();
  };

  image.onerror = () => {
    attempt += 1;
    if (attempt < ACTRESS_IMAGE_EXTENSIONS.length) {
      image.src = buildActressImagePath(actress, pose, ACTRESS_IMAGE_EXTENSIONS[attempt]);
    } else if (attempt === ACTRESS_IMAGE_EXTENSIONS.length) {
      image.src = pose.placeholder;
    } else {
      image.onerror = null;
      createImageFallback(frame, pose.label);
    }
  };

  frame.appendChild(loader);
  frame.appendChild(image);

  const explicit = buildActressExplicitImagePath(actress, pose);
  if (explicit) {
    attempt = -1;
    image.src = explicit;
  } else {
    image.src = buildActressImagePath(actress, pose, ACTRESS_IMAGE_EXTENSIONS[0]);
  }

  if (image.complete && image.naturalWidth > 0) {
    finishLoading();
  }

  return frame;
};

const createActressSection = (actress) => {
  const section = document.createElement("article");
  section.className = "actress-section";

  const split = document.createElement("div");
  split.className = "actress-split";

  const meta = document.createElement("aside");
  meta.className = "actress-meta";

  const rankEl = document.createElement("p");
  rankEl.className = "actress-rank";
  rankEl.textContent = actress.rank;

  const nameEl = document.createElement("h2");
  nameEl.className = "actress-name";
  nameEl.textContent = actress.name;

  const profileUrl = `https://www.instagram.com/${actress.ig}/`;

  const igBtn = document.createElement("a");
  igBtn.className = "ig-btn ig-btn--meta";
  igBtn.href = profileUrl;
  igBtn.target = "_blank";
  igBtn.rel = "noopener noreferrer";
  igBtn.setAttribute("aria-label", `${actress.name} on Instagram`);
  igBtn.innerHTML = instagramIcon;

  meta.appendChild(rankEl);
  meta.appendChild(nameEl);
  meta.appendChild(igBtn);

  const gallery = document.createElement("div");
  gallery.className = "actress-gallery";

  poses.forEach((pose) => {
    const shot = document.createElement("figure");
    shot.className = "gallery-shot";
    shot.appendChild(createGalleryFrame(actress, pose));
    gallery.appendChild(shot);
  });

  split.appendChild(meta);
  split.appendChild(gallery);
  section.appendChild(split);

  return section;
};

if (main) {
  actresses.forEach((actress, index) => {
    main.appendChild(createActressSection(actress));
    if (index < actresses.length - 1) {
      const rule = document.createElement("div");
      rule.className = "section-rule";
      rule.setAttribute("aria-hidden", "true");
      main.appendChild(rule);
    }
  });
}

const backToTop = document.querySelector("#back-to-top");
if (backToTop) {
  const revealAfterPx = 360;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updateVisibility = () => {
    backToTop.classList.toggle("back-to-top--visible", window.scrollY > revealAfterPx);
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  backToTop.addEventListener("click", () => {
    const instant = prefersReducedMotion.matches;
    window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
    document.getElementById("top")?.focus({ preventScroll: true });
  });
}
