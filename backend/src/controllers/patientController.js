// import { ObjectId } from "mongodb";
// import bcrypt from "bcryptjs";
// import { getDB } from "../config/db.js";

// export const registerPatient = async (req, res) => {
//   try {
//     const db = getDB();
//     const patients = db.collection("patients");

//     const {
//       name,
//       email,
//       phone,
//       password,
//       gender,
//       dateOfBirth,
//       address,
//       bloodGroup,
//       allergies,
//       medicalHistory,
//       emergencyName,
//       emergencyPhone,
//       emergencyRelation,
//     } = req.body;

//     // ✅ validation
//     if (!name || !email || !phone || !password) {
//       return res.status(400).json({ message: "Required fields missing" });
//     }

//     const exists = await patients.findOne({ email });
//     if (exists) {
//       return res.status(409).json({ message: "Patient already exists" });
//     }

//     const hash = await bcrypt.hash(password, 10);

//     const newPatient = {
//       name,
//       email,
//       phone,
//       password: hash,
//       role: "patient",

//       profile: {
//         gender,
//         dateOfBirth,
//         address,
//         profileImage: "",
//       },

//       medical: {
//         bloodGroup,
//         allergies: allergies ? allergies.split(",").map(a => a.trim()) : [],
//         medicalHistory: medicalHistory ? medicalHistory.split(",").map(m => m.trim()) : [],
//       },

//       emergencyContact: {
//         name: emergencyName,
//         phone: emergencyPhone,
//         relation: emergencyRelation,
//       },

//       isBlocked: false,
//       isVerified: false,
//       createdAt: new Date(),
//     };

//     await patients.insertOne(newPatient);

//     return res.status(201).json({
//       message: "Patient registered successfully",
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const getMyProfile = async (req, res) => {
//   try {
//     const db = getDB();
//     const userId = req.user?.id;

//     // MongoDB এর ObjectId ফরম্যাটে আইডি কনভার্ট করা
//     const patient = await db.collection("patients").findOne(
//       { _id: new ObjectId(userId) },
//       { projection: { password: 0 } }
//     );

//     if (!patient) {
//       return res.status(404).json({ success: false, message: "Patient not found" });
//     }

//     res.json({ success: true, patient });
//   } catch (err) {
//     console.error("DEBUG ERROR:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDB } from "../config/db.js";

export const registerPatient = async (req, res) => {
  try {
    const db = getDB();
    const patients = db.collection("patients");

    const {
      name,
      email,
      phone,
      password,
      gender,
      dateOfBirth,
      address,
      bloodGroup,
      allergies,
      medicalHistory,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
    } = req.body;

    // ✅ validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await patients.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Patient already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newPatient = {
      name,
      email,
      phone,
      password: hash,
      role: "patient",

      profile: {
        gender,
        dateOfBirth,
        address,
        profileImage: "",
      },

      medical: {
        bloodGroup,
        allergies: allergies ? allergies.split(",").map(a => a.trim()) : [],
        medicalHistory: medicalHistory ? medicalHistory.split(",").map(m => m.trim()) : [],
      },

      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relation: emergencyRelation,
      },

      isBlocked: false,
      isVerified: false,
      createdAt: new Date(),
    };

    await patients.insertOne(newPatient);

    return res.status(201).json({
      message: "Patient registered successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user?.id;

    // MongoDB এর ObjectId ফরম্যাটে আইডি কনভার্ট করা
    const patient = await db.collection("patients").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, patient });
  } catch (err) {
    console.error("DEBUG ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ নতুন: প্রোফাইল আপডেট করার জন্য
export const updateMyProfile = async (req, res) => {
  try {
    const db = getDB();
    const patients = db.collection("patients");
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const existing = await patients.findOne({ _id: new ObjectId(userId) });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const {
      name,
      phone,
      gender,
      dateOfBirth,
      address,
      bloodGroup,
      allergies,
      medicalHistory,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
    } = req.body;

    // ✅ শুধু যেসব ফিল্ড পাঠানো হয়েছে সেগুলোই আপডেট হবে (email/password এখানে ইচ্ছাকৃতভাবে বাদ)
    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;

    if (gender !== undefined) updateFields["profile.gender"] = gender;
    if (dateOfBirth !== undefined) updateFields["profile.dateOfBirth"] = dateOfBirth;
    if (address !== undefined) updateFields["profile.address"] = address;

    if (bloodGroup !== undefined) updateFields["medical.bloodGroup"] = bloodGroup;

    if (allergies !== undefined) {
      updateFields["medical.allergies"] =
        typeof allergies === "string"
          ? allergies.split(",").map((a) => a.trim()).filter(Boolean)
          : allergies;
    }

    if (medicalHistory !== undefined) {
      updateFields["medical.medicalHistory"] =
        typeof medicalHistory === "string"
          ? medicalHistory.split(",").map((m) => m.trim()).filter(Boolean)
          : medicalHistory;
    }

    if (emergencyName !== undefined) updateFields["emergencyContact.name"] = emergencyName;
    if (emergencyPhone !== undefined) updateFields["emergencyContact.phone"] = emergencyPhone;
    if (emergencyRelation !== undefined) updateFields["emergencyContact.relation"] = emergencyRelation;

    updateFields.updatedAt = new Date();

    await patients.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    const updatedPatient = await patients.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      patient: updatedPatient,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};