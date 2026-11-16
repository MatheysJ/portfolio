import { serializeJsonLd } from "./jsonLd";

describe("serializeJsonLd", () => {
  it("não permite fechar a tag <script> pelo conteúdo", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)" });

    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual({ name: "</script><script>alert(1)" });
  });
});
