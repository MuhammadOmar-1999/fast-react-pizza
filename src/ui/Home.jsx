import CreateUser from "../features/user/CreateUser";

function Home() {
  return (
    <div className="my-10 sm:my-16 text-center">
      <h1 className="font-semibold text-xl mb-8 md:text-3xl sm:text-2xl">
        The best pizza.
        <br />
        <spanc className="text-yellow-500">
          Straight out of the oven, straight to you.
        </spanc>
      </h1>
      <CreateUser />
    </div>
  );
}

export default Home;
