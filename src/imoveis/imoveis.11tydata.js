import { imageUrl } from "../../lib/images.js";

const tipo = (t) => (t === "Terreno" ? "Landform" : /^V/i.test(t || "") ? "SingleFamilyResidence" : "Residence");

export default {
  layout: "imovel.njk",
  ogType: "website",
  bodyClass: "page-imovel",
  showContact: true,
  permalink: (data) => `/imoveis/${data.page.fileSlug}/`,
  eleventyComputed: {
    description: (d) => d.resumo,
    ogImage: (d) => (Array.isArray(d.imagens) && d.imagens[0] ? d.imagens[0].src : undefined),
    jsonld: async (d) => {
      // Na análise de dependências o Eleventy chama esta função com dados vazios
      if (typeof d.page?.date?.toISOString !== "function" || typeof d.build?.url !== "string") return [];
      const base = d.build.url;
      const url = base + d.page.url;
      const images = [];
      for (const img of (d.imagens || []).slice(0, 6)) {
        const u = img?.src ? await imageUrl(img.src, 1200) : null;
        if (u) images.push(base + u);
      }
      const quartos = /^[TV](\d+)/i.exec(d.tipologia || "");
      const area = d.area
        ? { "@type": "QuantitativeValue", value: d.area, unitCode: d.unidade === "ha" ? "HAR" : "MTK", unitText: d.unidade }
        : undefined;
      const local = {
        "@type": "PostalAddress",
        addressLocality: d.localidade,
        addressRegion: d.concelho ? `${d.concelho}, Algarve` : "Algarve",
        addressCountry: "PT",
      };
      const item = {
        "@type": tipo(d.tipologia),
        name: d.title,
        description: d.resumo,
        address: local,
        ...(d.tipologia === "Terreno" ? {} : { floorSize: area, numberOfBedrooms: quartos ? Number(quartos[1]) : undefined }),
        ...(d.tipologia === "Terreno" ? { additionalProperty: area ? [{ "@type": "PropertyValue", name: "Área", value: d.area, unitText: d.unidade }] : undefined } : {}),
        image: images.length ? images : undefined,
      };
      const offer = {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: d.estado === "vendido" ? undefined : d.preco || undefined,
        availability:
          d.estado === "vendido" ? "https://schema.org/SoldOut" : d.estado === "brevemente" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
        businessFunction: "http://purl.org/goodrelations/v1#Sell",
        seller: { "@id": base + "/#organizacao" },
        url,
      };
      return [
        {
          "@type": "RealEstateListing",
          "@id": url + "#anuncio",
          url,
          name: `${d.title}${d.tipologia ? " · " + d.tipologia : ""}${d.localidade ? " em " + d.localidade : ""}`,
          description: d.resumo,
          inLanguage: "pt-PT",
          datePosted: d.page.date.toISOString().slice(0, 10),
          image: images.length ? images : undefined,
          about: item,
          offers: offer,
          provider: { "@id": base + "/#organizacao" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: base + "/" },
            { "@type": "ListItem", position: 2, name: "Imóveis", item: base + "/#imoveis" },
            { "@type": "ListItem", position: 3, name: d.title, item: url },
          ],
        },
      ];
    },
  },
};
