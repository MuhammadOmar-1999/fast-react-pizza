import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";
import PropTypes from "prop-types";

function DeleteItem({ id }) {
  const dispatch = useDispatch();

  function handleDeleteItem() {
    dispatch(deleteItem(id));
  }
  return (
    <Button type="small" onClick={handleDeleteItem}>
      Delete
    </Button>
  );
}

DeleteItem.propTypes = {
  id: PropTypes.number,
};

export default DeleteItem;
