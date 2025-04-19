import { Link } from "react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import TrashedLoginDropdown from "./trashed-login-dropdown";

const TrashedLoginsTable = (props) => {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead key="name">Name</TableHead>
          <TableHead key="url">URL</TableHead>
          <TableHead key="trash-date">Trash date</TableHead>
          <TableHead key="actions" className="w-16">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.trashedLogins.map((login) => (
          <TableRow key={login.login_id}>
            <TableCell>
              <Link to={"/trash/" + login.login_id}>
                <div className="w-full">{login.name}</div>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                to={"//" + login.urls[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-full">{login.urls[0]}</div>
              </Link>
            </TableCell>
            <TableCell>
             {login.trash_date}
            </TableCell>
            <TableCell>
              <TrashedLoginDropdown login={login} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TrashedLoginsTable;
