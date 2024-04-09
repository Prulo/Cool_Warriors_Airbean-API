const express = require("express")
const Datastore = require("nedb-promise")

const PORT = 8000;
const URL = "127.0.0.1";

const db = new Datastore({
    filename: "database.db",
    autoload: true,
  });
  
  const server = app.listen(PORT, URL, () => {
    console.log(Listening to port: ${PORT});
  });