"use client";
import { useState, useEffect, useCallback } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { useUi } from "./context/UiContext";
import { useAuth } from "./context/AuthContext";
import { RingLoader } from "react-spinners";
import toast from "react-hot-toast";

const Login = () => {
  const { isLoginOpen, closeLogin, loginState, setLoginState } = useUi();
  const { register, login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    fname: "",
    email: "",
    password: "",
    phone: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetFormFields = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  useEffect(() => {
    resetFormFields();
  }, [loginState, resetFormFields]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (loginState === "register") {
        let identifier = formData.email.trim();

        const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          identifier,
        );
        const isPhone = /^\d{10}$/.test(identifier);

        const userData = {
          fullName: formData.fname,
          email: isEmail ? identifier : null,
          phoneNumber: isPhone ? identifier : null,
        };

        if (!isEmail && !isPhone) {
          toast.error("Please Enter valid Email or 10-digit Phone number");
          setIsLoading(false);
          return;
        }

        const result = await register(identifier, formData.password, userData);

        if (result.success) {
          resetFormFields();
          closeLogin();
        }
      }
      if (loginState === "login") {
        let identifier = formData.email.trim();

        const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          identifier,
        );
        const isPhone = /^\d{10}$/.test(identifier);

        if (!isEmail && !isPhone) {
          toast.error("Enter valid Email or 10-digit Phone number");
          setIsLoading(false);
          return;
        }

        const result = await login(identifier, formData.password);

        if (result.success) {
          resetFormFields();
          closeLogin();
        }
      } else if (loginState === "forgotPassword") {
        // TODO: Implement forgot password functionality
        alert("Forgot password functionality coming soon!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoginOpen) return null;

  return (
    <div
      onClick={closeLogin}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-50"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-8 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <div className="flex flex-col gap-3 justify-between items-center w-full">
          <Image
            src="/images/logo.png"
            alt="Stonepedia Logo"
            width={150}
            height={150}
          />
          {loginState !== "login" && loginState !== "forgotPassword" && (
            <p className="text-xs text-center font-semibold text-gray-500">
              Sign up to see awesome Marbles and Granites..
            </p>
          )}
          {loginState === "forgotPassword" && (
            <p className="text-xs text-center font-semibold text-gray-500">
              Enter your email to reset password
            </p>
          )}
        </div>

        {loginState === "register" && (
          <div className="w-full">
            <input
              onChange={handleChange}
              name="fname"
              value={formData.fname}
              placeholder="Full Name"
              className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
              type="text"
              required
            />
          </div>
        )}
        {/* {loginState === "register" && (
          <div className="w-full ">
            <input
              onChange={handleChange}
              name="email"
              value={formData.email}
              placeholder="Email Id"
              className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
              type="email"
            />
          </div>
        )} */}

        <div className="w-full">
          <input
            onChange={handleChange}
            name="email"
            value={formData.email}
            placeholder="Email or Phone"
            className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
            type="text"
            required
          />
        </div>

        {loginState !== "forgotPassword" && (
          <div className="w-full relative ">
            <input
              onChange={handleChange}
              name="password"
              value={formData.password}
              placeholder="Password"
              className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
              type={showPassword ? "text" : "password"}
              // required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
        {/* {loginState === "register" && (
          <div className="w-full  relative">
            <input
              onChange={handleChange}
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Confirm Password"
              className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
              type={showConfirmPassword ? "text" : "password"}
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )} */}
        {loginState === "register" ? (
          <p className="text-xs">
            Already have account?{" "}
            <span
              onClick={() => setLoginState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : loginState === "forgotPassword" ? (
          <p className="text-xs ml-auto">
            Back to{" "}
            <span
              onClick={() => setLoginState("login")}
              className="text-primary cursor-pointer"
            >
              Login
            </span>
          </p>
        ) : (
          <div className="flex justify-between text-[10px] w-full">
            <p className="">
              Create an account?{" "}
              <span
                onClick={() => setLoginState("register")}
                className="text-primary cursor-pointer"
              >
                click here
              </span>
            </p>
            <p
              className="cursor-pointer text-primary"
              onClick={() => setLoginState("forgotPassword")}
            >
              Forgot Password?
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={` cursor-pointer bg-linear-to-r from-yellow-300 to-pink-800 w-full text-white font-semibold py-1 rounded-md flex items-center justify-center min-w-[240px] h-[34px]`}
        >
          {isLoading ? (
            <RingLoader color="white" size={30} speedMultiplier={1} />
          ) : loginState === "register" ? (
            "Register"
          ) : loginState === "forgotPassword" ? (
            "Reset Password"
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;

// 'use client';
// import { useState, useEffect, useCallback } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import Image from "next/image";
// import { useUi } from "./context/UiContext";
// import { useAuth } from "./context/AuthContext";
// import { RingLoader } from "react-spinners";

// const Login = () => {
//   const { isLoginOpen, closeLogin, loginState, setLoginState } = useUi();
//   const { register, login } = useAuth();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const initialFormData = {
//     fname: "",
//     email: "",
//     password: "",
//     phone: "",
//     confirmPassword: "",
//   };

//   const [formData, setFormData] = useState(initialFormData);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const resetFormFields = useCallback(() => {
//     setFormData(initialFormData);
//   }, []);

//   useEffect(() => {
//     resetFormFields();
//   }, [loginState, resetFormFields]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       if (loginState === "register") {
//         // Validate passwords match
//         if (formData.password !== formData.confirmPassword) {
//           alert("Passwords do not match!");
//           setIsLoading(false);
//           return;
//         }

//         const userData = {
//           fullName: formData.fname,
//           phoneNumber: formData.phone,
//         };

//         const result = await register(formData.email, formData.password, userData);

//         if (result.success) {
//           resetFormFields();
//           closeLogin();
//         }
//       } else if (loginState === "login") {
//         const result = await login(formData.email, formData.password);

//         if (result.success) {
//           resetFormFields();
//           closeLogin();
//         }
//       } else if (loginState === "forgotPassword") {
//         // TODO: Implement forgot password functionality
//         alert("Forgot password functionality coming soon!");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isLoginOpen) return null;

//   return (
//     <div
//       onClick={closeLogin}
//       className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-50"
//     >
//       <form
//         onSubmit={handleSubmit}
//         onClick={(e) => e.stopPropagation()}
//         className="flex flex-col gap-4 m-auto items-start p-8 py-8 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
//       >
//         <div className="flex flex-col gap-3 justify-between items-center w-full">
//           <Image
//             src="/images/logo.png"
//             alt="Stonepedia Logo"
//             width={150}
//             height={150}
//           />
//           {loginState !== "login" && loginState !== "forgotPassword" && (
//             <p className="text-xs text-center font-semibold text-gray-500">
//               Sign up to see awesome Marbles and Granites..
//             </p>
//           )}
//           {loginState === "forgotPassword" && (
//             <p className="text-xs text-center font-semibold text-gray-500">
//               Enter your email to reset password
//             </p>
//           )}
//         </div>

//         {loginState === "register" && (
//           <div className="w-full">
//             <input
//               onChange={handleChange}
//               name="fname"
//               value={formData.fname}
//               placeholder="Full Name"
//               className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
//               type="text"
//               required
//             />
//           </div>
//         )}
//         <div className="w-full ">
//           <input
//             onChange={handleChange}
//             name="email"
//             value={formData.email}
//             placeholder="Email Id"
//             className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
//             type="email"
//             required
//           />
//         </div>
//         {loginState === "register" && (
//           <div className="w-full">
//             <input
//               onChange={handleChange}
//               name="phone"
//               value={formData.phone}
//               placeholder="Phone Number"
//               className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
//               type="tel"
//               pattern="[0-9]{10}"
//               maxLength={10}
//               required
//             />
//           </div>
//         )}
//         {loginState !== "forgotPassword" && (
//           <div className="w-full relative ">
//             <input
//               onChange={handleChange}
//               name="password"
//               value={formData.password}
//               placeholder="Password"
//               className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
//               type={showPassword ? "text" : "password"}
//               required
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//         )}
//         {loginState === "register" && (
//           <div className="w-full  relative">
//             <input
//               onChange={handleChange}
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               placeholder="Confirm Password"
//               className="border border-gray-200 rounded w-full p-2 outline-primary text-xs"
//               type={showConfirmPassword ? "text" : "password"}
//               required
//             />
//             <span
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
//             >
//               {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//         )}
//         {loginState === "register" ? (
//           <p className="text-xs">
//             Already have account?{" "}
//             <span
//               onClick={() => setLoginState("login")}
//               className="text-primary cursor-pointer"
//             >
//               click here
//             </span>
//           </p>
//         ) : loginState === "forgotPassword" ? (
//           <p className="text-xs ml-auto">
//             Back to{" "}
//             <span
//               onClick={() => setLoginState("login")}
//               className="text-primary cursor-pointer"
//             >
//               Login
//             </span>
//           </p>
//         ) : (
//           <div className="flex justify-between text-[10px] w-full">
//             <p className="">
//               Create an account?{" "}
//               <span
//                 onClick={() => setLoginState("register")}
//                 className="text-primary cursor-pointer"
//               >
//                 click here
//               </span>
//             </p>
//             <p
//               className="cursor-pointer text-primary"
//               onClick={() => setLoginState("forgotPassword")}
//             >
//               Forgot Password?
//             </p>
//           </div>
//         )}
//         <button
//           type="submit"
//           disabled={isLoading}
//           className={` cursor-pointer bg-linear-to-r from-yellow-300 to-pink-800 w-full text-white font-semibold py-1 rounded-md flex items-center justify-center min-w-[240px] h-[34px]`}
//         >
//           {isLoading ? (
//             <RingLoader color="white" size={30} speedMultiplier={1} />
//           ) : loginState === "register" ? (
//             "Register"
//           ) : loginState === "forgotPassword" ? (
//             "Reset Password"
//           ) : (
//             "Login"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
