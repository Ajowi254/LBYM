/** Function that accepts an array of validation error and extracts the name of the error field (the word immediately follows 'instance.'). Returns an object of field name that have errors set to true. 
 * ['instance.firstName does not match pattern "^(?!\\\\s)[A-Za-z]*$"', 'instance.lastName does not match pattern "^(?!\\\\s)[A-Za-z]*$"']  =>  {firstName: true, lastName: true} 
 */ 

function errorMap(arr) {
  let regex = /(?<=instance\.)\w+/
  let found = {}
  for (let item of arr) {
    let errorName = item.match(regex)[0]
    found[errorName] = true;
  }
  return found;
}


export default errorMap;