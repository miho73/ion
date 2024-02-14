function getBit(bitmask: number, place: number) {
    return (bitmask >> place) & 1;
}

function changeBit(bitmask: number, place: number) {
    return bitmask ^ (1 << place);
}

export {getBit, changeBit}