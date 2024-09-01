document.addEventListener("DOMContentLoaded", function () {
  const socket = io("/a24");

  const AdController = window.Adsgram.init({ blockId: "1625" });
  Telegram.WebApp.ready();
  const { initData, initDataUnsafe } = Telegram.WebApp;
  webapp = Telegram.WebApp;
  const Tab = document.querySelectorAll(".Tab");
  const Content = document.querySelectorAll(".content");
  Tab.forEach((bar) => {
    bar.addEventListener("click", () => {
      const tabId = bar.getAttribute("data-Tab");
      Tab.forEach((btn) => btn.classList.remove("active"));
      Content.forEach((content) => content.classList.remove("active"));
      bar.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });
  socket.on("onlineUsers", (count) => {
    document.getElementById("online-users").textContent = count;
  });
  socket.on("userData", (users) => {
    users.forEach((user) => {
      console.log(user);

    //   let p = document.createElement("p");
    //   document.getElementById("users").appendChild(p).textContent =
    //     user.user.username;

      let img = document.createElement("img")
      img.classList.add='active-profile'
      console.log(user.profile);
      document.querySelector(".profile-container").appendChild(img).src =
        user.profile;
        
    });
  });


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
      });

      const data = await res.json();
      try {
        socket.emit("user", data);
        console.log("done");
      } catch (error) {
        console.log(error);
      }

      document.querySelector("#profileimg").src = data.profile;
      //   document.querySelector(".active-profile").src = data.profile;

      document.querySelector("p").innerHTML = data.user.username;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("main").style.display = "block";
  }
  user();
});
