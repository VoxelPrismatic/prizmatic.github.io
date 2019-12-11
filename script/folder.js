function folder(id) {
    ls = find(id).children;
    if(ls.length != 0) {
        docs(ls.slice(-1)[0]);
        ls.slice(-1)[0].remove();
    }
}

function folder_back() {
    find("fwd-page").innerHTML += `<span>${findHtml("this-here")}</span>`;
    folder("back-page");
}

function folder_prev() {
    find("next-page").innerHTML += `<span>${findHtml("this-here")}</span>`;
    folder("prev-page");
}

function folder_up() {
    btn_load("../__init__.txt");
}

function folder_next() {
    find("prev-page").innerHTML += `<span>${findHtml("this-here")}</span>`;
    folder("next-page");
}

function folder_fwd() {
    find("back-page").innerHTML += `<span>${findHtml("this-here")}</span>`;
    folder("fwd-page");
}
