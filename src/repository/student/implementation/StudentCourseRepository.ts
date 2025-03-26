import mongoose from "mongoose";
import { Course, ICourse } from "../../../model/course/courseModel";
import IStudentCourseRepository from "../IStudentCourseRepository";
import { Cart, ICart } from "../../../model/cart/cartModel";

class StudentCourseRepository implements IStudentCourseRepository {
    async getListedCourse(): Promise<ICourse[] | null> {
        const courses = await Course.find({ status: "listed" });
        return courses;
    }

    async courseExist(id: string, userId: string): Promise<boolean | null> {

        console.log("Received course ID:", id);
        console.log("Received user ID:", userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error("Invalid ObjectId format for user ID:", userId);
            return null;
        }

        const studentId = new mongoose.Types.ObjectId(userId);
        // Fetch or create cart
        let cart = await Cart.findOne({ userId: studentId });
        if (!cart) {
            return false;
        }

        // Check if course is already in cart
        if (cart.items.some(item => item.courseId.toString() === id)) {
            return true;
        }
            return false
        
    }

    async addToCart(id: string, userId: string): Promise<boolean | null> {
        try {
            console.log("Received course ID:", id);
            console.log("Received user ID:", userId);

            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.error("Invalid ObjectId format for course ID:", id);
                return null;
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.error("Invalid ObjectId format for user ID:", userId);
                return null;
            }

            const courseId = new mongoose.Types.ObjectId(id);
            const studentId = new mongoose.Types.ObjectId(userId);

            // Fetch the course
            const course = await Course.findOne({ _id: courseId, status: "listed" }).lean().exec();
            if (!course) {
                console.error("Course not found or not listed:", id);
                return null;
            }

            // Fetch or create cart
            let cart = await Cart.findOne({ userId: studentId });
            if (!cart) {
                cart = new Cart({ userId: studentId, items: [], totalPrice: 0 });
            }

            //   // Check if course is already in cart
            //   if (cart.items.some(item => item.courseId.toString() === id)) {
            //     console.log("Course already exists in cart");
            //     return false;
            //   }

            // Add course to cart
            cart.items.push({ courseId, price: course.price });
            await cart.save();
            return true;

        } catch (error) {
            console.error("Error adding course to cart:", error);
            throw error;
        }
    }

}

export default StudentCourseRepository;