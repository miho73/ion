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

function OverrideLayout({
    children,
    center = false
}: {
    children: React.ReactNode,
    center?: boolean
}) {
    let classes = 'override-layout';
    if(center) {
        classes += ' center';
    }
    return (
        <div className={classes}>{children}</div>
    )
}

export { VList, HList, OverrideLayout };