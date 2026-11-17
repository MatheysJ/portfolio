import { serializeJsonLd } from "./jsonLd";

describe("serializeJsonLd", () => {
  it("does not let the content close the <script> tag", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)" });

    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual({ name: "</script><script>alert(1)" });
  });
});
