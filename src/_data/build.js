// URL pública do site: no Netlify usa a variável SITE_URL (definir quando o domínio estiver ligado) ou o URL do próprio Netlify.
export default {
  url: (process.env.SITE_URL || process.env.URL || "https://sudliving.pt").replace(/\/$/, ""),
  date: new Date(),
};
