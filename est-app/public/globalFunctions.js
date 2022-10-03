function goto_today() {
    console.log('goto_today activated')
}

function gotoLink(linkIn) {
    window.location.href = linkIn;
}

async function is_logged_in() {
    const userID = getCookie('email');
    if (!is_email(userID)) {
        gotoLink('login.html');
    }
    const auth_key = getCookie('auth_key');
    // check format of userID
    const special_chars = [" ","!","@","#","$","%","^","&","*","(",")","-","_","=","+","[","]","{","}",";",":","'",'"',",",".","<",">","/","?"];
    if (!(auth_key.length==64)) {
        gotoLink('login.html');
    } else if (special_chars.some((el) => auth_key.includes(el))) {
        console.log(auth_key);
        gotoLink('login.html');
    }
    // make server request for validation of login
    console.log('auth key:' + auth_key)
    const data = {
        'userID' : userID,
        'auth_key' : auth_key
    }
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    const response = await fetch('/verifysession',options)
    const responseData = await response.json();
    console.log(responseData)
    if (!responseData['is_verified']) {
        gotoLink('login.html');
    } else {
        console.log('Verified Session')
        return true;
    }
    
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function deleteCookie(cname, cvalue) {
    setCookie(cname, cvalue, -1);
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function build_nav() {
    const page = document.getElementById("body");
    banner = document.createElement("div");
    banner.setAttribute("class","banner")

    const b1 = document.createElement("button");
    b1.setAttribute("class","bannerButton");
    b1.innerHTML = "<h4> DASHBOARD </h4>";
    b1.setAttribute("onclick","gotoLink('dashboard.html')")

    const b2 = document.createElement("button");
    b2.setAttribute("class","bannerButton");
    b2.innerHTML = "<h4> CALENDAR </h4>";
    b2.setAttribute("onclick","gotoLink('calendar.html')")

    const b3 = document.createElement("button");
    b3.setAttribute("class","bannerButton");
    b3.setAttribute("onclick","gotoLink('dashboard.html')")

    const b4 = document.createElement("button");
    b4.setAttribute("class","bannerButton");
    b4.innerHTML = "<h4> ANALYTICS </h4>";
    b4.setAttribute("onclick","gotoLink('analytics.html')")

    const b5 = document.createElement("button");
    b5.setAttribute("class","bannerButton");
    b5.innerHTML = "<h4> ACCOUNT </h4>";
    b5.setAttribute("onclick","gotoLink('account.html')")

    const b6 = document.createElement("button");
    b6.setAttribute("class","bannerButton");
    b6.innerHTML = "<h4> COACHING </h4>";
    b6.setAttribute("onclick","gotoLink('https://www.estpowerlifting.com/services')")

    const d1 = document.createElement("div");
    d1.setAttribute("class","center-center");
    d1.innerHTML = "<h4> TODAY'S <br> TRAINING </h4>";

    const im0 = document.createElement("div")
    im0.setAttribute("class","left_align");
    im0.setAttribute("style","width: 20%");
    const im = document.createElement("img");
    im.setAttribute("src","img/est_acronym_transp.png")

    b3.appendChild(d1);
    im0.appendChild(im);

    banner.appendChild(im0);
    banner.appendChild(b1);
    banner.appendChild(b2);
    banner.appendChild(b4);
    banner.appendChild(b5);
    banner.appendChild(b6);
    banner.appendChild(b3);

    page.appendChild(banner);
}

function is_email(address) {
    if (!address.includes("@")) {
        console.log('Error 1')
        return false
    }else if (!address.includes(".")) {
        console.log('Error 2')
        return false
    } else if (!address.includes(".com",".co.uk",".ac.uk",".au",".edu",".de")) {
        console.log('Error 3')
        return false
    } else if (address.includes(" ")) {
        console.log('Error 4')
        return false
    }
    var parts = address.split("@");
    console.log(parts.length)
    if (parts.length!=2) {
        console.log('Error 5')
        return false
    } else {
        return true
    }
}

function validate_password(pwd) {
    const special_chars = ["!","@","#","$","%","^","&","*","(",")","-","_","=","+","[","]","{","}",";",":","'",'"',",",".","<",">","/","?"];
    const numbers = ['1','2','3','4','5','6','7','8','9','0'];

    if (pwd.includes(" ")) {
        console.log('ad')
        return false
    } else if (pwd.length<10) {
        console.log('addwq')
        return false
    } else if (!special_chars.some((el) => pwd.includes(el))) {
        console.log('adafsd')
        return false
    } else if (!numbers.some((el) => pwd.includes(el))) {
        console.log('Agg23')
        return false
    } else if (pwd.toLowerCase() == pwd) {
        console.log("Password must contain both upper and lower case characters")
        return false
    } else if (pwd.toUpperCase() == pwd) {
        console.log("Password must contain both upper and lower case characters")
        return false
    } else {
        return true
    }
}

async function send_username_pwd(event) {
    switch(event.target.id) {
        case 'login_button':
            var endpoint = '/login';
            break;
        case 'register_button':
            var endpoint = '/register';
            break;
        default:
            console.log('g')
    }
    var userID = document.getElementById("getUserID").value;
    var pwd = document.getElementById("getPwd").value;

    if (!is_email(userID)) {
        console.log('Please enter a valid email address')
        return -1
    }
    if (!validate_password(pwd)) {
        console.log('Please enter a valid password')
        return -1
    }

    var data = {
        'userID' : userID,
        'pwd' : pwd
    }
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(endpoint,options)
    const responseData = await response.json();
    console.log(responseData);
    const cookie_validity = 30;
    setCookie('email', responseData['email'], cookie_validity)
    setCookie('auth_key', responseData['auth_key'], cookie_validity)
    gotoLink('dashboard.html')
}