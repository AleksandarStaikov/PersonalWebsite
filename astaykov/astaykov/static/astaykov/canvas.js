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
    init();
})

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

this.computeLocation = function (date) {
    if (date === this.undefined || date === null) {
        return canvas.width - 15;
    }

    var availableSpace = canvas.width;
    var daysDiff = Math.floor((eventObjects[eventObjects.length - 1].end - eventObjects[0].start) / (1000 * 60 * 60 * 24));

    var curentDiff = Math.floor((date - eventObjects[0].start) / (1000 * 60 * 60 * 24));

    var onePercent = 100 / daysDiff;
    var curentPercent = Math.round(curentDiff * onePercent);

    return Math.round((availableSpace - 30) / 100 * curentPercent) + 15
}

// Objects
function Event(name, desk, location, position, start, end) {
    this.name = name
    this.description = desk
    this.location = location
    this.position = position
    this.start = start
    this.end = end
    this.startMark = undefined
    this.endMark = undefined

    this.isSingle = function () {
        return this.end === undefined || this.start === this.end;
    }



    this.draw = function () {
        if (this.end !== undefined && +this.end === +this.start) {
            this.startMark = computeLocation(this.start);
            this.drawCircle();
        } else {
            this.startMark = computeLocation(this.start);
            this.endMark = computeLocation(this.end);
            this.drawTimeFrame();
        }
    }

    this.drawCircle = function () {
        c.beginPath();
        c.arc(this.startMark, canvas.height / 2, 5, 0, Math.PI * 2, false)
        c.strokeStyle = colors[0];
        c.fillStyle = colors[2];
        c.stroke();
        c.fill();
        c.closePath()
    }

    this.drawTimeFrame = function () {
        var eventLength = this.endMark - this.startMark;

        console.log(eventLength);

        var r = 15;
        var x = this.startMark + r;
        var y = canvas.height / 2;
        var ld = (eventLength - (4 * r)) / 2;

        c.beginPath();
        c.arc(x, y, r, Math.PI, Math.PI * 1.5);

        y -= r;

        c.lineTo(x + ld, y);

        x += ld;
        y -= r;

        c.arc(x, y, r, Math.PI * 0.5, 0, true);

        x += 2 * r

        c.arc(x, y, r, Math.PI, Math.PI * 0.5, true);

        x += ld
        y += r

        c.lineTo(x, y)

        y += r;

        c.arc(x, y, r, Math.PI * 1.5, Math.PI * 0);

        c.stroke();
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
    readEvents = [];
    eventObjects = [];
    eventElements.toArray().forEach(a => readEvents.push(parseEvents($(a))));
    readEvents.forEach(e => eventObjects.push(new Event(e.name, e.description, e.location, e.position, new Date(e.start), e.end ? new Date(e.end) : new Date())));
    eventObjects.push(new Event("Now", null, null, "Right", new Date(), new Date()))
    c.beginPath();
    c.moveTo(15, canvas.height / 2);
    c.lineTo(canvas.width - 15, canvas.height / 2);
    c.strokeStyle = colors[1];
    c.stroke();
    eventObjects.forEach(element => {
        element.draw();
    });
}

// Animation Loop

init()