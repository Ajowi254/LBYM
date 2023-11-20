import {useState, useEffect} from "react";

function useLocalStorage(itemKey, initialValue=null) {
  const ls = localStorage.getItem(itemKey) || initialValue;

  const [itemValue, setItemValue] = useState(ls);

  useEffect(() => {
    if (itemValue === null) {
      localStorage.removeItem(itemKey)
    } else {
      localStorage.setItem(itemKey, itemValue)
    }
    
  }, [itemKey, itemValue])

  return [itemValue, setItemValue];
}

export default useLocalStorage;