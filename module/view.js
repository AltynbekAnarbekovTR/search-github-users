export class VIEW {
  constructor(api) {
    localStorage.favourites = [];
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.api = api;

    this.app = document.getElementById("search");
    this.appReal = document.getElementById("app");

    this.favBlock = document.getElementById("favorites");

    this.noNav = document.querySelector(".no-nav");
    // this.appReal.append()

    console.log(this.appReal);
    // this.favoritesBtn = document.getElementById("favorites");

    //Favorites
    this.favLink = this.createElement("a", "nav-btn-favorites");
    this.favLink.textContent = "Favorites";
    //Search and Favorites
    this.searchLink = this.createElement("a", "nav-btn-search");
    this.searchLink.textContent = "Search";

    this.navContainer = this.createElement("div", "nav-container");
    this.navContainer.append(this.searchLink);
    this.navContainer.append(this.favLink);

    this.appReal.insertBefore(this.navContainer, this.noNav);
    this.favItemsContainer = this.createElement("div", "fav-items-container");

    // Заголовок
    this.title = this.createElement("h1", "title");
    this.title.textContent = "Github Search Users";

    // Основной блок
    this.mainContent = this.createElement("div", "main");

    // Список пользователей
    this.usersListWrapper = this.createElement("div", "users-wrapper");
    this.usersList = this.createElement("ul", "users");
    this.usersListWrapper.append(this.usersList);

    // Поле поиска
    this.searchLine = this.createElement("div", "search-line");
    this.searchInput = this.createElement("input", "search-input");
    this.searchInput.placeholder = "Search User";
    this.usersCounter = this.createElement("span", "counter");

    // Beginning of sort creation
    //Create array of options to be added
    var sortOptions = ["followers", "repositories", "joined"];

    //Create and append select list
    this.selectSort = this.createElement("select", "sort");
    this.sortLabel = this.createElement("label", "sort-label");
    this.sortLabel.textContent = "Sort by";

    this.selectSort.id = "SelectSort";

    //Create and append the options
    for (var i = 0; i < sortOptions.length; i++) {
      var option = document.createElement("option");
      option.value = sortOptions[i];
      option.text = sortOptions[i];
      this.selectSort.appendChild(option);
    }

    // Sort functions
    this.selectSort.addEventListener("change", () => {
      // console.log(this.selectSort.value);
    });

    // End of sort creation

    // Beginning of order creation
    var orderOptions = ["desc", "asc"];

    this.selectOrder = this.createElement("select", "order");
    this.orderLabel = this.createElement("label", "order-label");
    this.orderLabel.textContent = "Order by";
    this.selectOrder.id = "SelectOrder";

    for (var i = 0; i < orderOptions.length; i++) {
      var option = document.createElement("option");
      option.value = orderOptions[i];
      option.text = orderOptions[i];
      this.selectOrder.appendChild(option);
    }
    // End of order creation

    // Number of cards start
    this.numbOfCards = this.createElement("input", "numb-of-cards");
    this.numbOfCards.value = "30";
    this.numbOfCardsLabel = this.createElement("label", "numbOfCards-label");
    this.numbOfCardsLabel.textContent = "Per page";

    this.numbOfCards.type = "text";

    // Number of cards end

    // Start of pagination
    this.btnNext = this.createElement("button");
    this.btnNext.textContent = "Next";
    this.pageNumber = this.createElement("input");
    this.btnPrev = this.createElement("button");
    this.btnPrev.textContent = "Prev";

    this.btnNext2 = this.createElement("button", "btn-next");
    this.btnNext2.textContent = "Next";
    this.pageNumber2 = this.createElement("input", "page-input");
    this.pageNumber2.placeholder = "Page";
    this.pageNumber2.value = 1;
    this.btnPrev2 = this.createElement("button", "btn-prev");
    this.btnPrev2.textContent = "Prev";
    this.next = this.pageNumber2.value;

    this.pagesBlock = this.createElement("div", "pages-block");
    // End of pagination

    //
    this.sortContainer = this.createElement("div", "sort-container");

    this.searchLine.append(this.searchInput);

    this.sortContainer.append(this.sortLabel);
    this.sortContainer.append(this.selectSort);

    this.sortContainer.append(this.orderLabel);
    this.sortContainer.append(this.selectOrder);
    this.sortContainer.append(this.numbOfCardsLabel);
    this.sortContainer.append(this.numbOfCards);

    this.searchLine.append(this.sortContainer);
    this.searchLine.append(this.usersCounter);

    // Кнопка "Загрузить еще"
    this.loadMore = this.createElement("button", "btn");
    this.loadMore.textContent = "Загрузить еще";
    this.loadMore.style.display = "none";
    // this.usersListWrapper.append(this.loadMore);

    // Добавление всех блоков в приложение
    this.app.append(this.title);
    this.app.append(this.searchLine);
    this.mainContent.append(this.usersListWrapper);
    this.app.append(this.mainContent);

    // this.app.append(this.btnPrev);
    // this.app.append(this.pageNumber);
    // this.app.append(this.btnNext);
    this.pagesBlock.append(this.btnPrev2);
    this.pagesBlock.append(this.pageNumber2);
    this.pagesBlock.append(this.btnNext2);
    this.app.append(this.pagesBlock);
  }

  // Функция для создания элемента
  createElement(elementName, className) {
    const element = document.createElement(elementName);
    if (className) {
      element.classList.add(className);
    }
    return element;
  }

  // Создаем каждого найденного пользователя
  createUser(userData) {
    // prev meaning preview, not previous
    const user = this.createElement("li", "user-prev");
    const fav = this.createElement("div", "fav");
    fav.innerHTML = `
    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
width="97.092px" height="97.092px" viewBox="0 0 97.092 97.092" style="enable-background:new 0 0 97.092 97.092;"
xml:space="preserve">
<g>
<path d="M96.994,37.479c-0.236-0.725-0.862-1.253-1.617-1.361l-31.141-4.494L50.34,3.396c-0.336-0.684-1.032-1.117-1.794-1.117
c-0.762,0-1.458,0.433-1.794,1.116L32.855,31.623l-31.14,4.494c-0.754,0.108-1.381,0.637-1.617,1.361
c-0.235,0.725-0.039,1.521,0.508,2.052l22.551,21.939l-5.348,31.004c-0.13,0.75,0.179,1.51,0.795,1.957
c0.618,0.449,1.434,0.508,2.108,0.152l27.834-14.668L76.38,94.582c0.293,0.154,0.612,0.23,0.933,0.23
c0.415,0,0.827-0.129,1.176-0.383c0.616-0.447,0.926-1.207,0.795-1.957l-5.348-31.004l22.551-21.939
C97.031,38.999,97.229,38.203,96.994,37.479z "/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>`;

    //Activate button if user exist in lS
    if (localStorage.getItem("data") !== null) {
      let old_data = JSON.parse(localStorage.getItem("data"));
      if (old_data.find((o) => o.login === userData.login)) {
        fav.classList.add("active");
      }
    }

    fav.addEventListener("click", (e) => {
      fav.classList.toggle("active");
      if (localStorage.getItem("data") == null) {
        localStorage.setItem("data", "[]");
      }
      console.log(userData);
      var old_data = JSON.parse(localStorage.getItem("data"));

      var new_data = {
        login: userData.login,
        avatar: userData.avatar_url,
        url: userData.html_url,
        repos: userData.repos_url,
      };
      if (!old_data.find((o) => o.login === userData.login)) {
        old_data.push(new_data);
      } else {
        let indexOfitemToDelete = old_data.indexOf(
          old_data.find((o) => o.login === user.login)
        );

        old_data.splice(indexOfitemToDelete, 1);

        console.log(indexOfitemToDelete);
        console.log(old_data);
      }
      localStorage.setItem("data", JSON.stringify(old_data));

      e.stopPropagation();

      //Конец
    });

    //End of favorties

    user.addEventListener("click", () => {
      console.log(userData);
      this.showUser(userData);
    });
    user.innerHTML = `<img class="user-prev-photo" src="${userData.avatar_url}" alt="${userData.login}_photo">
    <div class="user-middle">
                          <span class="user-prev-name">${userData.login}</span>
                          
                          </div>
                          `;
    this.usersList.append(user);
    user.append(fav);
  }

  // Показываем данные выбранного пользователя
  showUser(userData) {
    console.log(userData);
    const user = this.createElement("div", "user");
    const userHtml = this.mainContent.querySelector(".user");
    const name = userData.login;
    this.api.loadUserData(name).then((data) => {
      const [following, followers, repos] = data;
      const followingHTML = this.getUserListHTML(following, "Following");
      const followersHTML = this.getUserListHTML(followers, "Followers");
      const reposHTML = this.getUserListHTML(repos, "Repos");
      console.log(userData);

      user.innerHTML = `<h3 class="user-info-header">User Info:</h3>
                        <div class="close-button"><img src="./assets/close.png" /></div>
                        <img src="${userData.avatar_url}">
                                  <h2 class="user-name">${name}</h2>
                                  <a href="${userData.html_url}">Link to github</a>
                                     ${followingHTML}
                                     ${followersHTML}
                                     ${reposHTML}`;
      if (userHtml) {
        userHtml.remove();
      }
      this.mainContent.append(user);
      this.closeButton = document.querySelector(".close-button");
      console.log(this.closeButton);
      this.closeButton.addEventListener("click", () => {
        user.classList.add("hidden");
      });
      this.btnPrev2.classList.add("btn-prev-far");
    });
  }

  // Получаем html списка в данных пользователя
  getUserListHTML(data, title) {
    return data.length
      ? `<div class="user-block">
                                  <h3 class="user-block-title">${title}</h3>
                                  <ul class="user-list">${this.templateItem(
                                    data
                                  )}</ul>
                              </div>`
      : "";
  }

  // Строим каждый элемент списка
  templateItem(data) {
    let userItem = "";
    data.forEach((user) => {
      userItem += `<li class="user-list-item">
                            <a href="${user.html_url}" class="user-list-link">${
        user.login ? user.login : user.name
      }</a>
                          </li>`;
    });
    return userItem;
  }

  // Очистка найденных пользователей
  clearUsers() {
    this.usersList.innerHTML = "";
  }

  // Устанавливаем сообщение о количестве найденных пользователей
  setUserCounter(message) {
    this.usersCounter.textContent = message;
  }

  //Показываем или скрываем кнопку "Загрузить еще"
  toggleStateLoadMoreButton(show) {
    this.loadMore.style.display = show ? "block" : "none";
  }

  //Function for rendering favorite users
}
