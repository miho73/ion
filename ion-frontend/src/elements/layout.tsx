import React from "react";

function VList({children}: {children: React.ReactNode}) {
    return (
        <div className={'vlist'}>{children}</div>
    );
}
function HList({children}: {children: React.ReactNode}) {
    return (
        <div className={'hlist'}>{children}</div>
    );
}

export { VList, HList };