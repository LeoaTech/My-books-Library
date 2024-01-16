import React, { useState } from "react";
import {
  AddBookDetails,
  ShowBookDetails,
  Table,
} from "../../components/_admin";
import Add from "../../assets/add.svg";

const Listing = () => {
  const [showModal, setShowModal] = useState(false);
  const [bookDetailModal, setBookDetailModal] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mx-4 overflow-hidden">
        <h2 className="text-3xl my-5">Listings</h2>

        <button
          className="bg-meta-5 text-white active:bg-secondary 
      font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Add Book
        </button>
      </div>
      <Table setBookDetailModal={setBookDetailModal} />

      {/* Add New Book Modal */}

      {showModal && <AddBookDetails setShowModal={setShowModal} />}
      {/* Edit / Delete  Book Details Modal */}
      {bookDetailModal && (
        <ShowBookDetails setBookDetailModal={setBookDetailModal} />
      )}
    </>
  );
};

export default Listing;

{
  /* <button className="bg-black p-2 px-3 text-lg text-white rounded-lg hover:bg-bodydark2">
          <span className="flex items-center gap-2">
            <img src={Add} alt="add-icon" className="h-3 w-3" />
            New Book{" "}
          </span>
        </button> */
}
