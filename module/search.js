export class Search {
  // Получаем текущую страницу поиска
  get currentPageNumber() {
    return this.currentPage;
  }

  // Устанавливаем текущую страницу поиска
  setCurrentPageValue(pageNumber) {
    console.log("Set func:" + pageNumber);
    this.currentPage = pageNumber;
    this.view.pageNumber2.value = pageNumber;
  }

  nextPage(pageNumber) {
    this.currentPage = pageNumber + 1;
    this.view.pageNumber2.value = pageNumber;
  }

  nextPage2() {
    let origValue = Number(this.view.pageNumber2.value);

    return origValue + 1;
  }

  constructor(log, api, view) {
    this.log = log;
    this.api = api;
    this.view = view;
    this.view.searchInput.addEventListener(
      "keyup",
      this.debounce(this.searchUsers.bind(this), 1000)
    );
    this.view.loadMore.addEventListener("click", this.loadMoreUsers.bind(this));
    this.currentPage = 1;

    //Sort Handler
    this.view.selectSort;
    this.view.selectSort.addEventListener("change", () => {
      // if (this.view.searchInput.value) {
      this.api
        .loadUsers(
          this.view.searchInput.value,
          this.currentPageNumber,
          this.view.selectSort.value,
          this.view.selectOrder.value,
          this.view.numbOfCards.value
        )
        .then((response) => {
          this.updateUsers(response);
        });
      // }
    });

    //Order Handler
    this.view.selectOrder.addEventListener("change", () => {
      // if (this.view.searchInput.value) {
      console.log(this.view.selectOrder.value);
      this.api
        .loadUsers(
          this.view.searchInput.value,
          this.currentPageNumber,
          this.view.selectSort.value,
          this.view.selectOrder.value,
          this.view.numbOfCards.value
        )
        .then((response) => this.updateUsers(response));
      // } else {
      // }
    });

    //Number of Cards start
    this.view.numbOfCards.addEventListener(
      "keyup",
      this.debounce(() => {
        // console.log(this.view.numbOfCards.value);
        if (
          this.view.numbOfCards.value < 101 &&
          this.view.numbOfCards.value > 1
        ) {
          this.view.numbOfCards.classList.remove("error");
          this.view.numbOfCards.placeholder =
            "How many cards should be displayed? (0 < number < 100)";

          // if (this.view.searchInput.value) {
          this.api
            .loadUsers(
              this.view.searchInput.value,
              this.currentPageNumber,
              this.view.selectSort.value,
              this.view.selectOrder.value,
              this.view.numbOfCards.value
            )
            .then((response) => this.updateUsers(response)),
            1000;
          // }
        } else {
          console.log(typeof this.view.numbOfCards.value);

          this.view.numbOfCards.classList.add("error");
          alert("Input number between 1 and 100");
          this.view.numbOfCards.value = "";
          this.view.numbOfCards.placeholder =
            "Please input a number between 1 and 100";
          console.log(this.view.numbOfCards.value);
        }
      }, 1000)
    );
    //Number of Cards end

    //Pagination start
    this.view.btnNext2.addEventListener("click", () => {
      if (this.view.searchInput.value) {
        this.loadMoreUsers();
      } else {
        this.setCurrentPageValue(this.currentPage + 1);
        this.api
          .loadUsers(
            "",
            this.currentPageNumber,
            this.view.selectSort.value,
            this.view.selectOrder.value,
            this.view.numbOfCards.value
          )
          .then((response) => {
            this.updateUsers(response);
          });
      }
    });

    this.view.btnPrev2.addEventListener("click", () => {
      if (this.view.searchInput.value) {
        this.loadLessUsers();
      } else {
        this.setCurrentPageValue(this.currentPage - 1);
        this.api
          .loadUsers(
            "",
            this.currentPageNumber,
            this.view.selectSort.value,
            this.view.selectOrder.value,
            this.view.numbOfCards.value
          )
          .then((response) => {
            this.updateUsers(response);
          });
      }
    });

    this.view.pageNumber2.addEventListener("keyup", () => {
      console.log(this.view.pageNumber2.value);
      this.currentPage = parseInt(this.view.pageNumber2.value);
      console.log("sdfdd" + this.currentPage);

      this.api
        .loadUsers(
          this.view.searchInput.value,
          this.view.pageNumber2.value,
          this.view.selectSort.value,
          this.view.selectOrder.value,
          this.view.numbOfCards.value
        )
        .then((response) => {
          this.updateUsers(response);
        });
      this.setCurrentPageValue(this.view.searchInput.value);
    });

    //Pagination end

    //Load users on start
    this.api.loadUsers().then((response) => {
      this.updateUsers(response);
    });

    //Preloader
    this.loadFavorites.bind(this);
    //Favourites
    this.view.favLink.addEventListener("click", () => {
      this.view.app.classList.add("hidden");
      this.view.favBlock.classList.remove("hidden");
      this.loadFavorites();
      this.view.showReposContainer.innerHTML = "";
      window.history.pushState("", "", "/newpage");
      // this.view.showReposContainer.classList.remove("hidden");
    });
    this.view.showReposContainer = this.view.createElement(
      "div",
      "repos-container"
    );

    this.view.searchLink.addEventListener("click", () => {
      this.view.app.classList.remove("hidden");
      this.view.favBlock.classList.add("hidden");
      this.view.showReposContainer.classList.add("hidden");
      this.api
        .loadUsers(
          this.view.searchInput.value,
          this.view.pageNumber2.value,
          this.view.selectSort.value,
          this.view.selectOrder.value,
          this.view.numbOfCards.value
        )
        .then((response) => {
          this.updateUsers(response);
        });
      // ф
    });
  }

  // Выполняем поиск пользователей при каждом вводе символа в поисковую строку
  searchUsers() {
    this.setCurrentPageValue(1);
    if (this.view.searchInput.value) {
      this.api
        .loadUsers(
          this.view.searchInput.value,
          this.currentPageNumber,
          this.view.selectSort.value,
          this.view.selectOrder.value,
          this.view.numbOfCards.value
        )
        .then((response) => {
          //Pagination start

          //Pagination end
          this.updateUsers(response);
        });
    } else {
      this.view.clearUsers();
      this.view.setUserCounter("");
      this.api.loadUsers().then((response) => {
        this.updateUsers(response);
      });
    }
  }

  //Скопировал loadMoreUsers,чтобы сделать панигацию (Единственное изменение - добавление clearUsers в начале)
  loadMoreUsers() {
    this.view.clearUsers();
    this.setCurrentPageValue(this.currentPage + 1);
    this.api
      .loadUsers(
        this.view.searchInput.value,
        this.currentPageNumber,
        this.view.selectSort.value,
        this.view.selectOrder.value,
        this.view.numbOfCards.value // Параметр сортировки
      )
      .then((response) => this.updateUsers(response, true));
  }

  loadLessUsers() {
    this.view.clearUsers();
    this.setCurrentPageValue(this.currentPage - 1);
    this.api
      .loadUsers(
        this.view.searchInput.value,
        this.currentPageNumber,
        this.view.selectSort.value,
        this.view.selectOrder.value,
        this.view.numbOfCards.value // Параметр сортировки
      )
      .then((response) => this.updateUsers(response, true));
  }

  // Обновляем текущее состояние пользователей
  updateUsers(response, isUpdate = false) {
    let users;
    let usersCount;
    // if (response.ok) {
    if (!isUpdate) {
      // Если новый поиск а не подгрузка, то очищаем ранее найденных пользователей
      this.view.clearUsers();
    }
    response.json().then((res) => {
      if (res.items) {
        users = res.items;
        usersCount = res.total_count;
        this.view.toggleStateLoadMoreButton(
          usersCount > 10 &&
            users.length * this.currentPageNumber !== usersCount
        );
        users.forEach((user) => this.view.createUser(user));
      } else {
        this.view.clearUsers();
      }
      this.view.setUserCounter(this.log.counterMessage(usersCount));
    });
  }

  //Preloader function

  // Задержка ввода данных для отправки запроса
  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  loadNextPage() {
    if (this.maxPage === this.currentPage) {
      this.currentPage = this.maxPage;
    } else {
      this.setCurrentPageValue(this.currentPage + 1);
      this.api.loadUsers();
    }
  }

  //Load Favorite Users
  loadFavorites() {
    console.log(this);

    let favData = JSON.parse(localStorage.getItem("data"));
    if (favData.length === 0) {
    }
    // this.view.favContainer = this.view.createElement("div");
    // this.view.favContainer.innerHTML = "";
    this.view.favItemsContainer.innerHTML = "";

    favData.map((user) => {
      this.favItem = this.view.createElement("div", "fav-item");
      this.favItemLeft = this.view.createElement("div", "fav-item__left");
      this.favItemMiddle = this.view.createElement("div", "fav-item__middle");
      this.favItemRight = this.view.createElement("div", "fav-item__right");

      console.log(user);
      this.favUserAvatar = this.view.createElement("img", "fav-user-img");
      this.favUserAvatar.src = user.avatar;

      this.favUserLogin = this.view.createElement("h2", "fav-user-login");
      this.favUserLogin.textContent = user.login;

      this.favUserGitLink = this.view.createElement("a");
      this.favUserGitLink.textContent = "link to GitHub";
      this.favUserGitLink.href = user.url;

      let favUserFavBtn = this.view.createElement("div", "fav-user-btn");
      favUserFavBtn.innerHTML = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      width="97.092px" height="97.092px" viewBox="0 0 97.092 97.092" style="enable-background:new 0 0 97.092 97.092;"
      xml:space="preserve">
      <g>
      <path d="M96.994,37.479c-0.236-0.725-0.862-1.253-1.617-1.361l-31.141-4.494L50.34,3.396c-0.336-0.684-1.032-1.117-1.794-1.117
      c-0.762,0-1.458,0.433-1.794,1.116L32.855,31.623l-31.14,4.494c-0.754,0.108-1.381,0.637-1.617,1.361
      c-0.235,0.725-0.039,1.521,0.508,2.052l22.551,21.939l-5.348,31.004c-0.13,0.75,0.179,1.51,0.795,1.957
      c0.618,0.449,1.434,0.508,2.108,0.152l27.834-14.668L76.38,94.582c0.293,0.154,0.612,0.23,0.933,0.23
      c0.415,0,0.827-0.129,1.176-0.383c0.616-0.447,0.926-1.207,0.795-1.957l-5.348-31.004l22.551-21.939
      C97.031,38.999,97.229,38.203,96.994,37.479z"/>
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
      favUserFavBtn.classList.add("active");
      let deleted = true;
      favUserFavBtn.addEventListener("click", (e) => {
        this.view.showReposContainer.innerHTML = "";
        console.log("Hello");
        console.log(favUserFavBtn);
        favUserFavBtn.classList.toggle("active");
        console.log(user);
        var old_data = JSON.parse(localStorage.getItem("data"));
        console.log(old_data);

        if (deleted) {
          let indexOfitemToDelete = old_data.indexOf(
            old_data.find((o) => o.login === user.login)
          );

          old_data.splice(indexOfitemToDelete, 1);

          console.log(indexOfitemToDelete);
          console.log(old_data);
          localStorage.setItem("data", JSON.stringify(old_data));
          this.loadFavorites();
        }
      });

      this.favUserShowRepos = this.view.createElement(
        "button",
        "show-repos-btn"
      );
      this.favUserShowRepos.textContent = "Show Repositories";
      //Show repos
      this.favUserShowRepos.addEventListener("click", () => {
        console.log("hello");
        console.log(user.repos);
        this.view.showReposContainer.classList.remove("hidden");
        this.api.loadUserRepos(user.login).then((data) => {
          console.log(data);
          const [repos] = data;
          const reposHTML = this.getUserListHTMLFav(repos, "Repos");
          this.view.showReposContainer.innerHTML = reposHTML;
          console.log(this.view.showReposContainer);
          this.view.favBlock.appendChild(this.view.showReposContainer);
        });
      });

      this.favUserReposBlock = this.view.createElement("div");
      this.favUserReposBlock.innerHTML = user.repos;

      this.favItemLeft.append(this.favUserAvatar);
      this.favItemMiddle.append(this.favUserLogin);
      this.favItemMiddle.append(this.favUserGitLink);
      this.favItemRight.append(favUserFavBtn);
      this.favItemRight.append(this.favUserShowRepos);

      this.favItem.append(this.favItemLeft);
      this.favItem.append(this.favItemMiddle);
      this.favItem.append(this.favItemRight);
      this.view.favItemsContainer.append(this.favItem);
      this.view.favBlock.append(this.view.favItemsContainer);
    });
  }
  getUserListHTMLFav(data, title) {
    return data.length
      ? `<div class="fav-user-repos">
                                  <h3 class="">${title}</h3>
                                  <ul class="fav-user-repos-list">${this.view.templateItem(
                                    data
                                  )}</ul>
                              </div>`
      : "";
  }
}
