console.log(window.location.search)
if (window.location.search.length > 0) {
    try {
        query_params = decodeURIComponent(window.location.search).substring(1).split("&");
        const retrieve_flag = query_params[0].split("=")[1];
        if (retrieve_flag) {
            // Request data for this session from server
        
        } else {
        
        }
        const userID = query_params[1].split("=")[1];
        const session_date = query_params[2].split("=")[1];
        setDate(session_date);
    } catch {

    }
}

addExercise();

async function sendToServer() {
    const data = collectSessionData();
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    const response = await fetch('/saveSession',options);
    const responseData = response.json();
    console.log(response.status);
}

function containsEncodedComponents(x) {
    return (decodeURI(x) !== decodeURIComponent(x));
  }


function roundHalf(num) {
    return Math.round(num*2)/2;
}

function collectSessionData() {
    const numEx = document.getElementsByClassName("exContainer").length;
    console.log(numEx+" exercises");
    let data = {
        'user_ID' : [],
        'auth_key' : [],
        'date': [],
        'exName': [],
        'protocol': [],
        'load': [],
        'reps': [],
        'rpe': [],
        'targetLoad': [],
        'targetReps': [],
        'targetRpe': [],
        'coachNotes': [],
        'athleteNotes': []
    };
    session_date = document.getElementById("date_field").innerText.split(' ')[1]
    console.log(session_date)
    data['date'] = String(session_date);
    data['userID'] = 'user_69';
    data['authkey'] = '69420';

    for (let ex = 0; ex<numEx; ex++) {
        
        data['exName'].push(document.getElementById("ex"+ex+"_exName").value);
        data['protocol'].push(document.getElementById("ex"+ex+"_protocol").value);
        data['coachNotes'].push(document.getElementById("ex"+ex+"_coachNotes").value);
        data['athleteNotes'].push(document.getElementById("ex"+ex+"_athleteNotes").value);

        let exercise = document.getElementById("ex"+ex);
        let numSets = exercise.getElementsByClassName("set").length;

        let load = [];
        let reps = [];
        let rpe = [];
        let load_t = [];
        let reps_t = [];
        let rpe_t = [];

        for (let i = 0; i<numSets; i++) {
            load[i] = document.getElementById("ex"+ex+"_set"+i+"_load").value;
            reps[i] = String(Math.floor(Number(document.getElementById("ex"+ex+"_set"+i+"_reps").value)));
            rpe[i] = String(roundHalf(Number(document.getElementById("ex"+ex+"_set"+i+"_rpe").value)));

            load_t[i] = document.getElementById("ex"+ex+"_set"+i+"_loadTarget").value;
            reps_t[i] = String(Math.floor(Number(document.getElementById("ex"+ex+"_set"+i+"_repsTarget").value)));
            rpe_t[i] = String(roundHalf(Number(document.getElementById("ex"+ex+"_set"+i+"_rpeTarget").value)));

            console.log(rpe_t[i])
        }

        data['load'].push(load);
        data['reps'].push(reps);
        data['rpe'].push(rpe);

        data['targetLoad'].push(load_t);
        data['targetReps'].push(reps_t);
        data['targetRpe'].push(rpe_t);

        console.log(data);
    }
    return data;
}

function setDate(dateString) {
    tmp = dateString.split("_");
    dd = tmp[0];
    mm = tmp[1];
    yy = tmp[2];
    const dateElement = document.getElementById("date_field");
    dateElement.innerHTML = "<h3>Date: "+dd+"/"+mm+"/"+yy + "</h3>";
    const session_date = dd+'_'+mm+'_'+yy;
}

function confirmPopUp(parentExID) {
    console.log("hello")
    const modal = document.createElement("div");
    modal.setAttribute("id","modal0");
    modal.setAttribute("class","modal")
    
    const msgBox = document.createElement("div")
    msgBox.setAttribute("id","confirmBox")
    msgBox.setAttribute("class","popup")

    const msg = document.createElement("h4");
    msg.setAttribute("style", "color: white");
    msg.appendChild(document.createTextNode("Delete Exercise?"))

    const btns = document.createElement("div")
    btns.setAttribute("class","centerify");

    const okBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");

    okBtn.setAttribute("class","btn");
    cancelBtn.setAttribute("class","btn");
    okBtn.setAttribute("id","btnOK");
    cancelBtn.setAttribute("id","btnCancel");

    okBtn.appendChild(document.createTextNode("OK"));
    cancelBtn.appendChild(document.createTextNode("Cancel"));

    const content = document.createElement("div");
    content.setAttribute("class","center-center")

    btns.appendChild(cancelBtn);
    btns.appendChild(okBtn);
    content.appendChild(msg);
    content.appendChild(btns);
    msgBox.appendChild(content)
    modal.appendChild(msgBox);
    document.getElementById("sessionBox").appendChild(modal);

    document.getElementById("btnOK").addEventListener("click", ()=> { 
        document.getElementById("sessionBox").removeChild(document.getElementById("modal0"));
    });
    document.getElementById("btnCancel").addEventListener("click", ()=> {
        document.getElementById("sessionBox").removeChild(document.getElementById("modal0"));
    });
    
    document.getElementById("btnOK").myParam = parentExID;
    document.getElementById("btnOK").addEventListener("click", removeExercise2 );
}




function addRemoveSet(event) {

    const parentID = event.currentTarget.parentElement.parentElement.parentElement.getAttribute("id");
    const newCount = document.getElementById(parentID+"_setCounter").value;
    const numSets = document.getElementById(parentID).getElementsByClassName("set").length;
    const delta = Math.abs(newCount-numSets)

    if (newCount>numSets) {
        for (let i = 1; i <= delta; i++) {
            addSet(parentID);
        }
        
    } else if (newCount<numSets) {
        for (let i = 1; i <= delta; i++) {
            removeSet(parentID);
        }
    }

}

function removeSet(exerciseElementID) {
    const numSets = document.getElementById(exerciseElementID).getElementsByClassName("set").length;
    const removeID = exerciseElementID + "_set" + String(numSets-1);
    console.log("id to remove: "+removeID);
    document.getElementById(removeID).parentNode.removeChild(document.getElementById(removeID));
}

function addSet(exerciseElementID) {
    const numSets = document.getElementById(exerciseElementID).getElementsByClassName("set").length;
    newSetID = exerciseElementID + "_set" + String(numSets);
    console.log(newSetID);

    const newSet = document.createElement("div");
    newSet.setAttribute("class","set");
    newSet.setAttribute("id",newSetID)
    

    // Target Fields
    const loadField = document.createElement("input");
    loadField.setAttribute("id",newSetID+"_loadTarget");
    loadField.setAttribute("type","number");
    loadField.setAttribute("placeholder","Load");
    loadField.setAttribute("class","setInputField");
    loadField.setAttribute("min","0");
    
    const loadLabel = document.createElement("label");
    loadLabel.setAttribute("for",newSetID+"_loadTarget");
    loadLabel.appendChild(document.createTextNode(" kg x "));

    newSet.appendChild(loadField);
    newSet.appendChild(loadLabel);

    const repsField = document.createElement("input");
    repsField.setAttribute("id",newSetID+"_repsTarget");
    repsField.setAttribute("type","number");
    repsField.setAttribute("placeholder","Reps");
    repsField.setAttribute("class","setInputField");
    repsField.setAttribute("min","0");
    
    const repsLabel = document.createElement("label");
    repsLabel.setAttribute("for",newSetID+"_repsTarget");
    repsLabel.appendChild(document.createTextNode(" @ "));

    newSet.appendChild(repsField);
    newSet.appendChild(repsLabel);

    const rpeField = document.createElement("input");
    rpeField.setAttribute("id",newSetID+"_rpeTarget");
    rpeField.setAttribute("type","number");
    rpeField.setAttribute("placeholder","RPE");
    rpeField.setAttribute("class","setInputField");
    rpeField.setAttribute("max","10");
    rpeField.setAttribute("min","0");
    rpeField.setAttribute("step","0.5");

    newSet.appendChild(rpeField);

    const copyButton = document.createElement("input");
    copyButton.setAttribute("type","image");
    copyButton.setAttribute("src","img/arrow.png");
    copyButton.setAttribute("id",newSetID+"_copyBtn");
    copyButton.setAttribute("class","inlineImgButton");

    newSet.appendChild(copyButton);
    // Actual Fields
    const loadActual = loadField.cloneNode(true);
    const label1 = loadLabel.cloneNode(true);
    const repsActual = repsField.cloneNode(true);
    const label2 = repsLabel.cloneNode(true);
    const rpeActual = rpeField.cloneNode(true);

    loadActual.setAttribute("id",newSetID+"_load");
    label1.setAttribute("for",newSetID+"_load");
    repsActual.setAttribute("id",newSetID+"_reps");
    label2.setAttribute("reps",newSetID+"_reps");
    rpeActual.setAttribute("id",newSetID+"_rpe");
    
    newSet.appendChild(loadActual);
    newSet.appendChild(label1);
    newSet.appendChild(repsActual);
    newSet.appendChild(label2);
    newSet.appendChild(rpeActual);

    
    document.getElementById(exerciseElementID).appendChild(newSet);
    document.getElementById(exerciseElementID).insertBefore(newSet,document.getElementById(exerciseElementID+"_bottomDiv"));
    copyButton.addEventListener("click", target2actual);
}

function target2actual(event) {
    setID = event.currentTarget.parentElement;
    const load = document.getElementById(setID.id+"_loadTarget").value;
    const reps = document.getElementById(setID.id+"_repsTarget").value;
    const rpe = document.getElementById(setID.id+"_rpeTarget").value;

    document.getElementById(setID.id+"_load").value = load;
    document.getElementById(setID.id+"_reps").value = reps;
    document.getElementById(setID.id+"_rpe").value = rpe;
}

function addExercise() {
    const bigBox = document.getElementById("sessionBox");
    let numEx = bigBox.getElementsByClassName("exContainer").length;

    let i = 0;
    while (true) {
        newExID = "ex"+i;
        if (document.getElementById(newExID)==null) {
            break;
        }
        i++;
    }

    console.log("new ex id: "+newExID);

    const newEx = document.createElement("div");
    newEx.setAttribute("class","exContainer");
    newEx.setAttribute("id",newExID)

    const topRow = document.createElement("div");
    topRow.setAttribute("class","topRow")
    topRow.setAttribute("id",newExID+"_topRow")

    

    // const exName = document.createElement("input");
    // exName.setAttribute("type","text");
    // exName.setAttribute("class","inputFieldBlk");
    // exName.setAttribute("placeholder","Exercise Name");
    // exName.setAttribute("id",newExID+"_exName");

    const exList = ["Squat", "Bench Press", "Sumo Deadlift"].sort()

    const exName = document.createElement("select");
    var tmp;
    for (let i = 0; i<exList.length; i++) {
        tmp = document.createElement("option");
        tmp.setAttribute("option", exList[i]);
        tmp.innerText = exList[i];
        console.log(exList[i])

        exName.appendChild(tmp);
    }

    // exName.setAttribute("type","text");
    exName.setAttribute("class","inputFieldBlk");
    exName.setAttribute("id",newExID+"_exName");
    
    const brkLine = document.createElement("br");
    const setsLabel = document.createElement("label");
    setsLabel.appendChild(document.createTextNode(" Sets: "));

    const setsNum = document.createElement("input");
    setsNum.setAttribute("id",newExID+"_setCounter")
    setsNum.setAttribute("class","setCount")
    setsNum.setAttribute("type","number")
    setsNum.setAttribute("style","width: 50px")
    setsNum.setAttribute("value","0")
    setsNum.setAttribute("min","0")
    setsNum.setAttribute("max","20")
    
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class","btnRed")
    deleteButton.appendChild(document.createTextNode("Delete"))
    deleteButton.setAttribute("id",newExID + "_deleteBtn")

    const rhs = document.createElement("div");
    rhs.appendChild(setsLabel);
    rhs.appendChild(setsNum);
    rhs.appendChild(deleteButton);


    topRow.appendChild(exName);
    topRow.appendChild(rhs);

    const coachNotes = document.createElement("textarea");
    coachNotes.setAttribute("class","exNotes");
    coachNotes.setAttribute("id",newExID+"_coachNotes");

    const protocolField = document.createElement("input");
    protocolField.setAttribute("type","text");
    protocolField.setAttribute("id",newExID+"_protocol");
    protocolField.setAttribute("placeholder","Protocol...");
    protocolField.setAttribute("class","inputFieldProtocol");

    //
    const modLabel = document.createElement("label");
    modLabel.appendChild(document.createTextNode(" Mod: "));

    const modifier = document.createElement("input");
    modifier.setAttribute("id",newExID+"_mod")
    modifier.setAttribute("class","setCount")
    modifier.setAttribute("type","number")
    modifier.setAttribute("style","width: 50px")
    modifier.setAttribute("value","0")
    //
    

    const protocolDiv = document.createElement("div");
    protocolDiv.setAttribute("class","topRow");
    
    const populateButton = document.createElement("button");
    populateButton.setAttribute("class","popButton");
    populateButton.setAttribute("id",newExID+"_popBtn");
    populateButton.appendChild(document.createTextNode("Populate"));
    

    const rhs2 = document.createElement("div");
    rhs2.appendChild(modLabel);
    rhs2.appendChild(modifier);
    rhs2.appendChild(populateButton);

    protocolDiv.appendChild(protocolField);
    protocolDiv.appendChild(rhs2);

    const notesDiv = document.createElement("div");
    notesDiv.setAttribute("class","wrapper1");
    notesDiv.appendChild(document.createTextNode("Coach Notes:"));
    notesDiv.appendChild(coachNotes);

    newEx.appendChild(topRow);
    newEx.appendChild(protocolDiv);
    newEx.appendChild(notesDiv);
    newEx.appendChild(document.createElement("hr"));
    newEx.appendChild(brkLine);


    // Target/actual

    const TA = document.createElement("div");
    TA.setAttribute("class","centerify")
    TA.appendChild(document.createTextNode("Target  \u00A0  \u00A0 \u00A0   |  \u00A0 \u00A0  \u00A0   Actual"))

    newEx.appendChild(TA);


    const athleteNotes = document.createElement("textarea");
    athleteNotes.setAttribute("class","exNotes");
    athleteNotes.setAttribute("id",newExID+"_athleteNotes");

    const bottomDiv = document.createElement("div");
    bottomDiv.setAttribute("class","wrapper1");
    bottomDiv.appendChild(document.createTextNode("Athlete Notes:"));
    bottomDiv.appendChild(athleteNotes);
    bottomDiv.setAttribute("id",newExID+"_bottomDiv");
    newEx.appendChild(bottomDiv);

    document.getElementById("sessionBox").insertBefore(newEx,document.getElementById("bottomButtons"));
    document.getElementById(newExID+"_setCounter").addEventListener("change",addRemoveSet);
    document.getElementById(newExID+"_deleteBtn").addEventListener("click",removeExercise);
    document.getElementById(newExID+"_popBtn").addEventListener("click", populateFields);


}

function populateFields(event){
    const parentExID = event.currentTarget.parentElement.parentElement.parentElement.getAttribute("id");
    const protocol = document.getElementById(parentExID+"_protocol").value;

    // Remove all existing sets

    // translate notation
    phrases = protocol.split(" ");
    numSets = 0;
    var newSets = [];
    
    console.log("Phrases:");
    console.log(phrases);

    for (let i = 0; i<phrases.length; i++) {
        // Look for RPE and %-specified sub-protocols, and down sets/repeats etc
        if (phrases[i].includes("@")) {
            substr = phrases[i].split("@")[1];
            // Get reps
            reps = phrases[i].split("@")[0];
            reps = reps[reps.length-1];
            if (substr.includes(",")) {
                rpes = substr.split(",");
                if (rpes[rpes.length-1]== '') {
                    rpes.pop();
                }
            } else {
                rpes = substr;
            }

            // Get RPEs
            for (let j = 0; j<rpes.length; j++) {
                newSets[newSets.length] = [reps, rpes[j], ''];
            }
        } else if (phrases[i].includes("%")) {
            a = phrases[i].split("%");
            pct = a[0];
            repset = a[1];
            b = repset.split("s");
            numSets += Number(b[0].substr(b[0].length-1));
            b = repset.split("r");
            
            reps = b[0].charAt(b.length-1);
            for (let j = 0; j<numSets; j++) {
                newSets[newSets.length] = [reps, '', pct];
            }

        } else if (phrases[i].includes("plus")) {
            numSets = phrases[i+1];
            // variable reps will already be defined if syntax is correct
            for (let j = 0; j<numSets; j++) {
                newSets[newSets.length] = [reps, '', ''];
            }
        }
    }

        // Look for down sets, repeats etc
    

    console.log("Sets to add:");
    for (i = 0; i<newSets.length; i++) {
        console.log(newSets[i][0]+"reps, "+newSets[i][1]+"rpe, " + newSets[i][2]+"%");
    }

    // Remove any existing sets
    const numExistingSets = document.getElementById(parentExID).getElementsByClassName("set").length;
    console.log(numExistingSets);

    if (numExistingSets>0) {
        for (i = 0; i<numExistingSets; i++) {
            removeSet(parentExID);
        }
    }
    
    

    for (i = 0; i<newSets.length; i++) {
        addSet(parentExID);
    }
    document.getElementById(parentExID+"_setCounter").value = newSets.length;
    // Add new sets

    // Populate values

}

function removeExercise(event) {   
    const parentExID = event.currentTarget.parentElement.parentElement.parentElement.getAttribute("id");
    confirmPopUp(parentExID);
    console.log("Parent ID: "+parentExID);      
}

function removeExercise2(event) {
    const parentID = event.currentTarget.myParam;
    console.log("id to remove: "+parentID);
    document.getElementById(parentID).remove();            
}



function addExPopUp() {
    console.log("hello")
    const modal = document.createElement("div");
    modal.setAttribute("id","modal0");
    modal.setAttribute("class","modal")
    
    
    const msgBox = document.createElement("div")
    msgBox.setAttribute("id","confirmBox")
    msgBox.setAttribute("class","addex_popup")

    const modal_title = document.createElement("h3");
    modal_title.setAttribute("style", "color: white; display:flex; justify-content: center");
    modal_title.appendChild(document.createTextNode("Add Exercise"))

    const btns = document.createElement("div")
    btns.setAttribute("class","centerify");

    const okBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");

    okBtn.setAttribute("class","btn");
    cancelBtn.setAttribute("class","btn");
    okBtn.setAttribute("id","btnOK");
    cancelBtn.setAttribute("id","btnCancel");

    okBtn.appendChild(document.createTextNode("OK"));
    cancelBtn.appendChild(document.createTextNode("Cancel"));

    const ex_selector = document.createElement('div');
    ex_selector.setAttribute('style', 'display:flex; flex-direction: column; justify-content: flex_start; width: 90%');

    const searchbar_ex = document.createElement("input");
    searchbar_ex.setAttribute("type","text")
    searchbar_ex.setAttribute("class","inputFieldBlk");
    searchbar_ex.setAttribute("style","width: 100%");
    searchbar_ex.setAttribute("placeholder","Search Exercises...");
    searchbar_ex.setAttribute("id","exercise_searchbar")
    searchbar_ex.addEventListener("keydown",update_suggestions_exercises);

    const autocomplete_ex = document.createElement("div")
    autocomplete_ex.setAttribute("class", "suggestions")
    autocomplete_ex.setAttribute("id","exercise_suggestions")

    
    var tmp;
    for (let i =0; i<exList.length; i++) {
        tmp = document.createElement('div');
        tmp.innerText = exList[i];
        tmp.setAttribute('class','suggestion unselectable')
        tmp.addEventListener("click",select_one);
        autocomplete_ex.appendChild(tmp);
    }

    ex_selector.appendChild(searchbar_ex);
    ex_selector.appendChild(autocomplete_ex)


    btns.appendChild(cancelBtn);
    btns.appendChild(okBtn);

    msgBox.appendChild(modal_title);
    msgBox.appendChild(ex_selector)
    msgBox.appendChild(btns);

    modal.appendChild(msgBox);

    document.getElementById("sessionBox").appendChild(modal);

    document.getElementById("btnOK").addEventListener("click", ()=> { 
        document.getElementById("sessionBox").removeChild(document.getElementById("modal0"));
    });
    document.getElementById("btnCancel").addEventListener("click", ()=> {
        document.getElementById("sessionBox").removeChild(document.getElementById("modal0"));
    });
    
    //document.getElementById("btnOK").myParam = parentExID;
    //document.getElementById("btnOK").addEventListener("click", removeExercise2 );
}

const exList = ["Squat", "Bench Press", "Sumo Deadlift", "Good Morning", "High Bar Squat", "Incline Bench", "Dumbbell Flyes"];

function select_one(event) {
    const p = event.currentTarget.parentElement
    const children = p.children;
    for (let i = 0; i<children.length; i++) {
        children[i].setAttribute('style','background: rgba(0,0,0,0)')
    }
    event.currentTarget.setAttribute('style','background: rgba(200,0,0,.5)')

}

function update_suggestions_exercises(event) {
   
    var search_term;

    if (event.key.length==1) {
        search_term = document.getElementById("exercise_searchbar").value + event.key;
    } else if (event.key == 'Backspace') {
        search_term = document.getElementById("exercise_searchbar").value.slice(0,-1);
    }

    var suggestions = [];
    
    if (search_term.length>0) {
        for (let i = 0; i<exList.length; i++) {
            if (exList[i].toLowerCase().includes(search_term.toLowerCase())) {
                suggestions.push(exList[i]);
            }
        }
    } else {
        suggestions = exList;
    }

    suggestions = suggestions.sort();

    const p = document.getElementById("exercise_suggestions");
    const children = p.children;
    var counter = 0;
    const max_exercises = 6;
    for (let i = 0; i<children.length; i++) {
        if (suggestions.includes(children[i].innerText)) {
            children[i].setAttribute('style','display: block')
            counter += 1
        } else {
            children[i].setAttribute('style','display: none')
        }
        if (counter>max_exercises) {
            break
        }
    }

    // const p = document.getElementById("exercise_suggestions");
    // while (p.firstChild) {
    //     p.removeChild(p.lastChild);
    // }
    // var d;
    
    // for (let i=0; i<Math.min(suggestions.length,3); i++) {
    //     d = document.createElement("div")
    //     d.innerText = suggestions[i]
    //     p.appendChild(d);
    // }

}
