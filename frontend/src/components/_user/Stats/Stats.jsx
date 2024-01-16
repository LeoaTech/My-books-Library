import React from "react";

const Stats = () => {
  return (
    <section className="max-w-screen-xl">
      <h2 className="mt-10 mb-3 text-center text-2xl font-bold uppercase">
        Why Us?
      </h2>
      <hr className="mx-auto mb-10 h-2 w-20 transform border-y-2 border-y-blue-500" />
      <div className="mx-auto grid grid-cols-1 grid-rows-1 gap-5 px-10 text-center sm:grid-cols-2 md:max-w-screen-lg md:grid-cols-4 md:px-0 text-white mb-20">
        <div className="flex aspect-square flex-col items-center justify-center space-y-3 bg-purple-600 border-b-4 border-b-white shadow-md shadow-blue-300 p-4">
          <div className="text-4xl">
            {/* <!-- fet:flag --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="0.88em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 28 32"
            >
              <g fill="currentColor">
                <path d="M13.5 1h-11a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h11.002c.251 0 1.498.074 1.498 1.5a.5.5 0 0 0 1 0V3.484C15.973 2.625 15.416 1 13.5 1zM15 16.456A2.798 2.798 0 0 0 13.5 16H3V2h10.5c1.396 0 1.494 1.363 1.5 1.5v12.956z" />
                <path d="M26.329 21H12.487c.006.001-.703.009-1.14-.419c-.251-.247-.379-.61-.379-1.081a.5.5 0 0 0-1 0c0 .754.231 1.36.688 1.803c.687.665 1.648.697 1.819.697h13.854c.389 0 .719-.157.931-.443c.281-.379.275-.863.185-1.162c-.563-1.853-3.541-5.883-4.379-6.996c.807-1.241 3.815-5.94 4.379-7.793c.091-.299.097-.782-.185-1.162c-.212-.287-.542-.444-.931-.444h-8.787a.5.5 0 0 0 0 1h8.787c.099 0 .119.028.127.039c.047.062.055.197.031.275c-.596 1.961-4.412 7.772-4.451 7.831a.5.5 0 0 0 .021.579c.038.05 3.839 5.018 4.43 6.961c.023.079.016.213-.031.276c-.008.011-.028.039-.127.039zM1 31.5V.5a.5.5 0 0 0-1 0v31a.5.5 0 0 0 1 0z" />
              </g>
            </svg>
          </div>
          <h3 className="text-3xl font-semibold">$40M+</h3>
          <span className="text-sm font-light">Revenue Gains</span>
        </div>
        <div className="flex aspect-square flex-col items-center justify-center space-y-3 bg-purple-600 border-b-4 border-b-white shadow-md shadow-blue-300 p-4">
          <div className="text-4xl">
            {/* <!-- et:lightbulb --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="0.69em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 22 32"
            >
              <path
                fill="currentColor"
                d="M11 0C5.71 0 0 4.206 0 11c0 3.353 1.334 6.174 3.896 8.312a.478.478 0 0 0 .092.088c1.901 2.062 1.997 2.454 2.01 3.361c.006.359.003.465 0 .523l-.004.209c-.015.452-.038 1.209.899 1.495l8.094 1.781a.5.5 0 1 0 .214-.977l-8.055-1.771c-.155-.047-.168-.051-.154-.498l.003-.191s.01-.078.002-.586c-.019-1.269-.295-1.882-2.309-4.059a.5.5 0 0 0-.138-.118C2.194 16.566 1 14.02 1 11C1 4.823 6.19 1 11 1c4.916 0 10 3.741 10 10c0 3.978-1.928 6.171-3.518 7.551a.485.485 0 0 0-.147.109c-2.037 2.204-2.313 2.817-2.332 4.086v.103l-.001.035c-.003.076-.014.118-.013.134a19.508 19.508 0 0 1-.117-.018l-4.195-.987a.5.5 0 1 0-.229.974l4.144.972c.055.02.553.182.973-.113c.183-.129.396-.382.434-.866l.003-.047l.002-.099l-.001-.026l.001-.046c.013-.902.107-1.294 2.005-3.356c.009-.007.019-.014.027-.022C20.703 17.143 22 14.4 22 11c0-6.885-5.593-11-11-11zm4 29.5a.498.498 0 0 0 .487-.39a.499.499 0 0 0-.377-.598l-8-1.814a.5.5 0 0 0-.221.975l8 1.814A.48.48 0 0 0 15 29.5zm-7.391.054a.5.5 0 1 0-.219.975l6.5 1.458a.5.5 0 1 0 .219-.975l-6.5-1.458z"
              />
            </svg>
          </div>
          <h3 className="text-3xl font-semibold">20 years</h3>
          <span className="text-sm font-light">
            More than 20 years of excellance
          </span>
        </div>
        <div className="flex aspect-square flex-col items-center justify-center space-y-3 bg-purple-600 border-b-4 border-b-white shadow-md shadow-blue-300 p-4">
          <div className="text-4xl">
            {/* <!-- healthicons:award-trophy-outline --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 48 48"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 7a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1v1h5a1 1 0 0 1 1 1v6a5 5 0 0 1-5 5h-1.683c-1.541 4.36-5.53 7.564-10.317 7.959V34h7a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H16a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h7v-6.041c-4.786-.395-8.776-3.599-10.317-7.959H11a5 5 0 0 1-5-5V9a1 1 0 0 1 1-1h5V7Zm22 9V8H14v8c0 5.523 4.477 10 10 10s10-4.477 10-10Zm2-6v8h1a3 3 0 0 0 3-3v-5h-4ZM8 10h4v8h-1a3 3 0 0 1-3-3v-5Zm9 26v4h14v-4H17Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-3xl font-semibold">4,000</h3>
          <span className="text-sm font-light">
            More than 2,320 customers globally
          </span>
        </div>
        <div className="flex aspect-square flex-col items-center justify-center space-y-3 bg-purple-600 border-b-4 border-b-white shadow-md shadow-blue-300 p-4">
          <div className="text-4xl">
            {/* <!-- et:global --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="M.034 16.668C.388 25.179 7.403 32 16 32s15.612-6.821 15.966-15.332A.493.493 0 0 0 32 16.5c0-.036-.013-.067-.02-.1c.003-.134.02-.265.02-.4c0-8.822-7.178-16-16-16S0 7.178 0 16c0 .135.017.266.02.4c-.007.033-.02.064-.02.1c0 .06.015.115.034.168zm24.887 6.074a21.921 21.921 0 0 0-4.215-1.271c.158-1.453.251-2.962.28-4.47h4.98c-.091 2.054-.456 3.993-1.045 5.741zM26.965 17h3.984a14.885 14.885 0 0 1-2.663 7.579a17.158 17.158 0 0 0-2.457-1.44c.645-1.869 1.042-3.943 1.136-6.139zm-14.576 5.286A23.416 23.416 0 0 1 16 22c1.224 0 2.433.102 3.61.286C18.916 27.621 17.4 31 16 31s-2.916-3.379-3.611-8.714zm1.519 8.378c-2.751-.882-5.078-3.471-6.482-6.984a20.873 20.873 0 0 1 3.99-1.217c.459 3.496 1.298 6.542 2.492 8.201zm-1.634-19.955A24.43 24.43 0 0 0 16 11a24.43 24.43 0 0 0 3.726-.291c.172 1.62.274 3.388.274 5.291h-8c0-1.903.102-3.671.274-5.291zM19.985 17a49.022 49.022 0 0 1-.26 4.291A24.397 24.397 0 0 0 16 21a24.42 24.42 0 0 0-3.726.291a48.668 48.668 0 0 1-.26-4.291h7.971zm.6 5.463c1.404.282 2.743.692 3.99 1.217c-1.404 3.513-3.731 6.102-6.482 6.984c1.193-1.659 2.032-4.705 2.492-8.201zM21 16c0-1.836-.102-3.696-.294-5.47c1.48-.292 2.896-.72 4.215-1.271C25.605 11.288 26 13.574 26 16h-5zm-.415-6.463c-.46-3.496-1.298-6.543-2.493-8.201c2.751.882 5.078 3.471 6.482 6.984a20.792 20.792 0 0 1-3.989 1.217zm-.974.177C18.433 9.898 17.224 10 16 10s-2.433-.102-3.611-.286C13.084 4.379 14.6 1 16 1c1.4 0 2.916 3.379 3.611 8.714zm-8.196-.177a20.895 20.895 0 0 1-3.99-1.217c1.404-3.513 3.731-6.102 6.482-6.984c-1.193 1.659-2.032 4.705-2.492 8.201zm-.121.993A51.315 51.315 0 0 0 11 16H6c0-2.426.395-4.712 1.079-6.742c1.319.552 2.735.979 4.215 1.272zm-.28 6.47c.029 1.508.122 3.017.28 4.471c-1.48.292-2.896.72-4.215 1.271c-.589-1.748-.954-3.687-1.045-5.742h4.98zM6.17 23.139a17.24 17.24 0 0 0-2.456 1.44A14.882 14.882 0 0 1 1.051 17h3.984c.094 2.196.491 4.27 1.135 6.139zM4.313 25.38a16.126 16.126 0 0 1 2.207-1.305c1.004 2.485 2.449 4.548 4.186 5.943a15.05 15.05 0 0 1-6.393-4.638zm16.981 4.637c1.738-1.394 3.182-3.458 4.186-5.943c.79.384 1.522.826 2.207 1.305a15.033 15.033 0 0 1-6.393 4.638zM27 16c0-2.567-.428-4.987-1.17-7.139c.88-.422 1.698-.907 2.457-1.44A14.91 14.91 0 0 1 31 16h-4zm.688-9.38c-.685.479-1.417.921-2.207 1.305c-1.004-2.485-2.449-4.549-4.186-5.943a15.062 15.062 0 0 1 6.393 4.638zM10.706 1.983C8.968 3.377 7.524 5.441 6.52 7.926A16.173 16.173 0 0 1 4.313 6.62a15.04 15.04 0 0 1 6.393-4.637zM3.714 7.421a17.185 17.185 0 0 0 2.456 1.44A21.954 21.954 0 0 0 5 16H1c0-3.19 1.009-6.145 2.714-8.579z"
              />
            </svg>
          </div>
          <h3 className="text-3xl font-semibold">Global</h3>
          <span className="text-sm font-light">
            More than 240 customers globally
          </span>
        </div>
      </div>
    </section>
  );
};

export default Stats;
