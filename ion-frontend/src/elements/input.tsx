import React from "react";

function Input({
    type = 'text',
    autoFocus = false,
    autoComplete = 'off',
    value,
    placeholder,
    stateUpdate,
    name,
    len,
}: {
    type?: string,
    autoFocus?: boolean,
    autoComplete?: string,
    value?: any,
    placeholder?: string,
    stateUpdate?: React.Dispatch<React.SetStateAction<any>>,
    name?: string,
    len?: number,
    range?: number[]
}) {
    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(stateUpdate !== undefined) stateUpdate(e.target.value);
    }

    if(type === 'number') {
        value = !value && value !== 0 ? '' : value;
    }

    return (
        <input type={type}
               autoFocus={autoFocus}
               autoComplete={autoComplete}
               autoCorrect={"off"}
               placeholder={placeholder}
               onChange={updateValue}
               value={value}
               name={name}
               style={{width: len+'px'}}
        />
    );
}

export default Input;