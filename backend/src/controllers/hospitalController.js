// import bcrypt from "bcryptjs";
// import { ObjectId } from "mongodb";
// import { getDB } from "../config/db.js";
// import { generateToken } from "../utils/token.js";
// import { slugify } from "../utils/slug.js";

// export const getMyHospital = async (req, res) => {
//   try {
//     console.log("REQ USER =", req.user);

//     if (!req.user?.id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const db = getDB();

//     const hospital = await db.collection("hospitals").findOne({
//       _id: new ObjectId(req.user.id),
//     });

//     if (!hospital) {
//       return res.status(404).json({
//         success: false,
//         message: "Hospital not found",
//       });
//     }

//     res.json({
//       success: true,
//       hospital,
//     });
//   } catch (err) {
//     console.error("GET MY HOSPITAL ERROR:", err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// export const registerHospital = async (req, res) => {
//   try {
//     const db = await getDB();
//     const hospitals = db.collection("hospitals");

//     const {
//       hospitalName,
//       ownerName,
//       email,
//       phone,
//       emergencyPhone,
//       password,
//       website,
//       address,
//       city,
//       state,
//       postalCode,
//       country,
//       hospitalType,
//       licenseNumber,
//       establishedYear,
//       totalDoctors,
//       totalBeds,
//       subscriptionPlan,
//       subscriptionMonths,
//     } = req.body;

//     const exists = await hospitals.findOne({ email });

//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "Hospital already exists",
//       });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const months = Number(subscriptionMonths || 1);

//     const hospital = {
//       hospitalName,
//       slug: slugify(hospitalName),
//       hospitalImage: req.file ? req.file.path : "",
//       ownerName,
//       email,
//       phone,
//       emergencyPhone,
//       password: hashed,
//       website,
//       address,
//       city,
//       state,
//       postalCode,
//       country,
//       hospitalType,
//       licenseNumber,
//       establishedYear: Number(establishedYear),
//       totalDoctors: Number(totalDoctors || 0),
//       totalBeds: Number(totalBeds || 0),
//       subscriptionPlan,
//       subscriptionMonths: months,
//       subscriptionAmount: months * 1000,
//       subscriptionStatus: "active",
//       expiresAt: new Date(
//         Date.now() + months * 30 * 24 * 60 * 60 * 1000
//       ),
//       role: "hospital",
//       isVerified: false,
//       isBlocked: false,
//       createdAt: new Date(),
//     };

//     const result = await hospitals.insertOne(hospital);

//     const token = generateToken(result.insertedId, "hospital");

//     res.json({
//       success: true,
//       token,
//       hospital,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// export const getAllHospitals = async (req, res) => {
//   try {
//     const db = getDB();

//     const hospitals = await db.collection("hospitals").find().toArray();

//     res.json({
//       success: true,
//       hospitals,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// export const updateMyHospital = async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const db = getDB();
//     const hospitals = db.collection("hospitals");

//     const existing = await hospitals.findOne({
//       _id: new ObjectId(req.user.id),
//     });

//     if (!existing) {
//       return res.status(404).json({
//         success: false,
//         message: "Hospital not found",
//       });
//     }

//     const {
//       hospitalName,
//       ownerName,
//       email,
//       phone,
//       emergencyPhone,
//       password,
//       website,
//       address,
//       city,
//       state,
//       postalCode,
//       country,
//       hospitalType,
//       licenseNumber,
//       establishedYear,
//       totalDoctors,
//       totalBeds,
//       subscriptionPlan,
//       subscriptionMonths,
//     } = req.body;

//     const updateFields = {};

//     if (hospitalName !== undefined) {
//       updateFields.hospitalName = hospitalName;
//       updateFields.slug = slugify(hospitalName);
//     }
//     if (ownerName !== undefined) updateFields.ownerName = ownerName;
//     if (email !== undefined) updateFields.email = email;
//     if (phone !== undefined) updateFields.phone = phone;
//     if (emergencyPhone !== undefined) updateFields.emergencyPhone = emergencyPhone;
//     if (website !== undefined) updateFields.website = website;
//     if (address !== undefined) updateFields.address = address;
//     if (city !== undefined) updateFields.city = city;
//     if (state !== undefined) updateFields.state = state;
//     if (postalCode !== undefined) updateFields.postalCode = postalCode;
//     if (country !== undefined) updateFields.country = country;
//     if (hospitalType !== undefined) updateFields.hospitalType = hospitalType;
//     if (licenseNumber !== undefined) updateFields.licenseNumber = licenseNumber;
//     if (establishedYear !== undefined) updateFields.establishedYear = Number(establishedYear);
//     if (totalDoctors !== undefined) updateFields.totalDoctors = Number(totalDoctors);
//     if (totalBeds !== undefined) updateFields.totalBeds = Number(totalBeds);
//     if (subscriptionPlan !== undefined) updateFields.subscriptionPlan = subscriptionPlan;

//     if (subscriptionMonths !== undefined) {
//       const months = Number(subscriptionMonths);
//       updateFields.subscriptionMonths = months;
//       updateFields.subscriptionAmount = months * 1000;
//       updateFields.expiresAt = new Date(
//         Date.now() + months * 30 * 24 * 60 * 60 * 1000
//       );
//     }

//     // password change চাইলে হ্যাশ করে বসাও, না চাইলে খালি রাখলে touch হবে না
//     if (password) {
//       updateFields.password = await bcrypt.hash(password, 10);
//     }

//     // নতুন image আপলোড করলে replace হবে, না করলে পুরোনোটাই থাকবে
//     if (req.file) {
//       updateFields.hospitalImage = req.file.path;
//     }

//     updateFields.updatedAt = new Date();

//     await hospitals.updateOne(
//       { _id: new ObjectId(req.user.id) },
//       { $set: updateFields }
//     );

//     const updatedHospital = await hospitals.findOne({
//       _id: new ObjectId(req.user.id),
//     });

//     res.json({
//       success: true,
//       message: "Hospital profile updated successfully",
//       hospital: updatedHospital,
//     });
//   } catch (err) {
//     console.error("UPDATE MY HOSPITAL ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };



import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { generateToken } from "../utils/token.js";
import { slugify } from "../utils/slug.js";

// helper: multer path কে clean, web-friendly URL এ convert করে
const buildImageUrl = (req) => {
  if (!req.file) return "";

  // Windows backslash -> forward slash
  const cleanPath = req.file.path.replace(/\\/g, "/");

  // "uploads/xxx.png" অংশটুকু বের করি (যেখান থেকেই আসুক)
  const uploadsIndex = cleanPath.indexOf("uploads/");
  const relativePath =
    uploadsIndex !== -1 ? cleanPath.substring(uploadsIndex) : cleanPath;

  // frontend থেকে সরাসরি access করার জন্য full URL বানাই
  return `${req.protocol}://${req.get("host")}/${relativePath}`;
};

export const getMyHospital = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const db = getDB();

    const hospital = await db.collection("hospitals").findOne({
      _id: new ObjectId(req.user.id),
    });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    res.json({
      success: true,
      hospital,
    });
  } catch (err) {
    console.error("GET MY HOSPITAL ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const registerHospital = async (req, res) => {
  try {
    const db = await getDB();
    const hospitals = db.collection("hospitals");

    const {
      hospitalName,
      ownerName,
      email,
      phone,
      emergencyPhone,
      password,
      website,
      address,
      city,
      state,
      postalCode,
      country,
      hospitalType,
      licenseNumber,
      establishedYear,
      totalDoctors,
      totalBeds,
      subscriptionPlan,
      subscriptionMonths,
    } = req.body;

    const exists = await hospitals.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Hospital already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const months = Number(subscriptionMonths || 1);

    const hospital = {
      hospitalName,
      slug: slugify(hospitalName),
      hospitalImage: buildImageUrl(req), // <-- fixed
      ownerName,
      email,
      phone,
      emergencyPhone,
      password: hashed,
      website,
      address,
      city,
      state,
      postalCode,
      country,
      hospitalType,
      licenseNumber,
      establishedYear: Number(establishedYear),
      totalDoctors: Number(totalDoctors || 0),
      totalBeds: Number(totalBeds || 0),
      subscriptionPlan,
      subscriptionMonths: months,
      subscriptionAmount: months * 1000,
      subscriptionStatus: "active",
      expiresAt: new Date(
        Date.now() + months * 30 * 24 * 60 * 60 * 1000
      ),
      role: "hospital",
      isVerified: false,
      isBlocked: false,
      createdAt: new Date(),
    };

    const result = await hospitals.insertOne(hospital);

    const token = generateToken(result.insertedId, "hospital");

    res.json({
      success: true,
      token,
      hospital,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const db = getDB();

    const hospitals = await db.collection("hospitals").find().toArray();

    res.json({
      success: true,
      hospitals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateMyHospital = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const db = getDB();
    const hospitals = db.collection("hospitals");

    const existing = await hospitals.findOne({
      _id: new ObjectId(req.user.id),
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    const {
      hospitalName,
      ownerName,
      email,
      phone,
      emergencyPhone,
      password,
      website,
      address,
      city,
      state,
      postalCode,
      country,
      hospitalType,
      licenseNumber,
      establishedYear,
      totalDoctors,
      totalBeds,
      subscriptionPlan,
      subscriptionMonths,
    } = req.body;

    const updateFields = {};

    if (hospitalName !== undefined) {
      updateFields.hospitalName = hospitalName;
      updateFields.slug = slugify(hospitalName);
    }
    if (ownerName !== undefined) updateFields.ownerName = ownerName;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (emergencyPhone !== undefined) updateFields.emergencyPhone = emergencyPhone;
    if (website !== undefined) updateFields.website = website;
    if (address !== undefined) updateFields.address = address;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (postalCode !== undefined) updateFields.postalCode = postalCode;
    if (country !== undefined) updateFields.country = country;
    if (hospitalType !== undefined) updateFields.hospitalType = hospitalType;
    if (licenseNumber !== undefined) updateFields.licenseNumber = licenseNumber;
    if (establishedYear !== undefined) updateFields.establishedYear = Number(establishedYear);
    if (totalDoctors !== undefined) updateFields.totalDoctors = Number(totalDoctors);
    if (totalBeds !== undefined) updateFields.totalBeds = Number(totalBeds);
    if (subscriptionPlan !== undefined) updateFields.subscriptionPlan = subscriptionPlan;

    if (subscriptionMonths !== undefined) {
      const months = Number(subscriptionMonths);
      updateFields.subscriptionMonths = months;
      updateFields.subscriptionAmount = months * 1000;
      updateFields.expiresAt = new Date(
        Date.now() + months * 30 * 24 * 60 * 60 * 1000
      );
    }

    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateFields.hospitalImage = buildImageUrl(req); // <-- fixed
    }

    updateFields.updatedAt = new Date();

    await hospitals.updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: updateFields }
    );

    const updatedHospital = await hospitals.findOne({
      _id: new ObjectId(req.user.id),
    });

    res.json({
      success: true,
      message: "Hospital profile updated successfully",
      hospital: updatedHospital,
    });
  } catch (err) {
    console.error("UPDATE MY HOSPITAL ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};