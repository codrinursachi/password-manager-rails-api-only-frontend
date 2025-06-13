import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export function TableContentSkeleton({ cellNumber }: { cellNumber?: number }) {
    return (
        <>
            {[...Array(8)].map((_element, rowIndex) => (
                <TableRow key={rowIndex}>
                    {[...Array(cellNumber)].map((_element, cellIndex) => (
                        <TableCell key={cellIndex}>
                            <Skeleton className="w-full h-8" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}
