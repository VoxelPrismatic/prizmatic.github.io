function jump(elem) {
    try {
        id = elem.id.split("JUMP_").slice(-1)[0];
    } catch {
        id = elem.split("JUMP_").slice(-1)[0];
    }
    console.log(id);
    find(id).scrollIntoView();
    var things = find("sect").children;
    for(var thing of things)
        if(thing.className == "lnk sel")
            thing.className = "lnk";
    find("JUMP_"+id).className = "lnk sel";
}
function docs(elem) {
    try {
        id = elem.id;
    } catch(err) {
        id = elem;
    } try {
        find("page").innerHTML = find("DOCS_"+id).innerHTML;
        find("sect").innerHTML = find("SECT_"+id).innerHTML;
    } catch(err) {
        load(id);
        find("loaded-pages").innerHTML += `<div id="DOCS_${id}" class="invis">${find("page").innerHTML}</div>`;
        find("loaded-sects").innerHTML += `<div id="SECT_${id}" class="invis">${find("sect").innerHTML}</div>`;
    }
    var things = find("nav").children;
    for(var thing of things)
        if(thing.className == "lnk sel")
            thing.className = "lnk";
    find(id).className = "lnk sel";
    find("edit_page").href = 
        `https://github.com/VoxelPrismatic/prizmatic.docs/edit/master/doc/${id.split("doc/").slice(-1)[0]}`;
    find("edit_page").innerHTML = "/"+id.split("doc/").slice(-1)[0].replace("index.txt", "").toUpper();
    jump("JUMP_top");
}
