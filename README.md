# Communication Garden site

Plain static HTML/CSS/JS for **communicationgarden.ca**, same pattern as [peakandpillar-site](https://github.com/iansakkalis4444-stack/peakandpillar-site).

## Preview (current)

- **Repo:** `iansakkalis4444-stack/communicationgarden-site`
- **Preview URL:** https://iansakkalis4444-stack.github.io/communicationgarden-site/
- Asset and nav links are prefixed with `/communicationgarden-site/` so the project Pages URL works.
- **`CNAME` is NOT in the repo yet** (see cutover). DNS still points at Wix; a CNAME file would make github.io redirect to the live Wix site.
- **`noindex, nofollow`** meta on every page + `robots.txt` Disallow: / so this preview does not compete with the live site in Google. **Remove both at cutover.**

### Deferred CNAME (for cutover only)

When DNS is ready, add a root file named `CNAME` with exactly:

```
communicationgarden.ca
```

(Saved locally as `CNAME.cutover.example` for reference.)

Also strip the `/communicationgarden-site` path prefix from all `href`/`src` (set `BASE = ''` in `_lib/sitegen.py` and regenerate, or search-replace `/communicationgarden-site` → ``), remove noindex meta, and replace `robots.txt` with Allow.

## Stack

- Static files at repo root
- GitHub Pages from `main` / `(root)`
- Contact form → [Web3Forms](https://web3forms.com) (`access_key` still a placeholder; mailto fallback works)
- Jane booking for appointments

## Local preview

```bash
# Note: links expect the /communicationgarden-site/ prefix.
# Either open via a local path that mirrors that, or temporarily set BASE='' and regenerate.
python3 -m http.server 8080
```

## Cutover checklist (needs Ian's approval — do not run yet)

1. **DNS at Wix / registrar** — point apex A records to GitHub Pages:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
   - www CNAME → `iansakkalis4444-stack.github.io`
2. **Preserve Google Workspace MX + SPF** when changing A/www — do not wipe email DNS.
3. **Add `CNAME`** file (`communicationgarden.ca`) to the repo.
4. **Remove path prefix** `/communicationgarden-site` from links/assets (apex serves from `/`).
5. **Remove noindex** meta from all pages and open `robots.txt` (Allow: /).
6. **Web3Forms key** — register with `info@communicationgarden.ca`, put access key in `contact/index.html`.
7. Verify HTTPS, form, Jane, email still work on the live domain.
8. **Cancel Wix Premium** only after verifying.

Hosting cost after cutover: **$0/month** (GitHub Pages). Domain renewal remains the only ongoing cost.
