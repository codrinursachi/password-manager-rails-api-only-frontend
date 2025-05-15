import { Link } from "react-router";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import React from "react";

type sshKey = {
  id: number;
  name: string;
  public_key: string;
  private_key: string;
  iv: string;
  notes: string;
};

const sshKeysTable: React.FC<{ sshKeys: sshKey[] }> = (props) => {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead key="name">Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.sshKeys.map((sshKey) => (
          <TableRow key={sshKey.id}>
            <TableCell>
              <Link to={"/ssh-keys/" + sshKey.id}>
                <div className="w-full">{sshKey.name}</div>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default sshKeysTable;
