import LoginsDropdown from "./logins-dropdown";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "./ui/table";

const LoginsTable = (props) => {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead key="name">Name</TableHead>
          <TableHead key="username">Username</TableHead>
          <TableHead key="url">URL</TableHead>
          <TableHead key="actions" className="w-16">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.logins.map((login) => (
          <TableRow key={login.id}>
            <TableCell>{login.name}</TableCell>
            <TableCell>{login.login_name}</TableCell>
            <TableCell>{login.uri}</TableCell>
            <TableCell><LoginsDropdown /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LoginsTable;
