cls = [
    "int", "float", "dict", "list",
    "tuple", "set", "bool", "None",
    "frozenset", "str", "bytes",
    "files", "type", "complex", 
    "range", "bytearray", "memoryview"
    
];

kw = [
    "True", "False", "def", "import",
    "from", "yield", "class", "if",
    "elif", "else", "for", "while",
    "async", "await", "with", "as",
    "in", "not", "and", "or", "is",
    "super", "self", "global",
    "local", "try", "except", "pass",
    "continue", "break", "return",
    "del", "nonlocal", "lambda",
    "finally", "assert", "break", 
    
];

function str_regex(m, a, b, c) {
    var st = "";
    if(a == "f" || a == "F") {
        var incode = false;
        for(var d of c.split('')) {
            if(d == "{") {
                st += "</span>{";
                incode = true;
            } else if(d == "}") {
                st += '}<span class="str">';
                incode = false;
            } else if(incode) {
                st += d;
            } else {
                st += d+"\u200b";
            } 
        }
    } else {
        st = c.split('').join("\u200b");
    }
    return `<span class="str">${a}${b}${st}${b}</span>`;
}

py_regex = [
    [
        /([fFrRuUbB]?)(['"])(.+?)(['"])/gm,
        str_regex
    ], [
        /([fFrRuUbB]?)('''|""")((.|\n)+)('''|""")/gm,
        str_regex
    ], [
        /\\u([A-Fa-f0-9]{4})/gm, 
        `<span class="op">\\u$1</span>`
    ], [
        /\\U([A-Fa-f0-9]{8})/gm, 
        `<span class="op">\\U$1</span>`
    ], [
        /\\x([A-Fa-f0-9]{2})/gm, 
        `<span class="op">\\x$1</span>`
    ], [/\\\u200b?(.)/gm, 
        `<span class="op">\\$1</span>`
    ], [
        /\\u([A-Fa-f0-9\u200b]{8})/gm, 
        `<span class="op">\\u$1</span>`
    ], [
        /\\U([A-Fa-f0-9\u200b]{16})/gm, 
        `<span class="op">\\U$1</span>`
    ], [
        /\\x([A-Fa-f0-9\u200b]{4})/gm, 
        `<span class="op">\\x$1</span>`
    ], [
        /\\(.)/gm, 
        `<span class="op">\\$1</span>`
    ], [
        /^( *)def ([\w\d_]+)/gm, 
        `$1<span class="kw">def</span> <span class="fn">$2</span>`
    ], [
        /^( *)class ([\w\d_]+)/gm,
        function(m, a, b) {
            cls.push(b);
            return `${a}<span class="kw">class</span> <span class="cls">${b}</span>`;
        }
    ], [
        /([\w\d_]+)([\(\[.])/gm,
        `<span class="fn">$1</span>$2`
    ], [
        /\#(.*)$/gm,
        function(m, a) {
            var s = "";
            for(var z = 0; z < a.length; z++)
                s += a[z] + "\u200b";
            s = s.slice(0, -1);
            return `<span class="comm">#${s}</span>`;
        }
    ], [
        /(-)?0x(\d+)/gm,
        `<span class="var">$10x$2</span>`
    ], [
        /(-)?(\d+(\.\d+)?j?)/gm, 
        `<span class="var">$1$2</span>`
    ], [
        /^( *)\@([\d\w_.]+)/gm,
        `<span class="dec">$1@$2</span>`
    ], [
        /([\w\d_]*)(Error|Exception)/gm,
        `<span class="err">$1$2</span>`
    ]
];

function py_mark(st) {
    st = st.replace(/\n/gm, " \n");
    for(var r of py_regex) {
        st = st.replace(r[0], r[1]);
    } for(var r of kw) {
        st = st.replace(RegExp("^"+r+"([ \.\:\(\[])", "gm"), `<span class="kw">${r}</span>$1`);
        st = st.replace(RegExp("(\n| +)"+r+"([ \.\:\(\[])", "gm"), `$1<span class="kw">${r}</span>$2`);
    } for(var r of cls) {
        st = st.replace(RegExp(cls+"([\\(\\[\\.])", "gm"), `<span class="cls">${r}</span>$1`);
    }
    return st;
}
