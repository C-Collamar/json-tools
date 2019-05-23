class Converter {
    /**
     * Takes in a JavaScript object to which conversion to other formats is based upon.
     * @param {Object} object The object the conversion will be referenced from.
     */
    constructor(object, encode = false) {
        this.ref_obj = object;
    }

    /**
     * Formats the object passed from _this_ constructor to JSON string.
     * @param   {string} indentSymbol Character used for indentation.
     * @param   {number} indentFactor Scales the indentation by the depth of the parse tree.
     * @returns {string} Formatted JSON string.
     */
    toJSON(indentSymbol, indentFactor) {
        return processObject(undefined, this.ref_obj, 1);

        function processObject(key, object, depth) {
            if(object !== undefined) {
                let result = '';
                let indent = indentSymbol.repeat(depth * indentFactor);

                if(object.constructor === Object) {
                    result = '{\n'
                    for(let i in object) {
                        result = `${result}${indent}"${i}": ${processObject(i, object[i], depth + 1)},\n`;
                    }
                    result = result.substr(0, result.length - 2) + '\n' + indent.substr(indentFactor) + '}';
                }
                else if(object.constructor === Array) {
                    result = '[\n'
                    for(let i = 0; i < object.length; ++i) {
                        result = `${result}${indent}${processObject(i, object[i], depth + 1)},\n`;
                    }
                    result = result.substr(0, result.length - 2) + '\n' + indent.substr(indentFactor) + ']';
                }
                else {
                    result = object.constructor === String? '"' + object + '"' : object;
                }

                return result;
            }
        }
    }

    /**
     * Formats the object passed from _this_ constructor to an XML string representation.
     * @param   {string} indentSymbol Character used for indentation.
     * @param   {number} indentFactor Scales the indentation by the depth of the parse tree.
     * @returns {string} XML1.0-complaint conversion of the object.
     */
    toXML(indentSymbol, indentFactor) {
        return '<?xml version="1.0" encoding="UTF-8" ?>\n' + processObject(undefined, this.ref_obj, 0).substr(1);

        function processObject(key, object, depth) {
            if(object !== undefined) {
                let result = '';
                let indent = indentSymbol.repeat(depth * indentFactor);

                if(object.constructor === Object) {
                    result = '\n';
                    for(let i in object) {
                        result = `${result}${indent}<${i}>${processObject(i, object[i], depth + 1)}</${i}>\n`;
                    }
                    result = result + indent.substr(indentFactor);
                }
                else if(object.constructor === Array) {
                    result = '\n';
                    for(let i = 0; i < object.length; ++i) {
                        result = `${result}${indent}<${key}>${processObject(undefined, object[i], depth + 1)}</${key}>\n`;
                    }
                    result = result + indent.substr(indentFactor);
                }
                else {
                    result = object;
                }

                return result;
            }
        }
    }

    toCSV() {
        let result = '';
        let object = this.ref_obj;
        let invalid = false;

        if(object.constructor === Object) {
            var keys = Object.keys(object);
            if(keys.length === 1 && object[keys[0]].constructor === Array && object[keys[0]].length > 0 && object[keys[0]][0].constructor === Object) {
                let array = object[keys[0]];
                let headers = Object.keys(array[0]);
                result = headers.map(x => x).join(',') + '\n';

                for(let i = 0; i < array.length; ++i) {
                    let element = array[i];
                    let row = '';
                    for(let j = 0; j < headers.length; ++j) {
                        if(element[headers[j]] === undefined) {
                            result = 'Your input breaks restriction #3';
                            invalid = true;
                            break;
                        }
                        row = row + element[headers[j]] + ',';
                    }
                    if(!invalid) {
                        row = row.substr(0, row.length - 1);
                        result = result + row + '\n';
                    }
                    else break;
                }
                if(!invalid) {
                    result = result.substr(0, result.length - 1);
                }
            }
            else {
                result = 'Your input breaks restriction #2.'
                invalid = true;
            }
        }
        else {
            result = 'Your input breaks restriction #1.';
            invalid = true;
        }

        if(invalid) {
            return `\
                Note: Object structure is incompatible for CSV conversion.\n\
                For compatibility, the object must comply to the following restrictions:\n\
                1. Input must be a valid object and must have a depth of 3.\n\
                2. The first level must be an object holding an array of objects.\n\
                3. Each object in the array must have the same key number and names.\n\
                \nComplaint: ${result}`.replace(/^(\s{2})+/gm, '');
        }
        else return result;
    }

    /**
     * Formats the object passed from _this_ constructor to anYAML string representation.
     * @param   {number} indentFactor Scales the indentation by the depth of the parse tree.
     * @returns {string} A valid YAML string.
     */
    toYAML(indentFactor) {
        let indentSymbol = ' ';
        return processObject(this.ref_obj, 0).substr(1);

        function processObject(object, depth) {
            if(object !== undefined) {
                let result = '';
                let indent = indentSymbol.repeat(depth * indentFactor);

                if(object.constructor === Object) {
                    result = '\n';
                    for(let i in object) {
                        result = result + `${indent}${i}: ${processObject(object[i], depth + 1)}\n`;
                    }
                    result = result.substr(0, result.length - 1);
                }
                else if(object.constructor === Array) {
                    result = '\n';
                    for(let i = 0; i < object.length; ++i) {
                        result = result + indent + '- ' + processObject(object[i], depth + 1) + '\n';
                    }
                    result = result.substr(0, result.length - 1);
                }
                else {
                    result = object;
                }

                return result;
            }
        }
    }
}