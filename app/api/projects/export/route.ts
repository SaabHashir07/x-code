import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import JSZip from "jszip";

// ============================================================
// COMPONENT → HTML
// ============================================================
function componentToHtml(
  comp: any,
  theme: any,
  pages: any
): string {
  const { type, props, style = {} } = comp;
  const align = style.align || "center";
  const pt = style.paddingTop ?? 60;
  const pb = style.paddingBottom ?? 60;
  const bg = style.bgColor || "transparent";
  const fg = style.textColor || "inherit";
  const styleAttr = `text-align:${align};padding-top:${pt}px;padding-bottom:${pb}px;${
    style.bgColor ? `background-color:${bg};` : ""
  }${style.textColor ? `color:${fg};` : ""}`;

  if (type === "navbar") {
    const links = (props.links || [])
      .map((l: any) => {
        const target = l.pageKey === "home" ? "index.html" : `${l.pageKey}.html`;
        return `<a href="${target}">${l.label}</a>`;
      })
      .join("");
    return `<nav class="navbar"><div class="nav-inner"><span class="logo">${props.logo}</span><div class="nav-links">${links}</div></div></nav>`;
  }

  if (type === "hero") {
    return `<section class="hero" style="${styleAttr}">
      <h1>${props.heading}</h1>
      <p class="hero-sub">${props.subheading}</p>
      <a href="#" class="btn btn-primary">${props.buttonText}</a>
    </section>`;
  }

  if (type === "features") {
    const items = (props.items || [])
      .map(
        (it: any) => `<div class="feature-card">
        <h3>${it.title}</h3>
        <p>${it.description}</p>
      </div>`
      )
      .join("");
    return `<section style="${styleAttr}">
      <h2 class="section-title">${props.heading}</h2>
      <div class="features-grid">${items}</div>
    </section>`;
  }

  if (type === "pricing") {
    const plans = (props.plans || [])
      .map(
        (p: any) => `<div class="pricing-card${p.highlighted ? " highlighted" : ""}">
        <h3>${p.name}</h3>
        <div class="price">${p.price}<span>${p.period}</span></div>
        <ul>${(p.features || [])
          .map((f: string) => `<li>✓ ${f}</li>`)
          .join("")}</ul>
        <a href="#" class="btn btn-primary">${p.buttonText}</a>
      </div>`
      )
      .join("");
    return `<section style="${styleAttr}">
      <h2 class="section-title">${props.heading}</h2>
      <p class="section-sub">${props.subheading}</p>
      <div class="pricing-grid">${plans}</div>
    </section>`;
  }

  if (type === "testimonial") {
    const items = (props.items || [])
      .map(
        (t: any) => `<div class="testimonial-card">
        <p class="quote">"${t.quote}"</p>
        <p class="author">${t.author}</p>
        <p class="role">${t.role}</p>
      </div>`
      )
      .join("");
    return `<section style="${styleAttr}">
      <h2 class="section-title">${props.heading}</h2>
      <div class="testimonials-grid">${items}</div>
    </section>`;
  }

  if (type === "cta") {
    return `<section class="cta" style="${styleAttr}">
      <h2>${props.heading}</h2>
      <p>${props.subheading}</p>
      <a href="#" class="btn btn-primary">${props.buttonText}</a>
    </section>`;
  }

  if (type === "stats") {
    const items = (props.items || [])
      .map(
        (it: any) => `<div class="stat">
        <div class="stat-value">${it.value}</div>
        <div class="stat-label">${it.label}</div>
      </div>`
      )
      .join("");
    return `<section class="stats" style="${styleAttr}"><div class="stats-grid">${items}</div></section>`;
  }

  if (type === "gallery") {
    const imgs = (props.images || [])
      .map(
        (img: any) =>
          `<div class="gallery-item">${
            img.src ? `<img src="${img.src}" alt="${img.alt || ""}" />` : ""
          }</div>`
      )
      .join("");
    return `<section style="${styleAttr}">
      <h2 class="section-title">${props.heading}</h2>
      <div class="gallery-grid">${imgs}</div>
    </section>`;
  }

  if (type === "contact") {
    const fields = (props.fields || [])
      .map(
        (f: string) => `<label>${f}
        <input type="text" name="${f.toLowerCase()}" />
      </label>`
      )
      .join("");
    return `<section style="${styleAttr}">
      <h2 class="section-title">${props.heading}</h2>
      <p class="section-sub">${props.subheading}</p>
      <form class="contact-form" onsubmit="event.preventDefault();alert('Message sent!');">
        ${fields}
        <button type="submit" class="btn btn-primary">${props.buttonText}</button>
      </form>
    </section>`;
  }

  if (type === "faq") {
    const items = (props.items || [])
      .map(
        (it: any) => `<div class="faq-item">
        <h3>${it.question}</h3>
        <p>${it.answer}</p>
      </div>`
      )
      .join("");
    return `<section style="${styleAttr}">
      <h2 class="section-title">${props.heading}</h2>
      <div class="faq-list">${items}</div>
    </section>`;
  }

  if (type === "team") {
    const members = (props.items || [])
      .map(
        (m: any) => `<div class="team-card">
        <div class="team-avatar">${(m.name || "?").charAt(0)}</div>
        <h3>${m.name}</h3>
        <p>${m.role}</p>
      </div>`
      )
      .join("");
    return `<section style="${styleAttr}">
      <h2 class="section-title">${props.heading}</h2>
      <div class="team-grid">${members}</div>
    </section>`;
  }

  if (type === "logos") {
    const logos = (props.items || [])
      .map((l: string) => `<span class="logo-item">${l}</span>`)
      .join("");
    return `<section style="${styleAttr}">
      <p class="logos-heading">${props.heading}</p>
      <div class="logos-row">${logos}</div>
    </section>`;
  }

  if (type === "video") {
    return `<section style="${styleAttr}">
      <h2 class="section-title">${props.heading}</h2>
      <div class="video-placeholder">${
        props.url ? `<iframe src="${props.url}" allowfullscreen></iframe>` : "Video"
      }</div>
    </section>`;
  }

  if (type === "divider") {
    return `<hr style="border:none;border-top:1px solid currentColor;opacity:0.2;margin:20px 0" />`;
  }

  if (type === "text") {
    return `<section style="${styleAttr}"><p>${props.content}</p></section>`;
  }

  if (type === "image") {
    return `<section style="${styleAttr}">${
      props.src
        ? `<img src="${props.src}" alt="${props.alt || ""}" style="max-width:100%;border-radius:12px" />`
        : `<div class="img-placeholder">Image</div>`
    }</section>`;
  }

  if (type === "button") {
    const target = props.pageKey
      ? props.pageKey === "home"
        ? "index.html"
        : `${props.pageKey}.html`
      : "#";
    return `<div style="${styleAttr}"><a href="${target}" class="btn btn-primary">${props.text}</a></div>`;
  }

  if (type === "footer") {
    return `<footer class="footer"><p>${props.text}</p></footer>`;
  }

  return "";
}

// ============================================================
// BUILD CSS FROM THEME
// ============================================================
function buildCSS(theme: any): string {
  const rpx =
    theme.radius === "sm"
      ? "4px"
      : theme.radius === "md"
      ? "8px"
      : theme.radius === "lg"
      ? "12px"
      : "20px";

  return `/* Generated by X Code */
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --primary: ${theme.primary};
  --secondary: ${theme.secondary};
  --bg: ${theme.background};
  --surface: ${theme.surface};
  --text: ${theme.text};
  --text-muted: ${theme.textMuted};
  --radius: ${rpx};
}
body {
  font-family: '${theme.font}', -apple-system, system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
section { max-width: 1100px; margin: 0 auto; padding: 60px 24px; }

/* Navbar */
.navbar { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); position: sticky; top: 0; background: var(--bg); z-index: 10; }
.nav-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.logo { font-weight: 700; font-size: 20px; }
.nav-links { display: flex; gap: 24px; }
.nav-links a { color: var(--text); text-decoration: none; opacity: 0.8; transition: opacity 0.2s; }
.nav-links a:hover { opacity: 1; color: var(--primary); }

/* Hero */
.hero { text-align: center; padding: 120px 24px; }
.hero h1 { font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; letter-spacing: -0.02em; }
.hero-sub { font-size: 18px; opacity: 0.75; max-width: 640px; margin: 0 auto 32px; }

/* Buttons */
.btn { display: inline-block; padding: 12px 24px; border-radius: var(--radius); text-decoration: none; font-weight: 600; font-size: 15px; cursor: pointer; border: none; transition: opacity 0.2s; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { opacity: 0.9; }

/* Sections */
.section-title { font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 12px; letter-spacing: -0.01em; }
.section-sub { text-align: center; opacity: 0.7; margin-bottom: 40px; }

/* Features */
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 40px; }
.feature-card { padding: 28px; border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); background: var(--surface); }
.feature-card h3 { font-size: 18px; margin-bottom: 8px; color: var(--primary); }
.feature-card p { opacity: 0.75; font-size: 14px; }

/* Pricing */
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 40px; }
.pricing-card { padding: 32px; border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); background: var(--surface); }
.pricing-card.highlighted { border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary); }
.pricing-card h3 { font-size: 20px; margin-bottom: 16px; }
.price { font-size: 36px; font-weight: 800; color: var(--primary); margin-bottom: 20px; }
.price span { font-size: 14px; opacity: 0.6; font-weight: 400; }
.pricing-card ul { list-style: none; margin-bottom: 24px; }
.pricing-card li { padding: 6px 0; font-size: 14px; opacity: 0.8; }

/* Testimonials */
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 40px; }
.testimonial-card { padding: 24px; border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); }
.quote { font-style: italic; opacity: 0.85; margin-bottom: 16px; }
.author { font-weight: 600; color: var(--primary); font-size: 14px; }
.role { opacity: 0.5; font-size: 12px; }

/* CTA */
.cta { text-align: center; padding: 80px 24px; background: linear-gradient(135deg, var(--primary)15, var(--secondary)15); border-radius: var(--radius); margin: 40px auto; max-width: 1100px; }
.cta h2 { font-size: 32px; margin-bottom: 12px; }
.cta p { opacity: 0.75; margin-bottom: 24px; }

/* Stats */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 24px; }
.stat { text-align: center; }
.stat-value { font-size: 40px; font-weight: 800; color: var(--primary); }
.stat-label { font-size: 13px; opacity: 0.6; margin-top: 4px; }

/* Gallery */
.gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 40px; }
.gallery-item { aspect-ratio: 1; background: var(--surface); border-radius: var(--radius); overflow: hidden; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }

/* Contact */
.contact-form { max-width: 480px; margin: 32px auto 0; display: flex; flex-direction: column; gap: 16px; }
.contact-form label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; opacity: 0.8; }
.contact-form input { padding: 12px; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.15); background: var(--surface); color: var(--text); font-size: 14px; font-family: inherit; }
.contact-form button { margin-top: 8px; }

/* FAQ */
.faq-list { max-width: 720px; margin: 40px auto 0; display: flex; flex-direction: column; gap: 16px; }
.faq-item { padding: 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); }
.faq-item h3 { font-size: 16px; margin-bottom: 6px; }
.faq-item p { opacity: 0.7; font-size: 14px; }

/* Team */
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px; margin-top: 40px; text-align: center; }
.team-avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; margin: 0 auto 12px; }
.team-card h3 { font-size: 15px; }
.team-card p { opacity: 0.6; font-size: 13px; }

/* Logos */
.logos-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 32px; margin-top: 20px; }
.logo-item { font-weight: 700; opacity: 0.5; font-size: 18px; }
.logos-heading { text-align: center; opacity: 0.6; font-size: 14px; }

/* Video */
.video-placeholder { aspect-ratio: 16/9; background: var(--surface); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; opacity: 0.5; margin-top: 32px; }
.video-placeholder iframe { width: 100%; height: 100%; border: none; border-radius: var(--radius); }

/* Image placeholder */
.img-placeholder { height: 200px; background: var(--surface); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; opacity: 0.4; }

/* Footer */
.footer { padding: 40px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); opacity: 0.6; font-size: 13px; }

/* Responsive */
@media (max-width: 768px) {
  .hero h1 { font-size: 32px; }
  .hero { padding: 80px 20px; }
  .section-title { font-size: 24px; }
  .nav-links { gap: 16px; font-size: 14px; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
}
`;
}

// ============================================================
// BUILD HTML PAGE
// ============================================================
function buildPage(
  page: any,
  pages: any,
  theme: any,
  siteSettings: any
): string {
  const componentsHtml = (page.components || [])
    .map((c: any) => componentToHtml(c, theme, pages))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${siteSettings.siteName || "My Website"} — ${page.name}</title>
  <meta name="description" content="${siteSettings.tagline || ""}" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${siteSettings.favicon || "🚀"}</text></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=${theme.font.replace(" ", "+")}:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
${componentsHtml}
</body>
</html>`;
}

// ============================================================
// ROUTE HANDLER
// ============================================================
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await request.json();
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const data = project.pages as any;
    if (!data || !data.pages) {
      return NextResponse.json({ error: "No design data" }, { status: 400 });
    }

    const { pages, theme, settings } = data;

    const zip = new JSZip();
    const folder = zip.folder(
      (settings?.siteName || "my-website")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "my-website"
    )!;

    // Generate HTML files for each page
    for (const key in pages) {
      const page = pages[key];
      const html = buildPage(page, pages, theme, settings || {});
      const filename = key === "home" ? "index.html" : `${key}.html`;
      folder.file(filename, html);
    }

    // Generate CSS
    folder.file("styles.css", buildCSS(theme));

    // README
    folder.file(
      "README.md",
      `# ${settings?.siteName || "My Website"}

Generated with **X Code** — AI-powered website builder.

## How to deploy

### Option 1: Netlify (drag & drop)
1. Go to https://app.netlify.com/drop
2. Drag this folder onto the page
3. Done! You get a live URL

### Option 2: Vercel
1. Go to https://vercel.com/new
2. Upload this folder
3. Deploy

### Option 3: GitHub Pages
1. Create a new repo
2. Upload these files
3. Settings → Pages → Deploy from main branch

## Files
- \`index.html\` — Home page
- \`styles.css\` — All styles
- Other pages: \`.html\` files

---
Built with ❤️ using X Code
`
    );

    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });

    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${
          settings?.siteName?.toLowerCase().replace(/\s+/g, "-") || "website"
        }.zip"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}