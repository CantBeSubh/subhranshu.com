const Counter = ({
    likeCount,
    visitCount,
}: {
    likeCount: number;
    visitCount: number;
}) => {
    if (likeCount === -1 || visitCount === -1) {
        return (
            <div className="flex items-center justify-center border-b rounded-full animate-spin h-6 w-6 border-gray-500"></div>
        );
    }

    return (
        <>
            total_visits ={" "}
            {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 5,
            }).format(visitCount)}{" "}
            | count (ppl_clicked_hello_emoji) ={" "}
            {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 5,
            }).format(likeCount)}
        </>
    );
};

export default Counter;
