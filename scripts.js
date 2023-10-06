const inputElem = document.getElementById("input");
const outputElem = document.getElementById("output");

inputElem.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = inputElem.value;
        handleCommand(inputValue);
        inputElem.value = "";
    }
});

let waitingForMessage = false; // Flag to check if the next input should be treated as a message



function handleCommand(command) {
    if (waitingForMessage) {
        // Handle the message input
        sendToDiscord(command);
        waitingForMessage = false; // Reset the flag after sending the message
        return;
    }
    switch (command) {
        case '/help':
            addOutput("Available commands: /help, /about, /down, /work, /education, /contact, /messageChris, /music, /clear");
            break;
        case '/about':
            addOutput("My name is Chris, I'm originally from Newtownards, Co.Down, Northern Ireland. I am a Java / Kotlin engineer with 7+ years of experience. I'm currently living in London.");
            break;
        case '/down':
            addOutput("https://en.wikipedia.org/wiki/County_Down")
            addOutput("County Down is situated in the southeastern part of Northern Ireland, bordered by the Irish Sea to the east, Belfast Lough to the north, and the Mourne Mountains to the south. It's a region of great natural beauty, with a mix of picturesque coastline, rolling countryside, and dramatic mountain landscapes.")
            addOutput("The Mourne Mountains, in particular, are one of County Down's most iconic features. These granite peaks not only dominate the county's topography but are also a haven for outdoor enthusiasts, offering numerous hiking, biking, and climbing opportunities. The highest peak, Slieve Donard, provides panoramic views of the Irish Sea and the surrounding landscape.")
            addOutput("Downpatrick, one of the county's main towns, is an important historical and ecclesiastical center. It is reputedly the burial place of Saint Patrick, the patron saint of Ireland. The town's Saint Patrick's Cathedral is a significant pilgrimage site and a testament to the region's rich Christian heritage.")
            addOutput("The Ards Peninsula, jutting out into the Irish Sea, offers a blend of quaint villages, sandy beaches, and rich maritime history. Strangford Lough, the largest inlet in the British Isles, lies adjacent to it, and is a significant wildlife sanctuary, known for its diverse bird population and marine life.")
            addOutput("County Down is a blend of historical depth, natural beauty, and cultural richness, making it one of Northern Ireland's most diverse and enchanting regions.")
            break;
        case '/education':
            addOutput("Queens University Belfast, BSC Computer Science 1st class honors https://www.qub.ac.uk")
            break;
        case '/work': 
            addOutput("10x Banking London,   Software Engineer,           07/2022 - Present")
            addOutput("Vonage London,        Java Developer,              09/2020 - 07/2022")
            addOutput("Blockchain.com,       London  Software Engineer,   08/2019 - 09/2020")
            addOutput("OTCXN Belfast,        Senior Software Engineer,    05/2018 - 08/2019")
            addOutput("CME Belfast,          Software Engineer,           08/2016 - 05/2018")
            break;
        case '/contact': 
            addOutput("Email: cbrown184@protonmail.com, Phone: +447798568854, Github: github.com/cbrown184");
            break;     
        case '/messageChris':
            addOutput("Type a message to send to me directly:");
            // Here, you can ask the user to input a message and then send it to you.
            waitingForMessage = true;
            break;
        case '/music':
            playMusic()
            break
        case '/clear':
            clearTerminal();
            break;
        default:
            addOutput("Unknown command. Type /help for available commands.");
    }
}

function clearTerminal() {
    outputElem.innerHTML = '';  // clear all the content inside the output element
}

function playMusic() {
    const audio = document.getElementById("audioPlayer");
    audio.play();
}

function sendToDiscord(message) {
    const webhookURL = 'https://discord.com/api/webhooks/1159766299921109042/bUMAYIliaXrjFRJhqyviVvToFvg9ivcBikv66S0_CWm4RnWr4XoD_zFIibxR0rbue23U';
    const payload = {
        content: message
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            addOutput("Failed to send message.. maybe try email");
        } else {
            addOutput("Message sent successfully!");
        }
    })
    .catch(error => {
        addOutput("Error: " + error.message);
    });
}


function addOutput(message) {
    const newOutput = document.createElement("div");
    newOutput.textContent = message;
    outputElem.appendChild(newOutput);
}

let audioCtx, analyser, source, dataArray, bufferLength, canvas, canvasCtx;

function setupAudioBars() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(document.getElementById("audioPlayer"));
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    canvas = document.getElementById("audioVisualizer");
    canvasCtx = canvas.getContext("2d");
    drawAudioBars();
}

function drawAudioBars() {
    requestAnimationFrame(drawAudioBars);
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    let barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i];

        canvasCtx.fillStyle = 'rgba(50,50,50,' + (barHeight/255) + ')';
        canvasCtx.fillRect(x, canvas.height - barHeight/2, barWidth, barHeight/2);

        x += barWidth + 1;
    }
}

document.getElementById("audioPlayer").onplay = function() {
    if (!audioCtx) setupAudioBars();
};
