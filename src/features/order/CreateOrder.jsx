import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: "Vegetale",
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: "Spinach and Mushroom",
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const formErrors = useActionData();
  // console.log(formErrors);
  const navigation = useNavigation();

  const {
    username,
    address,
    status: addressStatus,
    position,
  } = useSelector((state) => state.user);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);

  const dispatch = useDispatch();

  const [priorityPrice, setPriorityPrice] = useState(0);

  const isAddressLoading = addressStatus === "loading";
  const addressError = addressStatus === "error";
  function handleGetAddress(e) {
    e.preventDefault();
    dispatch(fetchAddress());
  }

  function handleSetPriority() {
    setPriorityPrice((p) => (p === 0 ? totalCartPrice * 0.2 : 0));
  }

  const finalPrice = priorityPrice + totalCartPrice;
  const isLoading = navigation.state === "loading";

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Lets go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <div className="grow">
            <input
              type="text"
              name="customer"
              required
              className="input"
              defaultValue={username}
            />
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input"
              defaultValue={address}
              disabled={isAddressLoading}
            />
            <span className="absolute right-[5px] z-10 mt-[5px]">
              <Button
                type="small"
                onClick={handleGetAddress}
                disabled={isAddressLoading}
              >
                {isAddressLoading ? "loading..." : "Get address"}
              </Button>
            </span>
            {addressError && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                Unable to fetch address
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            onClick={handleSetPriority}
          />
          <label className="font-semibold" htmlFor="priority">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}`
                : ""
            }
          />
          <Button type="primary" disabled={isLoading}>
            {isLoading
              ? "Placing order..."
              : `${formatCurrency(finalPrice)} Order now`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };

  const errors = {};

  if (!isValidPhone(order.phone)) {
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you!";
  }

  if (Object.keys(errors).length > 0) return errors;

  // if there are no errors then create new order and redirect
  const createdOrder = await createOrder(order);

  //dont' overuse accessing the store outside of react components. It disables some performance optimization of redux.
  store.dispatch(clearCart());
  return redirect(`/order/${createdOrder.id}`);
}

export default CreateOrder;
