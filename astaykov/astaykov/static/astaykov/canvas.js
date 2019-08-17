const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const holder = $(canvas).parent();

function parseEvents(eventElement) {
    var name = eventElement.children('name').text();
    var desc = eventElement.children('description').text();
    var position = eventElement.children('position').text();
    var location = eventElement.children('location').text();
    var start = eventElement.children('start').text();
    var end = eventElement.children('end').text();

    var obj = {
        name: name,
        desc: desc,
        position: position,
        location: location,
        start: start,
        end: end
    }

    return obj;
}

var eventElements = $(canvas).children();
var readEvents = [];
eventElements.toArray().forEach(a => readEvents.push(parseEvents($(a))));

canvas.width = holder[0].clientWidth;
canvas.height = 100;

const mouse = {
    x: undefined,
    y: undefined
}

const colors = ['#2185C5', '#7ECEFD', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = holder[0].clientWidth;
})

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

// Objects
function Event(name, desk, location, position, start, end) {
    this.name = name
    this.description = desk
    this.location = location
    this.position = position
    this.start = start
    this.end = end

    this.isSingle = function () {
        return this.end === undefined || this.start === this.end;
    }

    this.computeLocation = function () {
        var availableSpace = cnvas.width;
        

    }

    this.draw = function () {
        c.beginPath()
        c.arc(6, canvas.height / 2, 5, 0, Math.PI * 2, false)
        //c.fillStyle = randomColor(colors);

        c.strokeStyle = colors[0];
        c.fillStyle = colors[2];
        c.stroke();
        c.fill();
        c.closePath()
    }

    this.update = function () {
        this.draw()
    }
}


// Implementation
var eventElements = $(canvas).children();
var readEvents = [];
var eventObjects = [];
function init() {
    eventElements.toArray().forEach(a => readEvents.push(parseEvents($(a))));
    readEvents.forEach(e => eventObjects.push(new Event(e.name, e.description, e.location, e.position, e.start, e.end)));
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    eventObjects.forEach(element => {
        element.draw();
    });
}

init()
animate()