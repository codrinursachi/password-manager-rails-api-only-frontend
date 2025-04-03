import { useParams } from "react-router";

const LoginViewPage = (props: any) => {
  const { loginId } = useParams();
  return (
    <div>
      <h1>Login View</h1>
      <p>Login ID: {loginId}</p>
    </div>
  );
};

export default LoginViewPage;
