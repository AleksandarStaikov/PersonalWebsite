const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const holder = $(canvas).parent();
const eventRadius = 5;

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

canvas.width = holder[0].clientWidth;
canvas.height = 200;

const mouse = {
    x: undefined,
    y: undefined
}

const canvasLocation = {
    x: undefined,
    y: undefined
}

const colors = ['#2185C5', '#7ECEFD', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
    init();
})

addEventListener('scroll', updateCanvasLocation)

addEventListener('resize', () => {
    canvas.width = holder[0].clientWidth;
    init();
})

function updateCanvasLocation() {
    var canvasPossition = $(canvas).offset();
    canvasLocation.y = canvasPossition.top -= $(window).scrollTop()
    canvasLocation.x = canvasPossition.left
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function computeLocation(date) {
    if (date === undefined || date === null) {
        return canvas.width - 15;
    }

    var availableSpace = canvas.width;
    var daysDiff = Math.floor((eventObjects[eventObjects.length - 1].end - eventObjects[0].start) / (1000 * 60 * 60 * 24));

    var curentDiff = Math.floor((date - eventObjects[0].start) / (1000 * 60 * 60 * 24));

    var oneDayInPercents = 100 / daysDiff;
    var curentPercent = Math.round(curentDiff * oneDayInPercents);

    return Math.round((availableSpace - 30) / 100 * curentPercent) + 15
}

function computeRadius(length) {
    min = 16
    max = 200
    a = 4
    b = 13
    if (length < min) {
        return 0;
    }

    if (length > max) {
        return 14;
    }

    return (b - a) * (length - min) / (max - min) + a
}

function distanceBetweenPoints(a, b, x, y) {
    var horizontalDistance = Math.abs(a - x)
    var verticalDistance = Math.abs(b - y)
    return Math.sqrt(horizontalDistance * horizontalDistance + verticalDistance + verticalDistance)
}

function computeHoveredEvent(events) {
    var closest = events[0];
    var lowestDistance = distanceBetweenPoints(mouse.x, mouse.y, events[0].center.x + canvasLocation.x, events[0].center.y + canvasLocation.y)

    events.forEach(e => {
        var eventGlobalX = e.center.x + canvasLocation.x
        var eventGlobalY = e.center.y + canvasLocation.y
        var currentElementDistance = distanceBetweenPoints(mouse.x, mouse.y, eventGlobalX, eventGlobalY)
        if (currentElementDistance < lowestDistance) {
            closest = e
            lowestDistance = currentElementDistance
        }
    })

    if (lowestDistance <= eventRadius) {
        return closest;
    }
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
    this.center = { x: undefined, y: undefined }
    this.r = undefined
    this.eventLength = undefined

    this.isSingle = function () {
        return this.end !== undefined && +this.end === +this.start;
    }

    this.draw = function () {
        this.startMark = computeLocation(this.start);
        if (!this.isSingle()) {
            this.endMark = computeLocation(this.end);
            this.eventLength = this.endMark - this.startMark
            this.r = computeRadius(this.eventLength);
        }

        if (this.r === undefined || this.r === 0) {
            var circleMiddle = this.eventLength ? this.eventLength / 2 + this.startMark : this.startMark
            this.center.x = circleMiddle
            this.center.y = canvas.height / 2
        } else {
            if (this.position === 'B') {
                this.drawTimeFrameBellow()
            } else {
                this.drawTimeFrameAbove();
            }
        }
        this.drawCircle(this.center.x, this.center.y);
    }

    this.drawCircle = function (x, y) {
        c.beginPath();
        c.arc(x, y, eventRadius, 0, Math.PI * 2, false)
        c.strokeStyle = colors[0];
        c.fillStyle = colors[2];
        c.stroke();
        c.fill();
        c.closePath()
    }

    this.drawTimeFrameAbove = function () {
        var x = this.startMark + this.r;
        var y = canvas.height / 2;
        var ld = (this.eventLength - (4 * this.r)) / 2;

        c.beginPath();
        c.arc(x, y, this.r, Math.PI, Math.PI * 1.5);

        y -= this.r;

        c.lineTo(x + ld, y);

        x += ld;
        y -= this.r;

        c.arc(x, y, this.r, Math.PI * 0.5, 0, true);

        this.center.x = x + this.r
        this.center.y = y
        x += 2 * this.r

        c.arc(x, y, this.r, Math.PI, Math.PI * 0.5, true);

        x += ld
        y += this.r

        c.lineTo(x, y)

        y += this.r;

        c.arc(x, y, this.r, Math.PI * 1.5, Math.PI * 0);

        c.stroke();
    }

    this.drawTimeFrameBellow = function () {
        var x = this.startMark + this.r;
        var y = canvas.height / 2;
        var ld = (this.eventLength - (4 * this.r)) / 2;

        c.beginPath();
        c.arc(x, y, this.r, Math.PI, Math.PI * 0.5, true);

        y += this.r;

        c.lineTo(x + ld, y);

        x += ld;
        y += this.r;

        c.arc(x, y, this.r, Math.PI * 1.5, 0);

        this.center.x = x + this.r
        this.center.y = y
        x += 2 * this.r

        c.arc(x, y, this.r, Math.PI * 1.0, Math.PI * 1.5);

        x += ld
        y -= this.r

        c.lineTo(x, y)

        y -= this.r;

        c.arc(x, y, this.r, Math.PI * 0.5, Math.PI * 0, true);

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
eventElements.toArray().forEach(a => readEvents.push(parseEvents($(a))));
readEvents.forEach(e => eventObjects.push(new Event(e.name, e.description, e.location, e.position, new Date(e.start), e.end ? new Date(e.end) : new Date())));
eventObjects.push(new Event("Now", null, null, "Right", new Date(), new Date()))

function init() {
    updateCanvasLocation()

    c.beginPath();
    c.moveTo(15, canvas.height / 2);
    c.lineTo(canvas.width - 15, canvas.height / 2);
    c.strokeStyle = colors[1];
    c.stroke();

    eventObjects.forEach(event => {
        event.draw();
    });

    var hoveredEvent = computeHoveredEvent(eventObjects)


}

init()