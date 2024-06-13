import PropTypes from "prop-types";
import { formatCurrency } from "../../utils/helpers";

//eslint-disable-next-line
function OrderItem({ item, isLoadingIngredients, ingredients }) {
  const { quantity, name, totalPrice } = item;

  return (
    <li className="py-3">
      <div className="flex items-center justify-between gap-4">
        <p>
          <span className="font-bold">{quantity}&times;</span>{" "}
          <span>{name}</span>
        </p>
        <p className="font-bold">{formatCurrency(totalPrice)}</p>
      </div>
      <p className="text-sm capitalize italic text-stone-500">
        {isLoadingIngredients ? "loading..." : ingredients.join(", ")}
      </p>
    </li>
  );
}

OrderItem.propTypes = {
  item: PropTypes.shape({
    quantity: PropTypes.number,
    name: PropTypes.string,
    totalPrice: PropTypes.number,
  }),
  isLoadingIngredients: PropTypes.bool,
  ingredients: PropTypes.array,
};

export default OrderItem;
