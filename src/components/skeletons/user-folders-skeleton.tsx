import { Skeleton } from "../ui/skeleton";

export function UserFoldersSkeleton() {
    return (
        <>
            {[...Array(8)].map((_element, index) => (
                <Skeleton key={index} className="w-full h-8" />
            ))}
        </>
    );
}
