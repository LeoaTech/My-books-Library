import Slider from "../InfiniteSlider/InfiniteSlider";
import "../index.css";
import { useFetchBooks } from "../../../hooks/books/useFetchBooks";
import Loader from "../Loader/Loader";

const NewArrivalBooks = () => {

  const booksList = booksData?.books || [];

  const sliderBooks = booksList.map((book) => {
    const img = book.cover_img_url?.[0]?.secure_url || book.cover_img_url || book.img;
    const isAvailable =
      book.available ?? book.is_available ?? book.Available ?? true;
    return {
      id: book.id,
      title: book.title,
      author: book.author_name || book.author,
      img,
      publisher: book.publisher_name || book.publisher || "",
      publish_year: book.publish_year || book.publish_date || book.publishDate || "",
      purchase_price: book.purchase_price || book.member_price || "",
      member_price: book.member_price || book.purchase_price || "",
      discount_percentage: book.discount_percentage || "0",
      isbn: book.isbn,
      isAvailable,
      hideWishlist: true,
    };
  });

  return (
    <section className="new-arrivals-container">
      <div className="section-head text-center">
        <h2 className="mt-10 mb-3 text-center text-2xl font-bold uppercase">
          Newly Arrived
        </h2>
        <hr className="mx-auto mb-10 h-2 w-20 transform border-y-2 border-y-blue-500" />
      </div>
      <Slider books={sliderBooks} />
    </section>
  );
};

export default NewArrivalBooks;
