# Portfólio · Cubo 3D

**https://portfolio.matheus-junior.xyz**

Portfólio pessoal em uma única página: um cubo 3D com uma seção do currículo em cada face (Início, Experiência, Projetos, Stack, Formação e Contato). O cubo pode ser girado arrastando, pelas setas do teclado, pelas setas nas bordas de cada face ou pela navegação abaixo dele. Cada face tem uma URL própria (`#experiencia`, `#contato`…).

## Stack

- **Next.js 15** (Pages Router, página estática) · **React 19** · **TypeScript** em modo `strict`
- **Chakra UI 3** para componentes e **styled-components** para a geometria do cubo
- **Jest** + **Testing Library** para testes
- **GitHub Actions** + **Lighthouse CI** como portão de qualidade, com deploy na Cloudflare

## Como rodar

Requer Node.js 22 e Yarn 1.

```bash
yarn install
yarn dev          # http://localhost:3000
```

| Script            | O que faz                                              |
| ----------------- | ------------------------------------------------------ |
| `yarn build`      | Build de produção                                      |
| `yarn start`      | Serve o build de produção                              |
| `yarn lint`       | ESLint                                                 |
| `yarn typecheck`  | Checagem de tipos (`tsc --noEmit`)                     |
| `yarn test`       | Testes                                                 |
| `yarn test:ci`    | Testes com cobertura                                   |
| `yarn lighthouse` | Lighthouse CI contra o build (rode `yarn build` antes) |

O site fica em **https://portfolio.matheus-junior.xyz**, domínio usado na URL canônica, no `og:url` e no JSON-LD. Para outro ambiente, sobrescreva com a variável `NEXT_PUBLIC_SITE_URL` no build.

## Como o cubo funciona

A parte interessante do projeto está em [`src/utils/orientation`](src/utils/orientation/index.ts) e [`src/hooks/useCubeRotation`](src/hooks/useCubeRotation/index.ts).

**Orientação como matriz, não como ângulos.** Uma abordagem comum é guardar `rotateX` e `rotateY` e somar 90° a cada giro. Isso quebra assim que o cubo sai do "anel" horizontal: depois de subir para o topo, girar para a direita passa a girar em torno do eixo errado. Aqui a orientação é uma matriz de rotação 3×3, e cada giro multiplica a orientação atual por uma rotação de 90° no eixo *da tela*. Qualquer sequência de giros funciona, e a face visível é derivada da matriz (a face cuja normal aponta mais para o usuário).

**Conteúdo sempre em pé.** Ao chegar a uma face por um caminho diferente, o conteúdo dela pode estar de lado ou de cabeça para baixo. `getContentAngle` calcula, a partir da matriz, quanto girar o conteúdo (em múltiplos de 90°) para que ele chegue legível.

**Animação por quaternions.** A interpolação de `matrix3d()` feita pelo CSS não garante o menor caminho em todos os navegadores: o cubo poderia girar 270° pelo lado errado. Por isso a animação roda em JS: a matriz vira um quaternion e é interpolada com *slerp* pelo menor caminho. A cada quadro, a orientação é escrita direto numa variável CSS (`--cube-orientation`), sem re-render do React.

**Interação.** O eixo do arraste é decidido pela direção dominante do movimento. Arrastes curtos e rápidos também trocam de face. Um arraste não dispara o clique dos links da face. Em telas de toque, o arraste vertical fica com a rolagem do conteúdo. As animações respeitam `prefers-reduced-motion`.

## Testes

Os testes de `orientation` são, em boa parte, baseados em propriedades: sequências aleatórias de giros (com semente fixa, para serem reprodutíveis) verificam que quatro giros voltam ao início, que qualquer face é alcançável de qualquer orientação e que a face ativa sempre termina em pé. Os testes do hook simulam arraste com ponteiro, teclado e a animação com timers falsos.

## CI e deploy

O workflow em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) só valida, sem credenciais da Cloudflare:

- lint, checagem de tipos e testes;
- build e Lighthouse, falhando se performance, acessibilidade, boas práticas ou SEO ficarem abaixo de 90 ([`lighthouserc.json`](lighthouserc.json));
- build do Worker com [OpenNext](https://opennext.js.org/cloudflare) e `wrangler deploy --dry-run`, o mesmo artefato publicado em produção.

O deploy é feito pela integração **Workers Builds** da Cloudflare, que builda e publica o Worker `portfolio` ([`wrangler.jsonc`](wrangler.jsonc)) a cada push. Para publicar manualmente ou testar o Worker localmente:

```bash
yarn preview   # build com OpenNext + Worker local
yarn deploy    # build com OpenNext + deploy (requer login no Wrangler)
```

## Estrutura

```
src/
├── components/Common/   # Cubo, faces, navegação e botões
├── config/              # SEO (meta tags, JSON-LD) e tema do Chakra
├── constants/           # Conteúdo do currículo, faces e direções
├── hooks/               # useCubeRotation, useHashNavigation
├── pages/               # Página única + _app/_document
└── utils/orientation/   # Matrizes, quaternions e slerp
```

O conteúdo do currículo fica todo em [`src/constants/content.ts`](src/constants/content.ts).
