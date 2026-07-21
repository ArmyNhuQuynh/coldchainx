export const ORDER_CATEGORY = {
  MEAT_SEAFOOD: "MEAT_SEAFOOD",
  FROZEN_FRUITS_VEGGIES: "FROZEN_FRUITS_VEGGIES",
  ICE_CREAM_BEVERAGES: "ICE_CREAM_BEVERAGES",
  PHARMACEUTICALS: "PHARMACEUTICALS",
  RAW_MATERIALS_OTHERS: "RAW_MATERIALS_OTHERS",
} as const;

export type TOrderCategory = (typeof ORDER_CATEGORY)[keyof typeof ORDER_CATEGORY];

export function getOrderCategoryLabel(category: TOrderCategory): {
  label: string;
  className: string;
} {
  switch (category) {
    case ORDER_CATEGORY.MEAT_SEAFOOD:
      return {
        label: "Thịt & Hải sản",
        className: "border-red-400 text-red-700 bg-transparent",
      };
    case ORDER_CATEGORY.FROZEN_FRUITS_VEGGIES:
      return {
        label: "Rau củ & Trái cây đông lạnh",
        className: "border-green-400 text-green-700 bg-transparent",
      };
    case ORDER_CATEGORY.ICE_CREAM_BEVERAGES:
      return {
        label: "Kem & Đồ uống",
        className: "border-blue-400 text-blue-700 bg-transparent",
      };
    case ORDER_CATEGORY.PHARMACEUTICALS:
      return {
        label: "Dược phẩm",
        className: "border-purple-400 text-purple-700 bg-transparent",
      };
    case ORDER_CATEGORY.RAW_MATERIALS_OTHERS:
      return {
        label: "Nguyên liệu thô & Khác",
        className: "border-orange-400 text-orange-700 bg-transparent",
      };
    default:
      return {
        label: "Không xác định",
        className: "border-neutral-400 text-neutral-700 bg-transparent",
      };
  }
}
