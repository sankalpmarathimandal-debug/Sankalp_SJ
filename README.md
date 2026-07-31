# संकल्प - आपलं मराठी मंडळ (Sankalp Marathi Mandal)

Official website for Sankalp Marathi Mandal, Massachusetts.
Live at: https://sankalpmarathimandal-debug.github.io/Sankalp_SJ/ (custom domain: [sankalpmarathi.org](https://www.sankalpmarathi.org))

**How it works:** every page reads its content from an Excel workbook in `data/`. Edit the workbook → commit → the site updates. No Google Sheets dependency.

## Folder structure

```
Sankalp_SJ/
├── index.html          Home page
├── events.html         Event timeline (by year)
├── team.html           Our Team
├── shala.html          Marathi Shala
├── calendar.html       Shala Calendar (monthly, placeholder data)
├── join.html           Join Us form (Web3Forms — no Google Forms)
├── sponsor.html        Become a Sponsor form (Web3Forms — no Google Forms)
├── faq.html            FAQs
├── showcase.html       Showcase (placeholder — needs content)
├── constitution.html   Constitution (embedded PDF)
│
├── data/               ← ALL SITE CONTENT (edit these to update the site)
│   ├── home-events.xlsx    Homepage event cards
│   ├── timeline.xlsx       Events page timeline
│   ├── testimonials.xlsx   Homepage "Community Voices"
│   ├── highlights.json     Homepage slider (auto-generated — don't edit)
│   ├── partners.xlsx       Homepage partner logos
│   ├── team.xlsx           Team page members
│   ├── shala-team.xlsx     Shala page team
│   ├── faq.xlsx            FAQ page questions
│   ├── shala-faq.xlsx      Shala page FAQs
│   └── shala-calendar.xlsx Shala Calendar page (Year, Month, Day, Title, Type, Time, Notes)
│
├── assets/
│   ├── css/style.css       All styling
│   ├── js/main.js          All logic (reads the workbooks)
│   └── images/             Site images (branding, events, team, highlights…)
│
├── docs/constitution.pdf   The constitution document
│
├── source/                 Reference only — NOT used by the site
│   ├── google-links.md         Links to the original Google Sheets & Forms
│   └── reference/              Guidelines, schedules, and other workbooks
│
└── Start Local Preview.command   Double-click to preview the site locally
```

## Common updates

| To change | Edit |
|---|---|
| Homepage event cards | `data/home-events.xlsx` |
| Event timeline | `data/timeline.xlsx` |
| Testimonials | `data/testimonials.xlsx` |
| Highlight photos | just add/remove photos in `assets/images/highlights/` and push — updates automatically |
| Partner logos | `data/partners.xlsx` + logo in `assets/images/partners/` |
| Team members | `data/team.xlsx` + photo in `assets/images/team/` |
| Shala team / FAQs | `data/shala-team.xlsx` / `data/shala-faq.xlsx` |
| Shala calendar | `data/shala-calendar.xlsx` — one row per date (see below) |
| General FAQs | `data/faq.xlsx` |
| Constitution | replace `docs/constitution.pdf` |
| Join Us / Become a Sponsor forms | `join.html` / `sponsor.html` — see "Setting up form delivery" below |
| Announcement banner | marquee text in `index.html` |

Keep the header row of each workbook intact, and keep images web-friendly (≤1200px, JPG preferred).

### Updating the Shala Calendar

`data/shala-calendar.xlsx` has one row per date: `Year, Month, Day, Title, Type, Time, Notes`.

- **Month** is the full name (`September`), **Day** is the day of the month (`7`).
- **Type** controls the color and must be one of: `Class`, `Event`, `Holiday`, `Exam`.
- **Time** and **Notes** are optional.
- For a weekly recurring class, add one row per week (e.g. every Monday) — there's no recurrence feature yet.

The calendar currently ships with **sample dates** so the page isn't empty — replace them with the real schedule whenever it's ready. The page opens on the current month if it has entries, otherwise the nearest month that does.

### Setting up form delivery (Join Us / Become a Sponsor)

No Google Forms — `join.html` and `sponsor.html` are real HTML forms that submit via [Web3Forms](https://web3forms.com), a free email-relay service with no account or password required:

1. Go to https://web3forms.com and enter the email that should receive submissions (`sandeepj0208@gmail.com` or whichever inbox is best) — a free access key is emailed instantly. No sign-up, no password.
2. Open `assets/js/main.js` and paste the key into `CONFIG.WEB3FORMS_ACCESS_KEY` near the top of the file, replacing `'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY'`.
3. Commit and push. Both forms start delivering to your inbox immediately — no other code changes needed.

Until a real key is set, submitting either form shows a friendly "not set up yet" message instead of failing silently.

## Previewing changes

Double-click **Start Local Preview.command** — it opens the site in your browser with data loading correctly. (Opening an .html file directly won't load data; browsers block that.)

## Custom domain (www.sankalpmarathi.org)

1. Add a file named `CNAME` (no extension) at the repo root containing exactly: `www.sankalpmarathi.org`
2. Repo **Settings → Pages → Custom domain** → enter `www.sankalpmarathi.org` → Save, enable "Enforce HTTPS".
3. At your domain registrar, add a DNS CNAME record: `www` → `sankalpmarathimandal-debug.github.io`

## Still to do

- Showcase page content (`SHOWCASE_ITEMS` in `assets/js/main.js`)
- Shala admission form link (currently a mailto) in `shala.html`
- Real schedule in `data/shala-calendar.xlsx` (currently sample/demo dates)
