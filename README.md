# Communication Garden — production static site

Public site for [communicationgarden.ca](https://communicationgarden.ca), served from GitHub Pages.

- **Repo:** `iansakkalis4444-stack/communicationgarden-site`
- **Branch:** `main` (site root)
- **Custom domain:** `communicationgarden.ca` (+ `www`)
- **Booking:** [Jane](https://communicationgarden.janeapp.com)
- **Contact form:** Web3Forms (replace `YOUR_ACCESS_KEY_HERE` in `site.js` with a real key); mailto/phone fallbacks remain on Contact

## Local preview

Open `index.html` or serve the directory (paths are root-relative).

## DNS (Wix nameservers)

Apex A → GitHub Pages (`185.199.108.153` … `185.199.111.153`).  
`www` CNAME → `iansakkalis4444-stack.github.io`.  
Do not change MX / SPF / other TXT (Google Workspace mail).
