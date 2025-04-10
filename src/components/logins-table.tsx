import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";

const LoginsTable = (props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>URL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.logins.map((login) => (
          <TableRow key={login.id}>
            <TableCell>{login.name}</TableCell>
            <TableCell>{login.login_name}</TableCell>
            <TableCell>{login.uri}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LoginsTable;