import { Link, useLocation } from "react-router";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import SharedLoginDropdown from "./shared-login-dropdown";
import React from "react";

type SharedLogin = {
    login_id: number;
    name: string;
    login_name: string;
    urls: string[];
    shared_by: string;
    shared_with: string;
    login_password: string;
    iv: string;
    id: number;
};

const SharedLoginsTable: React.FC<{ sharedLogins: SharedLogin[] }> = (
    props
) => {
    const isSharedByMe = useLocation().pathname.includes("by-me");
    return (
        <Table className="table-fixed">
            <TableHeader>
                <TableRow>
                    <TableHead key="name">Name</TableHead>
                    <TableHead key="username">Username</TableHead>
                    <TableHead key="url">URL</TableHead>
                    {isSharedByMe ? (
                        <TableHead key="shared_with">Shared with</TableHead>
                    ) : (
                        <TableHead key="shared_by">Shared by</TableHead>
                    )}
                    <TableHead key="actions" className="w-16">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.sharedLogins.map((login) => (
                    <TableRow key={login.login_id}>
                        <TableCell>
                            <Link
                                to={
                                    "/shared-logins/" +
                                    (isSharedByMe ? "by-me/" : "with-me/") +
                                    login.login_id
                                }
                            >
                                <div className="w-full">{login.name}</div>
                            </Link>
                        </TableCell>
                        <TableCell>{login.login_name}</TableCell>
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
                            {isSharedByMe ? (
                                <div className="w-full">
                                    {login.shared_with}
                                </div>
                            ) : (
                                <div className="w-full">{login.shared_by}</div>
                            )}
                        </TableCell>
                        <TableCell>
                            <SharedLoginDropdown login={login} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default SharedLoginsTable;
