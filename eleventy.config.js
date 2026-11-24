import { SRC, picture, imageUrl } from "./lib/images.js";
import markdownIt from "markdown-it";
import { baseGraph } from "./lib/schema.js";

const md = markdownIt({ html: false, linkify: false, typographer: false });

const fmtNumber = (n) => new Intl.NumberFormat("pt-PT").format(n).replace(/ | /g, " ");

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/logo": "assets/logo" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addWatchTarget("src/_includes/style.css");

  eleventyConfig.addAsyncShortcode("picture", picture);
  eleventyConfig.addAsyncShortcode("imageUrl", imageUrl);

  eleventyConfig.addFilter("price", (n) => (n || n === 0 ? `${fmtNumber(n)} €` : "Sob consulta"));
  eleventyConfig.addFilter("num", fmtNumber);
  eleventyConfig.addFilter("md", (s) => md.render(s || "").replace(/<a href="http/g, '<a target="_blank" rel="noopener" href="http'));
  eleventyConfig.addFilter("schemaGraph", (site, base, extra) => {
    const graph = [...baseGraph(site, base), ...(Array.isArray(extra) ? extra : [])];
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  });
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("bedrooms", (t) => {
    const m = /^[TV](\d+)/i.exec(t || "");
    return m ? Number(m[1]) : null;
  });
  eleventyConfig.addFilter("absolute", (url, base) => (url && !/^https?:/.test(url) ? new URL(url, base).href : url));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  eleventyConfig.addFilter("minifyCss", (css) =>
    css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim()
  );
  eleventyConfig.addFilter("stripTags", (s) => String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
  eleventyConfig.addFilter("truncate", (s, n = 155) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s));

  const byOrder = (a, b) => (a.data.ordem ?? 99) - (b.data.ordem ?? 99);
  eleventyConfig.addCollection("imoveis", (api) => api.getFilteredByGlob("src/imoveis/*.md").sort(byOrder));
  eleventyConfig.addCollection("projetos", (api) => api.getFilteredByGlob("src/projetos/*.md").sort(byOrder));

  return {
    dir: { input: SRC, includes: "_includes", layouts: "_includes/layouts", data: "_data", output: "_site" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
