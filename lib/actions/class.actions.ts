"use server";

import dbConnect from "../mongodb";
// Assuming the model is correctly imported from '../models/Class'
// based on standard naming convention, but we'll use 'class' for now
// to match the previous context, ensuring it resolves to the model in `class.ts`.
import Classes from "../models/class";
import { revalidatePath } from "next/cache";

// --- Utility Function for Serialization ---
// Mongoose documents/ObjectIds are not valid in client components.
// This function converts the document to a plain, serializable object.
export async function serializeDocument(doc: any) {
  if (!doc) return null;
  const plainObject = doc.toObject ? doc.toObject() : doc;

  // Convert ObjectId and Date objects to strings
  const serialized = {
    ...plainObject,
    _id: plainObject._id ? plainObject._id.toString() : undefined,
    createdAt: plainObject.createdAt
      ? plainObject.createdAt.toISOString()
      : undefined,
    updatedAt: plainObject.updatedAt
      ? plainObject.updatedAt.toISOString()
      : undefined,
  };

  // Clean up internal Mongoose fields like __v
  delete serialized.__v;
  return serialized;
}

// --- CRUD Operations ---

/**
 * READ: Fetches all active classes.
 * @returns A promise that resolves to an array of serializable class objects or an empty array on error.
 */
export async function getClassInfo() {
  await dbConnect();
  try {
    // Fetch all classes that are marked as active
    const availableClasses = await Classes.find({
      /* isActive: true */
    }).lean();

    // Return the serialized array
    return availableClasses.map(serializeDocument);
  } catch (error) {
    console.error("Error fetching class information:", error);
    return [];
  }
}

/**
 * READ: Fetches a single class by its ID.
 * @param classId The MongoDB ObjectId string of the class.
 * @returns A promise that resolves to a serializable class object or null.
 */
export async function getClassById(classId: string) {
  await dbConnect();
  try {
    const classDoc = await Classes.findById(classId).lean();
    return serializeDocument(classDoc);
  } catch (error) {
    console.error(`Error fetching class with ID ${classId}:`, error);
    return null;
  }
}

/**
 * CREATE: Creates a new class document.
 * @param classData Object containing the fields for the new class (e.g., classId, title, etc.).
 * @returns A promise that resolves to the newly created serializable class object.
 */
export async function createClass(classData: any) {
  await dbConnect();
  try {
    const newClass = await Classes.create(classData);
    // Revalidate the path that displays the list of classes to show the new one immediately
    revalidatePath("/classes");
    return serializeDocument(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    throw new Error(
      `Failed to create class: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * UPDATE: Updates an existing class document.
 * @param classId The MongoDB ObjectId string of the class to update.
 * @param updateData Object containing fields to update.
 * @returns A promise that resolves to the updated serializable class object or null if not found.
 */
export async function updateClass(classId: string, updateData: any) {
  await dbConnect();
  try {
    const updatedClass = await Classes.findByIdAndUpdate(
      classId,
      updateData,
      { new: true, runValidators: true } // 'new: true' returns the updated document
    );

    if (!updatedClass) {
      console.warn(`Class with ID ${classId} not found for update.`);
      return null;
    }

    // Revalidate the paths related to this class and the class list
    revalidatePath(`/classes/${updatedClass.slug || classId}`);
    revalidatePath("/classes");

    return serializeDocument(updatedClass);
  } catch (error) {
    console.error(`Error updating class with ID ${classId}:`, error);
    throw new Error(
      `Failed to update class: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * DELETE: Deletes a class document.
 * @param classId The MongoDB ObjectId string of the class to delete.
 * @returns A promise that resolves to the deleted serializable class object or null if not found.
 */
export async function deleteClass(classId: string) {
  await dbConnect();
  try {
    const deletedClass = await Classes.findByIdAndDelete(classId);

    if (!deletedClass) {
      console.warn(`Class with ID ${classId} not found for deletion.`);
      return null;
    }

    // Revalidate the class list path
    revalidatePath("/classes");
    return serializeDocument(deletedClass);
  } catch (error) {
    console.error(`Error deleting class with ID ${classId}:`, error);
    throw new Error(
      `Failed to delete class: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
