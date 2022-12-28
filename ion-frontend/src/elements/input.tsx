function Input({
                   type = 'text',
                   autoFocus = false,
                   autoComplete = 'off',
                   value,
                   placeholder
}: {
    type?: string,
    autoFocus?: boolean,
    autoComplete?: string,
    value?: string,
    placeholder?: string
}) {
    return (
        <input type={type} autoFocus={autoFocus} autoComplete={autoComplete} autoCorrect={"off"} placeholder={placeholder}/>
    );
}

export default Input;