function Input({type,placeholder,setVal,field,value}) {
    return <>
        <input
            type={type}
            placeholder={placeholder}
            onChange={(e) => setVal((prev) => ({ ...prev, [field]: e.target.value }))}
            value={value}
            class="text-center  outline-1 rounded-md px-2 py-1"
        />
    </>
}
export default Input