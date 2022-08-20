const USER_PER_PAGE = 20;
const URL = "https://api.github.com/";
// https://api.github.com/search/users?q=${searchValue}&per_page=${USER_PER_PAGE}&page=${page}

export class API {
  constructor() {
    this.possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    this.text = this.possible.charAt(
      Math.floor(Math.random() * this.possible.length)
    );

    this.preloader = document.querySelector(".preloader");
    console.log(this.preloader);
  }

  // Загрузка пользователей
  async loadUsers(
    searchValue = this.text,
    page = 1,
    sortParam = "followers",
    orderParam = "desc",
    userPerPage = 20
  ) {
    try {
      if (!searchValue) {
        console.log(!searchValue);
        searchValue = this.text;
      }
      console.log("In process");
      console.log(page);
      this.showLoader(true);

      let page2 = Number(page);
      const response = await fetch(
        `${URL}search/users?q=${searchValue}&sort=${sortParam}&order=${orderParam}&per_page=${userPerPage}&page=${page2}`
      );
      this.showLoader(false);
      console.log(response);
      return response;
    } catch (e) {
      alert(e);
    }
  }

  //Получаем данные выбранного пользователя
  loadUserData(user) {
    const urls = [
      `${URL}users/${user}/following`,
      `${URL}users/${user}/followers`,
      `${URL}users/${user}/repos`,
    ];
    const requests = urls.map((url) => fetch(url));
    console.log(requests);
    return Promise.all(requests).then((responses) =>
      Promise.all(responses.map((r) => r.json()))
    );
  }

  loadUserRepos(user) {
    const urls = [`${URL}users/${user}/repos`];
    const requests = urls.map((url) => fetch(url));
    console.log(requests);
    return Promise.all(requests).then((responses) =>
      Promise.all(responses.map((r) => r.json()))
    );
  }

  showLoader(isLoad) {
    if (isLoad) {
      this.preloader.classList.remove("preloader_hidden");
    } else {
      this.preloader.classList.add("preloader_hidden");
    }
  }
}
