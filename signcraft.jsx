import { useState, useRef, useCallback, useEffect } from "react";

const TEMPLATES = [
  { id: "modern", name: "Modern", description: "Clean & minimal" },
  { id: "bold", name: "Bold", description: "Strong presence" },
  { id: "elegant", name: "Elegant", description: "Refined & classy" },
  { id: "creative", name: "Creative", description: "Stand out" },
];

const COLOR_SCHEMES = [
  { id: "navy", primary: "#1a365d", accent: "#c6941a", label: "Navy & Gold" },
  { id: "charcoal", primary: "#2d3748", accent: "#e53e3e", label: "Charcoal & Red" },
  { id: "forest", primary: "#22543d", accent: "#d69e2e", label: "Forest & Amber" },
  { id: "midnight", primary: "#1a202c", accent: "#6b46c1", label: "Midnight & Purple" },
  { id: "ocean", primary: "#2b6cb0", accent: "#38b2ac", label: "Ocean & Teal" },
  { id: "slate", primary: "#4a5568", accent: "#ed8936", label: "Slate & Orange" },
];

const SOCIAL_PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", icon: "in", prefix: "https://linkedin.com/in/" },
  { id: "twitter", label: "X / Twitter", icon: "𝕏", prefix: "https://x.com/" },
  { id: "github", label: "GitHub", icon: "◆", prefix: "https://github.com/" },
  { id: "instagram", label: "Instagram", icon: "◎", prefix: "https://instagram.com/" },
  { id: "dribbble", label: "Dribbble", icon: "●", prefix: "https://dribbble.com/" },
  { id: "youtube", label: "YouTube", icon: "▶", prefix: "https://youtube.com/@" },
];

const FONTS = [
  { id: "arial", label: "Arial", family: "Arial, Helvetica, sans-serif" },
  { id: "georgia", label: "Georgia", family: "Georgia, 'Times New Roman', serif" },
  { id: "verdana", label: "Verdana", family: "Verdana, Geneva, sans-serif" },
  { id: "tahoma", label: "Tahoma", family: "Tahoma, Geneva, sans-serif" },
  { id: "trebuchet", label: "Trebuchet", family: "'Trebuchet MS', Helvetica, sans-serif" },
];

const DEFAULT_DATA = {
  fullName: "Alex Morgan",
  jobTitle: "Senior Product Designer",
  company: "Acme Studios",
  email: "alex@acmestudios.com",
  phone: "+1 (555) 123-4567",
  website: "www.acmestudios.com",
  address: "",
  photoUrl: "",
  socials: {},
};

function generateSignatureHTML(data, template, colorScheme, font, isPremium) {
  const c = COLOR_SCHEMES.find((s) => s.id === colorScheme) || COLOR_SCHEMES[0];
  const f = FONTS.find((fo) => fo.id === font) || FONTS[0];

  const socialLinks = Object.entries(data.socials || {})
    .filter(([, url]) => url && url.trim())
    .map(([platformId, url]) => {
      const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
      if (!platform) return "";
      const fullUrl = url.startsWith("http") ? url : platform.prefix + url;
      return `<a href="${fullUrl}" target="_blank" style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background-color:${c.primary};color:#ffffff;font-size:11px;font-weight:bold;text-decoration:none;margin-right:6px;font-family:${f.family};">${platform.icon}</a>`;
    })
    .join("");

  const photoHTML = data.photoUrl
    ? `<img src="${data.photoUrl}" width="80" height="80" style="border-radius:50%;object-fit:cover;display:block;" alt="${data.fullName}" />`
    : `<div style="width:80px;height:80px;border-radius:50%;background-color:${c.primary};color:#ffffff;font-size:28px;font-weight:bold;text-align:center;line-height:80px;font-family:${f.family};">${(data.fullName || "A").charAt(0).toUpperCase()}</div>`;

  const viralFooter = isPremium
    ? ""
    : `<tr><td style="padding-top:12px;"><a href="https://signcraft.com?ref=sig" target="_blank" style="font-size:10px;color:#a0aec0;text-decoration:none;font-family:${f.family};">Create your professional signature → signcraft.com</a></td></tr>`;

  if (template === "bold") {
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f.family};max-width:500px;">
  <tr>
    <td style="background-color:${c.primary};padding:16px 20px;border-radius:8px 8px 0 0;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;padding-right:16px;">${photoHTML}</td>
        <td style="vertical-align:middle;">
          <div style="font-size:20px;font-weight:bold;color:#ffffff;margin-bottom:2px;">${data.fullName || ""}</div>
          <div style="font-size:13px;color:${c.accent};font-weight:600;">${data.jobTitle || ""}</div>
          ${data.company ? `<div style="font-size:12px;color:#cbd5e0;margin-top:2px;">${data.company}</div>` : ""}
        </td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="padding:14px 20px;background:#f7fafc;border:1px solid #e2e8f0;border-top:3px solid ${c.accent};border-radius:0 0 8px 8px;">
      <table cellpadding="0" cellspacing="0" border="0" style="font-size:12px;color:#4a5568;">
        ${data.email ? `<tr><td style="padding:2px 0;">✉ <a href="mailto:${data.email}" style="color:${c.primary};text-decoration:none;">${data.email}</a></td></tr>` : ""}
        ${data.phone ? `<tr><td style="padding:2px 0;">☏ <a href="tel:${data.phone.replace(/\s/g, "")}" style="color:${c.primary};text-decoration:none;">${data.phone}</a></td></tr>` : ""}
        ${data.website ? `<tr><td style="padding:2px 0;">◈ <a href="https://${data.website.replace(/^https?:\/\//, "")}" style="color:${c.primary};text-decoration:none;">${data.website}</a></td></tr>` : ""}
        ${data.address ? `<tr><td style="padding:2px 0;">◉ ${data.address}</td></tr>` : ""}
      </table>
      ${socialLinks ? `<div style="margin-top:10px;">${socialLinks}</div>` : ""}
      ${viralFooter ? `<table cellpadding="0" cellspacing="0" border="0">${viralFooter}</table>` : ""}
    </td>
  </tr>
</table>`;
  }

  if (template === "elegant") {
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f.family};max-width:500px;">
  <tr>
    <td style="padding-bottom:12px;border-bottom:2px solid ${c.accent};">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:top;padding-right:18px;">${photoHTML}</td>
        <td style="vertical-align:top;">
          <div style="font-size:18px;font-weight:bold;color:${c.primary};letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">${data.fullName || ""}</div>
          <div style="font-size:12px;color:${c.accent};letter-spacing:2px;text-transform:uppercase;font-weight:500;">${data.jobTitle || ""}</div>
          ${data.company ? `<div style="font-size:12px;color:#718096;margin-top:4px;font-style:italic;">${data.company}</div>` : ""}
        </td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="padding-top:12px;">
      <table cellpadding="0" cellspacing="0" border="0" style="font-size:12px;color:#4a5568;">
        <tr>
          ${data.email ? `<td style="padding-right:16px;"><a href="mailto:${data.email}" style="color:${c.primary};text-decoration:none;">${data.email}</a></td>` : ""}
          ${data.phone ? `<td style="padding-right:16px;border-left:1px solid #e2e8f0;padding-left:16px;"><a href="tel:${data.phone.replace(/\s/g, "")}" style="color:${c.primary};text-decoration:none;">${data.phone}</a></td>` : ""}
          ${data.website ? `<td style="border-left:1px solid #e2e8f0;padding-left:16px;"><a href="https://${data.website.replace(/^https?:\/\//, "")}" style="color:${c.primary};text-decoration:none;">${data.website}</a></td>` : ""}
        </tr>
      </table>
      ${data.address ? `<div style="font-size:11px;color:#a0aec0;margin-top:6px;">${data.address}</div>` : ""}
      ${socialLinks ? `<div style="margin-top:10px;">${socialLinks}</div>` : ""}
    </td>
  </tr>
  ${viralFooter}
</table>`;
  }

  if (template === "creative") {
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f.family};max-width:500px;">
  <tr>
    <td style="padding:4px 0;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:top;padding-right:4px;">
          <div style="width:6px;min-height:100px;background:linear-gradient(180deg,${c.primary},${c.accent});border-radius:3px;"></div>
        </td>
        <td style="vertical-align:top;padding-left:14px;">
          <div style="font-size:22px;font-weight:800;color:${c.primary};line-height:1.1;">${data.fullName || ""}</div>
          <div style="font-size:13px;color:${c.accent};font-weight:600;margin-top:4px;">${data.jobTitle || ""}${data.company ? ` · ${data.company}` : ""}</div>
          <div style="margin-top:10px;font-size:12px;color:#4a5568;">
            ${data.email ? `<div style="margin-bottom:3px;"><a href="mailto:${data.email}" style="color:#4a5568;text-decoration:none;">→ ${data.email}</a></div>` : ""}
            ${data.phone ? `<div style="margin-bottom:3px;"><a href="tel:${data.phone.replace(/\s/g, "")}" style="color:#4a5568;text-decoration:none;">→ ${data.phone}</a></div>` : ""}
            ${data.website ? `<div style="margin-bottom:3px;"><a href="https://${data.website.replace(/^https?:\/\//, "")}" style="color:#4a5568;text-decoration:none;">→ ${data.website}</a></div>` : ""}
            ${data.address ? `<div style="margin-bottom:3px;color:#a0aec0;">→ ${data.address}</div>` : ""}
          </div>
          ${socialLinks ? `<div style="margin-top:10px;">${socialLinks}</div>` : ""}
        </td>
      </tr></table>
    </td>
  </tr>
  ${viralFooter}
</table>`;
  }

  // Default: modern
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f.family};max-width:500px;">
  <tr>
    <td style="padding-right:18px;vertical-align:top;border-right:3px solid ${c.accent};">
      ${photoHTML}
    </td>
    <td style="padding-left:18px;vertical-align:top;">
      <div style="font-size:18px;font-weight:bold;color:${c.primary};margin-bottom:2px;">${data.fullName || ""}</div>
      <div style="font-size:13px;color:${c.accent};font-weight:500;margin-bottom:8px;">${data.jobTitle || ""}${data.company ? ` | ${data.company}` : ""}</div>
      <table cellpadding="0" cellspacing="0" border="0" style="font-size:12px;color:#4a5568;">
        ${data.email ? `<tr><td style="padding:2px 0;"><a href="mailto:${data.email}" style="color:#4a5568;text-decoration:none;">${data.email}</a></td></tr>` : ""}
        ${data.phone ? `<tr><td style="padding:2px 0;"><a href="tel:${data.phone.replace(/\s/g, "")}" style="color:#4a5568;text-decoration:none;">${data.phone}</a></td></tr>` : ""}
        ${data.website ? `<tr><td style="padding:2px 0;"><a href="https://${data.website.replace(/^https?:\/\//, "")}" style="color:#4a5568;text-decoration:none;">${data.website}</a></td></tr>` : ""}
        ${data.address ? `<tr><td style="padding:2px 0;color:#a0aec0;">${data.address}</td></tr>` : ""}
      </table>
      ${socialLinks ? `<div style="margin-top:8px;">${socialLinks}</div>` : ""}
    </td>
  </tr>
  ${viralFooter}
</table>`;
}

function LandingPage({ onGetStarted }) {
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimIn(true), 100);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#e2e8f0", overflow: "hidden", position: "relative" }}>
      {/* Animated background */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
        background: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(198,148,26,0.06) 0%, transparent 50%)",
      }} />

      {/* Nav */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 32px", position: "relative", zIndex: 10,
        opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(-20px)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #c6941a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 18, color: "#fff",
          }}>S</div>
          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: -0.5 }}>
            Sign<span style={{ color: "#c6941a" }}>Craft</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 14, fontWeight: 500 }}>
          <span style={{ color: "#94a3b8", cursor: "pointer" }}>Templates</span>
          <span style={{ color: "#94a3b8", cursor: "pointer" }}>Pricing</span>
          <button onClick={onGetStarted} style={{
            background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff",
            border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600,
            cursor: "pointer", fontSize: 13, transition: "transform 0.2s",
          }}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "80px 32px 40px", textAlign: "center",
        position: "relative", zIndex: 10,
        opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(40px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s",
      }}>
        <div style={{
          display: "inline-block", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 99, padding: "6px 16px", fontSize: 12, fontWeight: 600, color: "#818cf8",
          marginBottom: 28, letterSpacing: 0.5,
        }}>
          ✦ USED BY 50,000+ PROFESSIONALS
        </div>
        <h1 style={{
          fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, margin: "0 0 24px",
          background: "linear-gradient(135deg, #ffffff 30%, #c6941a 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Your email signature<br />should work for you.
        </h1>
        <p style={{
          fontSize: 18, color: "#94a3b8", maxWidth: 520, margin: "0 auto 40px",
          lineHeight: 1.6, fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>
          Create a stunning, professional email signature in 60 seconds.
          Free forever. No design skills needed.
        </p>
        <button onClick={onGetStarted} style={{
          background: "linear-gradient(135deg, #c6941a, #d4a843)", color: "#0a0e1a",
          border: "none", borderRadius: 12, padding: "16px 40px", fontWeight: 700,
          fontSize: 16, cursor: "pointer", letterSpacing: 0.3,
          boxShadow: "0 0 40px rgba(198,148,26,0.3)",
          transition: "all 0.3s ease",
        }}>
          Create My Signature →
        </button>
        <p style={{ fontSize: 12, color: "#475569", marginTop: 12 }}>Free • No sign-up required • Takes 60 seconds</p>
      </div>

      {/* Preview cards */}
      <div style={{
        maxWidth: 800, margin: "40px auto 0", padding: "0 32px",
        display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
        opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(60px)",
        transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s",
      }}>
        {[
          { name: "Sarah Chen", title: "VP of Engineering", color: "#6366f1" },
          { name: "Marcus Rivera", title: "Creative Director", color: "#c6941a" },
          { name: "Emma Larsson", title: "Growth Lead", color: "#10b981" },
        ].map((person, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, padding: 20, flex: "1 1 200px", maxWidth: 240,
            backdropFilter: "blur(10px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: person.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 16, color: "#fff",
              }}>{person.name[0]}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{person.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{person.title}</div>
              </div>
            </div>
            <div style={{ height: 2, background: person.color, borderRadius: 1, opacity: 0.6 }} />
            <div style={{ marginTop: 10, fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
              <div>✉ {person.name.toLowerCase().replace(" ", ".")}@company.com</div>
              <div>☏ +1 (555) 000-0000</div>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{
        maxWidth: 900, margin: "100px auto 0", padding: "0 32px",
        opacity: animIn ? 1 : 0, transition: "all 1.4s cubic-bezier(0.16,1,0.3,1) 0.8s",
      }}>
        <h2 style={{
          textAlign: "center", fontSize: 32, fontWeight: 700, letterSpacing: -1,
          fontFamily: "'Segoe UI', system-ui, sans-serif", marginBottom: 48,
        }}>
          Everything you need. <span style={{ color: "#c6941a" }}>Nothing you don't.</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: "⚡", title: "60-Second Setup", desc: "Fill in your details, pick a template, done." },
            { icon: "🎨", title: "4 Pro Templates", desc: "Modern, Bold, Elegant, and Creative styles." },
            { icon: "📋", title: "One-Click Copy", desc: "Copy HTML and paste into any email client." },
            { icon: "🌍", title: "Works Everywhere", desc: "Gmail, Outlook, Apple Mail, Thunderbird." },
            { icon: "📱", title: "Mobile Responsive", desc: "Signatures that look great on any device." },
            { icon: "🔒", title: "Privacy First", desc: "Your data stays in your browser. Period." },
          ].map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: 24,
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{
        maxWidth: 700, margin: "100px auto", padding: "0 32px",
        opacity: animIn ? 1 : 0, transition: "all 1.6s cubic-bezier(0.16,1,0.3,1) 1s",
      }}>
        <h2 style={{
          textAlign: "center", fontSize: 32, fontWeight: 700, letterSpacing: -1,
          fontFamily: "'Segoe UI', system-ui, sans-serif", marginBottom: 48,
        }}>
          Simple, <span style={{ color: "#c6941a" }}>transparent</span> pricing
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: 32,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Free</div>
            <div style={{ fontSize: 40, fontWeight: 800, margin: "8px 0" }}>€0</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Forever free</div>
            {["All 4 templates", "Unlimited signatures", "One-click copy", "Social media icons", "Mobile responsive"].map((item, i) => (
              <div key={i} style={{ fontSize: 13, padding: "6px 0", color: "#94a3b8" }}>✓ {item}</div>
            ))}
            <div style={{ fontSize: 11, color: "#475569", marginTop: 12, fontStyle: "italic" }}>Includes "Made with SignCraft" link</div>
            <button onClick={onGetStarted} style={{
              display: "block", width: "100%", textAlign: "center", marginTop: 20,
              background: "rgba(255,255,255,0.06)", color: "#e2e8f0",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 24px", fontWeight: 700,
              fontSize: 14, cursor: "pointer",
            }}>Get Started Free</button>
          </div>
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(198,148,26,0.1))",
            border: "1px solid rgba(198,148,26,0.3)", borderRadius: 16, padding: 32, position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -10, right: 20, background: "#c6941a", color: "#0a0e1a",
              borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700,
            }}>POPULAR</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c6941a", textTransform: "uppercase", letterSpacing: 1 }}>Premium</div>
            <div style={{ fontSize: 40, fontWeight: 800, margin: "8px 0" }}>€7<span style={{ fontSize: 20 }}>.99</span></div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>per month</div>
            {["Everything in Free", "Remove SignCraft branding", "Premium color schemes", "Custom font uploads", "Priority email support", "Click analytics"].map((item, i) => (
              <div key={i} style={{ fontSize: 13, padding: "6px 0", color: "#e2e8f0" }}>✓ {item}</div>
            ))}
            <a href="https://buy.stripe.com/YOUR_LINK_HERE" target="_blank" rel="noopener noreferrer" style={{
              display: "block", textAlign: "center", marginTop: 20,
              background: "linear-gradient(135deg, #c6941a, #d4a843)", color: "#0a0e1a",
              border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700,
              fontSize: 14, textDecoration: "none", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(198,148,26,0.3)",
            }}>Get Premium →</a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "40px 32px 80px" }}>
        <button onClick={onGetStarted} style={{
          background: "linear-gradient(135deg, #c6941a, #d4a843)", color: "#0a0e1a",
          border: "none", borderRadius: 12, padding: "16px 40px", fontWeight: 700,
          fontSize: 16, cursor: "pointer",
        }}>
          Create My Free Signature →
        </button>
      </div>
    </div>
  );
}

function SignatureEditor({ onBack }) {
  const [data, setData] = useState(DEFAULT_DATA);
  const [template, setTemplate] = useState("modern");
  const [colorScheme, setColorScheme] = useState("navy");
  const [font, setFont] = useState("arial");
  const [isPremium] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const previewRef = useRef(null);

  const updateField = useCallback((field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateSocial = useCallback((platformId, value) => {
    setData((prev) => ({ ...prev, socials: { ...prev.socials, [platformId]: value } }));
  }, []);

  const handleCopy = useCallback(() => {
    const html = generateSignatureHTML(data, template, colorScheme, font, isPremium);
    // Copy as rich HTML
    const blob = new Blob([html], { type: "text/html" });
    const plainBlob = new Blob([html], { type: "text/plain" });
    const clipItem = new ClipboardItem({ "text/html": blob, "text/plain": plainBlob });
    navigator.clipboard.write([clipItem]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [data, template, colorScheme, font, isPremium]);

  const signatureHTML = generateSignatureHTML(data, template, colorScheme, font, isPremium);

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #2d3748",
    background: "#0f1629", color: "#e2e8f0", fontSize: 13, outline: "none",
    fontFamily: "'Segoe UI', system-ui, sans-serif", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = { fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: 0.5 };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#e2e8f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{
            background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, padding: "4px 8px",
          }}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #c6941a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 14, color: "#fff",
            }}>S</div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Sign<span style={{ color: "#c6941a" }}>Craft</span></span>
          </div>
        </div>
        <button onClick={handleCopy} style={{
          background: copied ? "#10b981" : "linear-gradient(135deg, #c6941a, #d4a843)",
          color: copied ? "#fff" : "#0a0e1a",
          border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700,
          fontSize: 13, cursor: "pointer", transition: "all 0.3s",
          minWidth: 160,
        }}>
          {copied ? "✓ Copied to Clipboard!" : "📋 Copy Signature HTML"}
        </button>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 57px)" }}>
        {/* Editor panel */}
        <div style={{
          width: 380, minWidth: 380, borderRight: "1px solid rgba(255,255,255,0.06)",
          overflowY: "auto", padding: "0",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { id: "details", label: "Details" },
              { id: "style", label: "Style" },
              { id: "social", label: "Social" },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flex: 1, padding: "14px 0", background: "none", border: "none",
                borderBottom: activeTab === tab.id ? "2px solid #c6941a" : "2px solid transparent",
                color: activeTab === tab.id ? "#e2e8f0" : "#64748b",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              }}>{tab.label}</button>
            ))}
          </div>

          <div style={{ padding: 20 }}>
            {activeTab === "details" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={data.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="John Smith" /></div>
                <div><label style={labelStyle}>Job Title</label><input style={inputStyle} value={data.jobTitle} onChange={(e) => updateField("jobTitle", e.target.value)} placeholder="Product Designer" /></div>
                <div><label style={labelStyle}>Company</label><input style={inputStyle} value={data.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Acme Inc." /></div>
                <div><label style={labelStyle}>Email</label><input style={inputStyle} value={data.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@company.com" type="email" /></div>
                <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={data.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 (555) 123-4567" /></div>
                <div><label style={labelStyle}>Website</label><input style={inputStyle} value={data.website} onChange={(e) => updateField("website", e.target.value)} placeholder="www.yoursite.com" /></div>
                <div><label style={labelStyle}>Address (optional)</label><input style={inputStyle} value={data.address} onChange={(e) => updateField("address", e.target.value)} placeholder="123 Main St, City" /></div>
                <div><label style={labelStyle}>Photo URL (optional)</label><input style={inputStyle} value={data.photoUrl} onChange={(e) => updateField("photoUrl", e.target.value)} placeholder="https://example.com/photo.jpg" /></div>
              </div>
            )}

            {activeTab === "style" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Template</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                    {TEMPLATES.map((t) => (
                      <button key={t.id} onClick={() => setTemplate(t.id)} style={{
                        background: template === t.id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                        border: template === t.id ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10, padding: 14, cursor: "pointer", textAlign: "left",
                        color: "#e2e8f0", transition: "all 0.2s",
                      }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{t.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Color Scheme</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
                    {COLOR_SCHEMES.map((cs) => (
                      <button key={cs.id} onClick={() => setColorScheme(cs.id)} style={{
                        background: colorScheme === cs.id ? "rgba(255,255,255,0.08)" : "transparent",
                        border: colorScheme === cs.id ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8, padding: 10, cursor: "pointer", textAlign: "center",
                      }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 6 }}>
                          <div style={{ width: 16, height: 16, borderRadius: 4, background: cs.primary }} />
                          <div style={{ width: 16, height: 16, borderRadius: 4, background: cs.accent }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>{cs.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Font</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                    {FONTS.map((fo) => (
                      <button key={fo.id} onClick={() => setFont(fo.id)} style={{
                        background: font === fo.id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                        border: font === fo.id ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8, padding: "10px 14px", cursor: "pointer", textAlign: "left",
                        fontFamily: fo.family, color: "#e2e8f0", fontSize: 14,
                      }}>{fo.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 6px" }}>Add your social media profiles. Just enter your username or full URL.</p>
                {SOCIAL_PLATFORMS.map((platform) => (
                  <div key={platform.id}>
                    <label style={labelStyle}>
                      <span style={{ marginRight: 6 }}>{platform.icon}</span>
                      {platform.label}
                    </label>
                    <input
                      style={inputStyle}
                      value={data.socials[platform.id] || ""}
                      onChange={(e) => updateSocial(platform.id, e.target.value)}
                      placeholder={`${platform.prefix}yourname`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, background: "rgba(255,255,255,0.01)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>
            Live Preview
          </div>
          <div style={{
            background: "#ffffff", borderRadius: 16, padding: 40, maxWidth: 600, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}>
            {/* Fake email UI */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 11, color: "#a0aec0", marginBottom: 4 }}>From: {data.email || "you@company.com"}</div>
              <div style={{ fontSize: 11, color: "#a0aec0", marginBottom: 8 }}>To: client@example.com</div>
              <div style={{ fontSize: 14, color: "#2d3748", fontWeight: 600 }}>Re: Project Update</div>
            </div>
            <div style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.7, marginBottom: 24 }}>
              Hi there,<br /><br />
              Just following up on our conversation. Looking forward to hearing from you!<br /><br />
              Best regards,
            </div>
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
              <div ref={previewRef} dangerouslySetInnerHTML={{ __html: signatureHTML }} />
            </div>
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
            <button onClick={handleCopy} style={{
              background: copied ? "#10b981" : "linear-gradient(135deg, #c6941a, #d4a843)",
              color: copied ? "#fff" : "#0a0e1a",
              border: "none", borderRadius: 10, padding: "14px 32px", fontWeight: 700,
              fontSize: 14, cursor: "pointer", transition: "all 0.3s",
              boxShadow: "0 4px 20px rgba(198,148,26,0.3)",
            }}>
              {copied ? "✓ Copied!" : "📋 Copy Signature"}
            </button>
          </div>

          <div style={{
            marginTop: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 10, padding: "14px 20px", maxWidth: 500,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#818cf8", marginBottom: 4 }}>How to use your signature</div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>
              1. Click "Copy Signature" above<br />
              2. Open your email client (Gmail, Outlook, etc.)<br />
              3. Go to Settings → Signature<br />
              4. Paste your new signature<br />
              5. That's it! Every email you send will look professional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignCraftApp() {
  const [page, setPage] = useState("landing");

  if (page === "editor") {
    return <SignatureEditor onBack={() => setPage("landing")} />;
  }

  return <LandingPage onGetStarted={() => setPage("editor")} />;
}
