const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig")

/* Get ALL Authors */
const FetchAllAuthors = asyncHanlder(async (req, res) => {
  try {
    const AuthorsQuery = `SELECT * FROM authors`;
    const getAllAuthors = await db.query(AuthorsQuery);

    res.status(200).json({
      authors: getAllAuthors?.rows,
      message: "Authors Found ",
    });
  } catch (error) {
    console.log(error);
  }
});

/* Create New Author */

const AddNewAuthor = asyncHanlder(async (req, res) => {
  console.log(req.body);
  try {
    const createAuthorQuery = await db.query(
      `INSERT INTO authors (name) VALUES ($1)`,
      [req.body.name]
    );

    console.log(createAuthorQuery?.rows[0], "Authors /founded");

    res.status(200).json({
      authors: createAuthorQuery?.rows[0],
      message: "Authors Found ",
    });
  } catch (error) {
    console.log(error, "Error creating new author");
  }
});

/* Fetch Authors By ID */

/* Fetch All Authors by Book ID */

module.exports = { FetchAllAuthors, AddNewAuthor };
