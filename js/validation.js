/**
 * Attempts to convert the input string as JSON into an object.
 * @param   {string} code String to validate and parse.
 */
function JSONparse(code) {
    let result = { success: true };

    //attempt to parse the string as JSON
    try {
        let object = JSON.parse(code);
        result['object'] = object;
    }

    //if parsing failed
    catch(e) {
        result.success = false;
        result['error'] = {
            message: e.message.substr(0, e.message.indexOf(' in JSON at position ')),
            position: e.message.substr(e.message.indexOf(' in JSON at position ') + 21)
        };
    }

    return result;
}