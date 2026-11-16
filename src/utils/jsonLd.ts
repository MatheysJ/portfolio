/** Serializa JSON-LD sem permitir que o conteúdo feche a tag <script>. */
export const serializeJsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
