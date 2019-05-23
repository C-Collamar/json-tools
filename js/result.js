/**
 * Displays success message to the 'Result' section.
 */
function showParseSuccess() {
    //set up 'Result' section
    var resultHeading = document.getElementById('result-msg');
    resultHeading.className = 'success';
    resultHeading.innerHTML = 'PARSE SUCCESS!';
    document.getElementById('error-content').style.display = 'none';
    document.getElementById('helper-paragraph').innerHTML = 'Sweet, your code is in JSON format. Now you can access the visualization and conversion tools available below.';
}

/**
 * Displays preformatted error message within the 'Result' section.
 * @param   {string} err_msg  Error message to show.
 * @param   {number} position Position at which the error occurs.
 */
function showError(err_msg, position) {
    var card = document.getElementById('error-content');
    card.style.display = 'block';
    card.className = 'card boxshadowed';
    card.innerHTML =
    '<div class="side-border">' +
        '<div>' +
            '<div class="head">Message</div>' +
            '<div class="data">' + err_msg + '</div>' +
        '</div>' +
        '<div>' +
            '<div class="head">Position</div>' +
            '<div class="data">' + position + '</div>' +
        '</div>' +
    '</div>';

    var resultHeading = document.getElementById('result-msg');
    resultHeading.className = 'error';
    resultHeading.innerHTML = 'SYNTAX ERROR :(';
    document.getElementById('helper-paragraph').innerHTML = 'Looks like your input does not fully comply with the JSON standard. See the message below for more details.';
}