import { getLikeCount, getVisitCount } from "@/actions/count";
import { useEffect, useState } from "react";

const Counter = () => {
    const [counts, setCounts] = useState<{
        likeCount: number;
        visitCount: number;
    }>({ likeCount: -1, visitCount: -1 });

    useEffect(() => {
        async function getCounts() {
            const likeCount = await getLikeCount();
            const visitCount = await getVisitCount();
            setCounts({ likeCount, visitCount });
        }
        getCounts();
    }, []);

    if (counts.likeCount === -1 || counts.visitCount === -1) {
        return (
            <div className="flex items-center justify-center border-b rounded-full animate-spin h-6 w-6 border-gray-500"></div>
        );
    }

    return (
        <>
            total_visits -{" "}
            {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 5,
            }).format(counts.visitCount)}{" "}
            | total_likes -{" "}
            {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 5,
            }).format(counts.likeCount)}
        </>
    );
};

export default Counter;
