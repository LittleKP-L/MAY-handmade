// ✅ Cache version setting
const CACHE_VERSION = 'v1.0';

// ✅ Helper - Load with cache
async function fetchWithCache(url, cacheKey) {
  const cacheData = localStorage.getItem(cacheKey);
  const cacheVersion = localStorage.getItem(`${cacheKey}_version`);
  
  if (cacheData && cacheVersion === CACHE_VERSION) {
    // console.log("Loaded from cache:", cacheKey);
    return JSON.parse(cacheData);
  }

  // console.log("Fetching fresh:", cacheKey);
  const response = await fetch(url);
  const data = await response.json();
  
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(`${cacheKey}_version`, CACHE_VERSION);

  return data;
}

// ✅ Load products (cached)
async function loadProductsCached() {
  try {
    const products = await fetchWithCache(
      'https://script.google.com/macros/s/AKfycbzDXeNqUzFEyKfs_NBFZAVY2SnP8d7N_kV-nbRAFw5KdKdd3aLXla-P0wRCc0N85aLX/exec',
      'products_cache'
    );
    products.forEach(p => {
      if (p.img && !p.img.startsWith("http")) {
        if (!p.img.startsWith("images/")) p.img = "images/" + p.img;
      }
    });
    displayProducts(products);
  } catch (err) {
    document.getElementById('product-grid').innerHTML = "<p style='color:red;'>⚠️ Failed to load products.</p>";
  }
}

// ✅ Load contact links (cached)
async function loadContactsCached() {
  try {
    const contactContainer = document.getElementById("contact-buttons");
    const data = await fetchWithCache(
      'https://script.google.com/macros/s/AKfycbyAGuRgOmll3TUv8loI2YGWWJHzioKT7Ns-WfdsRFFZhPy8R_4_SPzZ8TW4UIszryaj/exec',
      'contacts_cache'
    );

    const contactStyles = {
      whatsapp: { icon: "fa-brands fa-whatsapp", color: "#25D366" },
      telegram: { icon: "fa-brands fa-telegram", color: "#229ED9" },
      messenger: { icon: "fa-brands fa-facebook-messenger", color: "#0084FF" },
      viber: { icon: "fa-brands fa-viber", color: "#7360F2" },
      tiktok: { icon: "fa-brands fa-tiktok", color: "#000000" },
      instagram: { icon: "fa-brands fa-instagram", color: "#E4405F" },
      facebook: { icon: "fa-brands fa-facebook", color: "#1877F2" }
    };

    contactContainer.innerHTML = '';
    data.forEach(item => {
      const platform = item.platform.toLowerCase();
      const info = contactStyles[platform] || { icon: "fa-solid fa-link", color: "#555" };

      const btn = document.createElement("a");
      btn.href = item.url;
      btn.target = "_blank";
      btn.className = "contact-btn";
      btn.style.backgroundColor = info.color;
      btn.innerHTML = `<i class="${info.icon}"></i> ${item.platform}`;
      contactContainer.appendChild(btn);
    });
  } catch (err) {
    document.getElementById('contact-buttons').innerHTML = "<p style='color:red;'>⚠️ Failed to load contact links.</p>";
  }
}
