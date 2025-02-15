const Counter = ({
  likeCount,
  visitCount,
}: {
  likeCount: number;
  visitCount: number;
}) => {
  return (
    <div className="flex items-center justify-center gap-2 max-[1048px]:flex-col">
      <span>
        total_visits ={" "}
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 5,
        }).format(visitCount)}
      </span>
      <span className="max-[1048px]:hidden"> | </span>
      <span>
        count (clicked_hello_emoji) ={" "}
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 5,
        }).format(likeCount)}
      </span>
    </div>
  );
};

export default Counter;
