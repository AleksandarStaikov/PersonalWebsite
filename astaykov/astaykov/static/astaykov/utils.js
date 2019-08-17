function readEvent(eventElement){
    var name = eventElement.children('name').text();
    var desc = eventElement.children('description').text();
    var position = eventElement.children('position').text();
    var location = eventElement.children('location').text();
    var start = eventElement.children('start').text();
    var end = eventElement.children('end').text();

    return {
        name: name,
        desc: desc,
        position: position,
        location: location,
        start: start,
        end: end
    }
}

var utils = {
    readEvent: readEvent
}

module.exports = { utils }
