import mongoose, { Types } from "mongoose";
import { Course, ICourse, ICourseExtended } from "../../../model/course/courseModel";
import IStudentCourseRepository from "../IStudentCourseRepository";
import { Cart } from "../../../model/cart/cartModel";
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
import { IReview, IReviewExtended, Review } from "../../../model/review/review.model";
import { AdminWallet, IAdminTransaction } from "../../../model/adminwallet/adminwallet";
import { IProgress, Progress } from "../../../model/progress/progress.model";
import { Wishlist } from "../../../model/wishlist/wishlist.model";

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

        const cart = await Cart.findOne({ userId: studentId, status: 'active' });

        if (!cart) {
            return null;
        }

        const courseIds = cart.items.map(item => item.courseId);
        const courses = await Course.find({ _id: { $in: courseIds } });

        const itemsWithDetails: ICartItemWithDetails[] = cart.items.map(item => {
            const course = courses.find(c => c._id.toString() === item.courseId.toString());
            return {
                courseId: item.courseId.toString(), 
                price: item.price,
                courseTitle: course ? course.title : "Unknown Course",
                courseSubtitle: course ? course.subtitle : "No description",
                courseDuration: course ? (course.totalDuration || 0) : 0,
                courseLectures: course ? (course.totalLectures || 0) : 0,
                courseImage: course ? course.imageThumbnail : "https://via.placeholder.com/300x200"
            };
        });

        const enrichedCart: ICartWithDetails = {
            userId: cart.userId.toString(), 
            items: itemsWithDetails,
            totalPrice: cart.totalPrice,
            status: cart.status,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
            _id: cart._id.toString(), 

        };

        return enrichedCart;
    }

    async removeItem(id: string, studentId: string): Promise<boolean | null> {
        try {
            const cart = await Cart.findOne({ userId: studentId });

            if (!cart) {
                return null; 
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
            const order = new Order(orderData);

            const savedOrder = await order.save();

            return savedOrder;
        } catch (error) {
            console.error("Error creating order in repository:", error);
            return null; 
        }
    }

    async updateByOrderId(razorpay_order_id: string, status: string): Promise<string | null> {
        try {
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
                        const existingProgress = await Progress.findOne({
                            studentId: updatedOrder.userId,
                            courseId: courseId
                        });

                        if (!existingProgress) {
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
            const orders = await Order.find({ userId, status: "success" }).select("courseIds");

            if (!orders || orders.length === 0) return null;

            const courseIds = orders.map(order => order.courseIds).flat(); 

            if (courseIds.length === 0) return null; 

            const purchasedCourses = await Course.find({ _id: { $in: courseIds } });

            return purchasedCourses;
        } catch (error) {
            console.error("Error fetching purchased courses:", error);
            return null;
        }
    }

    async getCourse(id: string): Promise<ICourseExtended | null> {
        try {
            const course = await Course.findOne({ _id: id })
                .populate('tutorId', 'username')
                .lean<ICourseExtended>();
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

    async findById(lectureId: string): Promise<ILecture | null> {
        return Lecture.findById(lectureId).exec();
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
            const order = new SubscriptionPurchased(orderData);

            const savedOrder = await order.save();

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



    async updateSubscriptionByOrderId(orderId: string, data: PaymentData): Promise<string | null> {
        console.log("data of update subscription", data);

        const updatedOrder = await SubscriptionPurchased.findOneAndUpdate(
            { orderId: orderId },
            data,
            { new: true }
        );
        console.log("Updated order", updatedOrder)

        if (updatedOrder && data.paymentStatus === 'paid' && data.paymentDetails?.paymentAmount) {
            try {
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

                const transaction: IAdminTransaction = {
                    amount: amount,
                    type: 'credit',
                    description: `Subscription payment received for order: ${orderId}`,
                    date: new Date(),
                    relatedUserId: updatedOrder.userId || undefined,
                    userType: 'Student',
                    referenceId: updatedOrder._id
                };

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

    async getReviews(id: string): Promise<IReviewExtended[] | null> {
        try {
            const reviews = await Review.find({ courseId: id, isVisible: true })
                .populate('userId', 'username') 
                .sort({ createdAt: -1 })
                .lean<IReviewExtended[]>() 
            return reviews.length > 0 ? reviews : [];
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return null;
        }
    }



    async createReview(formData: review): Promise<IReviewExtended | null> {
        try {
            
            const newReview = await Review.create({
                courseId: new Types.ObjectId(formData.courseId),
                userId: new Types.ObjectId(formData.userId),
                rating: formData.rating,
                review: formData.review,
            });

            const courseReviews = await Review.find({ courseId: formData.courseId });

            const totalReviews = courseReviews.length;
            const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
            const avgRating = parseFloat((totalRating / totalReviews).toFixed(1));

            await Course.findByIdAndUpdate(formData.courseId, {
                avgRating,
                totalReviews,
            });

            const populatedReview = await Review.findById(newReview._id)
                .populate('userId', 'username')
                .lean<IReviewExtended>();

            return populatedReview ?? null;
        } catch (error) {
            console.error('Error creating review:', error);
            return null;
        }
    }

    async getProgress(courseId: string, userId: string): Promise<IProgress | null> {
        const progress = await Progress.findOne({ courseId, studentId: userId });
        return progress ?? null;
    }

    async addLectureToProgress(userId: string, courseId: string, lectureId: string): Promise<IProgress | null> {
        try {
            const progress = await Progress.findOne({
                studentId: new Types.ObjectId(userId),
                courseId: new Types.ObjectId(courseId)
            });

            if (!progress) {
                console.error(`Progress not found for user ${userId} and course ${courseId}`);
                return null;
            }

            const lectureObjectId = new Types.ObjectId(lectureId);

            if (!progress.completedLectures.includes(lectureObjectId)) {

                progress.completedLectures.push(lectureObjectId);
                progress.lastAccessedLecture = lectureObjectId;
                progress.lastAccessDate = new Date();

                const totalLectures = await Lecture.countDocuments({
                    courseId: new Types.ObjectId(courseId)
                });

                if (totalLectures > 0) {
                    progress.progressPercentage = Math.round((progress.completedLectures.length / totalLectures) * 100);

                    if (progress.completedLectures.length === totalLectures && !progress.isCompleted) {
                        progress.isCompleted = true;
                        progress.completionDate = new Date();
                    }
                }
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
            const oldReview = await Review.findById(id);
            if (!oldReview) {
                return null;
            }
            const courseId = oldReview.courseId; 
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
            const allCourseReviews = await Review.find({ courseId });
            let newAvgRating = 0;
            if (allCourseReviews.length > 0) {
                const totalRating = allCourseReviews.reduce((sum, review) => sum + review.rating, 0);
                newAvgRating = totalRating / allCourseReviews.length;
            }
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
            const review = await Review.findById(id);
            if (!review) {
                return false;
            }
            const courseId = review.courseId; 

            const deletedReview = await Review.findByIdAndDelete(id);
            if (!deletedReview) {
                return false;
            }

            const remainingReviews = await Review.find({ courseId });

            let newAvgRating = 0;
            if (remainingReviews.length > 0) {
                const totalRating = remainingReviews.reduce((sum, review) => sum + review.rating, 0);
                newAvgRating = totalRating / remainingReviews.length;
            }

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

    async getWishlist(userId: string): Promise<ICourse[] | null> {
        try {
            console.log("userId in getWishlist", userId)
            const wishlist = await Wishlist.findOne({ userId })
                .populate("items.courseId")
                .exec();
            if (!wishlist) return []

            const courses = wishlist.items.map(item => item.courseId);
            const wishlistedCourses = Course.find({ _id: { $in: courses } });
            return wishlistedCourses;
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            return null;
        }
    }

    async addToWishlist(userId: string, courseId: string): Promise<boolean | null> {
        try {
            console.log("userId in addToWishlist", userId)
            const wishlist = await Wishlist.findOne({ userId });

            if (!wishlist) {
                const newWishlist = new Wishlist({
                    userId,
                    items: [{ courseId }]
                });
                await newWishlist.save();
            } else {
                const courseExists = wishlist.items.some(item => item.courseId.toString() === courseId);

                if (!courseExists) {
                    wishlist.items.push({ courseId: new Types.ObjectId(courseId) });
                    await wishlist.save();
                }
            }
            return true;
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            return null;
        }
    }

    async isInWishlist(userId: string, courseId: string): Promise<boolean | null> {
        try {
            const wishlist = await Wishlist.findOne({ userId });
            console.log("wishlist in isInWishlist", wishlist)
            if (!wishlist) return false;
            return wishlist.items.some(item => item.courseId.toString() === courseId);
        } catch (error) {
            console.error("Error checking wishlist:", error);
            return null;
        }
    }


    async removeFromWishlist(userId: string, courseId: string): Promise<boolean | null> {
        try {
            const wishlist = await Wishlist.findOne({ userId });
            if (!wishlist) {
                console.error("Wishlist not found for user:", userId);
                return null;
            }
            const updatedItems = wishlist.items.filter(item => item.courseId.toString() !== courseId);
            await Wishlist.updateOne(
                { userId },
                { items: updatedItems }
            );
            return true;
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            return null;
        }
    }
}

export default StudentCourseRepository;