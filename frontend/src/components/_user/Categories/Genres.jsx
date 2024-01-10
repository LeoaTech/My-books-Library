import React from "react";

const Genres = ({ genres }) => {
  const calculateGridSize = (totalGenres) => {
    const maxCols = 5; // Maximum number of columns in a row
    const minCols = 3; // Minimum number of columns in a row

    // Calculate the number of columns based on total genres
    const cols = Math.min(maxCols, Math.max(minCols, totalGenres));

    // Calculate the number of rows
    const rows = Math.ceil(totalGenres / cols);

    return { rows, cols };
  };

  const generateGrid = () => {
    const totalGenres = genres.length;
    const { rows, cols } = calculateGridSize(totalGenres);

    const gridItems = [];

    for (let i = 0; i < rows; i++) {
      const rowItems = [];
      const availableCols = cols - i;

      for (let j = 0; j < availableCols; j++) {
        const genreIndex = i * cols + j;
        if (genreIndex < totalGenres) {
          rowItems.push(
            <div
              key={genreIndex}
              className="inline-block mx-2 border-2 border-white"
              style={{ width: "150px", height: "50px" }}
            >
              <div className="rounded bg-gray-900 p-8">
                <h1 className="text-white">{genres[genreIndex]}</h1>
              </div>
              <div className="mx-auto h-2 w-11/12 rounded-b bg-gray-900 opacity-75"></div>
              <div className="mx-auto h-2 w-10/12 rounded-b bg-gray-900 opacity-50"></div>
            </div>
          );
        }
      }
      gridItems.push(
        <div key={i} className="text-center my-4">
          {rowItems}
        </div>
      );
    }

    return gridItems;
  };

  return (
    <section className="mb-24">
      <div className="section-head text-center">
        <h2 className="mt-10 mb-3 text-center text-2xl font-bold uppercase">
          Genres
        </h2>
        <hr className="mx-auto mb-10 h-2 w-20 transform border-y-2 border-y-blue-500" />
      </div>

      {generateGrid()}
    </section>
  );
};

export default Genres;
