// Dados estruturados (schema.org) da empresa e do site, comuns a todas as páginas
const filled = (v) => (v && !String(v).includes("[") ? v : undefined);

export function baseGraph(site, base) {
  const org = {
    "@type": ["RealEstateAgent", "Organization"],
    "@id": `${base}/#organizacao`,
    name: site.nome,
    legalName: filled(site.legal?.denominacao),
    slogan: site.lema,
    description: site.descricao,
    url: `${base}/`,
    logo: `${base}/assets/logo/logo-sud-living-preto.png`,
    image: `${base}/assets/logo/logo-sud-living-preto.png`,
    email: site.email,
    telephone: site.telefone.replace(/\s/g, ""),
    areaServed: [
      { "@type": "AdministrativeArea", name: "Algarve" },
      { "@type": "Country", name: "Portugal" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: filled(site.legal?.morada),
      postalCode: site.legal?.codigo_postal || undefined,
      addressLocality: site.legal?.localidade || undefined,
      addressRegion: "Algarve",
      addressCountry: "PT",
    },
    vatID: filled(site.legal?.nipc) ? `PT${site.legal.nipc.replace(/\s/g, "")}` : undefined,
    knowsAbout: [
      "Compra e venda de imóveis no Algarve",
      "Recuperação de casas tradicionais algarvias",
      "Investimento imobiliário no Algarve",
      "Alojamento local",
    ],
    subOrganization: { "@type": "LodgingBusiness", name: "Casas da Areia", url: "https://casasdaareia.com" },
    sameAs: [...Object.values(site.redes || {}), "https://casasdaareia.com"].filter(Boolean),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: `${base}/`,
    name: site.nome,
    inLanguage: "pt-PT",
    publisher: { "@id": `${base}/#organizacao` },
  };
  return [org, website];
}
