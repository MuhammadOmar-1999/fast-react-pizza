import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import {
  decreaseItemQuantity,
  getCurrentElementQuantity,
  increaseItemQuantity,
} from "./cartSlice";
import PropTypes from "prop-types";

function UpdateItemQuantity({ id }) {
  const currentQuantity = useSelector(getCurrentElementQuantity(id));

  const dispatch = useDispatch();

  function handleIncreaseItem() {
    dispatch(increaseItemQuantity(id));
  }
  function handleDecreaseItem() {
    dispatch(decreaseItemQuantity(id));
  }
  return (
    <div className="flex items-center gap-3">
      <Button type="round" onClick={handleDecreaseItem}>
        -
      </Button>
      <span>{currentQuantity}</span>
      <Button type="round" onClick={handleIncreaseItem}>
        +
      </Button>
    </div>
  );
}

UpdateItemQuantity.propTypes = {
  id: PropTypes.number,
};
export default UpdateItemQuantity;
