function trim(str) {
    return str.replace(/^([ \u200b]+)/, "").replace(/([ \u200b]+)$/, "")
}

var line_regex = [
    [/^ /gm, "\u200b \u200b"],
    
    [/\\(.)/gm, function(m, p1) {return `\\u{${p1.charCodeAt(0).toString(16)}}`;}],
    [/\\U([A-Fa-f0-9]{16})/gm, "\\u{$1}"],
    [/\\u([A-Fa-f0-9]{4})/gm, "\\u{$1}"],
    
    [/^\#\] +(.+)$/gm, "<div class='head1'>#] $1</div></br>"],
    [/^\~\] +(.+)$/gm, "<div class='head2'>~] $1</div></br>"],
    [/^\+\] +(.+)$/gm, "<div class='head3'>+] $1</div></br>"],
    [/^\-\] +(.+)$/gm, "<div class='head4'>-] $1</div></br>"],
    [/^\$\] +(.+)$/gm, "<div class='head5'>$] $1</div></br>"],
    [/^\%\] +(.+)$/gm, "<div class='head6'>%] $1</div></br>"],
    
    [/\[(.+?)\]\((.+?)\)/gm, "<a href='$2'>$1</a>"],
    [/\@\[(.+?)\]\((.+?)\)/gm, "<img alt='$1' src='$2'>"],
    [/e<<(.+?)>>/gm, "<a href='mailto:$1>$1</a>"],
    [/p<<(.+?)>>/gm, "<a href='tel:$1>$1</a>"],
    [/e\[(.+?)]<(.+?)>/gm, "<a href='mailto:$2'>$1</a>"],
    [/p\[(.+?)]<(.+?)>/gm, "<a href='tel:$2'>$1</a>"],
    [/<<(.+?)>>/gm, "<a href='$1'>$1</a>"],
    [/\?\[(.+?)\]\<(.+?)\>/gm, `<button class="btn" id="$2" onclick="maybeload(this.id)">$1</button>`],
    
    [/^\#(.+?)\#/gm, "<b>$1</b>"],
    [/^\*(.+?)\*/gm, "<i>$1</i>"],
    [/^\_(.+?)\_/gm, "<u>$1</u>"],
    [/^\~(.+?)\~/gm, "<s>$1</s>"],
    [/^\`(.+?)\`/gm, `<span class="code">$1</span>`],
    [/^\^(.+?)\^/gm, "<sup>$1</sup>"],
    [/^\%(.+?)\%/gm, "<sub>$1</sub>"],
    [/^\!\!(.+?)\!\!/gm, `<span class="hide" onclick="this.classList.toggle('unhide');">$1</span>`],
    [/^\:\: (.+)$/gm, `<span class="md-com">\u200b \u200b$1</span>`],
    
    [/([^\\])\#(.+?)\#/gm, "$1<b>$2</b>"],
    [/([^\\])\*(.+?)\*/gm, "$1<i>$2</i>"],
    [/([^\\])\_(.+?)\_/gm, "$1<u>$2</u>"],
    [/([^\\])\~(.+?)\~/gm, "$1<s>$2</s>"],
    [/([^\\])\`(.+?)\`/gm, `$1<span class="code">$2</span>`],
    [/([^\\])\^(.+?)\^/gm, "$1<sup>$2</sup>"],
    [/([^\\])\%(.+?)\%/gm, "$1<sub>$2</sub>"],
    [/([^\\])\!\!(.+?)\!\!/gm, `$1<span class="hide" onclick="this.classList.toggle('unhide');">$2</span>`],
    [/([^\\])\:\: (.+)$/gm, `$1<span class="md-com">\u200b \u200b$2</span>`],
    
    [/^WARN---$/gm, "<div class='warn'><b>WARNING ---</b><br>"],
    [/^NOTE---$/gm, "<div class='note'><b>NOTICE ---</b><br>"],
    [/^NEW---$/gm, "<div class='new'><b>NEW ---</b><br>"],
    [/^INFO---$/gm, "<div class='info'><b>INFO ---</b><br>"],
    [/^EX---$/gm, "<div class='exc'><b>EXAMPLES ---</b><br>"],
    [/^CODE---$/gm, "<div class='code'></br>"],
    [/^COMMENT---$/gm, "<div class='comblock'><b>OTHER INFO ---</b><br>"],
    [/^ *(\w+) *-{3,}/gm, "<b>$1 ---</b><br>"],
    [/^---$/gm, "</div></br>"],
    [/^-~-$/gm, "<hr></br>"],
    
    [/\{\{(\w+?)\}\}([\w\d]+?) /gm, "<span class='$1'>$2 </span>"],
    [/^--([\w\d_.-]+)--$/gm, "<div id='$1'></div></br>"],
    [/\\ *$/gm, "</br>"], //New line escape
    
    [/\\u\{([a-fA-F0-9]+)\}/gm, function(m, p1) {return String.fromCharCode("0x"+p1);}],
];

function mark(st) {
    for(var r of line_regex)
        st = st.replace(r[0], r[1]);
    return st;
}

function mk_table(st) {
    var table_lines = -1;
    var table_aligns = [];
    var table_str = [];
    var str = "";
    for(var line of st.split("\n")) {
        if(line != "" && line.replace(/^(\|.+)+\|$/gm, "") == "") {
            table_lines += 1
            table_str.push([]);
            if(table_lines == 0) {
                for(var header of line.split("|").slice(1, -1)) {
                    header = trim(header);
                    if(header.startsWith(":") && header.endsWith(":")) {
                        table_str[0].push(header.slice(1, -1));
                        table_aligns.push("center");
                    } else if(header.startsWith(":")) {
                        table_str[0].push(header.slice(1));
                        table_aligns.push("left");
                    } else if(header.endsWith(":")) {
                        table_str[0].push(header.slice(0, -1));
                        table_aligns.push("right");
                    } else {
                        table_str[0].push(header);
                        table_aligns.push("left");
                    }
                }
            } else {
                for(var cell of line.split("|").slice(1, -1)) {
                    table_str.slice(-1)[0].push(trim(cell));
                }
                var max_len = 0;
                for(var row of table_str)
                    if(row.length > max_len)
                        max_len = row.length;
                for(var r = 0; r < table_str.length; r++)
                    while(table_str[r].length < max_len) {
                        table_str[r].push("");
                        if(r == 0)
                            table_aligns.push("left");
                    }
            }
            continue;
        }
    }
    var row_num = -1; 
    str += "<table>";
    for(var row of table_str) {
        row_num += 1;
        str += "<tr>";
        var col_num = -1;
        for(var col of row) {
            col_num += 1;
            if(row_num == 0)
                str += `<th style="text-align: ${table_aligns[col_num]}">${mark_page(col)}</th>`;
            else
                str += `<td style="text-align: ${table_aligns[col_num]}">${mark_page(col)}</td>`;
        }
        str += "</tr>";
    }
    str += "</table>";
    return str;
}

function mk_ol(st) {
    var str = "";
    var ol = [];
    for(var line of st.split("\n").slice(0, -1))
        ol.push(trim(line.replace(/^\d+[\]\)\.\-] (.*)$/gm, "$1")));
    str += "<ol>";
    for(var li of ol)
        str += `<li>${mark_page(li)}</li>`;
    str += "</ol>";
    return str;
}


function mk_ul(st) {
    var str = "";
    var ul = [];
    for(var line of st.split("\n").slice(0, -1))
        ul.push(trim(line.slice(3)));
    str += "<ul>";
    for(var li of ul)
        str += `<li>${mark_page(li)}</li>`;
    str += "</ul>";
    return str;
}

function mark_page(st) {
    var str = "";
    var py = "";
    var table = "";
    var ol = "";
    var ul = "";
    var inpy = false;
    var intable = false;
    var inol = false;
    var inul = false;
    for(var line of st.split("\n")) {
        // Section
        if(line.search(/^--[\w\d_.-]+--$/gm) == 0) {
            sid = line.slice(2, -2);
            find("sect").innerHTML += `<div class="lnk" id="JUMP_${sid}" onclick="jump(this);">#${sid}</div>`;
        }
        
        // Python formatting
        if(line == "PY---" && !inpy) {
            inpy = true;
            continue;
        }
        if(line == "---" && inpy) {
            str += py_mark(py).replace(/\n/gm, "<br>");
            py = "";
            inpy = false;
            continue;
        }
        if(inpy) {
            py += line + "\n";
            continue;
        }
        
        //Table
        if(line == "TABLE---" && !intable) {
            intable = true;
            continue;
        }
        if((line == "---" || line == "" || line.replace(/^(\|.+)+\|$/gm, "") != "") && intable) {
            str += mk_table(table).replace(/\n/gm, "<br>");
            table = "";
            intable = false;
            continue;
        }
        if(intable) {
            table += line + "\n";
            continue;
        }
        
        // Ordered list
        if(line == "OL---" && !inol) {
            inol = true;
            continue;
        }
        if((line == "---" || line == "" || line.replace(/^\d+[\]\)\.\-] .*$/gm, "") != "") && inol) {
            str += mk_ol(ol);
            ol = "";
            inol = false;
            continue;
        }
        if(inol) {
            ol += line + "\n";
            continue;
        }
        
       // Unordered list
        if(line == "UL---" && !inul) {
            inul = true;
            continue;
        }
        if((line == "---" || line == "" || line.replace(/^[\>\]\)\~\-\+] .*$/gm, "") != "") && inul) {
            str += mk_ul(ul);
            ul = "";
            inul = false;
            continue;
        }
        if(inul) {
            ul += line + "\n";
            continue;
        }
        
        line = mark(line);
        if(line.endsWith("<br>"))
            str += line;
        else if(line.endsWith("§"))
            str += line.slice(0, -1);
        else if(line.endsWith("</br>"))
            str += line.slice(0, -5);
        else
            str += line+"\n";
    }
    return str.replace(/\n/gm, "<br>");
}
