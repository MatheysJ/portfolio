import {
  ChildrenAsProps,
  Faceable,
  Paintable,
  RotationController,
} from "@/types";

/** Props que o cubo repassa ao conteúdo de cada face. */
export type CubeFaceContentProps = Paintable & Faceable & RotationController;

export interface CubeFaceProps extends ChildrenAsProps, CubeFaceContentProps {
  /** Padrão: o nome da seção em maiúsculas. */
  title?: string;
  /** Nível semântico do título (a face inicial usa h1). */
  titleAs?: "h1" | "h2";
}
