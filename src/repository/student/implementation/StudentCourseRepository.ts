import mongoose, { Types } from "mongoose";
import { Course, ICourse } from "../../../model/course/courseModel";
import IStudentCourseRepository from "../IStudentCourseRepository";
import { Cart, ICart } from "../../../model/cart/cartModel";
import { ICartItemWithDetails, ICartWithDetails, IOrderCreateData, IOrderCreateSubscriptionData, PaymentData, review } from "../../../Types/basicTypes";
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
import { IReview, Review } from "../../../model/review/review.model";
import { AdminWallet, IAdminTransaction } from "../../../model/adminwallet/adminwallet";
import { IProgress, Progress } from "../../../model/progress/progress.model";

class StudentCourseRepository implements IStudentCourseRepository {

    async getListedCourse(): Promise<ICourse[] | null> {
        const courses = await Course.find({ status: "listed" });
        return courses;
    }

    async getTopRatedCourse(): Promise<ICourse[] | null> {
        const courses = await Course.find({ status: "listed" }).sort({ avgRating: -1 });
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

                try {
                    for (const courseId of updatedOrder.courseIds) {
                        // Check if progress already exists for this student and course
                        const existingProgress = await Progress.findOne({
                            studentId: updatedOrder.userId,
                            courseId: courseId
                        });

                        if (!existingProgress) {
                            // Create new progress record
                            const newProgress = new Progress({
                                studentId: updatedOrder.userId,
                                courseId: courseId,
                                completedLectures: [],
                                progressPercentage: 0,
                                isCompleted: false,
                                startDate: new Date()
                            });

                            await newProgress.save();
                            console.log(`Initialized progress for course ${courseId} for user ${updatedOrder.userId}`);
                        }
                    }
                } catch (error) {
                    console.error("Error initializing progress:", error);
                }

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
            const course = await Course.findOne({ _id: id }).populate('tutorId', 'username');
            return course
        } catch (error) {
            console.log("Error while getting Course details");
            return null
        }
    }

    async getTutor(id: string): Promise<ITutor | null> {
        try {
            const tutor = await Tutor.findOne({ _id: id });
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


    // async updateSubscriptionByOrderId(orderId: string, data: PaymentData): Promise<string | null> {
    //     console.log("data of update subscription",data)
    //     const updatedOrder = await SubscriptionPurchased.findOneAndUpdate(
    //         { orderId: orderId },
    //         data,
    //         { new: true }
    //     );
    //     return updatedOrder ? updatedOrder.paymentStatus : null;
    // }

    async updateSubscriptionByOrderId(orderId: string, data: PaymentData): Promise<string | null> {
        console.log("data of update subscription", data);

        const updatedOrder = await SubscriptionPurchased.findOneAndUpdate(
            { orderId: orderId },
            data,
            { new: true }
        );
        console.log("Updated order", updatedOrder)

        // Add payment to admin wallet if payment status is 'paid'
        if (updatedOrder && data.paymentStatus === 'paid' && data.paymentDetails?.paymentAmount) {
            try {
                // Find admin wallet or create if doesn't exist
                let adminWallet = await AdminWallet.findOne({ email: process.env.ADMIN_MAIL });

                if (!adminWallet) {
                    adminWallet = new AdminWallet({
                        email: process.env.ADMIN_MAIL,
                        balance: 0,
                        totalRevenue: 0,
                        totalOutflow: 0,
                        transactions: []
                    });
                }

                const amount = (data.paymentDetails.paymentAmount) / 100;

                // Create transaction record
                const transaction: IAdminTransaction = {
                    amount: amount,
                    type: 'credit',
                    description: `Subscription payment received for order: ${orderId}`,
                    date: new Date(),
                    relatedUserId: updatedOrder.userId || undefined,
                    userType: 'Student',
                    referenceId: updatedOrder._id
                };

                // Update wallet balances
                adminWallet.balance += amount;
                adminWallet.totalRevenue += amount;
                adminWallet.transactions.push(transaction);
                adminWallet.lastTransactionDate = new Date();

                // Save the admin wallet
                await adminWallet.save();

                console.log(`Added ${amount} to admin wallet for subscription payment`);

            } catch (error) {
                console.error("Error updating admin wallet:", error);

            }
        }

        return updatedOrder ? updatedOrder.paymentStatus : null;
    }

    async getReviews(id: string): Promise<IReview[] | null> {
        try {
            const reviews = await Review.find({ courseId: id, isVisible: true })
                .populate('userId', 'username') // Populate username from User model
                .sort({ createdAt: -1 }); // Sort by newest first
            return reviews.length > 0 ? reviews : null;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return null;
        }
    }



    async createReview(formData: review): Promise<IReview | null> {
        try {
            // Step 1: Create the new review
            const newReview = await Review.create({
                courseId: new Types.ObjectId(formData.courseId),
                userId: new Types.ObjectId(formData.userId),
                rating: formData.rating,
                review: formData.review,
            });

            // Step 2: Fetch all reviews of the course to recalculate avgRating
            const courseReviews = await Review.find({ courseId: formData.courseId });

            const totalReviews = courseReviews.length;
            const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
            const avgRating = parseFloat((totalRating / totalReviews).toFixed(1)); // rounded to 1 decimal

            // Step 3: Update the course with new average rating and total reviews
            await Course.findByIdAndUpdate(formData.courseId, {
                avgRating,
                totalReviews,
            });

            // Populate the user data (e.g., username) from the "Student" model
            const populatedReview = await newReview.populate('userId', 'username');

            return populatedReview;
        } catch (error) {
            console.error('Error creating reviews:', error);
            return null;
        }
    }

    async getProgress(courseId: string, userId: string): Promise<IProgress | null> {
        const progress = await Progress.findOne({ courseId, studentId: userId });
        return progress ?? null;
    }

    async addLectureToProgress(userId: string, courseId: string, lectureId: string): Promise<IProgress | null> {
        try {
            // Find the progress record for the given user and course
            const progress = await Progress.findOne({
                studentId: new Types.ObjectId(userId),
                courseId: new Types.ObjectId(courseId)
            });

            if (!progress) {
                console.error(`Progress not found for user ${userId} and course ${courseId}`);
                return null;
            }

            // Convert lectureId to ObjectId
            const lectureObjectId = new Types.ObjectId(lectureId);

            // Check if lecture is already in completedLectures to avoid duplicates
            if (!progress.completedLectures.includes(lectureObjectId)) {
                // Add lectureId to completedLectures
                progress.completedLectures.push(lectureObjectId);
                progress.lastAccessedLecture = lectureObjectId;
                progress.lastAccessDate = new Date();

                // Get total number of lectures for the course from Lecture collection
                const totalLectures = await Lecture.countDocuments({
                    courseId: new Types.ObjectId(courseId)
                });

                if (totalLectures > 0) {
                    // Calculate progress percentage
                    progress.progressPercentage = Math.round((progress.completedLectures.length / totalLectures) * 100);

                    // Check if course is completed
                    if (progress.completedLectures.length === totalLectures && !progress.isCompleted) {
                        progress.isCompleted = true;
                        progress.completionDate = new Date();
                    }
                }
                // Save the updated progress
                await progress.save();
                console.log(`Lecture ${lectureId} added to progress for user ${userId} and course ${courseId}`);
            }

            return progress;
        } catch (error) {
            console.error("Error adding lecture to progress:", error);
            return null;
        }
    }

    async editReview(id: string, formData: review): Promise<IReview | null> {
        try {
            // Find the review first to get the courseId
            const oldReview = await Review.findById(id);
            if (!oldReview) {
                return null;
            }   
            const courseId = oldReview.courseId; // Assuming review has courseId field
            // Update the review
            const updatedReview = await Review.findByIdAndUpdate(
                id,
                {
                    rating: formData.rating,
                    review: formData.review
                },
                { new: true }
            );
            if (!updatedReview) {
                return null;
            }
            // Find all reviews for this course to recalculate average
            const allCourseReviews = await Review.find({ courseId });
            // Calculate new average rating
            let newAvgRating = 0;
            if (allCourseReviews.length > 0) {
                const totalRating = allCourseReviews.reduce((sum, review) => sum + review.rating, 0);
                newAvgRating = totalRating / allCourseReviews.length;
            }
            // Update the course with new avgRating
            await Course.findByIdAndUpdate(courseId, {
                avgRating: newAvgRating
            });
            return updatedReview;
        } catch (error) {
            console.error("Error while editing review", error);
            return null;
        }
    }

    async deleteReview(id: string): Promise<boolean | null> {
        try {
            // First, find the review to get its courseId and rating
            const review = await Review.findById(id);
            if (!review) {
                return false;
            }
            const courseId = review.courseId; // Assuming review has courseId field
            // Delete the review
            const deletedReview = await Review.findByIdAndDelete(id);
            if (!deletedReview) {
                return false;
            }
            // Find all remaining reviews for this course
            const remainingReviews = await Review.find({ courseId });

            // Calculate new average rating
            let newAvgRating = 0;
            if (remainingReviews.length > 0) {
                const totalRating = remainingReviews.reduce((sum, review) => sum + review.rating, 0);
                newAvgRating = totalRating / remainingReviews.length;
            }
            // Update the course with new totalReviews and avgRating
            await Course.findByIdAndUpdate(courseId, {
                totalReviews: remainingReviews.length,
                avgRating: newAvgRating
            });
            return true;
        } catch (error) {
            console.error("Error while deleting review", error);
            return null;
        }
    }
}

export default StudentCourseRepository;