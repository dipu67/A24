const nav = document.querySelector("#rightNav");
const menu = document.querySelector("#menu");
const main = document.querySelector("#main")
let toogle = false;
menu.addEventListener("click", () => {
  if (toogle === false) {
    nav.style.display = "block";
    toogle = true;
} else {
      
      nav.style.display = "none";
    toogle = false;
  }
});
console.log(addEventListener);