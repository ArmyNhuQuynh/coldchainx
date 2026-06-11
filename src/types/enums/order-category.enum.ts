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
        className: "text-red-600 bg-red-50 border border-red-200",
      };
    case ORDER_CATEGORY.FROZEN_FRUITS_VEGGIES:
      return {
        label: "Rau củ & Trái cây đông lạnh",
        className: "text-green-600 bg-green-50 border border-green-200",
      };
    case ORDER_CATEGORY.ICE_CREAM_BEVERAGES:
      return {
        label: "Kem & Đồ uống",
        className: "text-blue-600 bg-blue-50 border border-blue-200",
      };
    case ORDER_CATEGORY.PHARMACEUTICALS:
      return {
        label: "Dược phẩm",
        className: "text-purple-600 bg-purple-50 border border-purple-200",
      };
    case ORDER_CATEGORY.RAW_MATERIALS_OTHERS:
      return {
        label: "Nguyên liệu thô & Khác",
        className: "text-orange-600 bg-orange-50 border border-orange-200",
      };
    default:
      return {
        label: "Không xác định",
        className: "text-neutral-600 bg-neutral-50 border border-neutral-200",
      };
  }
}