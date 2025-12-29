
const books = [
    {
        "id": 4,
        "title": "Think and Grow Rich The Landmark Bestseller Now Revised and Updated for the 21st Century",
        "summary": "The bestselling success book of all time—now revised and updated for the 21st century. Think and Grow Rich has been called the “Granddaddy of All Motivational Literature.” It was the first book to boldly ask, “What makes a winner?” The man who asked and listened for the answer, Napoleon Hill, is now counted in the top ranks of the world's winners himself. The most famous of all teachers of success spent “a fortune and the better part of a lifetime of effort” to produce the “Law of Success” philosophy that forms the basis of his books and that is so powerfully summarized in this one. In the original Think and Grow Rich, published in 1937, Hill draws on stories of Andrew Carnegie, Thomas Edison, Henry Ford, and other millionaires of his generation to illustrate his principles. In the updated version, Arthur R. Pell, Ph.D., a nationally known author, lecturer, and consultant in human resources management and an expert in applying Hill's thought, deftly interweaves anecdotes of how contemporary millionaires and billionaires, such as Bill Gates, Mary Kay Ash, Dave Thomas, and Sir John Templeton, achieved their wealth. Outmoded or arcane terminology and examples are faithfully refreshed to preclude any stumbling blocks to a new generation of readers.",
        "member_price": "300",
        "purchase_price": "500",
        "discount_percentage": "10",
        "is_available": true,
        "comments": null,
        "publish_year": "2005",
        "cover_img_url": "[{\"url\": \"http:\/\/res.cloudinary.com\/ddrztrsyf\/image\/upload\/v1762153834\/books\/file.jpg\", \"etag\": \"c089a56884c61fe1d8030fc757cdd5f1\", \"tags\": [], \"type\": \"upload\", \"bytes\": 129664, \"width\": 925, \"folder\": \"books\", \"format\": \"jpg\", \"height\": 617, \"api_key\": \"148245343772427\", \"version\": 1762153834, \"asset_id\": \"672b24046d02bfba0b1743d3d8733d42\", \"public_id\": \"books\/file\", \"signature\": \"3d33baf638514d9548e567c8fdf3c73402d0fe11\", \"created_at\": \"2025-10-31T05:12:38Z\", \"secure_url\": \"https:\/\/res.cloudinary.com\/ddrztrsyf\/image\/upload\/v1762153834\/books\/file.jpg\", \"version_id\": \"45a2744f78d824e1a77b6b0e4b6c7fe4\", \"access_mode\": \"public\", \"overwritten\": true, \"placeholder\": false, \"resource_type\": \"image\", \"original_filename\": \"file\"}]",
        "isbn": "9781585424337",

        "created_at": "2025-09-14T08:53:19.182Z",
        "updated_at": "2025-09-14T08:53:19.182Z",
        "edition": "Reprint",
        "quantity": 1
    },
    {
        "id": 3,
        "title": "Atomic Habits An Easy & Proven Way to Build Good Habits & Break Bad Ones",
        "summary": "The #1 New York Times bestseller. Over 25 million copies sold! Translated into 60+ languages! Tiny Changes, Remarkable Results No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. If you're having trouble changing your habits, the problem isn't you. The problem is your system. Bad habits repeat themselves again and again not because you don't want to change, but because you have the wrong system for change. You do not rise to the level of your goals. You fall to the level of your systems. Here, you'll get a proven system that can take you to new heights. Clear is known for his ability to distill complex topics into simple behaviors that can be easily applied to daily life and work. Here, he draws on the most proven ideas from biology, psychology, and neuroscience to create an easy-to-understand guide for making good habits inevitable and bad habits impossible. Along the way, readers will be inspired and entertained with true stories from Olympic gold medalists, award-winning artists, business leaders, life-saving physicians, and star comedians who have used the science of small habits to master their craft and vault to the top of their field. Learn how to: make time for new habits (even when life gets crazy); overcome a lack of motivation and willpower; design your environment to make success easier; get back on track when you fall off course; ...and much more. Atomic Habits will reshape the way you think about progress and success, and give you the tools and strategies you need to transform your habits--whether you are a team looking to win a championship, an organization hoping to redefine an industry, or simply an individual who wishes to quit smoking, lose weight, reduce stress, or achieve any other goal.",
        "member_price": "500",
        "purchase_price": "900",
        "discount_percentage": "12",
        "is_available": true,
        "comments": null,
        "publish_year": "2018",
        "cover_img_url": "[]",
        "isbn": "9780735211308",
        "created_at": "2025-09-12T03:26:59.836Z",
        "updated_at": "2025-09-12T03:26:59.836Z",
        "edition": null,
        "quantity": 1
    },
]


import { useState } from 'react'
import { toast } from 'react-toastify'
import { BASE_URL } from '../utils/baseAPIURL'
import { useQueryClient } from '@tanstack/react-query'

const ProductDetailPage = () => {


    const queryClient = useQueryClient()
    const [wishlistItems, setWishlistItems] = useState([])
    const isInWishlist = wishlistItems?.some(w => w?.itemId == books[0]?.id);
    const isOutOfStock = books[0]?.quantity === 1;

    // console.log(wishlistItems, "Wishlist Items");

    const addToWishlist = async (id) => {
        setWishlistItems((prev) => ([...prev, { itemId: id }]))


        const toastId = toast.loading("Adding items to wishlist..")

        try {

            const response = await fetch(`${BASE_URL}/wishlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ itemId: id }),
            });


            console.log(response, "Response");

            const wishlistResponse = await response.json();
            console.log(wishlistResponse);

            if (response.ok) {
                queryClient.invalidateQueries("wishlist")
                toast.update(toastId, {
                    render: 'wishlist Updated successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }


        } catch (error) {
            console.error('Error updating wishlist:', error);
            toast.update(toastId, {
                render: `Error: ${error || "Failed to add items in the wishlist"}`,
                type: 'error',
                isLoading: false,
                autoClose: 1000,
            });
        }
    }




    const removeFromWishlist = (id) => {
        // setWishlistItems(wishlistItems.filter((item) => item.itemId == id))
    }
    return (
        <>
            <p>Book ID: {books[0]?.id}</p>
            <p>Book Title: {books[0]?.title}</p>
            <p>Quantity:{isOutOfStock && <p className="text-red-600">Out of stock</p>}</p>

            <button
                onClick={() => isInWishlist ? removeFromWishlist(books[0]?.id) : addToWishlist(books[0]?.id)}
                className={`px-4 py-2 rounded ${isInWishlist ? 'bg-red-500' : 'bg-blue-500'} text-white`}
            >
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                {isOutOfStock && !isInWishlist && ' (Notify when available)'}
            </button>

        </>
    )


}

export default ProductDetailPage