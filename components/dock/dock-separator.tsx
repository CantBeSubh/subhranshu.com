'use client';
export const DockSeparator = (props: { handleAppHover: (ev: React.MouseEvent<HTMLLIElement>) => void; }) => {
    const { handleAppHover } = props;
    return (
        <li className="border-l border-white/10" onMouseMove={handleAppHover} />
    );
};
