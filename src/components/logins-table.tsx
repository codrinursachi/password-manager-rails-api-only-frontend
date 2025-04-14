import { Link } from "react-router";
import LoginDropdown from "./login-dropdown";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

const LoginsTable = (props) => {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead key="name">Name</TableHead>
          <TableHead key="username">Username</TableHead>
          <TableHead key="url">URL</TableHead>
          <TableHead key="actions" className="w-16">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.logins.map((login) => (
          <TableRow key={login.login_id}>
            <TableCell>
              <Link to={"/logins/" + login.login_id + "/edit"}>
                {login.name}
              </Link>
            </TableCell>
            <TableCell>{login.login_name}</TableCell>
            <TableCell>
                <Link
                to={login.urls}
                target="_blank"
                rel="noopener noreferrer"
                >
                {login.urls}
                </Link>
            </TableCell>
            <TableCell>
              <LoginDropdown login={login} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LoginsTable;
