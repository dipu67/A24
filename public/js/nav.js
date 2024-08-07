const nav = document.querySelector("#rightNav");
const menu = document.querySelector("#menu");
const main = document.querySelector("#main");
let toogle = false;
menu.addEventListener("click", () => {
  if (toogle === false) {
    nav.style.width = "200px";
    toogle = true;
  } else {
    nav.style.width = "0";
    toogle = false;
  }
});


