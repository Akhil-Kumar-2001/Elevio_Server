import mongoose from "mongoose";
import { Course, ICourse } from "../../../model/course/courseModel";
import IStudentCourseRepository from "../IStudentCourseRepository";
import { Cart, ICart } from "../../../model/cart/cartModel";
import { ICartItemWithDetails, ICartWithDetails, IOrderCreateData, IOrderCreateSubscriptionData } from "../../../Types/basicTypes";
import { IOrder, Order } from "../../../model/order/orderModel";
import { ITransaction, TutorWallet } from "../../../model/wallet/walletModel";
import { Category, ICategory } from "../../../model/category/categoryModel";
import { CourseResponseDataType } from "../../../Types/CategoryReturnType";
import { ISection, Section } from "../../../model/section/sectionModel";
import { ILecture, Lecture } from "../../../model/lecture/lectureModel";
import Subscription, { ISubscription } from "../../../model/subscription/subscriptionModel";
import { ISubscriptionPurchased, SubscriptionPurchased } from "../../../model/subscription/SubscriptionPurchased";
import { Student } from "../../../model/student/studentModel";
import { ITutor, Tutor } from "../../../model/tutor/tutorModel";

class StudentCourseRepository implements IStudentCourseRepository {
    async getListedCourse(): Promise<ICourse[] | null> {
        const courses = await Course.find({ status: "listed" });
        return courses;
    }

    async isPurchased(id: string, userId: string): Promise<boolean | null> {
        const order = await Order.findOne({
            userId,
            courseIds: id, // Check if courseId exists in courseIds array
            status: "success" // Ensure the order is successful
        });

        return !!order;
    }

    async courseExist(id: string, userId: string): Promise<boolean | null> {


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error("Invalid ObjectId format for user ID:", userId);
            return null;
        }

        const studentId = new mongoose.Types.ObjectId(userId);

        let cart = await Cart.findOne({ userId: studentId });
        if (!cart) {
            return false;
        }

        if (cart.items.some(item => item.courseId.toString() === id)) {
            return true;
        }
        return false

    }

    async addToCart(id: string, userId: string): Promise<boolean | null> {
        try {
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

            const course = await Course.findOne({ _id: courseId, status: "listed" }).lean().exec();
            if (!course) {
                console.error("Course not found or not listed:", id);
                return null;
            }

            let cart = await Cart.findOne({ userId: studentId });
            if (!cart) {
                cart = new Cart({ userId: studentId, items: [], totalPrice: 0 });
            }

            cart.items.push({ courseId, price: course.price });
            await cart.save();
            return true;

        } catch (error) {
            console.log("Error adding course to cart:", error);
            throw error;
        }
    }

    async getCart(studentId: string): Promise<ICartWithDetails | null> {
        // Step 1: Get the cart for the student
        const cart = await Cart.findOne({ userId: studentId, status: 'active' });

        // If no cart exists, return null
        if (!cart) {
            return null;
        }

        // Step 2: Get all course IDs from the cart
        const courseIds = cart.items.map(item => item.courseId);

        // Step 3: Fetch course details for those IDs
        const courses = await Course.find({ _id: { $in: courseIds } });

        // Step 4: Combine cart items with course details
        const itemsWithDetails: ICartItemWithDetails[] = cart.items.map(item => {
            const course = courses.find(c => c._id.toString() === item.courseId.toString());
            return {
                courseId: item.courseId.toString(), // Convert ObjectId to string
                price: item.price,
                courseTitle: course ? course.title : "Unknown Course",
                courseSubtitle: course ? course.subtitle : "No description",
                courseDuration: course ? (course.totalDuration || 0) : 0,
                courseLectures: course ? (course.totalLectures || 0) : 0,
                courseImage: course ? course.imageThumbnail : "https://via.placeholder.com/300x200"
            };
        });

        // Step 5: Create the enriched cart object
        const enrichedCart: ICartWithDetails = {
            userId: cart.userId.toString(), // Convert ObjectId to string
            items: itemsWithDetails,
            totalPrice: cart.totalPrice,
            status: cart.status,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
            _id: cart._id.toString(), // Convert ObjectId to string
            __v: cart.__v
        };



        // Step 6: Return the object
        return enrichedCart;
    }

    async removeItem(id: string, studentId: string): Promise<boolean | null> {
        try {
            const cart = await Cart.findOne({ userId: studentId });

            if (!cart) {
                return null; // Cart does not exist
            }
            const updatedItems = cart.items.filter(item => item.courseId.toString() !== id);

            const updatedTotalPrice = updatedItems.reduce((total, item) => total + item.price, 0);
            await Cart.updateOne(
                { userId: studentId },
                {
                    items: updatedItems,
                    totalPrice: updatedTotalPrice
                }
            );

            return true;
        } catch (error) {
            console.error("Error removing item from cart:", error);
            return null;
        }
    }

    async createOrder(orderData: IOrderCreateData): Promise<IOrder | null> {
        try {
            // Create a new Order document with the provided orderData
            const order = new Order(orderData);

            // Save the order to the database
            const savedOrder = await order.save();

            // Return true if the order was saved successfully
            return savedOrder;
        } catch (error) {
            console.error("Error creating order in repository:", error);
            return null; // Return null if an error occurs (e.g., database failure)
        }
    }

    async updateByOrderId(razorpay_order_id: string, status: string): Promise<string | null> {
        try {
            // Update the order status
            const updatedOrder = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { $set: { status: status } },
                { new: true }
            );

            console.log("updated order ", updatedOrder);

            if (!updatedOrder) {
                console.error("Order status not updated:");
                return null;
            }

            if (status === 'success' && updatedOrder.courseIds && updatedOrder.courseIds.length > 0) {

                const courses = await Course.find({
                    _id: { $in: updatedOrder.courseIds }
                }).select('tutorId price title');

                const numberOfCoursesPurchased = updatedOrder.courseIds.length;

                await Student.findByIdAndUpdate(
                    updatedOrder.userId,
                    { $inc: { enrolledCourseCount: numberOfCoursesPurchased } },
                    { new: true }
                );

                for (const course of courses) {

                    await Course.findByIdAndUpdate(
                        course._id,
                        { $addToSet: { purchasedStudents: updatedOrder.userId } },
                        { new: true }
                    );
                    if (course.tutorId) {

                        let tutorWallet = await TutorWallet.findOne({ tutorId: course.tutorId });

                        if (!tutorWallet) {
                            tutorWallet = new TutorWallet({
                                tutorId: course.tutorId,
                                balance: 0,
                                totalEarnings: 0,
                                totalWithdrawn: 0,
                                transactions: []
                            });
                        }

                        const transaction: ITransaction = {
                            amount: course.price,
                            type: 'credit',
                            description: `Course sale: ${course.title}`,
                            date: new Date(),
                            studentId: updatedOrder.userId,
                            referenceId: updatedOrder._id
                        };

                        tutorWallet.balance += course.price;
                        tutorWallet.totalEarnings += course.price;
                        tutorWallet.transactions.push(transaction);

                        await tutorWallet.save();

                        // console.log("Tutor wallet after the transaction", tutorWallet)
                    }
                }
            }

            await Cart.findOneAndUpdate(
                { userId: updatedOrder.userId },
                { $set: { items: [], totalPrice: 0 } },
                { new: true }
            );

            return updatedOrder ? updatedOrder.status : null;
        } catch (error) {
            console.error("Error updating order:", error);
            return null;
        }
    }

    async getCategories(): Promise<ICategory[] | null> {
        const categories = await Category.find();
        return categories;
    }

    async getCourses(page: number, limit: number): Promise<CourseResponseDataType | null> {
        try {
            const skip = (page - 1) * limit;
            const courses = await Course.find({ status: "listed" }).sort({ createAt: -1 }).skip(skip).limit(limit).exec()
            const totalRecord = await Course.countDocuments()
            return { courses, totalRecord }
        } catch (error) {
            console.log("Error while retrieving courses")
            return null
        }
    }

    async getPurchasedCourses(userId: string): Promise<ICourse[] | null> {
        try {
            // Await the query to get actual results
            const orders = await Order.find({ userId, status: "success" }).select("courseIds");

            if (!orders || orders.length === 0) return null; // No successful orders found

            // Extract all course IDs from orders
            const courseIds = orders.map(order => order.courseIds).flat(); // Flatten array of arrays

            if (courseIds.length === 0) return null; // No purchased courses found

            // Fetch course details
            const purchasedCourses = await Course.find({ _id: { $in: courseIds } });

            return purchasedCourses;
        } catch (error) {
            console.error("Error fetching purchased courses:", error);
            return null;
        }
    }

    async getCourse(id: string): Promise<ICourse | null> {
        try {
            const course = await Course.findOne({ _id: id })
            return course
        } catch (error) {
            console.log("Error while getting Course details");
            return null
        }
    }

    async getTutor(id: string): Promise<ITutor | null> {
        try {
            const tutor = await Tutor.findOne({_id:id});
            return tutor;
        } catch (error) {
            return null
        }
    }

    async getSections(id: string): Promise<ISection[] | null> {
        try {
            const sections = await Section.find({ courseId: id })
            return sections
        } catch (error) {
            console.log("Error while getting Sections");
            return null
        }
    }

    async getLectures(id: string): Promise<ILecture[] | null> {
        try {
            const lectures = await Lecture.find({ sectionId: id })
            return lectures
        } catch (error) {
            console.log("Error while retrieving Sections ");
            return null
        }
    }

    async getSubscription(): Promise<ISubscription[] | null> {
        const subscriptions = await Subscription.find({ status: true });
        return subscriptions ?? null;
    }
    async isValidPlan(studentId: string): Promise<boolean | null> {
        const isValid = await SubscriptionPurchased.findOne({
            userId: studentId,
            endDate: { $gte: new Date() }
        });

        return !!isValid;
    }

    async createSubscritionOrder(orderData: IOrderCreateSubscriptionData): Promise<ISubscriptionPurchased | null> {
        try {
            // Create a new Order document with the provided orderData
            const order = new SubscriptionPurchased(orderData);

            // Save the order to the database
            const savedOrder = await order.save();

            // Return true if the order was saved successfully
            return savedOrder;
        } catch (error) {
            console.error("Error creating order in repository:", error);
            return null;
        }
    }

    async findByOrderId(orderId: string): Promise<ISubscriptionPurchased | null> {
        const order = await SubscriptionPurchased.findOne({ orderId });
        return order;
    }

    async findPlanById(_id: string): Promise<ISubscription | null> {
        const plan = await Subscription.findById({ _id });
        return plan
    }


    async updateSubscriptionByOrderId(orderId: string, data: any): Promise<string | null> {
        const updatedOrder = await SubscriptionPurchased.findOneAndUpdate(
            { orderId: orderId },
            data,
            { new: true }
        );
        return updatedOrder ? updatedOrder.paymentStatus : null;
    }
}

export default StudentCourseRepository;