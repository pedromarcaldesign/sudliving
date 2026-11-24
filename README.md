# Sud Living · sudliving.pt

Site estático gerado com [Eleventy](https://www.11ty.dev/), editado no [Pages CMS](https://app.pagescms.org) e publicado no [Netlify](https://www.netlify.com/).

## Como editar (backoffice)
1. Entrar em **https://app.pagescms.org** com a conta GitHub `pedromarcaldesign`.
2. Abrir o repositório `sudliving`, branch `main`.
3. Editar **Imóveis à venda**, **Projetos**, **Equipa**, **Parceiros**, **Textos e contactos** ou **Páginas legais**, e carregar em **Save**.
4. O Netlify publica o site sozinho em 1 a 2 minutos.

Só quem tem acesso ao repositório no GitHub consegue editar.

## Fotografias
Carregue as fotografias em JPG ou PNG, de preferência com 2000 px ou mais. Em cada publicação, o site gera versões AVIF, WebP e JPEG em vários tamanhos (`lib/images.js`), e cada browser recebe a mais leve que suporta. As fotografias já convertidas ficam guardadas em cache no Netlify e não são reconvertidas.

## SEO e GEO (pesquisa com IA)
- HTML gerado no servidor, URL canónico, Open Graph e Twitter Cards em todas as páginas
- Uma página por imóvel em `/imoveis/<nome>/`
- Dados estruturados schema.org: `RealEstateAgent`, `WebSite`, `ItemList`, `RealEstateListing` com `Offer`, e `BreadcrumbList`
- `sitemap.xml`, `robots.txt` que deixa entrar os motores de pesquisa e os assistentes de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…), e `llms.txt` com um resumo do negócio e dos imóveis
- Lighthouse: 100 em Desempenho, Acessibilidade, Boas práticas e SEO, no telemóvel e no computador, em todas as páginas indexáveis

## Estrutura
- `src/imoveis/*.md`: um ficheiro por imóvel
- `src/projetos/*.md`: projetos antes/depois
- `src/_data/site.json`, `equipa.json`, `parceiros.json`: textos, contactos, dados legais, equipa e parceiros
- `src/paginas/*.md`: Política de Privacidade e Acessibilidade
- `src/images/`: fotografias originais (carregadas pelo Pages CMS)
- `src/_includes/`: modelos e CSS
- `.pages.yml`: configuração do backoffice
- `netlify.toml`: build, cabeçalhos de segurança e cache

## Desenvolvimento local
```bash
npm install
npm start
```

## Variáveis no Netlify
- `SITE_URL=https://sudliving.pt`: endereço usado nos URLs canónicos, no sitemap e nos dados estruturados

## Em falta
- Dados legais (rodapé): denominação social, NIPC, sede, capital social, conservatória e licença AMI (se aplicável)
- Classe energética de cada imóvel à venda
- Fotografias "antes" dos projetos, da Casa Bartolomeu, da Casa Perestrelo e dos imóveis sem fotos
- Fotografias da equipa, logótipos e links dos parceiros, links das redes sociais
- Revisão jurídica da Política de Privacidade
