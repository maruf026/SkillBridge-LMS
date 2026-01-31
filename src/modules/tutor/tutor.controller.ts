import type { Request, Response } from "express";
import { tutorServices } from "./tutor.service";
import type { AvailableDay} from "../../generated/prisma/enums";


const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const { bio, subject, categoryId, hourlyRate, availability } = req.body;

if (!categoryId && !subject) {
  return res.status(400).json({
    success: false,
    message: "Category is required",
  });
}


   
    if (!bio || !categoryId || !hourlyRate || !availability) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const result = await tutorServices.createTutorProfile({
      userId: user.id,
      bio,
      
      categoryId,
      hourlyRate,
      availability ,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    // duplicate profile (unique userId)
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Tutor profile already exists",
      });
    }

    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create tutor profile",
    });
  }
};

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await tutorServices.getAllTutors()

    return res.status(200).json({
      success: true,
      data: tutors
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tutors"
    })
  }
}


const getSingleTutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tutor id is required"
      })
    }

    const tutor = await tutorServices.getSingleTutor(id as string)

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found"
      })
    }

    return res.status(200).json({
      success: true,
      data: tutor
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tutor"
    })
  }
}


const updateTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const { bio, categoryId, hourlyRate, availability } = req.body;

    // prevent empty update
    if (!bio && !categoryId && !hourlyRate && !availability) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const updatedProfile = await tutorServices.updateTutorProfile(
      user.id,
      {
        bio,
        categoryId,
        hourlyRate,
        availability: availability
          ? (availability as AvailableDay)
          : undefined,
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedProfile,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tutor profile",
    });
  }
};


const deleteTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const deletedProfile = await tutorServices.deleteTutorProfile(user.id);

    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tutor profile deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete tutor profile",
    });
  }
};

export const tutorController = {
  createTutorProfile,
  getAllTutors,
  getSingleTutor,
  updateTutorProfile,
  deleteTutorProfile
};
