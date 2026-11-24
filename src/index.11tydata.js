export default {
  eleventyComputed: {
    jsonld: (data) => {
      if (typeof data.build?.url !== "string") return [];
      const base = data.build.url;
      const list = (data.collections.imoveis || []).map((i, n) => ({
        "@type": "ListItem",
        position: n + 1,
        url: base + i.url,
        name: i.data.title,
      }));
      return [{ "@type": "ItemList", name: "Imóveis Sud Living", itemListElement: list }];
    },
  },
};
