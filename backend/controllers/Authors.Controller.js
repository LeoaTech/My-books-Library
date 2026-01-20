const asyncHandler = require("express-async-handler");
const db = require("../config/dbConfig");

/* Get ALL Authors */
const FetchAllAuthors = asyncHandler(async (req, res) => {
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
    res.status(500).json({error:error?.message||"Failed to fetch authors."})
  }
});

/* Create New Author */

const AddNewAuthor = asyncHandler(async (req, res) => {

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
      `INSERT INTO authors (name, links, description, entity_id) VALUES ($1,$2,$3, $4) RETURNING id,name`,
      [name, links, description, entityId]
    );

    res.status(200).json({
      authors: createAuthorQuery?.rows[0],
      message: "Authors Saved Successfully ",
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message || "Error Creating Authors",
    });
  }
});

/* Update Author Details */

const UpdateAuthor = asyncHandler(async (req, res) => {
  try {
    if (!req.body.authorsForm) {
      return res.status(400).json("Invalid Authors Details");
    }

    if (!req.params.author_id) {
      return res.status(400).json({
        message: "Invalid Author's ID",
      });
    }

    const { name, links, description } = req.body.authorsForm;
    const { author_id } = req.params;
    const updateAuthorQuery = await db.query(
      `UPDATE authors SET name=$1, links=$2, description=$3 Where id=$4 RETURNING *`,
      [name, links, description, author_id]
    );


    res.status(200).json({
      authors: updateAuthorQuery?.rows[0],
      message: "Authors Updated Successfully ",
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message || "Error Updating Authors",
    });
  }
});




module.exports = { FetchAllAuthors, AddNewAuthor,  UpdateAuthor };
