import LinkButton from "../../ui/LinkButton";

function EmptyCart() {
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <div className="mt-7 text-xl font-semibold">
        <h2>You have nothing in your cart. sart adding some pizzas!😁</h2>
      </div>
    </div>
  );
}

export default EmptyCart;
