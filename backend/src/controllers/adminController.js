import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export const getStats = async (req, res) => {
  try {
    const db = getDB();

    // Fetch counts in parallel
    const [
      hospitalsCount,
      verifiedHospitalsCount,
      blockedHospitalsCount,
      doctorsCount,
      patientsCount,
      appointmentsCount,
      prescriptionsCount,
      hospitalsList,
      recentHospitals,
    ] = await Promise.all([
      db.collection("hospitals").countDocuments(),
      db.collection("hospitals").countDocuments({ isVerified: true }),
      db.collection("hospitals").countDocuments({ isBlocked: true }),
      db.collection("doctors").countDocuments(),
      db.collection("patients").countDocuments(),
      db.collection("appointments").countDocuments(),
      db.collection("prescriptions").countDocuments(),
      db.collection("hospitals").find({}, { projection: { subscriptionAmount: 1, subscriptionPlan: 1, subscriptionStatus: 1, expiresAt: 1 } }).toArray(),
      db.collection("hospitals").find().sort({ createdAt: -1 }).limit(5).toArray(),
    ]);

    // Calculate SaaS Revenue
    let totalRevenue = 0;
    const planDistribution = { Basic: 0, Pro: 0, Enterprise: 0, Free: 0, Other: 0 };
    let activeSubscriptions = 0;
    let expiringSoonCount = 0;
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    hospitalsList.forEach((h) => {
      totalRevenue += Number(h.subscriptionAmount || 0);

      const plan = h.subscriptionPlan || "Free";
      if (planDistribution[plan] !== undefined) {
        planDistribution[plan]++;
      } else {
        planDistribution.Other++;
      }

      if (h.subscriptionStatus === "active") {
        activeSubscriptions++;
      }

      if (h.expiresAt && new Date(h.expiresAt) > now && new Date(h.expiresAt) <= thirtyDaysFromNow) {
        expiringSoonCount++;
      }
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        hospitals: {
          total: hospitalsCount,
          verified: verifiedHospitalsCount,
          unverified: hospitalsCount - verifiedHospitalsCount,
          blocked: blockedHospitalsCount,
          activeSubscriptions,
          expiringSoon: expiringSoonCount,
        },
        doctors: doctorsCount,
        patients: patientsCount,
        appointments: appointmentsCount,
        prescriptions: prescriptionsCount,
        planDistribution,
        recentHospitals,
      },
    });
  } catch (err) {
    console.error("ADMIN GET STATS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 2. HOSPITALS MANAGEMENT
// ==========================================
export const getHospitals = async (req, res) => {
  try {
    const db = getDB();
    const { search, status, plan, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search && search.trim() !== "") {
      const s = search.trim();
      query.$or = [
        { hospitalName: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { city: { $regex: s, $options: "i" } },
        { licenseNumber: { $regex: s, $options: "i" } },
      ];
    }

    if (status) {
      if (status === "verified") query.isVerified = true;
      if (status === "unverified") query.isVerified = false;
      if (status === "blocked") query.isBlocked = true;
      if (status === "active") query.isBlocked = false;
    }

    if (plan && plan !== "all") {
      query.subscriptionPlan = { $regex: new RegExp(`^${plan}$`, "i") };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const totalCount = await db.collection("hospitals").countDocuments(query);
    const hospitals = await db
      .collection("hospitals")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    res.json({
      success: true,
      totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)) || 1,
      hospitals,
    });
  } catch (err) {
    console.error("ADMIN GET HOSPITALS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleVerifyHospital = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { isVerified } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid hospital ID" });
    }

    const target = await db.collection("hospitals").findOne({ _id: new ObjectId(id) });
    if (!target) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    const newStatus = typeof isVerified === "boolean" ? isVerified : !target.isVerified;

    await db.collection("hospitals").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isVerified: newStatus, updatedAt: new Date() } }
    );

    res.json({
      success: true,
      message: `Hospital ${newStatus ? "verified" : "unverified"} successfully`,
      isVerified: newStatus,
    });
  } catch (err) {
    console.error("ADMIN VERIFY HOSPITAL ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleBlockHospital = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid hospital ID" });
    }

    const target = await db.collection("hospitals").findOne({ _id: new ObjectId(id) });
    if (!target) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    const newStatus = typeof isBlocked === "boolean" ? isBlocked : !target.isBlocked;

    await db.collection("hospitals").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isBlocked: newStatus, updatedAt: new Date() } }
    );

    res.json({
      success: true,
      message: `Hospital ${newStatus ? "blocked" : "unblocked"} successfully`,
      isBlocked: newStatus,
    });
  } catch (err) {
    console.error("ADMIN BLOCK HOSPITAL ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateHospitalSubscription = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { subscriptionPlan, subscriptionMonths, subscriptionAmount } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid hospital ID" });
    }

    const months = Number(subscriptionMonths || 1);
    const amount = Number(subscriptionAmount || months * 1000);
    const expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

    const updateFields = {
      subscriptionPlan: subscriptionPlan || "Pro",
      subscriptionMonths: months,
      subscriptionAmount: amount,
      subscriptionStatus: "active",
      expiresAt,
      updatedAt: new Date(),
    };

    await db.collection("hospitals").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    res.json({
      success: true,
      message: "Hospital subscription updated successfully",
      subscription: updateFields,
    });
  } catch (err) {
    console.error("ADMIN UPDATE SUBSCRIPTION ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteHospital = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid hospital ID" });
    }

    const hospitalId = new ObjectId(id);

    // Delete hospital and cleanup related doctors/appointments
    await Promise.all([
      db.collection("hospitals").deleteOne({ _id: hospitalId }),
      db.collection("doctors").deleteMany({ hospitalId }),
      db.collection("appointments").deleteMany({ hospitalId }),
    ]);

    res.json({
      success: true,
      message: "Hospital tenant and associated records deleted",
    });
  } catch (err) {
    console.error("ADMIN DELETE HOSPITAL ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 3. CROSS-HOSPITAL DOCTORS MANAGEMENT
// ==========================================
export const getDoctors = async (req, res) => {
  try {
    const db = getDB();
    const { search, hospitalId, specialization, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search && search.trim() !== "") {
      const s = search.trim();
      query.$or = [
        { fullName: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { phone: { $regex: s, $options: "i" } },
        { department: { $regex: s, $options: "i" } },
      ];
    }

    if (hospitalId && ObjectId.isValid(hospitalId)) {
      query.hospitalId = new ObjectId(hospitalId);
    }

    if (specialization && specialization !== "all") {
      query.specialization = { $regex: new RegExp(`^${specialization}$`, "i") };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const totalCount = await db.collection("doctors").countDocuments(query);
    
    // Aggregation join to fetch hospital name for each doctor
    const doctors = await db.collection("doctors").aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "hospitals",
          localField: "hospitalId",
          foreignField: "_id",
          as: "hospital",
        },
      },
      {
        $unwind: {
          path: "$hospital",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          hospitalName: "$hospital.hospitalName",
          hospitalEmail: "$hospital.email",
          fullName: 1,
          email: 1,
          phone: 1,
          photo: 1,
          specialization: 1,
          designation: 1,
          department: 1,
          qualification: 1,
          experienceYears: 1,
          consultationFee: 1,
          medicalRegistrationNumber: 1,
          licenseNumber: 1,
          isVerified: 1,
          isActive: 1,
          createdAt: 1,
        },
      },
    ]).toArray();

    res.json({
      success: true,
      totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)) || 1,
      doctors,
    });
  } catch (err) {
    console.error("ADMIN GET DOCTORS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleVerifyDoctor = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { isVerified } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid doctor ID" });
    }

    const target = await db.collection("doctors").findOne({ _id: new ObjectId(id) });
    if (!target) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const newStatus = typeof isVerified === "boolean" ? isVerified : !target.isVerified;

    await db.collection("doctors").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isVerified: newStatus, updatedAt: new Date() } }
    );

    res.json({
      success: true,
      message: `Doctor license ${newStatus ? "verified" : "unverified"} successfully`,
      isVerified: newStatus,
    });
  } catch (err) {
    console.error("ADMIN VERIFY DOCTOR ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleBlockDoctor = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { isActive } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid doctor ID" });
    }

    const target = await db.collection("doctors").findOne({ _id: new ObjectId(id) });
    if (!target) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const newStatus = typeof isActive === "boolean" ? isActive : !target.isActive;

    await db.collection("doctors").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: newStatus, updatedAt: new Date() } }
    );

    res.json({
      success: true,
      message: `Doctor account ${newStatus ? "activated" : "deactivated"} successfully`,
      isActive: newStatus,
    });
  } catch (err) {
    console.error("ADMIN BLOCK DOCTOR ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 4. PATIENTS MANAGEMENT
// ==========================================
export const getPatients = async (req, res) => {
  try {
    const db = getDB();
    const { search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search && search.trim() !== "") {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { phone: { $regex: s, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const totalCount = await db.collection("patients").countDocuments(query);
    const patients = await db
      .collection("patients")
      .find(query, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    res.json({
      success: true,
      totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)) || 1,
      patients,
    });
  } catch (err) {
    console.error("ADMIN GET PATIENTS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid patient ID" });
    }

    const patientId = new ObjectId(id);

    const target = await db.collection("patients").findOne({ _id: patientId });
    if (!target) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Delete patient account completely from database
    await Promise.all([
      db.collection("patients").deleteOne({ _id: patientId }),
      db.collection("appointments").deleteMany({ patientId: patientId }),
    ]);

    res.json({
      success: true,
      message: "Patient account permanently removed from database",
    });
  } catch (err) {
    console.error("ADMIN DELETE PATIENT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 5. SYSTEM & INFRASTRUCTURE HEALTH
// ==========================================
export const getSystemHealth = async (req, res) => {
  try {
    const db = getDB();
    const startTime = Date.now();
    await db.command({ ping: 1 });
    const pingTimeMs = Date.now() - startTime;

    const memoryUsage = process.memoryUsage();

    res.json({
      success: true,
      health: {
        status: "ONLINE",
        database: {
          connected: true,
          pingMs: pingTimeMs,
        },
        server: {
          uptimeSeconds: Math.floor(process.uptime()),
          memory: {
            rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
            heapTotalMb: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
            heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
          },
          nodeVersion: process.version,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("ADMIN SYSTEM HEALTH ERROR:", err);
    res.status(500).json({
      success: false,
      health: {
        status: "DEGRADED",
        error: err.message,
      },
    });
  }
};

// ==========================================
// 6. REVENUE CALCULATOR BY DATE RANGE
// ==========================================
export const getRevenueByDateRange = async (req, res) => {
  try {
    const db = getDB();
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const hospitals = await db
      .collection("hospitals")
      .find(query, {
        projection: {
          hospitalName: 1,
          email: 1,
          ownerName: 1,
          city: 1,
          subscriptionPlan: 1,
          subscriptionAmount: 1,
          subscriptionMonths: 1,
          subscriptionStatus: 1,
          createdAt: 1,
          expiresAt: 1,
        },
      })
      .sort({ createdAt: -1 })
      .toArray();

    let filteredRevenue = 0;
    const planBreakdown = { Basic: 0, Pro: 0, Enterprise: 0, Other: 0 };

    hospitals.forEach((h) => {
      const amt = Number(h.subscriptionAmount || 0);
      filteredRevenue += amt;
      const plan = h.subscriptionPlan || "Basic";
      if (planBreakdown[plan] !== undefined) {
        planBreakdown[plan] += amt;
      } else {
        planBreakdown.Other += amt;
      }
    });

    res.json({
      success: true,
      startDate: startDate || null,
      endDate: endDate || null,
      totalCount: hospitals.length,
      filteredRevenue,
      planBreakdown,
      hospitals,
    });
  } catch (err) {
    console.error("ADMIN REVENUE CALCULATION ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

