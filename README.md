# संकल्प - आपलं मराठी मंडळ (Sankalp Marathi Mandal)

Official website for Sankalp Marathi Mandal, Massachusetts — live at [sankalpmarathi.org](https://www.sankalpmarathi.org).

**All content is served from this repository** — no Google Sheets dependency. Site data lives in Excel workbooks in `data/` (converted from the original Google Sheets); edit a workbook, commit, and the site updates.

## Structure

```
index.html …………………… Home (events, testimonials, highlights, partners, about)
event-timeline.html …… Event timeline by year
our-team.html ………………… Committee (Board, Executive, Previous members)
marathi-shala.html …… Shala info, team, and FAQs
faqs.html ……………………… General FAQs
showcase.html ………………… Talent showcase (placeholder — needs content)
constitution.html …… Embedded constitution PDF
assets/css/style.css … Shared design system
assets/js/main.js ……… Shared logic + Excel loaders
assets/images/ ………………… All optimized site images
data/ ………………………………… All site content (Excel workbooks)
docs/ ………………………………… Constitution PDF
source/ ……………………………… Original source files (sheets pointers, forms, originals)
```

## Updating content

| To change | Edit |
|---|---|
| Homepage event cards | `data/EventBanner.xlsx` |
| Event timeline | `data/Timeline.xlsx` |
| Testimonials | `data/CommunityTestimonials.xlsx` |
| Impact/highlight photos | `data/HighlightPhotos.xlsx` (+ add image to `assets/images/highlights/`) |
| Partner logos | `data/SankalpPartners.xlsx` (+ logo in `assets/images/partners/`) |
| Team members | `data/SankalpOrg.xlsx` (+ photo in `assets/images/team/`) |
| Shala team | `data/SankalpShalaOrg.xlsx` |
| General FAQs | `data/FAQComplete.xlsx` |
| Shala FAQs | `data/ShalaFAQ.xlsx` |
| Shala events | `data/EventBannerShala.xlsx` |
| Constitution | replace `docs/sankalp-constitution.pdf` |
| Join/Sponsor form links | `CONFIG` block in `assets/js/main.js` |
| Announcement banner | marquee text in `index.html` |

Edit workbooks in Excel or Google Sheets (download → edit → re-upload), keep the header row intact, and keep images web-friendly (≤1200px, JPG). The browser reads the workbooks directly via SheetJS.

Reference documents converted from the original Google Sheets (not used by the site) are in `source/xlsx/`: `ParentsGuidelines.xlsx`, `TeacherGuidelines.xlsx`, `SponsorsPictures.xlsx`.

## Hosting on GitHub Pages

1. Push to GitHub → repo **Settings → Pages** → Deploy from branch `main`, folder `/ (root)`.
2. Live at `https://sankalpmarathimandal-debug.github.io/SankalpMarathiMandalWebsite/`.
3. Custom domain: add a `CNAME` file containing `www.sankalpmarathi.org`, set it in Pages settings, and point the domain's DNS CNAME record to `sankalpmarathimandal-debug.github.io`.

## Local preview

Workbook loading requires a web server (not file://):

```
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Still to do

- Showcase page content (`SHOWCASE_ITEMS` in `assets/js/main.js`)
- Shala admission form link (currently mailto) in `marathi-shala.html`
- Original full-resolution images are kept locally in `source/images-original/` (not committed)
