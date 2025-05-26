import { Link } from "react-router";
import LoginDropdown from "./login-dropdown";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import React from "react";

type Login = {
  login_id: number;
  name: string;
  login_name: string;
  urls: string[];
  login_password: string;
  iv: string;
};

const LoginsTable: React.FC<{ logins: Login[] }> = (props) => {
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
                <div className="w-full">{login.name}</div>
              </Link>
            </TableCell>
            <TableCell>{login.login_name}</TableCell>
            <TableCell>
              <Link
                to={
                  (login.urls[0].includes("http") && login.urls[0]) ||
                  "//" + login.urls[0]
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-full">{login.urls[0]}</div>
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
