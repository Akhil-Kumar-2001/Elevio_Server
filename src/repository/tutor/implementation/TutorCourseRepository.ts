import { CourseData, ILectureData, ISectionData } from "../../../Types/basicTypes";
import ITutorCourseRepository from "../ITutorCourseRepository";
import { Course, ICourse } from "../../../model/course/courseModel";
import { Category, ICategory } from "../../../model/category/categoryModel";
import { CourseResponseDataType } from "../../../Types/CategoryReturnType";
import { ISection, Section } from "../../../model/section/sectionModel";
import { ILecture, Lecture } from "../../../model/lecture/lectureModel";
import s3 from '../../../Config/awsConfig'

class TutorCourseRepository implements ITutorCourseRepository {

    async getCategories(): Promise<ICategory[] | null> {
        const categories = await Category.find();
        return categories
    }

    async createCourse(courseData: CourseData): Promise<boolean | null> {
        try {
            const newCourse = new Course(courseData);
            await newCourse.save();
            return true;
        } catch (error) {
            console.error("Error creating course:", error);
            return null;
        }
    }

    async getCourses(page: number, limit: number): Promise<CourseResponseDataType | null> {
        try {
            const skip = (page - 1) * limit;
            const courses = await Course.find().sort({ createAt: -1 }).skip(skip).limit(limit).exec()
            const totalRecord = await Course.countDocuments()
            return { courses, totalRecord }
        } catch (error) {
            console.log("Error while retrieving courses")
            return null
        }
    }

    async getCourseDetails(id: string): Promise<ICourse | null> {
        try {
            const courseDetails = await Course.findById(id).populate('category', 'name');
            return courseDetails
        } catch (error) {
            console.log("Error while retrieving course details")
            return null
        }
    }
    
    async editCourse(id: string, editCourse: ICourse): Promise<ICourse | null> {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(
                id,
                { $set: editCourse },
                { new: true}
            );
            return updatedCourse
        } catch (error) {
            console.log("Error while updating course details")
            return null
        }
    }

    async createSection(id: string, sectionData: ISectionData): Promise<ISection | null> {
        try {
          // Log the id to verify
          console.log("Course ID in createSection:", id);
      
          // Find the course to ensure it exists
          const courseExists = await Course.findById(id);
          if (!courseExists) {
            console.log("Course not found for ID:", id);
            return null;
          }
      
          // Get the total number of sections to determine the order
          const sectionCount = await Section.countDocuments({ courseId: id });
      
          // Create new section
          const newSection = new Section({
            courseId: id,
            title: sectionData.title,
            description: sectionData.description,
            order: sectionCount + 1, // Set order based on existing sections
            totalLectures: 0,
            totalDuration: 0,
            isPublished: false,
          });
      
          await newSection.save();
          return newSection;
        } catch (error) {
          console.error("Error while creating section:", error);
          return null;
        }
      }

      
    async createLecture(data: ILectureData): Promise<ILecture | null> {
        try {
            const { title, courseId, sectionId } = data;
    
            // Check if the course and section exist
            const courseExists = await Course.findById(courseId);
            if (!courseExists) {
                console.log("Course not found");
                return null;
            }
    
            const sectionExists = await Section.findById(sectionId);
            if (!sectionExists) {
                console.log("Section not found");
                return null;
            }
    
            // Get the current number of lectures in the section to determine the order
            const lectureCount = await Lecture.countDocuments({ sectionId });
    
            // Create new lecture
            const newLecture = new Lecture({
                sectionId,
                courseId,
                title,
                videoUrl: "", // Placeholder; should be provided when video is uploaded
                duration: 0, // Default value; update once video is processed
                order: lectureCount + 1, // Order based on existing lectures
                status: "processing",
                isPreview: false,
            });
    
            await newLecture.save();
    
            // Update section's total lectures count
            await Section.findByIdAndUpdate(sectionId, {
                $inc: { totalLectures: 1 },
            });
    
            return newLecture;
        } catch (error) {
            console.error("Error while creating lecture:", error);
            return null;
        }
    }

    async getSections(id: string): Promise<ISection[] | null> {
        try {
            const sections = await Section.find({courseId:id})
            return sections
        } catch (error) {
            console.log("Error while retrieving Sections ");
            return null
        }
    }

    async getLectures(id: string): Promise<ILecture[] | null> {
        try {
            const lectures = await Lecture.find({sectionId:id})
            return lectures
        } catch (error) {
            console.log("Error while retrieving Sections ");
            return null
        }
    }

    async editLecture(id: string, title: string): Promise<ILecture | null> {
        try {
            const updatedLecture = await Lecture.findByIdAndUpdate(
                id,
                { title },
                { new: true } 
            );
            return updatedLecture;
        } catch (error) {
            console.log("Error updating lecture:", error);
            return null;
        }
    }

    async deleteLecture(id: string): Promise<boolean | null> {
        try {
            const deletedLecture = await Lecture.findByIdAndDelete(id);
            return deletedLecture ? true :false;
        } catch (error) {
            console.log("Error deleting lecture:", error);
            return null
        }
    }

    async editSection(id: string, data: ISectionData): Promise<ISection | null> {
        try {
            console.log("reached here")
            const updatedSection = await Section.findByIdAndUpdate(
                            id,
                            {$set:data},
                            {new:true}
            );
            console.log(updatedSection)
            return updatedSection;
        } catch (error) {
            console.log("Error updating section:", error);
            return null;
        }
    }

    async uploadLectureVideo(lectureId: string, videoFile: Express.Multer.File): Promise<string | null> {
        const fileName = `${lectureId}-${Date.now()}-${videoFile.originalname}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || 'your-bucket-name',
            Key: `lectures/${fileName}`,
            Body: videoFile.buffer,
            ContentType: videoFile.mimetype,
            // Remove ACL: 'public-read'
        };
    
        try {
            // Upload to S3
            const uploadResult = await s3.upload(params).promise();
            const videoUrl = uploadResult.Location;
    
            // Update lecture in the database
            const updatedLecture = await Lecture.findByIdAndUpdate(
                lectureId,
                { videoUrl, status: 'completed' },
                { new: true }
            );
    
            if (!updatedLecture) {
                throw new Error('Lecture not found');
            }
    
            return videoUrl;
        } catch (error) {
            console.error('Error uploading video to S3:', error);
            return null;
        }
    }

    async applyReview(courseId: string): Promise<boolean | null> {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(
                courseId, 
                { status: "pending" }, 
                { new: true }
            );
            if (!updatedCourse) {
                return null; 
            }
            return true;
        } catch (error) {
            console.log("Error updating course status:", error);
            return null; 
        }
    }
    
    
    
}

export default TutorCourseRepository;
