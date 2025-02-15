import { getLikeCount, getVisitCount } from "@/actions/count";
import { useEffect, useState } from "react";

const Counter = () => {
    const [counts, setCounts] = useState<{
        likeCount: number;
        visitCount: number;
    }>({ likeCount: 0, visitCount: 0 });

    useEffect(() => {
        async function getCounts() {
            const likeCount = await getLikeCount();
            const visitCount = await getVisitCount();
            setCounts({ likeCount, visitCount });
        }
        getCounts();
    }, []);

    return (
        <>
            total_visits: {counts.visitCount} | total_likes: {counts.likeCount}
        </>
    );
};

export default Counter;
