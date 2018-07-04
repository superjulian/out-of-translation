var passages = [
    "After slipping off your porch last night, we lost our common language.", 
    "(It was not saying what we were thinking. It was taking every feeling  and shoving it deep into our pockets like a used tissue.).", 
    "My hands tucking your hair behind your ears or waving hello became eyes snapped the other way and a text to end it. Just for now you said. Which meant always.",
    "I came late, fear-shaken and wondering if you were looking out the window down on me, walking under the street-lit nighttime. Wondering if I looked ok but I would check in my phone’s camera on the elevator ride up.", 
    "You became the only person I had kissed in an elevator, a fact I wouldn’t tell you. I thought it was important.", 
    "In a couple of weeks I gave up and showed you the picture I accidentally took the first time, where I look so frightened. It made you laugh. If I could make you laugh, I could fall into trusting you.",
    "Mostly I just wanted to feel special, and sometimes you were good for that (like you were good at making me fear I didn’t look gay enough to be with you; My hair still long, legs still shaved and still wearing skirts).", 
    "I fell for the stacks of poetry on your desk and your near-condescending wisdom. That was how it was. Hands held when nobody was looking.", 
    "We liked pretending we were in love which was fun at the time and then hurt like hell for days after. No one tells you how dangerous that is.",
    "Now I am good at not looking your way when we are in the same room.",
    "I admit, I still read your poems (out of vanity, looking for shards of me).", 
    "Maybe I haven’t learned anything, I’m still using you to make me feel special. You use me too though."
];

function Text (currentText, nextText, ready, queued, count) {
    this.currentText = currentText;
    this.nextText = nextText;
    this.ready = ready;
    this.queued = queued;
    this.count =count;
}
function Section (id, contains){
    this.id = id;
    this.contains = contains;
    this.getElement = function (){
        return document.getElementById(this.id);
    };
}
//array of objects for each section of text, of the form {currentText: "", nextText: "", ready: false, queued: false} 
//contains text and boolean to track whether the text has been translated.
var texts = []; 
//array of text section objects of the form 
// {element: DOM reffrence, contains: [list of texts in order of appearance]}
var sections = []; 
var userLock = false;

function translate (text) {
    var toGarble = {}
    toGarble.text = text.currentText;
    toGarble.count = text.count;
    if (text.count < 5) {text.count += 1;}
    var xml = new XMLHttpRequest;
    xml.open("POST", "https://google-garble.herokuapp.com/plainText");
    xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xml.onreadystatechange = function() {//Call a function when the state changes.
        if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            text.nextText = this.responseText;
            text.ready = true;
            if (text.queued){//will this work?
                replaceText ([text]);
            }
            //console.log(this.responseText);
        }
    }
    xml.send(JSON.stringify(toGarble));
}

function replaceText (newTexts, calledFrom = null){
    //console.log("replaceText called");
    //console.log(newTexts);
    //console.log(calledFrom);
    if (!userLock || !calledFrom){
        userLock = true;
        if (calledFrom) {
            calledFrom.getElement().innerHTML = "...";
        }
        for (var i = 0; i < newTexts.length; i++){
            var text = newTexts[i];
            if (text.ready) {
                text.currentText = text.nextText;
                text.queued = false;
                text.ready = false;
                translate (text);
            }
            else {
                text.queued = true;
            }
        }
        update();
    }
}

function update () {
    console.log("update called");
    for (var i = 0; i < texts.length; i++){//check to see if anything is queued
        var text = texts[i];
        if (text.queued){//early return if so
            return false;
        }
    }
    for (var i = 0; i < sections.length; i++) {//update all sections
        var string = "";
        for (var j = 0; j < sections[i].contains.length; j++){//concatinate texts
            string += sections[i].contains[j].currentText + " ";
        }
        sections[i].getElement().innerHTML = string;//replace in docment
    }
    userLock = false;

}

function onLoad () {
    for (var i = 0; i < passages.length; i++){
        texts.push(new Text (passages[i], passages[i], true, false, 2));
    }
    sections.push (new Section ("text1", [texts[0], texts[1], texts[2]]))
    sections.push (new Section ("text2", [texts[3], texts[4], texts[5]]))
    sections.push (new Section ("text3", [texts[6], texts[7], texts[8]]))
    sections.push (new Section ("text4", [texts[9], texts[10], texts[11]]))
    document.getElementById("translate1").onclick = function () {
        replaceText(sections [0].contains, sections[0]);
        return false;
    };
    document.getElementById("translate2").onclick = function () {
        replaceText(sections [1].contains, sections[1]);
        return false;
    };
    document.getElementById("translate3").onclick = function () {
        replaceText( sections [2].contains, sections[2]); 
        return false;
    };
    document.getElementById("translate4").onclick = function () {
        replaceText(sections [3].contains, sections[3]);
        return false;
    };
    replaceText (texts, null);
    console.log("new loaded :)");
}
onLoad();
