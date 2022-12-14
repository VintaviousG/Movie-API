require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const path = require("path");

//Static Files llows easy access to folders in public folder
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "./views");

const popularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}${process.env.API_KEY_2}&page=1`;

/*
home page for movie search application
On the home page, the user has a search bar and a list of famous movies, including poster, title, and plot. 
*/
app.get(
    "/",

    async (req, res) => {
        try {
            const response = await axios.get(popularMoviesURL);

            //Array of popular movies from the TMDB api
            const popularMovieData = response.data.results;

            //render to home.ejs, and pass in popular movie data to ejs file
            res.render("home.ejs", {
                data: popularMovieData,
            });
        } catch (error) {
            console.log(error);
            console.log("error");
        }
    }
);

//Result page for user to see an list of movies and get details of them
//The result page lists movies associated with what the user searched in the home page search bar.
app.get("/results", async (req, res) => {
    try {
        //movie searched for in the home page search bar
        let querySearch = req.query.search;

        console.log(
            "On the Results page that displays infomation about search movie"
        );

        const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}${process.env.API_KEY_2}&query=${querySearch}`;

        const response = await axios.get(SEARCH_URL);
        const searchData = response.data.results;

        res.render("results.ejs", {
            searchedTerm: querySearch,
            data: searchData,
        });
    } catch (error) {
        console.log(error);
        console.log("Error");
    }
});

console.log("Express server listening on");
app.listen(process.env.PORT, () => {
    console.log("Server running at http://localhost:8080");
});
