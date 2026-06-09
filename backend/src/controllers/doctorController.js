import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// // 🔥 SAFE HELPER
// const safeString = (v) => (v && v !== "undefined" ? v : "");
// const safeNumber = (v) => (v && !isNaN(v) ? Number(v) : 0);

// const toArray = (value) => {
//   if (!value) return [];
//   if (Array.isArray(value)) return value;
//   return String(value).split(",").map(v => v.trim());
// };

// ===============================
// CREATE DOCTOR
// ===============================

// export const createDoctor = async (req, res) => {
//   try {
//     const db = getDB();

//     console.log("🔥 BODY:", req.body);
//     console.log("📸 FILE:", req.file);

//     // =========================
//     // SAFE HELPERS
//     // =========================
//     const safeString = (v) => (v && v !== "undefined" ? v : "");
//     const safeNumber = (v) => (v && !isNaN(v) ? Number(v) : 0);

//     let hospitalId = null;

//     if (
//       req.body.hospitalId &&
//       req.body.hospitalId !== "undefined" &&
//       ObjectId.isValid(req.body.hospitalId)
//     ) {
//       hospitalId = new ObjectId(req.body.hospitalId);
//     }



//     const doctor = {
//       hospitalId,

//       fullName: safeString(req.body.fullName),

//       photo: req.file ? `/uploads/${req.file.filename}` : "",

//       email: safeString(req.body.email),
//       password: safeString(req.body.password),
//       phone: safeString(req.body.phone),
//       gender: safeString(req.body.gender),
//       dateOfBirth: safeString(req.body.dateOfBirth),

//       bloodGroup: safeString(req.body.bloodGroup),
//       address: safeString(req.body.address),
//       nidNumber: safeString(req.body.nidNumber),

//       specialization: safeString(req.body.specialization),
//       designation: safeString(req.body.designation),
//       department: safeString(req.body.department),

//       qualification: safeString(req.body.qualification),

//       experienceYears: safeNumber(req.body.experienceYears),

//       medicalRegistrationNumber: safeString(req.body.medicalRegistrationNumber),
//       licenseNumber: safeString(req.body.licenseNumber),

//       consultationFee: safeNumber(req.body.consultationFee),

//       availableDays: toArray(req.body.availableDays),
//       startTime: safeString(req.body.startTime),
//       endTime: safeString(req.body.endTime),

//       maxPatientsPerDay: safeNumber(req.body.maxPatientsPerDay),

//       bio: safeString(req.body.bio),
//       languages: toArray(req.body.languages),

//       totalPatients: 0,
//       totalAppointments: 0,
//       rating: 5,
//       reviewsCount: 0,

//       isActive: true,
//       isVerified: false,
//       role: "doctor",

//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await db.collection("doctors").insertOne(doctor);

//     res.status(201).json({
//       success: true,
//       id: result.insertedId,
//     });
//   } catch (err) {
//     console.error("❌ CREATE DOCTOR ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// export const createDoctor = async (req, res) => {
//   try {
//     const db = getDB();

//     let hospitalId = null;

//     if (
//       req.body.hospitalId &&
//       ObjectId.isValid(req.body.hospitalId)
//     ) {
//       hospitalId = new ObjectId(req.body.hospitalId);
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or missing hospitalId",
//       });
//     }
//     const doctor = {
//       hospitalId, // 🔥 IMPORTANT

//       fullName: safeString(req.body.fullName),
//       photo: req.file ? `/uploads/${req.file.filename}` : "",

//       email: safeString(req.body.email),
//       password: safeString(req.body.password),
//       phone: safeString(req.body.phone),
//       gender: safeString(req.body.gender),
//       dateOfBirth: safeString(req.body.dateOfBirth),

//       bloodGroup: safeString(req.body.bloodGroup),
//       address: safeString(req.body.address),
//       nidNumber: safeString(req.body.nidNumber),

//       specialization: safeString(req.body.specialization),
//       designation: safeString(req.body.designation),
//       department: safeString(req.body.department),

//       qualification: safeString(req.body.qualification),
//       experienceYears: safeNumber(req.body.experienceYears),

//       medicalRegistrationNumber: safeString(req.body.medicalRegistrationNumber),
//       licenseNumber: safeString(req.body.licenseNumber),

//       consultationFee: safeNumber(req.body.consultationFee),

//       availableDays: toArray(req.body.availableDays),
//       startTime: safeString(req.body.startTime),
//       endTime: safeString(req.body.endTime),

//       maxPatientsPerDay: safeNumber(req.body.maxPatientsPerDay),

//       bio: safeString(req.body.bio),
//       languages: toArray(req.body.languages),

//       totalPatients: 0,
//       totalAppointments: 0,
//       rating: 5,
//       reviewsCount: 0,

//       isActive: true,
//       isVerified: false,
//       role: "doctor",

//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await db.collection("doctors").insertOne(doctor);

//     res.status(201).json({
//       success: true,
//       id: result.insertedId,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const safeString = (v) => (v ? String(v).trim() : "");

const safeNumber = (v) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

export const createDoctor = async (req, res) => {
  try {
    const db = getDB();

    console.log("BODY =", req.body);

    const { hospitalId } = req.body;

    if (!hospitalId || !ObjectId.isValid(hospitalId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing hospitalId",
      });
    }

    const doctor = {
      hospitalId: new ObjectId(hospitalId),

      fullName: safeString(req.body.fullName),

      // photo: req.file
      //   ? `/uploads/${req.file.filename}`
      //   : "",

      photo: req.file ? `/uploads/${req.file.filename}` : "",

      email: safeString(req.body.email),
      password: safeString(req.body.password),
      phone: safeString(req.body.phone),
      gender: safeString(req.body.gender),
      dateOfBirth: safeString(req.body.dateOfBirth),

      bloodGroup: safeString(req.body.bloodGroup),
      address: safeString(req.body.address),
      nidNumber: safeString(req.body.nidNumber),

      specialization: safeString(req.body.specialization),
      designation: safeString(req.body.designation),
      department: safeString(req.body.department),

      qualification: safeString(req.body.qualification),

      experienceYears: safeNumber(
        req.body.experienceYears
      ),

      medicalRegistrationNumber: safeString(
        req.body.medicalRegistrationNumber
      ),

      licenseNumber: safeString(
        req.body.licenseNumber
      ),

      consultationFee: safeNumber(
        req.body.consultationFee
      ),

      availableDays: toArray(
        req.body.availableDays
      ),

      startTime: safeString(req.body.startTime),
      endTime: safeString(req.body.endTime),

      maxPatientsPerDay: safeNumber(
        req.body.maxPatientsPerDay
      ),

      bio: safeString(req.body.bio),

      languages: toArray(
        req.body.languages
      ),

      totalPatients: 0,
      totalAppointments: 0,
      rating: 5,
      reviewsCount: 0,

      isActive: true,
      isVerified: false,
      role: "doctor",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("doctors")
      .insertOne(doctor);

    res.status(201).json({
      success: true,
      doctorId: result.insertedId,
    });
  } catch (err) {
    console.error("CREATE DOCTOR ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ===============================
// GET ALL DOCTORS
// ===============================
export const getDoctors = async (req, res) => {
  try {
    const db = getDB();

    const doctors = await db.collection("doctors").find().toArray();

    res.json({ success: true, doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET DOCTOR BY ID
// ===============================
export const getDoctorById = async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const doctor = await db.collection("doctors").findOne({
      _id: new ObjectId(req.params.id),
    });

    res.json({ success: true, doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// UPDATE DOCTOR (FIXED IMAGE)
// ===============================
// export const updateDoctor = async (req, res) => {
//   try {
//     const db = getDB();

//     const { _id, ...rest } = req.body;

//     const updateData = {
//       ...rest,
//       updatedAt: new Date(),
//     };

//     // ✅ IMAGE UPDATE FIX
//     if (req.file) {
//       updateData.photo = `/uploads/${req.file.filename}`;
//     }

//     await db.collection("doctors").updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: updateData }
//     );

//     res.json({
//       success: true,
//       message: "Updated",
//     });
//   } catch (err) {
//     console.error("UPDATE ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export const updateDoctor = async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Doctor ID",
      });
    }

    const doctor = await db.collection("doctors").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      bloodGroup: req.body.bloodGroup,
      address: req.body.address,
      nidNumber: req.body.nidNumber,
      specialization: req.body.specialization,
      designation: req.body.designation,
      department: req.body.department,
      qualification: req.body.qualification,
      experienceYears: Number(req.body.experienceYears || 0),
      medicalRegistrationNumber:
        req.body.medicalRegistrationNumber,
      licenseNumber: req.body.licenseNumber,
      consultationFee: Number(req.body.consultationFee || 0),
      availableDays: req.body.availableDays
        ? req.body.availableDays.split(",")
        : [],
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      maxPatientsPerDay: Number(
        req.body.maxPatientsPerDay || 0
      ),
      bio: req.body.bio,
      languages: req.body.languages
        ? req.body.languages.split(",")
        : [],
      updatedAt: new Date(),
    };

    // 🔥 hospitalId change korbe na
    updateData.hospitalId = doctor.hospitalId;

    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    await db.collection("doctors").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    res.json({
      success: true,
      message: "Doctor updated successfully",
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ===============================
// DELETE DOCTOR
// ===============================
export const deleteDoctor = async (req, res) => {
  try {
    const db = getDB();

    await db.collection("doctors").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.json({
      success: true,
      message: "Deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getDoctorsByHospital = async (req, res) => {
  try {
    const db = getDB();

    const { hospitalId } = req.params;

    if (!ObjectId.isValid(hospitalId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Hospital ID",
      });
    }

    const doctors = await db
      .collection("doctors")
      .find({
        hospitalId: new ObjectId(hospitalId),
      })
      .toArray();

    res.json({
      success: true,
      doctors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMyDoctors = async (req, res) => {
  try {
    const db = getDB();

    const hospitalId = req.user.id;

    console.log("LOGGED HOSPITAL =", hospitalId);

    const doctors = await db
      .collection("doctors")
      .find({
        hospitalId: new ObjectId(hospitalId),
      })
      .toArray();

    console.log("FOUND DOCTORS COUNT =", doctors.length);

    res.json({
      success: true,
      doctors,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const db = getDB();
    // authMiddleware থেকে আসা ইউজারের আইডি
    const doctorId = req.user.id; 

    const doctor = await db.collection("doctors").findOne({
      _id: new ObjectId(doctorId),
    });

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// ৩. প্রোফাইল আপডেট (প্রফেশনাল সিকিউরিটি সহ)
export const updateDoctorProfile = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    // যে ফিল্ডগুলো ডাক্তার এডিট করতে পারবে
    const updateData = {
      consultationFee: Number(req.body.consultationFee),
      experienceYears: Number(req.body.experienceYears),
      phone: req.body.phone,
      address: req.body.address,
      bio: req.body.bio,
      availableDays: Array.isArray(req.body.availableDays) ? req.body.availableDays : req.body.availableDays?.split(",").map(i => i.trim()),
      languages: Array.isArray(req.body.languages) ? req.body.languages : req.body.languages?.split(",").map(i => i.trim()),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      updatedAt: new Date()
    };

    const result = await db.collection("doctors").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) return res.status(404).json({ message: "Doctor not found" });

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const getDoctorsFiltered = async (req, res) => {
  try {
    const db = getDB();

    const { hospitalId } = req.params;
    const { specialization, search, sortBy } = req.query;

    if (!ObjectId.isValid(hospitalId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Hospital ID",
      });
    }

    const query = {
      hospitalId: new ObjectId(hospitalId),
    };

    // Specialization Filter
    if (
      specialization &&
      specialization !== "all" &&
      specialization.trim() !== ""
    ) {
      query.specialization = specialization.trim();
    }

    // Search By Name
    if (search && search.trim() !== "") {
      query.fullName = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Sorting
    let sortCriteria = { createdAt: -1 };

    switch (sortBy) {
      case "fee-low":
        sortCriteria = { consultationFee: 1 };
        break;

      case "fee-high":
        sortCriteria = { consultationFee: -1 };
        break;

      case "exp":
        sortCriteria = { experienceYears: -1 };
        break;

      case "rating":
        sortCriteria = { rating: -1 };
        break;

      default:
        sortCriteria = { createdAt: -1 };
    }

    console.log("FILTER QUERY =", query);
    console.log("SORT =", sortCriteria);

    const doctors = await db
      .collection("doctors")
      .find(query)
      .sort(sortCriteria)
      .toArray();

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (err) {
    console.error("GET FILTERED DOCTORS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getHospitalSpecializations = async (req, res) => {
  try {
    const db = getDB();

    const { hospitalId } = req.params;

    if (!ObjectId.isValid(hospitalId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Hospital ID",
      });
    }

    const specializations = await db
      .collection("doctors")
      .distinct("specialization", {
        hospitalId: new ObjectId(hospitalId),
        specialization: {
          $exists: true,
          $ne: "",
        },
      });

    const cleanedSpecializations = specializations
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      count: cleanedSpecializations.length,
      specializations: cleanedSpecializations,
    });
  } catch (err) {
    console.error("GET SPECIALIZATION ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};