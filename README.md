# DigyBiz Website

**CREATE • AUTOMATION • SCALE** — website for DigyBiz, an AI-powered digital marketing and automation agency.

🌐 **Live domain:** <https://www.digybiz.co.in>

This is a static website: plain HTML, CSS and JavaScript. There's no build step and nothing to install, so it can be hosted free on GitHub Pages, Netlify, Vercel or Cloudflare Pages. The "Free Proposal" form saves **Name, Phone and Email** to a Google Sheet through Google Apps Script.

---

## What's included

| Page | File |
|---|---|
| Home | `index.html` |
| Services (all 8 services, with links to each section) | `services.html` |
| About Us | `about.html` |
| Our Work / Portfolio (with filters) | `our-work.html` |
| Contact | `contact.html` |
| Privacy Policy | `privacy-policy.html` |
| Terms & Conditions | `terms.html` |
| Not-found page | `404.html` |

```
digybiz-website/
├── index.html, services.html, about.html, our-work.html, contact.html, ...
├── assets/
│   ├── css/style.css        ← all styling (brand colours are at the top)
│   ├── js/config.js         ← YOUR SETTINGS: form URL, WhatsApp, email, socials
│   ├── js/main.js           ← header, footer, popup form, icons
│   └── img/                 ← logo, brand mockups, favicon
└── apps-script/Code.gs      ← paste this into Google Apps Script
```

The header, footer, floating WhatsApp button and **Get Free Proposal** popup come from `assets/js/main.js`. To change a menu item or footer link, edit it there once and every page updates.

To open the popup from any button or link, add `data-proposal` to it. Example: `<a href="#" data-proposal>Get a quote</a>`.

---

## Step 1 — Put in your details

Open `assets/js/config.js`. WhatsApp/phone (+91 87783 13419), Instagram (@digy_biz), Facebook (facebook.com/DigyBiz) and email (digybizsolutions@gmail.com) are already filled in. One value still needs setting:

```js
SCRIPT_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE", // from Step 2
```

Also check these lines of copy, which are business promises you should confirm or change:
- "We reply within one business day" (form note, `main.js`)
- "no long lock-in contracts" (home page, *Why Choose DigyBiz*)
- The founder quote on `about.html`
- The *Last updated* date and wording in `privacy-policy.html` and `terms.html`. These are starting templates, not legal advice.

---

## Step 2 — Connect the form to Google Sheets

1. Go to <https://sheets.google.com> and create a blank sheet, for example **DigyBiz Leads**.
2. In the sheet, click **Extensions → Apps Script**.
3. Delete the code in `Code.gs`, paste in all of [`apps-script/Code.gs`](apps-script/Code.gs), and click **Save**.
4. *(Optional)* To get an email for every new lead, set `NOTIFY_EMAIL` near the top, for example `var NOTIFY_EMAIL = 'digybizsolutions@gmail.com';`.
5. Choose the **`setup`** function in the toolbar dropdown and click **Run**. Click **Review permissions**, choose your Google account, then **Advanced → Go to project (unsafe) → Allow**. This is normal for your own scripts. It creates a **Leads** tab with these columns:
   `Timestamp | Name | Phone | Email | Source | Page URL | Status | Notes`
6. Click **Deploy → New deployment**, click the gear icon, and choose **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
7. Paste that URL into `SCRIPT_URL` in `assets/js/config.js`.
8. Test it: open the site, submit the form, and check that a new row appears in the sheet.

> **If you edit `Code.gs` later:** go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. That keeps the same URL. Choosing "New deployment" again creates a new URL, which you'd then have to paste into `config.js`.

The **Status** column has a dropdown (New, Contacted, Proposal Sent, Won, Lost), so you can use the sheet as a simple lead tracker.

**Spam protection:** the form has a hidden "honeypot" field that bots fill in and people don't. The script also checks every field and blocks spreadsheet formula injection.

---

## Step 3 — Put it on GitHub

**Option A — in the browser (no Git needed):**
1. Sign in at <https://github.com>, click **+ → New repository**, name it `digybiz-website`, choose **Public**, and click **Create repository**. Don't add a README.
2. On the new repo page, click the **uploading an existing file** link.
3. Open the `digybiz-website` folder on your computer, select **everything inside it** (`index.html`, `assets`, `apps-script`, etc.), and drag it into the upload box. Folders keep their structure.
4. Click **Commit changes**.

To update the site later, upload the changed files the same way. Files with the same name are replaced.

**Option B — with Git** (install from <https://git-scm.com/download/win> first):

```bash
cd digybiz-website
git init
git add .
git commit -m "DigyBiz website v1"
git branch -M main
git remote add origin https://github.com/<your-username>/digybiz-website.git
git push -u origin main
```

(Create the empty `digybiz-website` repository on github.com first.)

---

## Step 4 — Go live (choose one)

**GitHub Pages (free):** in your repo, open **Settings → Pages → Build and deployment**, set Source to **Deploy from a branch**, choose `main` / `(root)`, and save. Within a minute or two the site is live at `https://<your-github-username>.github.io/digybiz-website/`. You can use that link before you buy the domain.

**When you buy `digybiz.co.in`:** go to **Settings → Pages → Custom domain**, enter `www.digybiz.co.in` and click **Save**. GitHub then adds a `CNAME` file to the repo for you. Next, set up the DNS records below.

**Netlify / Vercel / Cloudflare Pages (free):** "Import from GitHub", pick the repo, leave the build command empty and set the publish directory to `/`, then deploy. Add `www.digybiz.co.in` under the project's domain settings. These hosts ignore the `CNAME` file.

### Point www.digybiz.co.in to GitHub Pages

At your domain registrar (where you bought `digybiz.co.in`), open **DNS settings** and add these records:

| Type | Name / Host | Value |
|---|---|---|
| CNAME | `www` | `<your-github-username>.github.io` |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

The four **A** records make `digybiz.co.in` (without www) redirect to `www.digybiz.co.in`. Remove any old A or CNAME records for `@` and `www` first, such as the registrar's parking page.

DNS changes can take anywhere from a few minutes to 24 hours. After the domain shows as verified in **Settings → Pages**, tick **Enforce HTTPS**.

### After going live
- Add the site to [Google Search Console](https://search.google.com/search-console) and submit `https://www.digybiz.co.in/sitemap.xml`.
- Set up a [Google Business Profile](https://www.google.com/business/) with the website link.
- Add `www.digybiz.co.in` to your Instagram bio and WhatsApp Business profile.

If you ever change the domain, update it in `CNAME`, `robots.txt`, `sitemap.xml` and the `canonical` / `og:url` tags at the top of each HTML page.

---

## Preview on your computer

Double-click `index.html` to open it in a browser. You can also run a small local server, which matches the live site more closely:

```bash
npx serve .
```

---

## Next steps from the roadmap

- **Phase 2:** separate landing pages for each service, so each Meta Ads campaign can point to its own page. Copy `services.html` as a starting point.
- **Phase 3:** Case Studies, Industries, Blog, Pricing/Packages and a Cookie Policy (needed once you add Google Analytics or the Meta Pixel).
- Add a **Testimonials** section to the home page once you have real client feedback.
- Swap the *Concept* portfolio cards on `our-work.html` for real projects as you complete them.
- Automation: auto-reply email/WhatsApp to new leads, then a CRM.
