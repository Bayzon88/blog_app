const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const atlas = require("./atlas");

const app = express();
app.set("view engine", "ejs"); //setting up ejs engine
app.use(bodyParser.urlencoded({ extended: true })); //Setting up body parser for post requests
app.use(express.static("public")); //Setting up public folder for images, css, etc

//************************ Declaring Variables for content to display ************************/
const home =
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio explicabo doloremque ipsam odio! Aspernatur necessitatibus odit doloribus repellat repudiandae architecto vero earum. Dolor, magnam! Debitis earum veritatis corporis eligendi sit sed maiores sunt aut vel.";
const about =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis facilis debitis ducimus, architecto accusantium voluptatem? Explicabo quae numquam laboriosam, laborum impedit praesentium ullam laudantium repudiandae!";
const contact =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius optio nam accusamus exercitationem beatae voluptates!";
// let newPosts = []; //Hold all new post made in the /Compose page
//*****************************************************************************************/
//Connecting database
atlas.connectDB();

//Data retrieved from JSON File
//Read old post and display them when entering the home page
// const savedPosts = atlas.getData();

// if (savedPosts !== "") newPosts = savedPosts; //checking if the file is not empty

//? **************  Get Responses for each page (Home, About and Contact) **************/
//Home Response
app.get("/", (req, res) => {
  //Promise will retrieve the data, once resolved will display data
  async function getAndDisplayData() {
    res.render("home", { homeText: home, newPosts: await atlas.getData() }); //Render the ejs file
  }
  getAndDisplayData();
});
//About Response
app.get("/about", (req, res) => {
  res.render("about", { aboutText: about }); //Render the ejs file
});
//Contact Response
app.get("/contact", (req, res) => {
  res.render("contact", { contactText: contact }); //Render the ejs file
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:post", (req, res) => {
  let postTitle = _.lowerCase(req.params.post);
  atlas.getData().then((data) => {
    data.forEach((entry) => console.log("entry"));
    data.forEach((post) => {
      if (_.lowerCase(post.title) === postTitle) {
        res.render("post", { postTitle: post.title, postText: post.text });
      }
    });
  });
});

//? ************************************************************************************/

//? ******************************  Post request section ******************************/
//Compose will add new post to the array and re-write data
app.post("/compose", (req, res) => {
  //Using object destructuring to add an ID to the post
  url = _.kebabCase(_.lowerCase(req.body.postTitle));
  let newPost = { ...req.body, id: newPosts.length + 1, url: "/posts/" + url };
  atlas.postData(newPost);

  res.redirect("/");
});
app.post("/", (req, res) => {
  newPosts = []; //removing all items from the array
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
