document.addEventListener("DOMContentLoaded", function () {
  const AdController = window.Adsgram.init({ blockId: "1625" });
  Telegram.WebApp.ready();
  const { initData } = Telegram.WebApp;
  webapp = Telegram.WebApp;
  console.log(initData);
  const Tab = document.querySelectorAll('.Tab')
  const Content = document.querySelectorAll('.content')
  Tab.forEach((bar)=>{
    bar.addEventListener('click',()=>{
        const tabId = bar.getAttribute('data-Tab');
        Tab.forEach(btn => btn.classList.remove('active'));
        Content.forEach(content => content.classList.remove('active'));
        bar.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    })
})
  console.log(Telegram.WebApp.initData);
//   const button = document.getElementById("ad");
//   button.addEventListener("click", () => {
//     AdController.show()
//       .then((result) => {
//         // user watch ad till the end
//         // your code to reward user
//         alert("Reward");
//       })
//       .catch((result) => {
//         // user skipped video or get error during playing ad
//         // do nothing or whatever you want
//         alert(JSON.stringify(result, null, 4));
//       });
//   });
  async function user() {
    try {
      const res = await fetch("/a24bot", {
        method: "POST",
        headers: {
          "content-type": "aplication/json",
          Authorization: `tma ${initData}`,
        },
        body: JSON.stringify({ initData }),
      });;
      
      const data = await res.json();
      document.querySelector('#profileimg').src= data.profile
      document.querySelector('p').innerHTML= data.user.username
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("main").style.display = "block";
  }
  user();
});
