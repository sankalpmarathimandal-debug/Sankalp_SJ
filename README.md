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
├── showcase.html       Showcase — videos & photos (Excel-driven, see below)
├── forms.html           Forms & Sign-ups (self-service — see below)
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
│   ├── shala-calendar.xlsx Shala Calendar page (Year, Month, Day, Title, Type, Time, Notes)
│   ├── forms.xlsx          Forms & Sign-ups page (Title, Description, Link, Active, Order)
│   └── showcase.xlsx       Showcase page (Title, Description, Category, YouTubeURL, ImageURL, Active, Order)
│
├── assets/
│   ├── css/style.css       All styling
│   ├── js/main.js          All logic (reads the workbooks)
│   └── images/             Site images (branding, events, team, highlights, showcase…)
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
| Forms & Sign-ups (event RSVPs, surveys, etc.) | `data/forms.xlsx` — no coding, see "Updating Forms & Sign-ups" below |
| Showcase videos & photos | `data/showcase.xlsx` — no coding, see "Updating the Showcase" below |
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

### Updating Forms & Sign-ups (no coding required)

`forms.html` is a self-service page — anyone on the team can publish a new sign-up or survey without touching code, using `data/forms.xlsx`. Columns: `Title, Description, Link, Active, Order`.

**To add a new form:**

1. Create the form itself somewhere no-code — [Google Forms](https://forms.google.com) or [Tally](https://tally.so) both work well and are free. Build it there like any Google Form, then copy its shareable link.
2. Open `data/forms.xlsx` in Excel (or Google Sheets), add a new row: a short `Title`, a one-line `Description`, paste the `Link`, set `Active` to `Yes`, and give it an `Order` number (lower numbers show first).
3. Save the file, keeping the same filename (`forms.xlsx`).
4. Get it back into the repo (pick whichever fits the team):
   - **Easiest / recommended:** send the updated file (or just the new row's details) to whoever manages the GitHub repo — they drag the replacement file in and it's live in a minute.
   - **Fully self-service:** if a team member is added as a GitHub collaborator, they can go to `data/forms.xlsx` on github.com, click **Add file → Upload files**, drag in the updated workbook (same filename), and click **Commit changes** — all in the browser, no terminal, no git commands.

To take a form down, set its `Active` column to `No` instead of deleting the row (keeps the link on file for next time). If there are no active rows, the page just shows "No forms are open right now."

### Updating the Showcase (videos & photos, no coding required)

`showcase.html` displays a grid of videos and photos — performances, student achievements, a community member's painting, anything — driven entirely by `data/showcase.xlsx`. Columns: `Title, Description, Category, YouTubeURL, ImageURL, Active, Order`.

Each row is **either** a video **or** a photo — fill in one of `YouTubeURL` / `ImageURL` and leave the other blank.

**To add a video:**

1. Paste any YouTube link into `YouTubeURL` — a normal `youtube.com/watch?v=...` link, a `youtu.be/...` short link, or a Shorts link all work.
2. Leave `ImageURL` blank. The site automatically pulls the thumbnail from YouTube — nothing to upload. Clicking it plays the video in a pop-up on the page.

**To add a photo** (a painting, a student's achievement, an event photo, etc.):

1. Save the photo into `assets/images/showcase/` (resize to ≤1200px, JPG preferred) — either send it to the repo admin, or if you're a GitHub collaborator, drag it in yourself via **Add file → Upload files** on that folder on github.com.
2. In `ImageURL`, put the path to that file, e.g. `assets/images/showcase/priya-painting.jpg`. Leave `YouTubeURL` blank.
3. Clicking the photo opens it full-size in a pop-up on the page.

**Both types share the same remaining columns:**

- `Title` (required), and optionally `Description` and `Category` (e.g. "Dance", "Art", "Marathi Shala").
- `Active` — set to `Yes` to publish, `No` to unpublish without losing the row.
- `Order` — **lower numbers show first**, so this is how priority is controlled. Use gaps (10, 20, 30…) to make it easy to slot new items in between later.

Once the workbook is updated, get it back into the repo the same way as `forms.xlsx` (hand it to the repo admin, or upload directly via GitHub's website if you're a collaborator — see "Updating Forms & Sign-ups" above for the exact steps). If there are no active rows, the page shows "Nothing to show yet."

## Previewing changes

Double-click **Start Local Preview.command** — it opens the site in your browser with data loading correctly. (Opening an .html file directly won't load data; browsers block that.)

## Custom domain (www.sankalpmarathi.org)

1. Add a file named `CNAME` (no extension) at the repo root containing exactly: `www.sankalpmarathi.org`
2. Repo **Settings → Pages → Custom domain** → enter `www.sankalpmarathi.org` → Save, enable "Enforce HTTPS".
3. At your domain registrar, add a DNS CNAME record: `www` → `sankalpmarathimandal-debug.github.io`

## Still to do

- Shala admission form link (currently a mailto) in `shala.html`
- Real schedule in `data/shala-calendar.xlsx` (currently sample/demo dates)
- `data/forms.xlsx` ships with one inactive example row — replace or delete once real forms are added
- `data/showcase.xlsx` ships with one inactive example photo row (`ImageURL` points at a placeholder file that doesn't exist yet) — replace or delete once real photos are added
