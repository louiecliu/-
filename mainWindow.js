// "use strict";

class user {
  #name;
  #showed = false;
  constructor(name) {
    this.#name = name;
  }

  show() {
    this.#showed = true;
  }

  isShow() {
    return this.#showed;
  }

  getName() {
    return this.#name;
  }
}

const body = document.getElementsByTagName("body")[0];
const info = document.getElementById("info");
const num = document.getElementById("num");
const ques = document.getElementById("ques");
const presenter = document.getElementById("presenter");
const clock = document.getElementById("clock");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const action = document.getElementById("action");
const reset = document.getElementById("reset");

const settings = document.getElementById("settings");
const userList = document.getElementById("userList");

const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reserve = document.getElementById("reserve"); // 候選人數
const username = document.getElementById("username");
const add = document.getElementById("add");
const del = document.getElementById("del");

let numOfCandidate = -1;
let candidate_done = false;

let state = "stop";
let index = 86; // 現在的題目
let userNum = -1; // 現在的講員

let now = 0;
let timer = "";
let limit = "03:00";
let warn = "02:50";

// let userLt = ["劉世緯", "黃新年", "張仁芳", "陳妙真", "關玉貞"];
let userLt = ["劉世緯", "陳妙真", "張仁芳", "黃新年"];
let users = [];
userLt.forEach((name) => users.push(new user(name)));
// console.log(users);
// users.forEach((user) => console.log(user.getName()));

let begin = 77;
let end = 103;

const genRand = (num1, num2) => {
  min = num1 < num2 ? num1 : num2;
  max = num1 < num2 ? num2 : num1;
  return Array.from(Array(Math.abs(max - min) + 1).keys(), (n) => n + min);
};

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};
let list = shuffle(genRand(parseInt(begin), parseInt(end)));

const updUsrList = () => {
  users = [];
  for (let i = 0; i < userList.length; i++) {
    users.push(new user(userList[i].text));
  }
};

const addToUserList = (e) => {
  if (e != "") {
    let option = new Option(e);
    userList.add(option);
    updUsrList();
    updUser(userNum);
  }
};

const userDom = (index) => {
  let div = document.createElement("div");
  div.setAttribute("class", "user");
  div.setAttribute("id", `user${index}`);
  let entry = document.createElement("h2");
  entry.setAttribute("class", "username");
  entry.innerHTML = users[index].getName();
  div.appendChild(entry);
  if (users[index].isShow()) {
    let entry = document.createElement("h2");
    entry.innerHTML =
      q[list[index] - 1].id + "：" + q[list[index] - 1].question;
    div.appendChild(entry);
  } else {
    let btn = document.createElement("button");
    btn.setAttribute("name", "choose");
    btn.setAttribute("class", "choose");
    btn.innerHTML = "選題";
    btn.addEventListener("click", () => {
      let entry = document.createElement("h2");
      entry.innerHTML =
        q[list[index] - 1].id + "：" + q[list[index] - 1].question;
      btn.parentElement.appendChild(entry);
      btn.parentElement.removeChild(btn);
      users[index].show();
    });
    div.appendChild(btn);
  }
  return div;
};

const updUser = (userNum) => {
  if (userNum < users.length && candidate_done == false) {
    let candidate = document.getElementById("candidate");
    let children = candidate.children;
    // console.log(children);
    if (children != undefined) candidate.innerHTML = "";
    for (i = 0; i < numOfCandidate; i++) {
      if (userNum + i + 1 < users.length)
        candidate.appendChild(userDom(userNum + i + 1));
    }
  } else candidate_done = true;
};

updUser(userNum);

let q = [];
fetch("./json/questions.json")
  .then((response) => response.json())
  .then((jsonObject) => (q = jsonObject));

add.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(`username: ${username.value}`);
  addToUserList(username.value);
  username = ""
});

// Escape to hide settings
let input = document.querySelectorAll("input");
input.forEach((elem) => {
  // console.log(`${elem.name}`);
  if (elem.name === "username") {
    elem.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        console.log(`in key 13`);
        addToUserList(username.value);
        username = ""
      } else if (e.key === "Escape") {
        settings.classList.add("hidden");
      }
    });
  } else {
    elem.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        console.log(`esc event`);
        s;
        settings.classList.add("hidden");
      }
    });
  }
});

del.addEventListener("click", (e) => {
  e.preventDefault();
  let selected = [];
  for (let i = 0; i < userList.options.length; i++)
    selected[i] = userList.options[i].selected;
  if (selected.length > 0) {
    let index = selected.length;
    while (index--) if (selected[index]) userList.remove(index);
    updUsrList();
    updUser(userNum);
  }
});

start.addEventListener("blur", () => {
  begin = start.value === "" ? 1 : start.value;
  console.log(`begin: ${begin}`);
  list = shuffle(genRand(parseInt(begin), parseInt(end)));
  console.log(list);

});

stop.addEventListener("blur", () => {
  end = stop.value === "" ? 103 : stop.value;
  console.log(`end: ${end}`);
  list = shuffle(genRand(parseInt(begin), parseInt(end)));
  console.log(list);
});

reserve.addEventListener("blur", () => {
  numOfCandidate = reserve.value === "" ? 2 : reserve.value;
  updUser(userNum)
  console.log(`numOfCandidate: ${numOfCandidate}`);
});

action.addEventListener("click", () => {
  if (state !== "start") {
    state = "start";
    action.innerHTML = "暫停";
    timer = setInterval(tick, 1000);
    action.innerHTML = "暫停";
  } else {
    state = "pause";
    clearInterval(timer);
    action.innerHTML = "開始";
  }
});

reset.addEventListener("click", () => {
  if (state === "start") {
    clearInterval(timer);
    action.innerHTML = "開始";
  }
  now = 0;
  state = "stop";
  clock.innerHTML = "00:00";
});

setting.addEventListener("click", () => {
  console.log("setting clicked");
  settings.classList.toggle("hidden");
});

function tick() {
  now++;

  let remain = now;
  let hour = Math.floor(remain / 3600);
  remain -= hour * 3600;
  let min = Math.floor(remain / 60);
  remain -= min * 60;
  let sec = remain;

  //   if (hour < 10) hour = "0" + hour;

  if (min < 10) min = "0" + min;

  if (sec < 10) sec = "0" + sec;

  clock.innerHTML = `${min}:${sec}`;

  if (clock.innerHTML === warn && warn.checked) {
    body.setAttribute("style", "background-color: #ffc0cb");
    // rang 1 time
    /*       if (!rang1) {
          bell1.play();
          rang1 = true;
        } */
  }
  if (timer.innerHTML === limit && warn.checked) {
    body.setAttribute("style", "background-color: #ff0000");
    timer.style.color = "#f5f5f5";
    // rang 2 time
    /* if (!rang2) {
          bell2.play();
          rang2 = true;
        } */
  }
}

let nextUser = -1;

const okToUpd = (uNum) => {
  console.log(`uNum: ${uNum}\nnext: ${nextUser}`);
  if (uNum + 1 > nextUser) {
    nextUser = uNum;
    return true;
  }
  return false;
};

prev.addEventListener("click", () => {
  if (userNum === users.length - 1) next.disabled = false;
  if (userNum - 1 === 0) prev.disabled = true;
  if (userNum > 0) {
    lastUser = userNum;
    userNum--;
    num.innerHTML = q[list[userNum] - 1].id;
    ques.innerHTML = q[list[userNum] - 1].question;
    presenter.innerHTML = users[userNum].getName();

    if (okToUpd(userNum)) updUser(userNum);
  } else {
    // TODO display empyt or show begin reached
    console.log(`userNum ${userNum}`);
  }
});

next.addEventListener("click", () => {
  info.classList.remove("hidden");
  if (userNum === 0) prev.disabled = false;
  if (userNum + 1 === users.length - 1) next.disabled = true;
  if (userNum < users.length - 1) {
    userNum++;
    num.innerHTML = q[list[userNum] - 1].id;
    ques.innerHTML = q[list[userNum] - 1].question;
    presenter.innerHTML = users[userNum].getName();

    if (okToUpd(userNum)) updUser(userNum);
  } else {
    // TODO display empty or show end of list
    console.log(`userNum ${userNum} reach array end: length ${users.length}`);
  }
});

window.addEventListener("load", () => {
  window.resizeTo(1024, 768);
  console.log(`new loaded...`);
  /* 
  if (userLt.length > 0) {
    userLt.forEach(((value) => {
      option = document.createElement('option')
      option.value = value
      userList.add(option)
    })
  } */

  settings.classList.add("hidden");
  prev.disabled = true;

  info.classList.add("hidden");
  if (start.value === "") begin = 1;

  if (stop.value === "") end = 103;

  if (reserve.value === "") numOfCandidate = 2;
  console.log(`numOfCandidate: ${numOfCandidate}`);
  console.log(`begin: ${begin}`);
  console.log(`end: ${end}`);
  // if (userLt.length > 0)
  //   userLt.forEach((value) => {
  //     console.log(`${value}`);
  //     let option = new Option(value);
  //     userList.add(option);
  //   });
  // updUser(userNum);
  users = [];

});
