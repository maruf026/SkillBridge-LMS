// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import "process";
import * as path from "path";
import { fileURLToPath } from "url";
import "@prisma/client/runtime/client";

// src/generated/prisma/enums.ts
var BookingStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED"
};

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  id     String @id @default(uuid())\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id])\n\n  bio        String\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  hourlyRate   Int\n  availability Json\n  isVerified   Boolean @default(false)\n\n  reviews Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Category {\n  id        String         @id @default(uuid())\n  name      String         @unique\n  createdAt DateTime       @default(now())\n  tutors    TutorProfile[]\n}\n\nmodel Booking {\n  id        String        @id @default(uuid())\n  studentId String\n  tutorId   String\n  status    BookingStatus @default(PENDING)\n  date      DateTime\n  createdAt DateTime      @default(now())\n\n  // relations\n  student User @relation("StudentBookings", fields: [studentId], references: [id])\n  tutor   User @relation("TutorBookings", fields: [tutorId], references: [id])\n}\n\nmodel Review {\n  id      String @id @default(uuid())\n  rating  Int\n  comment String\n\n  tutorId String\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id])\n\n  studentId String\n  student   User   @relation("StudentReviews", fields: [studentId], references: [id])\n\n  createdAt DateTime @default(now())\n}\n\nenum BookingStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nmodel User {\n  id            String   @id\n  name          String\n  email         String   @unique\n  emailVerified Boolean  @default(false)\n  image         String?\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  role     Role    @default(STUDENT)\n  isBanned Boolean @default(false)\n\n  sessions Session[]\n  accounts Account[]\n\n  tutorProfile TutorProfile?\n\n  studentBookings Booking[] @relation("StudentBookings")\n  tutorBookings   Booking[] @relation("TutorBookings")\n\n  reviewsGiven Review[] @relation("StudentReviews")\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorProfile"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"availability","kind":"scalar","type":"Json"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutors","kind":"object","type":"TutorProfile","relationName":"CategoryToTutorProfile"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"User","relationName":"TutorBookings"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentReviews"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"tutorBookings","kind":"object","type":"Booking","relationName":"TutorBookings"},{"name":"reviewsGiven","kind":"object","type":"Review","relationName":"StudentReviews"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [
    process.env.APP_URL
  ],
  cookies: {
    sessionToken: {
      path: "/"
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true
  }
});

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/middleweres/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      const userFromDb = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          isBanned: true,
          role: true,
          email: true,
          name: true
        }
      });
      if (!userFromDb) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }
      if (userFromDb.isBanned) {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned"
        });
      }
      req.user = {
        id: session.user.id,
        email: userFromDb.email,
        name: userFromDb.name,
        role: userFromDb.role
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission"
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
var auth_default = auth2;

// src/modules/auth/auth.route.ts
var router = Router();
router.get("/me", auth_default(), (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});
var authRouter = router;

// src/modules/tutor/tutor.route.ts
import { Router as Router2 } from "express";

// src/modules/tutor/tutor.service.ts
var createTutorProfile = async (data) => {
  return prisma.tutorProfile.create({
    data: {
      userId: data.userId,
      bio: data.bio,
      categoryId: data.categoryId,
      hourlyRate: data.hourlyRate,
      availability: data.availability
    }
  });
};
var getAllTutors = async () => {
  const tutors = await prisma.tutorProfile.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          name: true
        }
      },
      category: true,
      reviews: {
        select: {
          rating: true
        }
      }
    }
  });
  return tutors.map((tutor) => {
    const ratings = tutor.reviews.map((r) => r.rating);
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
    return {
      id: tutor.id,
      userId: tutor.userId,
      name: tutor.user.name,
      bio: tutor.bio,
      hourlyRate: tutor.hourlyRate,
      availability: tutor.availability,
      category: tutor.category,
      avgRating,
      totalReviews: ratings.length,
      createdAt: tutor.createdAt
    };
  });
};
var getSingleTutor = async (id) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true }
      },
      category: true
    }
  });
  if (!tutor) return null;
  return {
    id: tutor.id,
    // ✅ TutorProfile.id
    userId: tutor.userId,
    // User.id
    name: tutor.user.name,
    bio: tutor.bio,
    hourlyRate: tutor.hourlyRate,
    availability: tutor.availability,
    category: tutor.category
  };
};
var updateTutorProfile = async (userId, input) => {
  const data = {};
  if (input.bio !== void 0) {
    data.bio = input.bio;
  }
  if (input.categoryId !== void 0) {
    data.categoryId = input.categoryId;
  }
  if (input.hourlyRate !== void 0) {
    data.hourlyRate = input.hourlyRate;
  }
  if (input.availability !== void 0) {
    data.availability = input.availability;
  }
  return prisma.tutorProfile.update({
    where: { userId },
    data
  });
};
var deleteTutorProfile = async (userId) => {
  const existingProfile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!existingProfile) {
    return null;
  }
  return prisma.tutorProfile.delete({
    where: { userId }
  });
};
var tutorServices = {
  createTutorProfile,
  getAllTutors,
  getSingleTutor,
  updateTutorProfile,
  deleteTutorProfile
};

// src/modules/tutor/tutor.controller.ts
var createTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    const { bio, categoryName, hourlyRate, availability } = req.body;
    if (!bio || !categoryName || !hourlyRate || !availability) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    if (typeof availability !== "object" || Array.isArray(availability) || Object.keys(availability).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability format"
      });
    }
    const category = await prisma.category.findFirst({
      where: {
        name: {
          equals: categoryName,
          mode: "insensitive"
        }
      }
    });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid category name"
      });
    }
    const result = await tutorServices.createTutorProfile({
      userId: user.id,
      bio,
      categoryId: category.id,
      // ✅ FIX
      hourlyRate,
      availability
    });
    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Tutor profile already exists"
      });
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create tutor profile"
    });
  }
};
var getAllTutors2 = async (req, res) => {
  try {
    const tutors = await tutorServices.getAllTutors();
    return res.status(200).json({
      success: true,
      data: tutors
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tutors"
    });
  }
};
var getSingleTutor2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tutor id is required"
      });
    }
    const tutor = await tutorServices.getSingleTutor(id);
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tutor"
    });
  }
};
var updateTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    const { bio, categoryId, hourlyRate, availability } = req.body;
    if (!bio && !categoryId && !hourlyRate && !availability) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update"
      });
    }
    const updatedProfile = await tutorServices.updateTutorProfile(
      user.id,
      {
        bio,
        categoryId,
        hourlyRate,
        availability: availability ? availability : void 0
      }
    );
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tutor profile"
    });
  }
};
var deleteTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    const deletedProfile = await tutorServices.deleteTutorProfile(user.id);
    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Tutor profile deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete tutor profile"
    });
  }
};
var tutorController = {
  createTutorProfile: createTutorProfile2,
  getAllTutors: getAllTutors2,
  getSingleTutor: getSingleTutor2,
  updateTutorProfile: updateTutorProfile2,
  deleteTutorProfile: deleteTutorProfile2
};

// src/modules/tutor/tutor.route.ts
var router2 = Router2();
router2.post("/profile", auth_default("TUTOR" /* TUTOR */), tutorController.createTutorProfile);
router2.get("/", tutorController.getAllTutors);
router2.get(
  "/profile/me",
  auth_default("TUTOR" /* TUTOR */),
  async (req, res) => {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: req.user.id }
    });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    res.status(200).json({
      success: true,
      data: profile
    });
  }
);
router2.get("/:id", tutorController.getSingleTutor);
router2.put("/profile", auth_default("TUTOR" /* TUTOR */), tutorController.updateTutorProfile);
router2.delete("/profile", auth_default("TUTOR" /* TUTOR */), tutorController.deleteTutorProfile);
var tutorRouter = router2;

// src/modules/booking/booking.route.ts
import { Router as Router3 } from "express";

// src/modules/booking/booking.service.ts
var createBooking = async (data) => {
  return prisma.booking.create({
    data: {
      studentId: data.studentId,
      tutorId: data.tutorId,
      date: data.date
    }
  });
};
var getStudentBookings = async (studentId) => {
  return prisma.booking.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: {
      tutor: { select: { name: true } }
    }
  });
};
var getTutorBookings = async (tutorId) => {
  return prisma.booking.findMany({
    where: { tutorId },
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { name: true } }
    }
  });
};
var getSingleBooking = async (bookingId, user) => {
  return prisma.booking.findFirst({
    where: {
      id: bookingId,
      OR: [
        { studentId: user.id },
        { tutorId: user.id }
      ]
    },
    include: {
      tutor: {
        select: { name: true }
      }
    }
  });
};
var updateBookingStatus = async (bookingId, tutorId, status) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking || booking.tutorId !== tutorId) {
    return null;
  }
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  });
};
var bookingServices = {
  createBooking,
  getStudentBookings,
  getTutorBookings,
  updateBookingStatus,
  getSingleBooking
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res) => {
  try {
    const user = req.user;
    const { tutorId, date } = req.body;
    if (!tutorId || !date) {
      return res.status(400).json({
        success: false,
        message: "Tutor id and date are required"
      });
    }
    const booking = await bookingServices.createBooking({
      studentId: user.id,
      tutorId,
      date: new Date(date)
    });
    return res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking"
    });
  }
};
var getStudentBookings2 = async (req, res) => {
  try {
    const user = req.user;
    const bookings = await bookingServices.getStudentBookings(user.id);
    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};
var getTutorBookings2 = async (req, res) => {
  try {
    const user = req.user;
    const bookings = await bookingServices.getTutorBookings(user.id);
    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};
var getSingleBooking2 = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const booking = await bookingServices.getSingleBooking(id, user);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking"
    });
  }
};
var updateBookingStatus2 = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;
    if (!Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status"
      });
    }
    const updated = await bookingServices.updateBookingStatus(
      id,
      user.id,
      status
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or unauthorized"
      });
    }
    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update booking status"
    });
  }
};
var bookingController = {
  createBooking: createBooking2,
  getStudentBookings: getStudentBookings2,
  getTutorBookings: getTutorBookings2,
  updateBookingStatus: updateBookingStatus2,
  getSingleBooking: getSingleBooking2
};

// src/modules/booking/booking.route.ts
var router3 = Router3();
router3.post("/", auth_default("STUDENT" /* STUDENT */), bookingController.createBooking);
router3.get(
  "/student",
  auth_default("STUDENT" /* STUDENT */),
  bookingController.getStudentBookings
);
router3.get("/:id", auth_default(), bookingController.getSingleBooking);
router3.get("/tutor", auth_default("TUTOR" /* TUTOR */), bookingController.getTutorBookings);
router3.patch(
  "/:id/status",
  auth_default("TUTOR" /* TUTOR */),
  bookingController.updateBookingStatus
);
var bookingRouter = router3;

// src/modules/review/review.routes.ts
import { Router as Router4 } from "express";

// src/modules/review/review.service.ts
var createReview = async (studentId, tutorUserId, rating, comment) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: tutorUserId }
  });
  if (!tutorProfile) return null;
  return prisma.review.create({
    data: {
      studentId,
      tutorId: tutorProfile.id,
      rating,
      comment
    }
  });
};
var getTutorReviews = async (tutorId) => {
  return prisma.review.findMany({
    where: { tutorId },
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        select: {
          name: true
        }
      }
    }
  });
};
var reviewServices = {
  createReview,
  getTutorReviews
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const user = req.user;
    const { tutorId, rating, comment } = req.body;
    if (!tutorId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: tutorId }
    });
    if (!tutorProfile) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found"
      });
    }
    const review = await prisma.review.create({
      data: {
        studentId: user.id,
        tutorId: tutorProfile.id,
        // ✅ CORRECT ID
        rating: Number(rating),
        comment
      }
    });
    return res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error("REVIEW ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit review"
    });
  }
};
var getTutorReviews2 = async (req, res) => {
  try {
    const { tutorId } = req.params;
    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: "Tutor id is required"
      });
    }
    const reviews = await reviewServices.getTutorReviews(tutorId);
    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
};
var reviewController = {
  createReview: createReview2,
  getTutorReviews: getTutorReviews2
};

// src/modules/review/review.routes.ts
var router4 = Router4();
router4.post("/", auth_default("STUDENT" /* STUDENT */), reviewController.createReview);
router4.get("/tutor/:tutorId", reviewController.getTutorReviews);
var reviewRouter = router4;

// src/modules/admin/admin.routes.ts
import { Router as Router5 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true
    }
  });
};
var banOrUnbanUser = async (id, isBanned) => {
  return prisma.user.update({
    where: { id },
    data: { isBanned }
  });
};
var getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      tutor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};
var createCategory = async (name) => {
  return prisma.category.create({
    data: { name }
  });
};
var getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id }
  });
};
var adminServices = {
  getAllUsers,
  banOrUnbanUser,
  getAllBookings,
  createCategory,
  getAllCategories,
  deleteCategory
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (_req, res) => {
  try {
    const users = await adminServices.getAllUsers();
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};
var banOrUnbanUser2 = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { isBanned: true }
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isBanned: !user.isBanned }
    });
    return res.status(200).json({
      success: true,
      message: updatedUser.isBanned ? "User banned successfully" : "User unbanned successfully"
    });
  } catch (error) {
    console.error("BAN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status"
    });
  }
};
var getAllBookings2 = async (_req, res) => {
  try {
    const bookings = await adminServices.getAllBookings();
    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};
var createCategory2 = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }
    const category = await adminServices.createCategory(name);
    return res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create category"
    });
  }
};
var getAllCategories2 = async (_req, res) => {
  try {
    const categories = await adminServices.getAllCategories();
    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    await adminServices.deleteCategory(id);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category"
    });
  }
};
var adminController = {
  getAllUsers: getAllUsers2,
  banOrUnbanUser: banOrUnbanUser2,
  getAllBookings: getAllBookings2,
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  deleteCategory: deleteCategory2
};

// src/modules/admin/admin.routes.ts
var router5 = Router5();
router5.get(
  "/users",
  auth_default("ADMIN" /* ADMIN */),
  adminController.getAllUsers
);
router5.patch(
  "/users/:id/ban",
  auth_default("ADMIN" /* ADMIN */),
  adminController.banOrUnbanUser
);
router5.get(
  "/bookings",
  auth_default("ADMIN" /* ADMIN */),
  adminController.getAllBookings
);
router5.post(
  "/categories",
  auth_default("ADMIN" /* ADMIN */),
  adminController.createCategory
);
router5.get(
  "/categories",
  auth_default("ADMIN" /* ADMIN */),
  adminController.getAllCategories
);
router5.delete(
  "/categories/:id",
  auth_default("ADMIN" /* ADMIN */),
  adminController.deleteCategory
);
var adminRouter = router5;

// src/app.ts
var app = express();
app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/tutors", tutorRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("SkillBridge server is running successfully");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
