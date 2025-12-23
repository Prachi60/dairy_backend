import handleResponse from "../utils/helper.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import Store from "../models/store.js"
import { createUserValidator } from "../validations/user.js";
import { transporter } from "../utils/emailHandler.js";
import ejs from "ejs";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { fileURLToPath } from "url";

// export const registerUser = async (req, res) => {
//   try {
//     const { error, value } = createUserValidator.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       return handleResponse(res, 400, "Validation error", {
//         details: error.details.map((error) => error.message),
//       });
//     }

//     const { name, email, contact_number, address, pincode, role, password } =
//       value;
//     const existingMail = await User.findOne({ email: email });
//     if (existingMail) {
//       return handleResponse(
//         res,
//         409,
//         "User already registered with this email"
//       );
//     }

//     let storeId = null;

//     // if (role === "admin") {
//     //     if (!req.body.store) {
//     //         return handleResponse(res, 400, "Store ID is required for admin");
//     //     }

//     //     if (!mongoose.Types.ObjectId.isValid(req.body.store)) {
//     //         return handleResponse(res, 400, "Invalid store ID");
//     //     }

//     //     storeId = req.body.store;
//     // }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       name,
//       email,
//       contact_number,
//       address,
//       pincode,
//       role,
//       password: hashedPassword,
//       store: storeId,
//     });

//     // const existingSuperadmin = await User.findOne({ role: "superadmin" });
//     //    if (existingSuperadmin) {
//     //      return handleResponse(res, 400, "Superadmin already registered");
//     //    }

//     const result = await newUser.save();
//     const token = jwt.sign(
//       {
//         id: result._id,
//         role: result.role,
//         store: result.store?._id,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     const mailOptions = {
//       from: `"no-reply"<${process.env.EMAIL_USER}>`,
//       to: result.email,
//       subject: "User Registered Succesfully",
//       html: `
//       <h3>Hello ${result.name || "user"} </h3>
//       <p> Welcome to Subsify !!</p>
//       <span>Daily Groceries ,milk,veggies & more always on time....</span>
//       <p>The details you shared with us are as follows

//         Email: ${result.email},
//        Name: ${result.name},
//         contact number :${result.contact_number}</p>

//       `,
//     };

//     let emailSent = false;

//     try {
//       await transporter.sendMail(mailOptions);
//       emailSent = true;
//     } catch (mailError) {
//       console.error("Failure in sending mail", mailError.message);
//     }
//     return handleResponse(res, 201, "User registered successfully", {
//       name: result.name,
//       role: result.role,
//       email: result.email,
//       token,
//       message: emailSent
//         ? "A confirmation email has been sent to your Gmail"
//         : "User registered, but email could not be sent",
//     });
//   } catch (error) {
//     console.error("Error in registering user", error.message);
//     return handleResponse(res, 500, "Internal Server Error", {
//       error: error.message,
//     });
//   }
// };

const renderTemplate = async (templateName, data) => {
  const filePath = path.join(__dirname, "..", "templates", templateName);

  // console.log("Email template path:", filePath);

  return await ejs.renderFile(filePath, data);
};

export const registerUser = async (req, res) => {
  try {
    const { error, value } = createUserValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return handleResponse(res, 400, "Validation error", {
        details: error.details.map((err) => err.message),
      });
    }

    const { name, email, contact_number, address, pincode, role, password } =
      value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleResponse(
        res,
        409,
        "User already registered with this email"
      );
    }
     let storeId = null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      contact_number,
      address,
      pincode,
      role,
      password: hashedPassword,
      store: storeId,
    });

    const result = await newUser.save();

    const token = jwt.sign(
      {
        id: result._id,
        role: result.role,
        store: result.store?._id,

      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const htmlTemplate = await renderTemplate("welcome.ejs", {
      name: result.name,
      email: result.email,
      contact_number: result.contact_number,
    });

    const mailOptions = {
      from: `"Subsify"<${process.env.EMAIL_USER}>`,
      to: result.email,
      subject: "Welcome to Subsify 🎉",
      html: htmlTemplate,
    };

    let emailSent = false;

    try {
      await transporter.sendMail(mailOptions);
      emailSent = true;
    } catch (mailError) {
      console.error("Email sending failed:", mailError.message);
    }

    return handleResponse(res, 201, "User registered successfully", {
      name: result.name,
      role: result.role,
      email: result.email,
      token,
      message: emailSent
        ? "A confirmation email has been sent to your email"
        : "User registered, but email could not be sent",
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { error, value } = createUserValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return handleResponse(res, 400, "Validation error", {
        details: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;

    let user = await User.findOne({ email });
    // console.log("User:", user);

    if (!user) {
      return handleResponse(res, 401, "Invalid Credentials");
    }

    if (user.role === "admin") {
      user = await user.populate("store");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return handleResponse(res, 401, "Password  do not matched");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        store: user.store?._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const role = user.role;
    const store = user.store;
    console.log("store", store);
    return handleResponse(res, 200, "login Succesful", { token, role, store });
  } catch (error) {
    console.error("Error in login:", error.message);
    return handleResponse(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    // console.log("req.id",req.id);

    if (!user) {
      return handleResponse(res, 404, "User not found");
    }

    return handleResponse(res, 200, "Details fetched successfully", user);
  } catch (error) {
    console.error("error in fetching details", error.message);
    return handleResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
