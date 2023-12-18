import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className='hero relative flex flex-col mb-8'>
      <div className="relative py-24 overflow-hidden lg:mt-0 isolate sm:pt-32 sm:pb-16 h-4/5">
        <img
          src="https://ik.imagekit.io/pb97gg2as/E-Commerce-Assets/boksbg.png?updatedAt=1684597529803"
          alt="header-books"
          className="absolute inset-0 object-cover object-right w-full h-full -z-10 md:object-center" />
        <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl" aria-hidden="true">
          <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            style={{
              clipPath: `polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 
                    47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)`}}>
          </div>
        </div>
        <div className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          aria-hidden="true">
          <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-30"
            style={{
              clipPath: `polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 
                      60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)`}} >
          </div>
        </div>
        <div className="px-6 mx-auto max-w-7xl lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">LEOATECH
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#ff4694] to-[#776fff] "> LIBRARY</span></h2>

            <p className="mt-6 text-lg leading-8 text-white">
              Uncover a World of Literary Delights: Explore and Shop the Vast Library from Our APP
            </p>
          </div>
          <div className="max-w-2xl mx-auto mt-10 lg:mx-0 lg:max-w-none">
            <div className='flex items-center gap-x-5 sm:text-sm mx-auto justify-center'>
              <a
                href="javascript:void(0)"
                className={`flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-purple-800 duration-150 
                hover:bg-white active:bg-purple-900 rounded-full md:inline-flex`}>
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                  <path fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="javascript:void(0)" className={`flex items-center justify-center gap-x-1 py-2 px-4 text-white bg-purple-800 duration-150 
                bg-purple-700 active:bg-purple-900 font-medium rounded-full md:inline-flex`}>
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                  <path fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <Banner /> */}
    </section>
  );
}

export default HeroSection;