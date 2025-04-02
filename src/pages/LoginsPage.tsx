import { useEffect } from "react";
import { useNavigate } from "react-router";

const LoginsPage: React.FC<{isLoggedIn: boolean}> = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.isLoggedIn) {
      navigate("/login");
    }
  }, [props.isLoggedIn]);
  return (
    <div>
      <h1>Logins</h1>
    </div>
  );
}

export default LoginsPage;