// Script by Anton Plancke
"use strict";
document.addEventListener("DOMContentLoaded", pageLoaded);
let MenuIsOpen = false;

function pageLoaded() {
    createCategoryButtons();
    searchMovies();
    searchRandom();
    document.querySelectorAll(".hamburger")[0].addEventListener("click", toggleSidebar);
    document.querySelectorAll(".hamburger")[1].addEventListener("click", toggleSidebar);
    document.querySelectorAll("#random_field .button")[0].addEventListener("click", searchRandom);
}

function toggleSidebar() {
    let sidebar = document.getElementsByTagName("aside")[0];
    if (MenuIsOpen) {sidebar.classList.add("closed")}
    else {sidebar.classList.remove("closed")}
    MenuIsOpen = !MenuIsOpen;
}

/* ============= Functionaliteit voor de Chuck Norris Quotes ============= */

function searchByCategory(e) {
    if (e  !== undefined) {
        e.preventDefault();
    }
    removeActiveCategoryButtons();
    e.currentTarget.classList.add("active");
    let category = e.currentTarget.innerText;
    let destination = document.getElementById("results");
    fetchByCategoryChuckNorris(category).then(function (json) {
        destination.innerHTML = JSONquoteToHTML(json);
    });
}

function searchRandom(e) {
    if (e  !== undefined) {
        e.preventDefault();
    }
    removeActiveCategoryButtons();
    document.getElementById("random_field").firstElementChild.classList.add("active");
    let destination = document.getElementById("results");
    fetchRandomChuckNorris().then(function (json) {
        destination.innerHTML = JSONquoteToHTML(json);
    });
}

function removeActiveCategoryButtons() {
    let buttons = document.getElementsByClassName("active");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
}

function createCategoryButtons() {
    let destination = document.getElementById("categories_field");

    fetchCategoriesChuckNorris().then(function (cats) {
        for (let i = 0; i < cats.length; i++) {
            destination.innerHTML += "<a href='#' class='button'>" + cats[i] + "</a>";
        }
    }).then(function () {
        for (let i = 0; i < destination.childNodes.length; i++) {
            destination.childNodes[i].addEventListener("click", searchByCategory)
        }
    });
}

/* ============= Functionaliteit voor de films ============= */

function searchMovies() {
    let destination = document.querySelectorAll(".movies")[0];
    fetchMovieDataBaseByChuckNorris(1).then(function (json) {
        destination.innerHTML = JSONmoviesToHTML(json);
        for (let i = 2; i <= json.total_pages; i++)
        {
            fetchMovieDataBaseByChuckNorris(i).then(function (json) {
                destination.innerHTML += JSONmoviesToHTML(json);
            })
        }
    });
}

/* ============= Functionaliteit voor JSON ============= */

/**
 * @return {string}
 */
function JSONquoteToHTML(input) {
    let results;
    if (input !== undefined && Array.isArray(input.result)) {
        results = input.result;
    } else {
        results = [input];
    }

    let html = "";
    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        html += "<blockquote><a>" + result.value + "</a></blockquote>";
    }
    return html;
}

/**
 * @return {string}
 */
function JSONmoviesToHTML(input) {
    let results = input.results;
    let html = "";

    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        let title = result.title;
        let notfound = (result.poster_path === null);

        html += "<li class='movie' data-id=\"" + result.id /* + "\" data-overview=\"" + result.overview */ + "\" data-title=\"" + result.title + "\">";

        if(notfound) {
            html += "<div class='cover'></div>";
        }
        else {
            html += "<div class='cover' style='background-image: url(https://image.tmdb.org/t/p/w185" + result.poster_path + ")'></div>";
        }

        html += "<p class='title' title='" + title + "'>" + title + "</p>";
        html += "<p class='year'>" + (new Date(result.release_date)).getFullYear() + "</p></li>";
    }

    return html;
}

function fetchJson(url) {
    return fetch(url)
        .then(function (response) {
            if (response.ok) return response.json();
        })
}

function fetchRandomChuckNorris() {
    return fetchJson("https://api.chucknorris.io/jokes/random");
}

function fetchByTextChuckNorris(text) {
    return fetchJson("https://api.chucknorris.io/jokes/search?query=" + text);
}

function fetchByCategoryChuckNorris(category) {
    return fetchJson("https://api.chucknorris.io/jokes/random?category=" + category);
}

function fetchCategoriesChuckNorris() {
    return fetchJson("https://api.chucknorris.io/jokes/categories");
}

function fetchMovieDataBaseByChuckNorris(page) {
    return fetchJson("https://api.themoviedb.org/3/discover/movie?with_cast=51576&api_key=863272f8a623a524f11ee0f240f33743&sort_by=release_date.desc&page=" + page);
}

function fetchMovieDataBaseByID(id) {
    return fetchJson("https://api.themoviedb.org/3/movie/" + id + "?api_key=863272f8a623a524f11ee0f240f33743");
}