import React from "react";
import { useId } from "react";

function Select({
    options,
    label,
    className="",
    ...props
},ref){
    const id = useId()
    return(
        <div className=" w-full">
            {label && <label
            htmlFor={id}
            className=''
            ></label>}

            <select
            id={id}
            ref={ref}
            className={` py-2 px-3 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 boder border-gray-200 w-full ${className}`}
            >
                {options ?.map((option)=>(
                    <option key={option} value={option}> {option}</option>
                ))}

            </select>
        </div>
    )
}

export default React.forwardRef(Select)