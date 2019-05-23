/**
 * Creates a treeview as an HTML string of the input object's structure.
 * @param   {Object} object Object to which the treeview will be generated.
 * @returns {String} The treeview representation as HTML.
 */
function generateTreeview(object) {
    if(object.constructor === Object) {
        let result = '';
        let keys = Object.keys(object);
        for(let k in keys) {
            result = result + `
                <details>
                    <summary>
                        <span>${keys[k]}</span>
                        <span class="type">${getObjectType(object[keys[k]])}</span>
                    </summary>
                    ${generateTreeview(object[keys[k]])}
                </details>
            `;
        }
        return result;
    }
    else if(object.constructor === Array) {
        let result = '';
        for(let i = 0; i < object.length; ++i) {
            result = result + `
                <details>
                    <summary>
                        <span>${i}</span>
                        <span class="type">${getObjectType(object[i])}</span>
                    </summary>
                    ${generateTreeview(object[i])}
                </details>
            `;
        }
        return result;
    }
    else if(object !== undefined) {
        return `<div class="primitive"><span>${object}</span></div>`;
    }
}

/**
 * Helper function that returns a string representation of the type of the object.
 * @param   {Object} object Reference object.
 * @returns {string} Type of the object.
 */
function getObjectType(object) {
    if(object !== undefined) {
        switch(object.constructor) {
            case Object: return 'Object';
            case Array:  return 'Array';
            case String: return 'String';
            case Number: return 'Number';
            default:     return 'Undefined';
        }
    }
}