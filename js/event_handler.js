function handleSuccess(object) {
    //notify user
    showParseSuccess();

    //prepare object conversion and fomatter
    objConversion = new Converter(object);

    //format input JSON code
    let useSpace = document.getElementById('use-space').checked;
    document.getElementById('code').value = objConversion.toJSON(
        useSpace? ' ' : '\t',
        useSpace? document.getElementById('space-per-tab').value : 1
    );

    //show 'Treeview' section
    document.getElementById('treeview-container').innerHTML = generateTreeview(object);
    document.getElementById('treeview').style.display = 'block';

    //show 'Conversion' section
    document.getElementById('convert').style.display = 'block';
    document.getElementById('XMLTab').click(); //initially display conversion to XML
}

function handleError(message, position) {
        //display error information
        showError(message, position);

        //hide other sections in case they're currently displayed
        document.getElementById('treeview').style.display = 'none';
        document.getElementById('convert').style.display = 'none';
}

window.addEventListener('load', function() {
    //used for navbar-showing/hiding purposes
    prevScrollpos = window.pageYOffset || document.documentElement.scrollTop;

    //enable/disable 'Space per tab' input depending if user uses spaces over tabs
    document.getElementById('use-space').addEventListener('change', function() {
        let spacePerTab = document.getElementById('space-per-tab');
        spacePerTab.required = this.checked;
        spacePerTab.disabled = !this.checked;
    });

    //only allow submission if user inputs a value
    document.getElementById('code').addEventListener('keyup', function() {
        document.getElementById('process').disabled = (this.value.trim() === '');
    });

    //handle input submission
    document.getElementById('input-json-form').addEventListener('submit', function(e) {
        e.preventDefault();
        let code = document.getElementById('code').value;

        //attempt JSON string conversion
        let result = JSONparse(code);

        //if input is successfully parsed
        if(result.success) {
            handleSuccess(result.object);
        }
        else {
            //display error information
            handleError(result.error.message, result.error.position);
        }

        //show the result section
        document.getElementById('result').style.display = 'block';
    });

    //when user clicks the XML tab in 'Conversion' section
    document.getElementById('XMLTab').addEventListener('click', function() {
        selectTab(this);
        document.getElementById('converted-format-container').value = objConversion.toXML(' ', 4);
    });

    //when user clicks the CSV tab in 'Conversion' section
    document.getElementById('CSVTab').addEventListener('click', function() {
        selectTab(this);
        document.getElementById('converted-format-container').value = objConversion.toCSV();
    });

    //when user clicks the YAML tab in 'Conversion' section
    document.getElementById('YAMLTab').addEventListener('click', function() {
        selectTab(this);
        document.getElementById('converted-format-container').value = objConversion.toYAML(4);
    });

    //for highlighting selected tab in 'Conversion' section
    function selectTab(tab) {
        if(tab.className.indexOf('selected') === -1) {
            for(var i = 0; i < tab.parentElement.children.length; ++i) {
                tab.parentElement.children[i].classList.remove('selected');
            }
        }
        tab.classList.add('selected');
    }
});

//hide navbar on scroll down and show on scroll up
window.addEventListener('scroll', function() {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    var navbar = document.getElementById('navbar');
    var main = document.getElementById('body');

    if(prevScrollpos > currentScrollPos)
        navbar.className = '';
    else
        navbar.className = 'hide';

    prevScrollpos = (currentScrollPos < 0)? 0 : currentScrollPos;
});