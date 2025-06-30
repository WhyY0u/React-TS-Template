import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  const loginAs = (role: "user" | "admin") => {
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify({ role }));
    navigate("/protuct");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div>
      <h1>🔐 Главная страница</h1>

      {!isLoggedIn ? (
        <>
          <button onClick={() => loginAs("user")}>Войти как пользователь</button>
          <button onClick={() => loginAs("admin")}>Войти как админ</button>
        </>
      ) : (
        <button onClick={logout}>🚪 Выйти</button>
      )}
    </div>
  );
};

Home.route = {
  path: "/",
};

export default Home;

