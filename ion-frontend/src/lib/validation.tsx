function rangeValidation(value: number, min: number, max: number) {
    return (value < min || value > max);
}

function errorBitmask(state: number, place: number) {
    return state | (1 << place);
}

export { rangeValidation, errorBitmask }