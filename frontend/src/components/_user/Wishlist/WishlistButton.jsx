
import { useState } from 'react'
import { toast } from 'react-toastify'
import { BASE_URL } from '../../../utils/baseAPIURL'
import { useQueryClient } from '@tanstack/react-query'

const AddToWishListButton = ({ bookId, stock_quantity }) => {

    const queryClient = useQueryClient()
    const [wishlistItems, setWishlistItems] = useState([]);

    const isInWishlist = wishlistItems?.some(w => w?.itemId == bookId);
    const isOutOfStock = stock_quantity === 1 || stock_quantity === 0;

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

            const wishlistResponse = await response.json();
            if (response.ok) {
                queryClient.invalidateQueries("wishlist")
                toast.update(toastId, {
                    render: 'wishlist Updated successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                toast.update(toastId, {
                    render: `Error: ${wishlistResponse?.error || "Failed to add items in the wishlist"}`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 1000,
                });
                setWishlistItems(wishlistItems.filter((item) => item.itemId == id))

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
        setWishlistItems(wishlistItems.filter((item) => item.itemId == id))
    }
    return (

        <button
            onClick={() => isInWishlist ? removeFromWishlist(bookId) : addToWishlist(bookId)}
            disabled={!bookId}
            type="button"
            className="absolute right-0 top-1 w-12 h-12
             flex items-center justify-center
             rounded-full text-gray-500
             hover:text-red-500 hover:bg-red-100
             focus:outline-none focus:ring-2 focus:ring-red-500"        >
            {isInWishlist ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-red-500"
                >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.711 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.976 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 8.721a25.175 25.175 0 01-4.244 3.17z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                </svg>
            )}

        </button>


    )


}

export default AddToWishListButton


{/* <button
                className={`px-4 py-2 rounded ${isInWishlist ? 'bg-red-500' : 'bg-blue-500'} text-white`}
            >
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                {isOutOfStock && !isInWishlist && ' (Notify when available)'}
            </button> */}


