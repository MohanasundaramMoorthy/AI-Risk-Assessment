# AI Risk Assessment Platform — Static Website

A professional enterprise showcase website for the AI Risk Assessment platform, built as a
GitHub Pages static site. Features the Page Index Chatbot and Bias Detection Tool, with
embedded architecture diagrams extracted from the project PowerPoint decks.

> **Note on technology stack:** This repository hosts the *documentation/showcase website* only
> (static HTML/CSS/JS for GitHub Pages). The actual tools — Page Index Chatbot and Bias
> Detection Tool — are **Streamlit applications** backed by an **AWS-first architecture**
> (AWS Bedrock, Amazon DynamoDB, Amazon S3, AWS API Gateway, Amazon OpenSearch Service).

---

## Project Structure

```
AI-RiskAssessment/
├── index.html                          # Main website (single-page, section-based)
├── style.css                           # All styles — enterprise design system
├── script.js                           # Sidebar navigation, scroll spy, lightbox
├── README.md                           # This file
│
├── assets/
│   ├── ppt/
│   │   ├── AI_RiskAssessment_Architecture.pptx      # Full system architecture deck
│   │   └── page_index_Workflow_architecture.pptx    # Deployment model / workflow deck
│   │
│   └── images/
│       ├── arch_slide_1.png            # End-to-End Workflow (1920×1080)
│       ├── arch_slide_2.png            # Full System Architecture (1920×1080)
│       ├── workflow_slide_1.png        # Deployment Model — User + Developer Flow (1920×1468)
│       ├── arch_export.pdf             # Intermediate PDF (can be deleted)
│       └── workflow_export.pdf         # Intermediate PDF (can be deleted)
```

---

## How to Run Locally

Simply open `index.html` in any modern browser:

```bash
# macOS
open index.html

# Windows
start index.html

# Or use VS Code Live Server extension for auto-reload
```

No build step, no dependencies, no server required.

---

## How to Update or Replace the PPT Files

1. Place the new `.pptx` file inside `assets/ppt/`
2. Re-export slide images (see below)
3. Update the download links in `index.html` if the filename changed

The download links in `index.html` point to:
- `assets/ppt/AI_RiskAssessment_Architecture.pptx`
- `assets/ppt/page_index_Workflow_architecture.pptx`

---

## How to Re-Export Slide Images

Run the included Python script (requires PyMuPDF and Microsoft PowerPoint installed):

```bash
pip3 install pymupdf python-pptx

# Step 1 — Export PPT to PDF (requires macOS + PowerPoint)
osascript -e '
tell application "Microsoft PowerPoint"
    open POSIX file "/path/to/AI_RiskAssessment_Architecture.pptx"
    delay 3
    set thePresentation to active presentation
    save thePresentation in POSIX file "/path/to/assets/images/arch_export.pdf" as save as PDF
    close thePresentation saving no
end tell
'

# Step 2 — Convert PDF pages to PNG
python3 -c "
import fitz, os
doc = fitz.open('assets/images/arch_export.pdf')
for i, page in enumerate(doc):
    mat = fitz.Matrix(2.0, 2.0)
    pix = page.get_pixmap(matrix=mat)
    pix.save(f'assets/images/arch_slide_{i+1}.png')
"
```

Then place the PNG files in `assets/images/` with the expected filenames:
- `arch_slide_1.png`
- `arch_slide_2.png`
- `workflow_slide_1.png`

---

## How to Replace Preview Images

Replace any image in `assets/images/` with a new PNG of any resolution.
The site will render it at full width within its container, preserving aspect ratio.

To update captions or alt text, edit the relevant `<img>` tag and `.arch-caption` block in `index.html`.

---

## How to Upload to GitHub

```bash
# From the project root folder:
git init
git add .
git commit -m "Initial commit — AI Risk Assessment Platform site"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

---

## How to Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

Note: GitHub Pages serves `index.html` automatically from the root. All asset paths
(`assets/ppt/`, `assets/images/`) are relative and will work correctly.

---

## How to Maintain the Sidebar Navigation

The sidebar is defined in `index.html` inside the `<nav class="sidebar">` element.

Each section in the page has a matching `data-section` attribute on its nav link:

```html
<!-- In the sidebar -->
<a href="#home" class="nav-link" data-section="home">Home</a>

<!-- In the main content -->
<section id="home" class="section hero-section">...</section>
```

### To add a new section:

1. Add a new `<section id="your-id" class="section">` block in `index.html`
2. Add a matching nav link in the sidebar:
   ```html
   <li class="nav-item">
     <a href="#your-id" class="nav-link" data-section="your-id">
       Your Section
     </a>
   </li>
   ```
3. The scroll spy in `script.js` will automatically detect and highlight it

### To add a subsection to the chatbot group:

1. Add a new `<li>` inside `<ul class="nav-sub" id="group-chatbot">`
2. Add a corresponding `<section id="chatbot-newsubsection">` in the main content

---

## Design System Reference

The site uses CSS custom properties defined at the top of `style.css`.
Key variables to know:

| Variable          | Value                  | Use                          |
|-------------------|------------------------|------------------------------|
| `--navy-900`      | `#0a1628`              | Sidebar background           |
| `--accent`        | `#0ea5e9`              | Highlight colour, links      |
| `--blue-300`      | `#3b82f6`              | Chatbot tool accent          |
| `--amber-500`     | `#f59e0b`              | Bias tool accent             |
| `--bg-alt`        | `#eef2f7`              | Alternate section background |
| `--sidebar-width` | `260px`                | Left sidebar width           |
| `--content-max`   | `980px`                | Max content width            |

To change the primary accent colour, update `--accent` and `--accent-hover` in `:root`.

---

## Browser Compatibility

Tested and supported in:
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

Responsive breakpoints:
- Desktop: `> 900px` — sidebar visible, full layout
- Mobile:  `≤ 900px` — sidebar collapses to hamburger menu

---

## Governance Alignment

This platform and its documentation are aligned with:
- **UK Government Orange Book** — risk management framework
- **NIST AI Risk Management Framework (AI RMF)**
- **GDPR** — audit logging and data handling
- Classification: OFFICIAL

---

*AI Risk Assessment Platform — Enterprise AI Governance · v2.0*
