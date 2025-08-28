const asyncHanlder = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Authors */
const FetchAllAuthors = asyncHanlder(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    const AuthorsQuery = `SELECT * FROM authors WHERE entity_id =$1`;
    const getAllAuthors = await db.query(AuthorsQuery, [entityId]);

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

  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    if (!req.body.authorsForm) {
      return res.status(400).json("Invalid Authors Details");
    }

    const { name, links, description } = req.body.authorsForm;

    const createAuthorQuery = await db.query(
      `INSERT INTO authors (name, links, description, entity_id) VALUES ($1,$2,$3, $4)`,
      [name, links, description, entityId]
    );

    console.log(createAuthorQuery?.rows[0], "Authors Saved");

    res.status(200).json({
      authors: createAuthorQuery?.rows[0],
      message: "Authors Saved Successfully ",
    });
  } catch (error) {
    console.log(error, "Error creating new author");
    res.status(500).json({
      error,
      message: error.message || "Error Creating Authors",
    });
  }
});





module.exports = { FetchAllAuthors, AddNewAuthor };
