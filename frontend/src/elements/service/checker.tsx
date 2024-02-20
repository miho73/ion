function inRange(from: number, to: number, val: number | undefined) {
    if (val === undefined) return false;
    return (from <= val) && (val <= to);
}

export {inRange};
